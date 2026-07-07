package com.pia.telekom.repository;

import com.pia.telekom.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Page<Invoice> findByCustomer_CustomerId(Long customerId, Pageable pageable);

    boolean existsByInvoiceIdAndCustomer_CustomerId(Long invoiceId, Long customerId);

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
            @Param("customerIds") List<Long> customerIds);

    @Query("""
        SELECT i FROM Invoice i
        JOIN FETCH i.customer c
        JOIN FETCH c.region
        """)
    List<Invoice> findAllWithCustomerAndRegion();
}