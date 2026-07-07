package com.pia.telekom.controller;

import com.pia.telekom.dto.InvoiceRequest;
import com.pia.telekom.dto.InvoiceResponse;
import com.pia.telekom.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springdoc.core.annotations.ParameterObject;

@RestController
@RequestMapping("/api/customers/{customerId}/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public Page<InvoiceResponse> getInvoices(@PathVariable Long customerId, @ParameterObject Pageable pageable) {
        return invoiceService.getInvoicesByCustomer(customerId, pageable);
    }

    @PostMapping
    public ResponseEntity<InvoiceResponse> createInvoice(@PathVariable Long customerId,
                                                         @Valid @RequestBody InvoiceRequest request) {
        InvoiceResponse created = invoiceService.createInvoice(customerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{invoiceId}")
    public InvoiceResponse updateInvoice(@PathVariable Long customerId,
                                         @PathVariable Long invoiceId,
                                         @Valid @RequestBody InvoiceRequest request) {
        return invoiceService.updateInvoice(customerId, invoiceId, request);
    }

    @DeleteMapping("/{invoiceId}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long customerId,
                                              @PathVariable Long invoiceId) {
        invoiceService.deleteInvoice(customerId, invoiceId);
        return ResponseEntity.noContent().build();
    }
}