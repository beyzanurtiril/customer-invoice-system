package com.pia.telekom.dto;

import java.math.BigDecimal;

public record ProductResponse(
        Long productId,
        String name,
        String category,
        BigDecimal monthlyFee,
        Integer dataLimitGb,
        Integer voiceLimitMin,
        String tierLevel,
        String subscriptionType
) {
}