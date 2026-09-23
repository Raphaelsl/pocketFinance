package com.pocketfinance.backend.controller;

import com.pocketfinance.backend.dto.SuggestionRequest;
import com.pocketfinance.backend.dto.SuggestionResponse;
import com.pocketfinance.backend.dto.TransactionSuggestionResult;
import com.pocketfinance.backend.service.TransactionSuggestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionSuggestController {

    private final TransactionSuggestService service;

    public TransactionSuggestController(TransactionSuggestService service) {
        this.service = service;
    }

    @PostMapping("/suggest")
    public ResponseEntity<SuggestionResponse> suggestTransaction(@Valid @RequestBody SuggestionRequest request) {

        TransactionSuggestionResult suggestion = service.suggest(request.input());

        String confidence = suggestion.confidence() != null ? suggestion.confidence() : "UNKNOWN";

        return ResponseEntity.ok(new SuggestionResponse(suggestion, confidence));
    }
}