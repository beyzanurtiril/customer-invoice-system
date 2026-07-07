package com.pia.telekom.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "customer_stats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomerStats {

    @Id
    @Column(name = "customer_id")
    private Integer customerId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "total_invoices")
    private Integer totalInvoices;

    @Column(name = "late_payment_count")
    private Integer latePaymentCount;

    @Column(name = "unpaid_count")
    private Integer unpaidCount;

    @Column(name = "avg_delay_days", precision = 6, scale = 2)
    private BigDecimal avgDelayDays;

    @Column(name = "overuse_count")
    private Integer overuseCount;

    @Column(name = "total_recharges")
    private Integer totalRecharges;

    @Column(name = "avg_recharge_amount", precision = 8, scale = 2)
    private BigDecimal avgRechargeAmount;

    @Column(name = "avg_days_between_recharges", precision = 6, scale = 2)
    private BigDecimal avgDaysBetweenRecharges;
}