package com.pocketfinance.backend.dto;

import com.pocketfinance.backend.model.TransactionType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransactionResponse(
        UUID id,
        TransactionType type,
        BigDecimal amount,
        String currency,
        String description,
        Instant occurredAt,
        UUID categoryId,
        String categoryName,
        String metadata,
        Instant createdAt,
        Instant updatedAt
) {
}
