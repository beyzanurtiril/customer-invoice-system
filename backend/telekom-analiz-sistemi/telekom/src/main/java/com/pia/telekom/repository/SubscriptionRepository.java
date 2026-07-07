package com.pia.telekom.repository;

import com.pia.telekom.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {

    Optional<Subscription> findByCustomer_CustomerId(Integer customerId);

    long countByStatusIgnoreCase(String status);

    @Query("SELECT s.product.category, COUNT(s) FROM Subscription s GROUP BY s.product.category")
    List<Object[]> countGroupedByCategory();
}