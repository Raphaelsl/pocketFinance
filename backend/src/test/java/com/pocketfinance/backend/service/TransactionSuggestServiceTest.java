package com.pocketfinance.backend.service;

import com.pocketfinance.backend.dto.TransactionSuggestionResult;
import com.pocketfinance.backend.exception.ParsingFailedException;
import com.pocketfinance.backend.port.TransactionParserPort;
import com.pocketfinance.backend.validator.TransactionSuggestionValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TransactionSuggestServiceTest {

    private TransactionParserPort parserPort;
    private TransactionSuggestionValidator validator;
    private TransactionSuggestService service;

    @BeforeEach
    void setUp() {
        parserPort = mock(TransactionParserPort.class);
        validator = mock(TransactionSuggestionValidator.class);
        service = new TransactionSuggestService(parserPort, validator);
    }

    @Test
    void shouldReturnResultWhenValidationPasses() {
        String input = "Gastei 50 reais no ifood";
        TransactionSuggestionResult mockResult = new TransactionSuggestionResult(
                new BigDecimal("50.00"), "EXPENSE", "BRL", "ifood", "2026-09-15", "Alimentação", "HIGH"
        );

        when(parserPort.parse(input)).thenReturn(mockResult);
        when(validator.isValid(mockResult)).thenReturn(true);

        TransactionSuggestionResult result = service.suggest(input);

        assertNotNull(result);
        assertEquals(mockResult, result);
        verify(parserPort, times(1)).parse(input);
        verify(validator, times(1)).isValid(mockResult);
    }

    @Test
    void shouldThrowParsingFailedExceptionWhenValidationFails() {
        String input = "Gastei -50 reais no ifood";
        TransactionSuggestionResult mockResult = new TransactionSuggestionResult(
                new BigDecimal("-50.00"), "EXPENSE", "BRL", "ifood", "2026-09-15", "Alimentação", "HIGH"
        );

        when(parserPort.parse(input)).thenReturn(mockResult);
        when(validator.isValid(mockResult)).thenReturn(false);

        ParsingFailedException exception = assertThrows(ParsingFailedException.class, () -> service.suggest(input));

        assertNotNull(exception.getMessage());
        verify(parserPort, times(1)).parse(input);
        verify(validator, times(1)).isValid(mockResult);
    }
}