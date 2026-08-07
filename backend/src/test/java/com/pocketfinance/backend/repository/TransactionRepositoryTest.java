package com.pocketfinance.backend.repository;

import com.pocketfinance.backend.model.Transaction;
import com.pocketfinance.backend.model.TransactionType;
import com.pocketfinance.backend.repository.projection.DashboardSummaryProjection;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@DataJpaTest
@ActiveProfiles("test")
class TransactionRepositoryIntegrationTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TransactionRepository transactionRepository;

    @Test
    void getDashboardSummary_DeveSomarValoresCorretamente() {

        Instant now = Instant.parse("2026-03-15T10:00:00Z");

        Transaction t1 = new Transaction(null, new BigDecimal("100.00"), "BRL", "Salário", now, null, null, now, now, TransactionType.INCOME);
        Transaction t2 = new Transaction(null, new BigDecimal("50.00"), "BRL", "Freelance", now, null, null, now, now, TransactionType.INCOME);
        Transaction t3 = new Transaction(null, new BigDecimal("30.00"), "BRL", "Lanche", now, null, null, now, now, TransactionType.EXPENSE);


        Transaction t4 = new Transaction(null, new BigDecimal("500.00"), "USD", "Viagem", now, null, null, now, now, TransactionType.EXPENSE);


        entityManager.persist(t1);
        entityManager.persist(t2);
        entityManager.persist(t3);
        entityManager.persist(t4);
        entityManager.flush();

        Instant start = Instant.parse("2026-03-01T00:00:00Z");
        Instant end = Instant.parse("2026-04-01T00:00:00Z");


        DashboardSummaryProjection summary = transactionRepository.getDashboardSummary(start, end, "BRL");


        assertNotNull(summary);
        assertEquals(new BigDecimal("150.00"), summary.getTotalIncome());
        assertEquals(new BigDecimal("30.00"), summary.getTotalExpense());
        assertEquals(3L, summary.getTransactionCount());
    }
}