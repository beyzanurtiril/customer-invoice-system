package com.pia.telekom.repository;

import com.pia.telekom.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    Page<Invoice> findByCustomer_CustomerId(Integer customerId, Pageable pageable);

    boolean existsByInvoiceIdAndCustomer_CustomerId(Integer invoiceId, Integer customerId);

    @Query("""
        SELECT i.customer.customerId, COUNT(i)
        FROM Invoice i
        WHERE i.paymentDate IS NULL
          AND i.dueDate < :today
          AND i.invoiceDate > :since
          AND i.customer.customerId IN :customerIds
        GROUP BY i.customer.customerId
        """)
    List<Object[]> countOverdueGroupedByCustomerIds(
            @Param("today") LocalDate today,
            @Param("since") LocalDate since,
            @Param("customerIds") List<Integer> customerIds);

    @Query("""
        SELECT i FROM Invoice i
        JOIN FETCH i.customer c
        JOIN FETCH c.region
        """)
    List<Invoice> findAllWithCustomerAndRegion();

    @Query(value = "SELECT i FROM Invoice i JOIN FETCH i.customer c LEFT JOIN FETCH i.product",
            countQuery = "SELECT COUNT(i) FROM Invoice i")
    Page<Invoice> findAllWithCustomer(Pageable pageable);

    long countByPaymentDateIsNullAndDueDateBefore(LocalDate date);

    @Query("""
        SELECT i.customer.customerId
        FROM Invoice i
        WHERE i.paymentDate IS NULL AND i.dueDate < :today AND i.invoiceDate > :since
        GROUP BY i.customer.customerId
        HAVING COUNT(i) >= :threshold
        """)
    List<Integer> findCustomerIdsWithOverdueCountAtLeast(
            @Param("today") LocalDate today,
            @Param("since") LocalDate since,
            @Param("threshold") long threshold);

    @Query("SELECT MAX(i.invoiceDate) FROM Invoice i")
    LocalDate findMaxInvoiceDate();

    @Query("SELECT COALESCE(SUM(i.invoiceAmount), 0) FROM Invoice i WHERE i.invoiceDate BETWEEN :start AND :end")
    BigDecimal sumInvoiceAmountBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    /*
      PERFORMANS: Aşağıdaki üç sorgu, analiz servislerinin eskiden findAll() ile
      TÜM fatura tablosunu RAM'e çekip Java'da gruplamasının yerine geçer.
      Uzak Supabase'de binlerce satır transferi + lazy proxy başına ekstra
      SELECT'ler yerine, her analiz artık DB tarafında TEK aggregate sorgudur.
    */

    /** Ay bazında ciro: [yyyy-MM (String), toplam (BigDecimal)] */
    @Query(value = """
        SELECT to_char(i.invoice_date, 'YYYY-MM') AS ym,
               SUM(i.invoice_amount)              AS total
        FROM invoice i
        WHERE i.invoice_date IS NOT NULL
        GROUP BY to_char(i.invoice_date, 'YYYY-MM')
        ORDER BY ym
        """, nativeQuery = true)
    List<Object[]> sumRevenueGroupedByMonth();

    /**
     * Limit aşımı yapan müşteriler (üst paket önerisi):
     * [customerId, fullName, productId, productName, tierLevel, overageCount, totalOverage]
     */
    @Query(value = """
        SELECT c.customer_id,
               (c.name || ' ' || c.surname)   AS full_name,
               p.product_id,
               p.name                          AS product_name,
               p.tier_level,
               COUNT(i.invoice_id)             AS overage_count,
               SUM(i.overage_amount)           AS total_overage
        FROM invoice i
        JOIN customer c ON c.customer_id = i.customer_id
        JOIN product  p ON p.product_id  = i.product_id
        WHERE i.invoice_date > :since
          AND i.overage_amount > 0
        GROUP BY c.customer_id, c.name, c.surname, p.product_id, p.name, p.tier_level
        HAVING COUNT(i.invoice_id) >= :threshold
        ORDER BY total_overage DESC
        """, nativeQuery = true)
    List<Object[]> findUpgradeCandidates(@Param("since") LocalDate since,
                                         @Param("threshold") long threshold);

    /**
     * Bölge bazlı ödeme analizi:
     * [regionId, regionName, cityType, invoiceCount, totalRevenue, avgAmount, stdDev, overdueRatePct]
     */
    @Query(value = """
        SELECT r.region_id,
               r.name,
               r.city_type,
               COUNT(i.invoice_id)                              AS invoice_count,
               COALESCE(SUM(i.invoice_amount), 0)               AS total_revenue,
               COALESCE(AVG(i.invoice_amount), 0)               AS avg_amount,
               COALESCE(STDDEV_SAMP(i.invoice_amount), 0)       AS std_dev,
               COALESCE(
                 100.0 * SUM(CASE WHEN i.payment_date IS NULL AND i.due_date < CURRENT_DATE
                                  THEN 1 ELSE 0 END)
                 / NULLIF(COUNT(i.invoice_id), 0), 0)           AS overdue_rate
        FROM region r
        JOIN customer c ON c.region_id  = r.region_id
        JOIN invoice  i ON i.customer_id = c.customer_id
        GROUP BY r.region_id, r.name, r.city_type
        ORDER BY total_revenue DESC
        """, nativeQuery = true)
    List<Object[]> aggregateRegionalPayments();
}