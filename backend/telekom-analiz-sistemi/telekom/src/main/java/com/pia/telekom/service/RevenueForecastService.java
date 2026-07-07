package com.pia.telekom.service;

import com.pia.telekom.dto.RevenueForecastResponse;
import com.pia.telekom.entity.Invoice;
import com.pia.telekom.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RevenueForecastService {

    private final InvoiceRepository invoiceRepository;

    @Transactional(readOnly = true)
    public RevenueForecastResponse forecastRevenue() {
        List<Invoice> allInvoices = invoiceRepository.findAll();

        Map<YearMonth, BigDecimal> monthlyRevenue = allInvoices.stream()
                .collect(Collectors.groupingBy(
                        inv -> YearMonth.from(inv.getInvoiceDate()),
                        TreeMap::new,
                        Collectors.reducing(BigDecimal.ZERO, Invoice::getInvoiceAmount, BigDecimal::add)
                ));

        SimpleRegression regression = new SimpleRegression();
        List<RevenueForecastResponse.MonthlyRevenue> historicalData = new java.util.ArrayList<>();

        int index = 0;
        for (Map.Entry<YearMonth, BigDecimal> entry : monthlyRevenue.entrySet()) {
            regression.addData(index, entry.getValue().doubleValue());
            historicalData.add(new RevenueForecastResponse.MonthlyRevenue(
                    entry.getKey().toString(), entry.getValue()));
            index++;
        }

        double slope = 0.0;
        double intercept = 0.0;
        double rSquared = 0.0;
        BigDecimal nextMonthForecast = BigDecimal.ZERO;
        BigDecimal nextYearForecast = BigDecimal.ZERO;

        if (monthlyRevenue.size() >= 2) {
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