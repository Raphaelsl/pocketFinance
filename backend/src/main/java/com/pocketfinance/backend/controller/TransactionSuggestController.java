package com.pocketfinance.backend.controller;

import com.pocketfinance.backend.dto.TransactionSuggestionResult;
import com.pocketfinance.backend.service.TransactionSuggestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionSuggestController {

    private final TransactionSuggestService service;

    public TransactionSuggestController(TransactionSuggestService service) {
        this.service = service;
    }

    @PostMapping("/suggest")
    public ResponseEntity<?> suggestTransaction(@RequestBody Map<String, String> payload) {
        String input = payload.get("input");

        if (input == null || input.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "INVALID_INPUT",
                    "message", "O texto de entrada não pode ser vazio."
            ));
        }

        if (input.length() > 500) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "INVALID_INPUT",
                    "message", "O texto de entrada não pode ultrapassar 500 caracteres."
            ));
        }


        TransactionSuggestionResult suggestion = service.suggest(input);

        return ResponseEntity.ok(Map.of(
                "suggestion", suggestion,
                "confidence", suggestion.confidence() != null ? suggestion.confidence() : "UNKNOWN",
                "rawInput", input
        ));
    }
}