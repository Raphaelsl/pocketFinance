package com.pocketfinance.backend.dto;

import java.math.BigDecimal;

public record TransactionSuggestionResult(
        BigDecimal amount,
        String type,
        String currency,
        String description,
        String occurredAt,
        String suggestedCategoryName,
        String confidence
) {}