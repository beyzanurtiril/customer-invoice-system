package com.pia.telekom.service;

import com.pia.telekom.dto.ProductResponse;
import com.pia.telekom.dto.SubscriptionRequest;
import com.pia.telekom.dto.SubscriptionResponse;
import com.pia.telekom.entity.Customer;
import com.pia.telekom.entity.Product;
import com.pia.telekom.entity.Subscription;
import com.pia.telekom.repository.CustomerRepository;
import com.pia.telekom.repository.ProductRepository;
import com.pia.telekom.repository.SubscriptionRepository;
import jakarta.persistence.EntityNotFoundException;
import com.pia.telekom.config.CacheConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    /*
      Bu metod tek müşteri detayı için kullanılır ve tek sorgu atar; sorun bu değildi.
      Asıl yük, Customer entity'sindeki mappedBy'lı OneToOne alanının her müşteri
      listelemesinde otomatik subscription sorgusu tetiklemesi ve frontend'in liste
      ekranında HER müşteri için bu endpoint'i ayrı ayrı çağırmasıydı. Entity alanı
      kaldırıldı, frontend liste akışı toplu sorguya çevrildi; detay ekranı için
      bu endpoint aktif kalıyor.
    */
    @Transactional(readOnly = true)
    public SubscriptionResponse getSubscriptionByCustomer(Integer customerId) {
        Subscription subscription = subscriptionRepository.findByCustomer_CustomerId(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Bu müşteriye ait abonelik bulunamadı: customerId=" + customerId));
        return toResponse(subscription);
    }

    @CacheEvict(cacheNames = {CacheConfig.DASHBOARD}, allEntries = true)
    @Transactional
    public SubscriptionResponse createSubscription(SubscriptionRequest request) {
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new EntityNotFoundException("Müşteri bulunamadı: id=" + request.customerId()));
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new EntityNotFoundException("Ürün bulunamadı: id=" + request.productId()));

        Subscription subscription = Subscription.builder()
                .customer(customer)
                .product(product)
                .startDate(request.startDate())
                .status(request.status())
                .build();

        return toResponse(subscriptionRepository.save(subscription));
    }

    private SubscriptionResponse toResponse(Subscription subscription) {
        Product p = subscription.getProduct();
        ProductResponse productResponse = new ProductResponse(
                p.getProductId(), p.getName(), p.getCategory(), p.getMonthlyFee(),
                p.getDataLimitGb(), p.getVoiceLimitMin(), p.getTierLevel(), p.getSubscriptionType()
        );
        Customer c = subscription.getCustomer();

        return new SubscriptionResponse(
                subscription.getSubscriptionId(), c.getCustomerId(),
                c.getName() + " " + c.getSurname(), productResponse,
                subscription.getStartDate(), subscription.getStatus()
        );
    }
}
