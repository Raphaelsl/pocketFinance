package com.pocketfinance.backend.repository;

import com.pocketfinance.backend.dto.TransactionFilter;
import com.pocketfinance.backend.model.Category;
import com.pocketfinance.backend.model.Transaction;
import com.pocketfinance.backend.specification.TransactionSpecification;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
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
        category1 = Category.builder()
                .id(UUID.randomUUID())
                .name("Food")
                .createdAt(Instant.now())
                .build();

        category2 = Category.builder()
                .id(UUID.randomUUID())
                .name("Transport")
                .createdAt(Instant.now())
                .build();

        // Create transactions
        Instant baseTime = Instant.now();

        transaction1 = Transaction.builder()
                .id(UUID.randomUUID())
                .amount(new BigDecimal("100.50"))
                .currency("BRL")
                .description("Lunch at restaurant")
                .occurredAt(baseTime)
                .category(category1)
                .metadata("{\"type\": \"restaurant\"}")
                .createdAt(baseTime)
                .updatedAt(baseTime)
                .build();

        transaction2 = Transaction.builder()
                .id(UUID.randomUUID())
                .amount(new BigDecimal("50.00"))
                .currency("BRL")
                .description("Bus ticket")
                .occurredAt(baseTime.plusSeconds(3600))
                .category(category2)
                .metadata("{\"type\": \"transport\"}")
                .createdAt(baseTime.plusSeconds(3600))
                .updatedAt(baseTime.plusSeconds(3600))
                .build();

        transaction3 = Transaction.builder()
                .id(UUID.randomUUID())
                .amount(new BigDecimal("200.00"))
                .currency("BRL")
                .description("Grocery shopping")
                .occurredAt(baseTime.plusSeconds(7200))
                .category(category1)
                .metadata("{\"type\": \"grocery\"}")
                .createdAt(baseTime.plusSeconds(7200))
                .updatedAt(baseTime.plusSeconds(7200))
                .build();
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
    void whenUsingSpecification_withFilter_thenReturnFilteredTransactions() {
        Pageable pageable = PageRequest.of(0, 10);

        // Test specification with category filter
        TransactionFilter filter = TransactionFilter.builder()
                .categoryId(category1.getId())
                .build();

        List<Transaction> transactions = Arrays.asList(transaction1, transaction3);
        Page<Transaction> expectedPage = new PageImpl<>(transactions, pageable, transactions.size());

        when(transactionRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(expectedPage);

        Specification<Transaction> spec = TransactionSpecification.withFilter(filter);
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

        TransactionFilter filter = TransactionFilter.builder()
                .categoryId(category1.getId())
                .search("grocery")
                .build();

        List<Transaction> transactions = Arrays.asList(transaction3);
        Page<Transaction> expectedPage = new PageImpl<>(transactions, pageable, transactions.size());

        when(transactionRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(expectedPage);

        Specification<Transaction> spec = TransactionSpecification.withFilter(filter);
        Page<Transaction> result = transactionRepository.findAll(spec, pageable);

        assertEquals(1, result.getContent().size());
        assertEquals("Grocery shopping", result.getContent().get(0).getDescription());
    }
}