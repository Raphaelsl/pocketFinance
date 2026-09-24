package com.pocketfinance.backend.validator;

import com.pocketfinance.backend.dto.TransactionSuggestionResult;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@Component
public class TransactionSuggestionValidator {

    public boolean isValid(TransactionSuggestionResult result) {
        if (result == null) return false;


        if (result.amount() == null || result.amount().compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }


        if (result.type() == null || (!result.type().equals("INCOME") && !result.type().equals("EXPENSE"))) {
            return false;
        }


        if (result.currency() == null || !result.currency().matches("^[A-Z]{3}$")) {
            return false;
        }

        if (result.description() == null || result.description().trim().isEmpty()) {
            return false;
        }

        if (result.occurredAt() == null) {
            return false;
        }

        try {
            LocalDate.parse(result.occurredAt());
        } catch (DateTimeParseException e) {
            return false;
        }

        return true;
    }
}