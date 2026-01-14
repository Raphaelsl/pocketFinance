package com.pocketfinance.backend.dto;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionUpdateRequest {

    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private String currency;

    private String description;

    private Instant occurredAt;

    private UUID categoryId;

    private String metadata;
}
