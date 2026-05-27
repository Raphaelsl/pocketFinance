package com.pocketfinance.backend;

import com.pocketfinance.backend.model.TransactionType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Simple unit tests for TransactionType enum
 * No Spring context loading - pure Java tests
 */
@DisplayName("Transaction Type - Simple Unit Tests (B6)")
class TransactionSimpleTests {

    @Test
    @DisplayName("TransactionType.INCOME enum value exists")
    void testTransactionTypeIncomeExists() {
        assertNotNull(TransactionType.INCOME);
        assertEquals("INCOME", TransactionType.INCOME.toString());
    }

    @Test
    @DisplayName("TransactionType.EXPENSE enum value exists")
    void testTransactionTypeExpenseExists() {
        assertNotNull(TransactionType.EXPENSE);
        assertEquals("EXPENSE", TransactionType.EXPENSE.toString());
    }

    @Test
    @DisplayName("TransactionType has exactly 2 values")
    void testTransactionTypeValuesCount() {
        TransactionType[] values = TransactionType.values();
        assertEquals(2, values.length);
        assertEquals(TransactionType.INCOME, values[0]);
        assertEquals(TransactionType.EXPENSE, values[1]);
    }

    @Test
    @DisplayName("Can compare TransactionType values")
    void testTransactionTypeComparison() {
        TransactionType income = TransactionType.INCOME;
        TransactionType expense = TransactionType.EXPENSE;

        assertEquals(TransactionType.INCOME, income);
        assertEquals(TransactionType.EXPENSE, expense);

        // Different types should not be equal
        assertNotEqual(income, expense);
    }

    private void assertNotEqual(Object a, Object b) {
        if (a.equals(b)) {
            throw new AssertionError(a + " should not equal " + b);
        }
    }
}

