package com.pocketfinance.backend.mapper;

import com.pocketfinance.backend.dto.TransactionCreateRequest;
import com.pocketfinance.backend.dto.TransactionResponse;
import com.pocketfinance.backend.dto.TransactionUpdateRequest;
import com.pocketfinance.backend.model.Transaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {

    public Transaction toEntity(TransactionCreateRequest request) {
        return Transaction.builder()
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .description(request.getDescription())
                .occurredAt(request.getOccurredAt())
                .metadata(request.getMetadata())
                .build();
    }

    public TransactionResponse toResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .currency(transaction.getCurrency())
                .description(transaction.getDescription())
                .occurredAt(transaction.getOccurredAt())
                .categoryId(transaction.getCategory() != null ? transaction.getCategory().getId() : null)
                .metadata(transaction.getMetadata())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(TransactionUpdateRequest request, Transaction transaction) {
        if (request.getAmount() != null) {
            transaction.setAmount(request.getAmount());
        }
        if (request.getCurrency() != null) {
            transaction.setCurrency(request.getCurrency());
        }
        if (request.getDescription() != null) {
            transaction.setDescription(request.getDescription());
        }
        if (request.getOccurredAt() != null) {
            transaction.setOccurredAt(request.getOccurredAt());
        }
        if (request.getMetadata() != null) {
            transaction.setMetadata(request.getMetadata());
        }
    }
}
