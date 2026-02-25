package com.pocketfinance.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransactionResponse(
        UUID id,
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
