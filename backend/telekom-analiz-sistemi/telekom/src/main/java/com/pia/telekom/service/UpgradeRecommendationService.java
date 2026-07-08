package com.pia.telekom.service;

import com.pia.telekom.dto.UpgradeRecommendationResponse;
import com.pia.telekom.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UpgradeRecommendationService {

    private static final int OVERAGE_THRESHOLD = 2;
    private static final int LOOKBACK_MONTHS = 12;

    private final InvoiceRepository invoiceRepository;

    /*
      PERFORMANS NOTU:
      Eski hali findAll() ile bütün faturaları çekiyor, ardından her fatura için
      lazy customer ve product proxy'lerini tetikleyerek Supabase'e YÜZLERCE ek
      SELECT atıyordu (dashboard'un asıl yavaşlık sebebi buydu). Artık gruplama,
      HAVING filtresi ve toplamlar DB'de tek sorguda yapılır; buraya yalnızca
      öneri satırları döner. Sonuç 60 sn önbelleklenir.
    */
    @Cacheable("upgradeRecommendations")
    @Transactional(readOnly = true)
    public List<UpgradeRecommendationResponse> getRecommendations() {
        LocalDate since = LocalDate.now().minusMonths(LOOKBACK_MONTHS);

        return invoiceRepository.findUpgradeCandidates(since, OVERAGE_THRESHOLD).stream()
                .map(this::toResponse)
                .toList();
    }

    private UpgradeRecommendationResponse toResponse(Object[] row) {
        Integer customerId = ((Number) row[0]).intValue();
        String fullName = (String) row[1];
        Integer productId = ((Number) row[2]).intValue();
        String productName = (String) row[3];
        String tierLevel = row[4] == null ? "?" : String.valueOf(row[4]);
        int overageCount = ((Number) row[5]).intValue();
        BigDecimal totalOverage = toBigDecimal(row[6]);

        String recommendation = "Paket limitini sık aşıyor, bir üst pakete (%s → üst tier) geçiş önerilir"
                .formatted(tierLevel);

        return new UpgradeRecommendationResponse(
                customerId, fullName, productId, productName,
                overageCount, totalOverage, recommendation
        );
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value instanceof BigDecimal bd) return bd;
        if (value instanceof Number number) return BigDecimal.valueOf(number.doubleValue());
        return BigDecimal.ZERO;
    }
}
