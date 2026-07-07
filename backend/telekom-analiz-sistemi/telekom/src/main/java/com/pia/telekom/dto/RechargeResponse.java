package com.pia.telekom.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RechargeResponse(
        Long rechargeId, Long customerId, String rechargeChannel,
        BigDecimal rechargeAmount, LocalDate rechargeDate
) {
}
