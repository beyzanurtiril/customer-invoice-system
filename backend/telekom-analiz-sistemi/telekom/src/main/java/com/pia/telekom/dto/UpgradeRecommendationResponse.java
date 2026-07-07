package com.pia.telekom.dto;

import java.math.BigDecimal;

public record UpgradeRecommendationResponse(
        Long customerId,
        String customerFullName,
        Long currentProductId,
        String currentProductName,
        int overageInvoiceCount,
        BigDecimal totalOverageAmount,
        String recommendation
) {
}