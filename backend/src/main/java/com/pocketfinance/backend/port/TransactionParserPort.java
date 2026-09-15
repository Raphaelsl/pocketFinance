package com.pocketfinance.backend.port;

import com.pocketfinance.backend.dto.TransactionSuggestionResult;

public interface TransactionParserPort {
    TransactionSuggestionResult parse(String input);
}