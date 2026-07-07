package com.pia.telekom.repository;

import com.pia.telekom.entity.Recharge;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RechargeRepository extends JpaRepository<Recharge, Integer> {
    Page<Recharge> findByCustomer_CustomerId(Integer customerId, Pageable pageable);
}
