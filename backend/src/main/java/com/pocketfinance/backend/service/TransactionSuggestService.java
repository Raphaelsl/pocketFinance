package com.pocketfinance.backend.service;

import com.pocketfinance.backend.dto.TransactionSuggestionResult;
import com.pocketfinance.backend.port.TransactionParserPort;
import com.pocketfinance.backend.validator.TransactionSuggestionValidator;
import org.springframework.stereotype.Service;
import com.pocketfinance.backend.exception.ParsingFailedException;

@Service
public class TransactionSuggestService {

    private final TransactionParserPort parserPort;
    private final TransactionSuggestionValidator validator;


    public TransactionSuggestService(TransactionParserPort parserPort, TransactionSuggestionValidator validator) {
        this.parserPort = parserPort;
        this.validator = validator;
    }

    public TransactionSuggestionResult suggest(String input) {
        TransactionSuggestionResult result = parserPort.parse(input);

        if (!validator.isValid(result)) {

            throw new ParsingFailedException("A IA não retornou os dados no formato exigido.");
        }

        return result;
    }
}