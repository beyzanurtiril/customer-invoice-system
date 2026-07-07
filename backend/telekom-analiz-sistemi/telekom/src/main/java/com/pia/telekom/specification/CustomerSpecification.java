package com.pia.telekom.specification;

import com.pia.telekom.entity.Customer;
import com.pia.telekom.entity.Invoice;
import com.pia.telekom.entity.Subscription;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class CustomerSpecification {

    public static Specification<Customer> filterBy(String name, String surname,
                                                   Long regionId, String cityType,
                                                   String subscriptionType,
                                                   Integer minOverdueCount) {
        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (name != null && !name.isBlank()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }
            if (surname != null && !surname.isBlank()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("surname")), "%" + surname.toLowerCase() + "%"));
            }
            if (regionId != null) {
                predicates = cb.and(predicates,
                        cb.equal(root.get("region").get("regionId"), regionId));
            }
            if (cityType != null && !cityType.isBlank()) {
                predicates = cb.and(predicates,
                        cb.equal(cb.lower(root.get("region").get("cityType")), cityType.toLowerCase()));
            }
            if (subscriptionType != null && !subscriptionType.isBlank()) {
                Join<Customer, Subscription> subJoin = root.join("subscription", JoinType.INNER);
                predicates = cb.and(predicates,
                        cb.equal(cb.lower(subJoin.get("product").get("subscriptionType")), subscriptionType.toLowerCase()));
            }
            if (minOverdueCount != null) {
                Subquery<Long> overdueSub = query.subquery(Long.class);
                var invoiceRoot = overdueSub.from(Invoice.class);
                overdueSub.select(cb.count(invoiceRoot));
                overdueSub.where(
                        cb.equal(invoiceRoot.get("customer"), root),
                        cb.isNull(invoiceRoot.get("paymentDate")),
                        cb.lessThan(invoiceRoot.get("dueDate"), LocalDate.now()),
                        cb.greaterThan(invoiceRoot.get("invoiceDate"), LocalDate.now().minusMonths(12))
                );
                predicates = cb.and(predicates,
                        cb.greaterThanOrEqualTo(overdueSub, minOverdueCount.longValue()));
            }
            return predicates;
        };
    }
}