package com.pocketfinance.backend.mapper;

import com.pocketfinance.backend.dto.TransactionCreateRequest;
import com.pocketfinance.backend.dto.TransactionResponse;
import com.pocketfinance.backend.model.Category;
import com.pocketfinance.backend.model.Transaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {

    public Transaction toEntity(TransactionCreateRequest request) {
        Category category = Category.builder()
                .id(request.categoryId())
                .build();

        return Transaction.builder()
                .amount(request.amount())
                .description(request.description())
                .category(category)
                .occurredAt(request.occurredAt())
                .currency(request.currency())
                .build();
    }

    public TransactionResponse toResponse(Transaction entity) {
        String categoryName = entity.getCategory() != null
                ? entity.getCategory().getName()
                : null;

        return new TransactionResponse(
                entity.getId(),
                entity.getAmount(),
                entity.getDescription(),
                categoryName,
                entity.getOccurredAt(),
                entity.getCurrency()
        );
    }
}
