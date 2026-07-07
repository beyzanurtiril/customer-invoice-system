package com.pia.telekom.repository;

import com.pia.telekom.entity.CustomerRiskAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRiskAnalysisRepository extends JpaRepository<CustomerRiskAnalysis, Integer> {
}