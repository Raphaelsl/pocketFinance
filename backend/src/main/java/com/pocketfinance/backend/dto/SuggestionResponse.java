package com.pocketfinance.backend.dto;

public record SuggestionResponse(
        TransactionSuggestionResult suggestion,
        String confidence
) {}