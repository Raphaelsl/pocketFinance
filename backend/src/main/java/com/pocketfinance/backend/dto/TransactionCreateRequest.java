package com.pocketfinance.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransactionCreateRequest(
        @NotNull(message = "Amount is required")
        @Positive(message = "Amount must be positive")
        BigDecimal amount,

        @NotBlank(message = "Currency is required")
        String currency,

        @NotBlank(message = "Description is required")
        String description,

        @NotNull(message = "Occurred at is required")
        Instant occurredAt,

        UUID categoryId,

        String metadata
) {
}
