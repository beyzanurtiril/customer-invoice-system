package com.pia.telekom.dto;

import java.time.LocalDate;

public record SubscriptionResponse(
        Long subscriptionId,
        Long customerId,
        String customerFullName,
        ProductResponse product,
        LocalDate startDate,
        String status
) {
}