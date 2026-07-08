package com.pia.telekom.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/*
  Dashboard ve analiz sorguları uzak Supabase üzerinde ağır aggregate'ler
  çalıştırır. Sonuçları 60 saniye önbelleğe alıyoruz:
  - İlk açılış DB'ye gider, sonraki açılışlar (sayfa değişimi, geri dönüş,
    yenileme) milisaniyeler içinde bellekteki kopyadan döner.
  - Fatura/müşteri/abonelik yazma işlemleri ilgili cache'leri anında boşaltır
    (@CacheEvict), bu yüzden veri en fazla 60 sn bayat kalabilir; pratikte
    yazma sonrası hemen tazelenir.
*/
@Configuration
@EnableCaching
public class CacheConfig {

    public static final String DASHBOARD = "dashboard";
    public static final String REVENUE_FORECAST = "revenueForecast";
    public static final String REGIONAL_PAYMENTS = "regionalPayments";
    public static final String UPGRADE_RECOMMENDATIONS = "upgradeRecommendations";

    public static final String[] ALL_ANALYTICS_CACHES = {
            DASHBOARD, REVENUE_FORECAST, REGIONAL_PAYMENTS, UPGRADE_RECOMMENDATIONS
    };

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager(ALL_ANALYTICS_CACHES);
        manager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofSeconds(60))
                .maximumSize(100));
        return manager;
    }
}
