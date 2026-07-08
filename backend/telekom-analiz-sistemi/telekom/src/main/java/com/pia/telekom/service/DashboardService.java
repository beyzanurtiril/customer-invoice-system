package com.pia.telekom.service;

import com.pia.telekom.dto.*;
import com.pia.telekom.repository.CustomerRepository;
import com.pia.telekom.repository.InvoiceRepository;
import com.pia.telekom.repository.SubscriptionRepository;
import com.pia.telekom.config.CacheConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final long RISK_THRESHOLD = 3;
    private static final int LOOKBACK_MONTHS = 12;

    private final CustomerRepository customerRepository;
    private final InvoiceRepository invoiceRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final RevenueForecastService revenueForecastService;
    private final RegionalPaymentAnalysisService regionalPaymentAnalysisService;
    private final UpgradeRecommendationService upgradeRecommendationService;

    /*
      Tüm dashboard cevabı 60 sn önbelleklenir (CacheConfig). Alt analizler de
      kendi cache'lerine sahip olduğundan ilk istek bile eskisine göre çok
      daha hafiftir; sonraki istekler DB'ye hiç gitmez.
    */
    @Cacheable(CacheConfig.DASHBOARD)
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        DashboardStats stats = buildStats();
        List<RevenuePoint> revenuePoints = buildRevenuePoints();
        List<PackageDistributionItem> packageDistribution = buildPackageDistribution();
        long activeLineCount = subscriptionRepository.countByStatusIgnoreCase("active");
        List<CityRevenueItem> cityRevenue = buildCityRevenue();
        List<String> recommendations = buildRecommendations(stats);

        return new DashboardResponse(
                buildPeriodLabel(), stats, revenuePoints, packageDistribution,
                activeLineCount, cityRevenue, recommendations
        );
    }

    private DashboardStats buildStats() {
        long totalCustomers = customerRepository.count();

        LocalDate maxInvoiceDate = invoiceRepository.findMaxInvoiceDate();
        BigDecimal monthlyRevenue = BigDecimal.ZERO;
        if (maxInvoiceDate != null) {
            YearMonth latestMonth = YearMonth.from(maxInvoiceDate);
            monthlyRevenue = invoiceRepository.sumInvoiceAmountBetween(
                    latestMonth.atDay(1), latestMonth.atEndOfMonth());
        }

        long overdueInvoiceCount = invoiceRepository.countByPaymentDateIsNullAndDueDateBefore(LocalDate.now());

        long riskyCustomerCount = invoiceRepository.findCustomerIdsWithOverdueCountAtLeast(
                LocalDate.now(), LocalDate.now().minusMonths(LOOKBACK_MONTHS), RISK_THRESHOLD).size();

        return new DashboardStats(totalCustomers, monthlyRevenue, overdueInvoiceCount, riskyCustomerCount);
    }

    private List<RevenuePoint> buildRevenuePoints() {
        return revenueForecastService.forecastRevenue().historicalData().stream()
                .map(m -> new RevenuePoint(m.yearMonth(), m.revenue()))
                .toList();
    }

    private List<PackageDistributionItem> buildPackageDistribution() {
        List<Object[]> rows = subscriptionRepository.countGroupedByCategory();
        long total = rows.stream().mapToLong(r -> (Long) r[1]).sum();

        return rows.stream()
                .map(r -> {
                    String category = (String) r[0];
                    long count = (Long) r[1];
                    double percentage = total == 0 ? 0.0 : Math.round((count * 1000.0) / total) / 10.0;
                    return new PackageDistributionItem(category, count, percentage);
                })
                .toList();
    }

    private List<CityRevenueItem> buildCityRevenue() {
        // r.city() alanı cityType (BÜYÜKŞEHİR/İL) taşıyor; grafikte şehir adı gösterilmeli.
        return regionalPaymentAnalysisService.analyzeByRegion().stream()
                .map(r -> new CityRevenueItem(r.regionName(), r.totalRevenue()))
                .toList();
    }

    private List<String> buildRecommendations(DashboardStats stats) {
        int upgradeCandidateCount = upgradeRecommendationService.getRecommendations().size();

        return List.of(
                "%d müşteri paket limitini sık aşıyor, üst pakete geçiş önerisi sunulabilir".formatted(upgradeCandidateCount),
                "%d müşteri son 12 ayda 3 veya daha fazla kez ödemesini geciktirdi".formatted(stats.riskyCustomerCount()),
                "%d fatura şu anda vadesi geçmiş ve ödenmemiş durumda".formatted(stats.overdueInvoiceCount())
        );
    }

    private String buildPeriodLabel() {
        LocalDate now = LocalDate.now();
        String month = now.getMonth().getDisplayName(TextStyle.FULL, new Locale("tr", "TR"));
        return month + " " + now.getYear();
    }
}