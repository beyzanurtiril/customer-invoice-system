package com.pia.telekom.service;

import com.pia.telekom.dto.RevenueForecastResponse;
import com.pia.telekom.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RevenueForecastService {

    private final InvoiceRepository invoiceRepository;

    /*
      PERFORMANS NOTU:
      Eski hali invoiceRepository.findAll() ile TÜM fatura tablosunu uzak
      Supabase'den çekip aylık toplamları Java'da hesaplıyordu. Artık aylık
      toplamlar DB'de tek GROUP BY sorgusuyla hesaplanıyor; buraya sadece
      "ay -> toplam" satırları geliyor (fatura sayısı ne olursa olsun ~aydaki
      satır kadar veri). Sonuç ayrıca 60 sn önbelleklenir (CacheConfig).
    */
    @Cacheable("revenueForecast")
    @Transactional(readOnly = true)
    public RevenueForecastResponse forecastRevenue() {
        List<Object[]> monthlyRows = invoiceRepository.sumRevenueGroupedByMonth();

        SimpleRegression regression = new SimpleRegression();
        List<RevenueForecastResponse.MonthlyRevenue> historicalData = new ArrayList<>();

        int index = 0;
        for (Object[] row : monthlyRows) {
            String yearMonth = (String) row[0];
            BigDecimal total = toBigDecimal(row[1]);

            regression.addData(index, total.doubleValue());
            historicalData.add(new RevenueForecastResponse.MonthlyRevenue(yearMonth, total));
            index++;
        }

        double slope = 0.0;
        double intercept = 0.0;
        double rSquared = 0.0;
        BigDecimal nextMonthForecast = BigDecimal.ZERO;
        BigDecimal nextYearForecast = BigDecimal.ZERO;

        if (historicalData.size() >= 2) {
            slope = regression.getSlope();
            intercept = regression.getIntercept();
            rSquared = regression.getRSquare();

            double nextMonthValue = regression.predict(index);
            double nextYearValue = regression.predict(index + 11);

            nextMonthForecast = toMoney(nextMonthValue);
            nextYearForecast = toMoney(nextYearValue * 12);
        }

        return new RevenueForecastResponse(
                historicalData, round(slope), round(intercept),
                nextMonthForecast, nextYearForecast, round(rSquared)
        );
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value instanceof BigDecimal bd) return bd;
        if (value instanceof Number number) return BigDecimal.valueOf(number.doubleValue());
        return BigDecimal.ZERO;
    }

    private BigDecimal toMoney(double value) {
        if (Double.isNaN(value) || value < 0) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP);
    }

    private double round(double value) {
        if (Double.isNaN(value)) {
            return 0.0;
        }
        return Math.round(value * 10000.0) / 10000.0;
    }
}
