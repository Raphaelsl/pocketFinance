package com.pocketfinance.backend.validator;

import com.pocketfinance.backend.dto.TransactionSuggestionResult;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TransactionSuggestionValidatorTest {

    private final TransactionSuggestionValidator validator = new TransactionSuggestionValidator();

    private TransactionSuggestionResult createValidResult() {
        return new TransactionSuggestionResult(
                new BigDecimal("150.00"), "EXPENSE", "BRL", "Compra no mercado", "2026-09-15", "Alimentação", "HIGH"
        );
    }

    @Test
    void shouldReturnTrueForValidResult() {
        assertTrue(validator.isValid(createValidResult()));
    }

    @Test
    void shouldReturnFalseWhenAmountIsZeroOrNegative() {
        TransactionSuggestionResult zeroAmount = new TransactionSuggestionResult(
                BigDecimal.ZERO, "EXPENSE", "BRL", "Teste", "2026-09-15", "Cat", "HIGH"
        );
        assertFalse(validator.isValid(zeroAmount));

        TransactionSuggestionResult negativeAmount = new TransactionSuggestionResult(
                new BigDecimal("-50.00"), "EXPENSE", "BRL", "Teste", "2026-09-15", "Cat", "HIGH"
        );
        assertFalse(validator.isValid(negativeAmount));
    }

    @Test
    void shouldReturnFalseWhenTypeIsInvalid() {
        TransactionSuggestionResult invalidType = new TransactionSuggestionResult(
                new BigDecimal("150.00"), "Despesa", "BRL", "Teste", "2026-09-15", "Cat", "HIGH"
        );
        assertFalse(validator.isValid(invalidType));
    }

    @Test
    void shouldReturnFalseWhenCurrencyIsInvalid() {
        TransactionSuggestionResult invalidCurrency = new TransactionSuggestionResult(
                new BigDecimal("150.00"), "EXPENSE", "brl", "Teste", "2026-09-15", "Cat", "HIGH"
        );
        assertFalse(validator.isValid(invalidCurrency));
    }

    @Test
    void shouldReturnFalseWhenDateIsInvalid() {
        TransactionSuggestionResult invalidDate = new TransactionSuggestionResult(
                new BigDecimal("150.00"), "EXPENSE", "BRL", "Teste", "15/09/2026", "Cat", "HIGH"
        );
        assertFalse(validator.isValid(invalidDate));
    }
}