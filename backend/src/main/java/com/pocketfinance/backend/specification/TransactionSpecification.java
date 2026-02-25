package com.pocketfinance.backend.specification;

import com.pocketfinance.backend.model.Transaction;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TransactionSpecification {

    public static Specification<Transaction> byCategoryId(UUID categoryId) {
        if (categoryId == null) {
            return null;
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Transaction> byDateRange(Instant start, Instant end) {
        if (start == null && end == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (start != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("occurredAt"), start));
            }

            if (end != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("occurredAt"), end));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Transaction> byDescription(String search) {
        if (search == null || search.trim().isEmpty()) {
            return null;
        }
        String searchPattern = "%" + search.toLowerCase() + "%";
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern);
    }
}
