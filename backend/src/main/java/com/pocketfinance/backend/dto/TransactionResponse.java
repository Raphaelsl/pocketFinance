package com.pocketfinance.backend.dto;



import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;


public record TransactionResponse(
        UUID id,
        BigDecimal amount,
        String description,
        String categoryName,
        Instant occurredAt,
        String currency
) {

}
