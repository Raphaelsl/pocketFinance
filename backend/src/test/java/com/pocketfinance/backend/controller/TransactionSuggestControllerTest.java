package com.pocketfinance.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pocketfinance.backend.dto.TransactionSuggestionResult;
import com.pocketfinance.backend.exception.ParsingFailedException;
import com.pocketfinance.backend.service.TransactionSuggestService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TransactionSuggestController.class)
class TransactionSuggestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TransactionSuggestService service;

    @Test
    void shouldReturn200OnSuccess() throws Exception {
        String input = "Comprei um lanche por 20 reais";
        TransactionSuggestionResult mockResult = new TransactionSuggestionResult(
                new BigDecimal("20.00"), "EXPENSE", "BRL", "Lanche", "2026-09-15", "Alimentação", "HIGH"
        );

        when(service.suggest(input)).thenReturn(mockResult);

        mockMvc.perform(post("/api/transactions/suggest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("input", input))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.suggestion.amount").value(20.00))
                .andExpect(jsonPath("$.confidence").value("HIGH"))
                .andExpect(jsonPath("$.rawInput").value(input));
    }

    @Test
    void shouldReturn400WhenInputIsEmpty() throws Exception {
        mockMvc.perform(post("/api/transactions/suggest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("input", "   "))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("INVALID_INPUT"));
    }

    @Test
    void shouldReturn400WhenInputIsTooLong() throws Exception {
        String longInput = "a".repeat(501);

        mockMvc.perform(post("/api/transactions/suggest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("input", longInput))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("INVALID_INPUT"));
    }

    @Test
    void shouldReturn422WhenParsingFails() throws Exception {
        String input = "Gastei -10";
        when(service.suggest(input)).thenThrow(new ParsingFailedException("Invalid data", input));

        mockMvc.perform(post("/api/transactions/suggest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("input", input))))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message").value("PARSING_FAILED: Invalid data"))
                .andExpect(jsonPath("$.details[0]").value("rawInput: " + input));
    }
    @Test
    void shouldReturn503WhenAiServiceIsUnavailable() throws Exception {
        String input = "Comprei algo na padaria por 10 reais";


        when(service.suggest(input)).thenThrow(new org.springframework.web.client.RestClientException("Simulated AI downtime"));

        mockMvc.perform(post("/api/transactions/suggest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("input", input))))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.message").value("AI_SERVICE_UNAVAILABLE: O serviço de inteligência artificial falhou."));
    }

    @Test
    void shouldNotCallServiceWhenInputExceeds500Characters() throws Exception {

        String longInput = "a".repeat(501);

        mockMvc.perform(post("/api/transactions/suggest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("input", longInput))))
                .andExpect(status().isBadRequest());
        org.mockito.Mockito.verify(service, org.mockito.Mockito.never()).suggest(org.mockito.ArgumentMatchers.anyString());
    }
}