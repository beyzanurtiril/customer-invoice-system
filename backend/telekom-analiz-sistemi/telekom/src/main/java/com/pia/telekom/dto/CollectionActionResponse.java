package com.pia.telekom.dto;

import java.time.LocalDate;

public record CollectionActionResponse(
        Long actionId,
        Long invoiceId,
        String actionType,
        LocalDate actionDate
) {
}