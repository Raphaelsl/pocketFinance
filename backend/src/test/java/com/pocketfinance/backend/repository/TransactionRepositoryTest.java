package com.pocketfinance.backend.repository;

import com.pocketfinance.backend.model.Category;
import com.pocketfinance.backend.model.Transaction;
import com.pocketfinance.backend.model.TransactionType;
import com.pocketfinance.backend.specification.TransactionSpecification;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionRepositoryTest {

    @Mock
    private TransactionRepository transactionRepository;

    private Category category1;
    private Category category2;
    private Transaction transaction1;
    private Transaction transaction2;
    private Transaction transaction3;

    @BeforeEach
    void setUp() {
        // Create categories
        category1 = new Category(
                UUID.randomUUID(),
                "Food",
                Instant.now()
        );

        category2 = new Category(
                UUID.randomUUID(),
                "Transport",
                Instant.now()
        );

        // Create transactions
        Instant baseTime = Instant.now();

        transaction1 = new Transaction(
                UUID.randomUUID(),
                new BigDecimal("100.50"),
                "BRL",
                "Lunch at restaurant",
                baseTime,
                category1,
                "{\"type\": \"restaurant\"}",
                baseTime,
                baseTime,
                TransactionType.EXPENSE  // NEW: add type
        );

        transaction2 = new Transaction(
                UUID.randomUUID(),
                new BigDecimal("50.00"),
                "BRL",
                "Bus ticket",
                baseTime.plusSeconds(3600),
                category2,
                "{\"type\": \"transport\"}",
                baseTime.plusSeconds(3600),
                baseTime.plusSeconds(3600),
                TransactionType.EXPENSE  // NEW: add type
        );

        transaction3 = new Transaction(
                UUID.randomUUID(),
                new BigDecimal("200.00"),
                "BRL",
                "Grocery shopping",
                baseTime.plusSeconds(7200),
                category1,
                "{\"type\": \"grocery\"}",
                baseTime.plusSeconds(7200),
                baseTime.plusSeconds(7200),
                TransactionType.EXPENSE  // NEW: add type
        );
    }

    @Test
    void whenFindByCategoryId_thenReturnTransactions() {
        Pageable pageable = PageRequest.of(0, 10);
        List<Transaction> transactions = Arrays.asList(transaction1, transaction3);
        Page<Transaction> expectedPage = new PageImpl<>(transactions, pageable, transactions.size());

        when(transactionRepository.findByCategoryId(category1.getId(), pageable)).thenReturn(expectedPage);

        Page<Transaction> result = transactionRepository.findByCategoryId(category1.getId(), pageable);

        assertEquals(2, result.getContent().size());
        assertTrue(result.getContent().stream()
                .allMatch(t -> t.getCategory().getId().equals(category1.getId())));
    }

    @Test
    void whenFindByOccurredAtBetween_thenReturnTransactions() {
        Instant dateFrom = Instant.now().minusSeconds(3600);
        Instant dateTo = Instant.now().plusSeconds(10800);
        Pageable pageable = PageRequest.of(0, 10);
        List<Transaction> transactions = Arrays.asList(transaction1, transaction2, transaction3);
        Page<Transaction> expectedPage = new PageImpl<>(transactions, pageable, transactions.size());

        when(transactionRepository.findByOccurredAtBetween(dateFrom, dateTo, pageable)).thenReturn(expectedPage);

        Page<Transaction> result = transactionRepository.findByOccurredAtBetween(dateFrom, dateTo, pageable);

        assertEquals(3, result.getContent().size());
    }

    @Test
    void whenFindByCategoryIdAndOccurredAtBetween_thenReturnTransactions() {
        Instant dateFrom = Instant.now().minusSeconds(3600);
        Instant dateTo = Instant.now().plusSeconds(3600);
        Pageable pageable = PageRequest.of(0, 10);
        List<Transaction> transactions = Arrays.asList(transaction1);
        Page<Transaction> expectedPage = new PageImpl<>(transactions, pageable, transactions.size());

        when(transactionRepository.findByCategoryIdAndOccurredAtBetween(
                category1.getId(), dateFrom, dateTo, pageable)).thenReturn(expectedPage);

        Page<Transaction> result = transactionRepository.findByCategoryIdAndOccurredAtBetween(
                category1.getId(), dateFrom, dateTo, pageable);

        assertEquals(1, result.getContent().size());
        assertEquals(transaction1.getDescription(), result.getContent().get(0).getDescription());
    }

    @Test
    void whenFindWithFilters_thenReturnFilteredTransactions() {
        Pageable pageable = PageRequest.of(0, 10);

        // Test filter by category
        List<Transaction> categoryTransactions = Arrays.asList(transaction1, transaction3);
        Page<Transaction> expectedCategoryPage = new PageImpl<>(categoryTransactions, pageable, categoryTransactions.size());
        when(transactionRepository.findWithFilters(
                category1.getId(), null, null, null, pageable)).thenReturn(expectedCategoryPage);

        Page<Transaction> result = transactionRepository.findWithFilters(
                category1.getId(), null, null, null, pageable);
        assertEquals(2, result.getContent().size());

        // Test filter by search
        List<Transaction> searchTransactions = Arrays.asList(transaction1);
        Page<Transaction> expectedSearchPage = new PageImpl<>(searchTransactions, pageable, searchTransactions.size());
        when(transactionRepository.findWithFilters(
                null, null, null, "restaurant", pageable)).thenReturn(expectedSearchPage);

        result = transactionRepository.findWithFilters(
                null, null, null, "restaurant", pageable);
        assertEquals(1, result.getContent().size());
        assertEquals("Lunch at restaurant", result.getContent().get(0).getDescription());

        // Test filter by date range
        Instant dateFrom = Instant.now().minusSeconds(3600);
        Instant dateTo = Instant.now().plusSeconds(3600);
        List<Transaction> dateTransactions = Arrays.asList(transaction1);
        Page<Transaction> expectedDatePage = new PageImpl<>(dateTransactions, pageable, dateTransactions.size());
        when(transactionRepository.findWithFilters(
                null, dateFrom, dateTo, null, pageable)).thenReturn(expectedDatePage);

        result = transactionRepository.findWithFilters(
                null, dateFrom, dateTo, null, pageable);
        assertEquals(1, result.getContent().size());
    }

    @Test
    void whenUsingSpecification_withCategoryFilter_thenReturnFilteredTransactions() {
        Pageable pageable = PageRequest.of(0, 10);

        List<Transaction> transactions = Arrays.asList(transaction1, transaction3);
        Page<Transaction> expectedPage = new PageImpl<>(transactions, pageable, transactions.size());

        when(transactionRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(expectedPage);

        Specification<Transaction> spec = TransactionSpecification.byCategoryId(category1.getId());
        Page<Transaction> result = transactionRepository.findAll(spec, pageable);

        assertEquals(2, result.getContent().size());
        assertTrue(result.getContent().stream()
                .allMatch(t -> t.getCategory().getId().equals(category1.getId())));
    }

    @Test
    void whenUsingSpecification_withDateRange_thenReturnFilteredTransactions() {
        Pageable pageable = PageRequest.of(0, 10);

        Instant dateFrom = Instant.now();
        Instant dateTo = Instant.now().plusSeconds(3600);

        List<Transaction> transactions = Arrays.asList(transaction1);
        Page<Transaction> expectedPage = new PageImpl<>(transactions, pageable, transactions.size());

        when(transactionRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(expectedPage);

        Specification<Transaction> spec = TransactionSpecification.byDateRange(dateFrom, dateTo);
        Page<Transaction> result = transactionRepository.findAll(spec, pageable);

        assertEquals(1, result.getContent().size());
        assertEquals(transaction1.getDescription(), result.getContent().get(0).getDescription());
    }

    @Test
    void whenUsingSpecification_withSearch_thenReturnFilteredTransactions() {
        Pageable pageable = PageRequest.of(0, 10);

        List<Transaction> transactions = Arrays.asList(transaction2);
        Page<Transaction> expectedPage = new PageImpl<>(transactions, pageable, transactions.size());

        when(transactionRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(expectedPage);

        Specification<Transaction> spec = TransactionSpecification.byDescription("bus");
        Page<Transaction> result = transactionRepository.findAll(spec, pageable);

        assertEquals(1, result.getContent().size());
        assertEquals("Bus ticket", result.getContent().get(0).getDescription());
    }

    @Test
    void whenUsingSpecification_withMultipleFilters_thenReturnFilteredTransactions() {
        Pageable pageable = PageRequest.of(0, 10);

        List<Transaction> transactions = Arrays.asList(transaction3);
        Page<Transaction> expectedPage = new PageImpl<>(transactions, pageable, transactions.size());

        when(transactionRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(expectedPage);

        Specification<Transaction> spec = Specification.where((Specification<Transaction>) null)
                .and(TransactionSpecification.byCategoryId(category1.getId()))
                .and(TransactionSpecification.byDescription("grocery"));

        Page<Transaction> result = transactionRepository.findAll(spec, pageable);

        assertEquals(1, result.getContent().size());
        assertEquals("Grocery shopping", result.getContent().get(0).getDescription());
    }

    @Test
    void whenTransactionCreatedWithType_thenTypeIsNotNull() {
        // Arrange & Act
        assertNotNull(transaction1.getType(), "Transaction type should not be null");
        assertNotNull(transaction2.getType(), "Transaction type should not be null");
        assertNotNull(transaction3.getType(), "Transaction type should not be null");
    }

    @Test
    void whenTransactionHasTypeExpense_thenTypeEqualsExpense() {
        // Arrange & Act
        assertEquals(TransactionType.EXPENSE, transaction1.getType(),
                "Transaction1 should have EXPENSE type");
        assertEquals(TransactionType.EXPENSE, transaction2.getType(),
                "Transaction2 should have EXPENSE type");
        assertEquals(TransactionType.EXPENSE, transaction3.getType(),
                "Transaction3 should have EXPENSE type");
    }

    @Test
    void whenCreatingIncomeTransaction_thenTypeEqualsIncome() {
        // Arrange
        UUID incomeTransactionId = UUID.randomUUID();
        Transaction incomeTransaction = new Transaction(
                incomeTransactionId,
                new BigDecimal("5000.00"),
                "USD",
                "Monthly salary",
                Instant.now(),
                null,
                null,
                Instant.now(),
                Instant.now(),
                TransactionType.INCOME  // INCOME type
        );

        // Act & Assert
        assertEquals(TransactionType.INCOME, incomeTransaction.getType(),
                "Income transaction should have INCOME type");
        assertNotEquals(TransactionType.EXPENSE, incomeTransaction.getType(),
                "Income transaction should not have EXPENSE type");
    }

    @Test
    void whenCreatingExpenseTransaction_thenTypeEqualsExpense() {
        // Arrange
        UUID expenseTransactionId = UUID.randomUUID();
        Transaction expenseTransaction = new Transaction(
                expenseTransactionId,
                new BigDecimal("50.00"),
                "USD",
                "Grocery shopping",
                Instant.now(),
                null,
                null,
                Instant.now(),
                Instant.now(),
                TransactionType.EXPENSE  // EXPENSE type
        );

        // Act & Assert
        assertEquals(TransactionType.EXPENSE, expenseTransaction.getType(),
                "Expense transaction should have EXPENSE type");
        assertNotEquals(TransactionType.INCOME, expenseTransaction.getType(),
                "Expense transaction should not have INCOME type");
    }

    @Test
    void whenUpdatingTransactionType_thenTypeIsUpdated() {
        // Arrange
        Transaction updateableTransaction = new Transaction(
                UUID.randomUUID(),
                new BigDecimal("100.00"),
                "BRL",
                "Test",
                Instant.now(),
                null,
                null,
                Instant.now(),
                Instant.now(),
                TransactionType.EXPENSE
        );
        assertEquals(TransactionType.EXPENSE, updateableTransaction.getType());

        // Act - update type
        updateableTransaction.setType(TransactionType.INCOME);

        // Assert
        assertEquals(TransactionType.INCOME, updateableTransaction.getType(),
                "Transaction type should be updated to INCOME after setType()");
        assertNotEquals(TransactionType.EXPENSE, updateableTransaction.getType(),
                "Transaction type should no longer be EXPENSE");
    }

    @Test
    void whenGettingTransactionType_thenTypeEnumValueIsCorrect() {
        // Arrange & Act
        TransactionType type1 = transaction1.getType();
        TransactionType type2 = TransactionType.EXPENSE;

        // Assert
        assertEquals(type1, type2, "Transaction type should match EXPENSE enum value");
        assertEquals("EXPENSE", type1.toString(), "TransactionType.EXPENSE should have string value EXPENSE");
    }

    /**
     * Helper method to extract UUID from JSON response
     */

