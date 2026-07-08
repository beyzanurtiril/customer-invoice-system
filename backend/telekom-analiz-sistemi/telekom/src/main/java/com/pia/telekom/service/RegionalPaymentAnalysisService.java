package com.pia.telekom.service;

import com.pia.telekom.dto.RegionalPaymentAnalysisResponse;
import com.pia.telekom.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionalPaymentAnalysisService {

    private final InvoiceRepository invoiceRepository;

    /*
      PERFORMANS NOTU:
      Eski hali JOIN FETCH ile bütün fatura+müşteri+bölge satırlarını uzak
      Supabase'den indirip ortalama/std sapma/gecikme oranını Java'da
      hesaplıyordu. Artık tüm istatistikler DB'de (AVG, STDDEV_SAMP, CASE)
      hesaplanır; buraya bölge başına TEK satır döner. Sonuç 60 sn önbelleklenir.
    */
    @Cacheable("regionalPayments")
    @Transactional(readOnly = true)
    public List<RegionalPaymentAnalysisResponse> analyzeByRegion() {
        return invoiceRepository.aggregateRegionalPayments().stream()
                .map(this::toResponse)
                .toList();
    }

    private RegionalPaymentAnalysisResponse toResponse(Object[] row) {
        Integer regionId = ((Number) row[0]).intValue();
        String regionName = (String) row[1];
        String cityType = (String) row[2];
        long invoiceCount = ((Number) row[3]).longValue();
        BigDecimal totalRevenue = toBigDecimal(row[4]);
        double avgAmount = toDouble(row[5]);
        double stdDev = toDouble(row[6]);
        double overdueRate = toDouble(row[7]);

        return new RegionalPaymentAnalysisResponse(
                regionId, regionName, cityType, invoiceCount,
                totalRevenue, round(avgAmount), round(stdDev), round(overdueRate)
        );
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value instanceof BigDecimal bd) return bd;
        if (value instanceof Number number) return BigDecimal.valueOf(number.doubleValue());
        return BigDecimal.ZERO;
    }

    private double toDouble(Object value) {
        return value instanceof Number number ? number.doubleValue() : 0.0;
    }

    private double round(double value) {
        if (Double.isNaN(value)) {
            return 0.0;
        }
        return Math.round(value * 100.0) / 100.0;
    }
}
