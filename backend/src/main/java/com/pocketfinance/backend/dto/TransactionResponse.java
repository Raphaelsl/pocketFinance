package com.pocketfinance.backend.dto;

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
public class TransactionResponse {

    private UUID id;
    private BigDecimal amount;
    private String currency;
    private String description;
    private Instant occurredAt;
    private UUID categoryId;
    private String metadata;
    private Instant createdAt;
    private Instant updatedAt;
}
