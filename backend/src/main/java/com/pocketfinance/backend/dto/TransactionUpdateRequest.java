package com.pocketfinance.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransactionUpdateRequest(
        BigDecimal amount,
        String description,
        UUID categoryId,
        Instant occurredAt,
        String currency
) {
}
