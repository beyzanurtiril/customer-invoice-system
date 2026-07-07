package com.pia.telekom.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record SubscriptionRequest(
        @NotNull(message = "Müşteri seçimi zorunludur")
        Long customerId,

        @NotNull(message = "Ürün seçimi zorunludur")
        Long productId,

        LocalDate startDate,
        String status
) {
}