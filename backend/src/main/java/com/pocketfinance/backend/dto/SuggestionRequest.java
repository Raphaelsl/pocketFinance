package com.pocketfinance.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SuggestionRequest(
        @NotBlank(message = "O texto de entrada não pode ser vazio.")
        @Size(max = 500, message = "O texto de entrada não pode ultrapassar 500 caracteres.")
        String input
) {}