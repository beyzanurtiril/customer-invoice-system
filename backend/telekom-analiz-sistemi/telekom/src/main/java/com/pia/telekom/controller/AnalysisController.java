package com.pia.telekom.controller;

import com.pia.telekom.dto.RegionalPaymentAnalysisResponse;
import com.pia.telekom.dto.RevenueForecastResponse;
import com.pia.telekom.dto.UpgradeRecommendationResponse;
import com.pia.telekom.service.RegionalPaymentAnalysisService;
import com.pia.telekom.service.RevenueForecastService;
import com.pia.telekom.service.UpgradeRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final RegionalPaymentAnalysisService regionalPaymentAnalysisService;
    private final UpgradeRecommendationService upgradeRecommendationService;
    private final RevenueForecastService revenueForecastService;

    @GetMapping("/regional-payments")
    public List<RegionalPaymentAnalysisResponse> getRegionalPaymentAnalysis() {
        return regionalPaymentAnalysisService.analyzeByRegion();
    }

    @GetMapping("/upgrade-recommendations")
    public List<UpgradeRecommendationResponse> getUpgradeRecommendations() {
        return upgradeRecommendationService.getRecommendations();
    }

    @GetMapping("/revenue-forecast")
    public RevenueForecastResponse getRevenueForecast() {
        return revenueForecastService.forecastRevenue();
    }
}