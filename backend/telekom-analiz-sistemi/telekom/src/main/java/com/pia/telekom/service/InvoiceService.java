package com.pia.telekom.service;

import com.pia.telekom.dto.InvoiceRequest;
import com.pia.telekom.dto.InvoiceResponse;
import com.pia.telekom.dto.ProductResponse;
import com.pia.telekom.entity.Customer;
import com.pia.telekom.entity.Invoice;
import com.pia.telekom.entity.Product;
import com.pia.telekom.repository.CustomerRepository;
import com.pia.telekom.repository.InvoiceRepository;
import com.pia.telekom.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesByCustomer(Long customerId, Pageable pageable) {
        ensureCustomerExists(customerId);
        return invoiceRepository.findByCustomer_CustomerId(customerId, pageable)
                .map(this::toResponse);
    }

    @Transactional
    public InvoiceResponse createInvoice(Long customerId, InvoiceRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Müşteri bulunamadı: id=" + customerId));

        Product product = resolveProduct(request.productId());

        Invoice invoice = Invoice.builder()
                .customer(customer)
                .product(product)
                .paymentChannel(request.paymentChannel())
                .invoiceAmount(request.invoiceAmount())
                .dueAmount(request.dueAmount())
                .overageAmount(request.overageAmount())
                .invoiceDate(request.invoiceDate())
                .dueDate(request.dueDate())
                .paymentDate(request.paymentDate())
                .build();

        Invoice saved = invoiceRepository.save(invoice);
        return toResponse(saved);
    }

    @Transactional
    public InvoiceResponse updateInvoice(Long customerId, Long invoiceId, InvoiceRequest request) {
        Invoice invoice = getInvoiceForCustomerOrThrow(customerId, invoiceId);
        Product product = resolveProduct(request.productId());

        invoice.setProduct(product);
        invoice.setPaymentChannel(request.paymentChannel());
        invoice.setInvoiceAmount(request.invoiceAmount());
        invoice.setDueAmount(request.dueAmount());
        invoice.setOverageAmount(request.overageAmount());
        invoice.setInvoiceDate(request.invoiceDate());
        invoice.setDueDate(request.dueDate());
        invoice.setPaymentDate(request.paymentDate());

        Invoice updated = invoiceRepository.save(invoice);
        return toResponse(updated);
    }

    @Transactional
    public void deleteInvoice(Long customerId, Long invoiceId) {
        Invoice invoice = getInvoiceForCustomerOrThrow(customerId, invoiceId);
        invoiceRepository.delete(invoice);
    }

    private Invoice getInvoiceForCustomerOrThrow(Long customerId, Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new EntityNotFoundException("Fatura bulunamadı: id=" + invoiceId));

        if (!invoice.getCustomer().getCustomerId().equals(customerId)) {
            throw new EntityNotFoundException(
                    "Fatura (id=" + invoiceId + ") bu müşteriye (id=" + customerId + ") ait değil");
        }
        return invoice;
    }

    private void ensureCustomerExists(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new EntityNotFoundException("Müşteri bulunamadı: id=" + customerId);
        }
    }

    private Product resolveProduct(Long productId) {
        if (productId == null) {
            return null;
        }
        return productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Ürün bulunamadı: id=" + productId));
    }

    private InvoiceResponse toResponse(Invoice invoice) {
        ProductResponse productResponse = null;
        if (invoice.getProduct() != null) {
            Product p = invoice.getProduct();
            productResponse = new ProductResponse(
                    p.getProductId(), p.getName(), p.getCategory(), p.getMonthlyFee(),
                    p.getDataLimitGb(), p.getVoiceLimitMin(), p.getTierLevel(), p.getSubscriptionType()
            );
        }

        return new InvoiceResponse(
                invoice.getInvoiceId(),
                invoice.getCustomer().getCustomerId(),
                productResponse,
                invoice.getPaymentChannel(),
                invoice.getInvoiceAmount(),
                invoice.getDueAmount(),
                invoice.getOverageAmount(),
                invoice.getInvoiceDate(),
                invoice.getDueDate(),
                invoice.getPaymentDate(),
                invoice.getPaymentStatus()
        );
    }
}