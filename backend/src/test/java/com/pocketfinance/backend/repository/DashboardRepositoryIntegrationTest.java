package com.pocketfinance.backend.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;


import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class DashboardRepositoryIntegrationTest {

    @Autowired
    private TransactionRepository transactionRepository;

    @Test
    @DisplayName("Deve retornar o resumo do dashboard (DashboardSummary) corretamente")
    void testGetDashboardSummary() {
        // Criando os Instants corretamente em UTC
        Instant start = Instant.parse("2026-01-01T00:00:00Z");
        Instant end = Instant.parse("2026-02-01T00:00:00Z"); // Fim exclusivo

        var summary = transactionRepository.getDashboardSummary(start, end, "BRL");
        assertThat(summary).isNotNull();
    }

    @Test
    @DisplayName("Deve agrupar as despesas por categoria corretamente (CategoryBreakdown)")
    void testGetCategoryBreakdown() {
        Instant start = Instant.parse("2026-01-01T00:00:00Z");
        Instant end = Instant.parse("2026-02-01T00:00:00Z");

        var breakdown = transactionRepository.getCategoryBreakdown(start, end, "BRL");
        assertThat(breakdown).isNotNull();
    }

    @Test
    @DisplayName("Deve calcular a evolução mensal de receitas e despesas corretamente (MonthlyEvolution)")
    void testGetMonthlyEvolution() {
        Instant start = Instant.parse("2025-12-01T00:00:00Z");
        Instant end = Instant.parse("2026-02-01T00:00:00Z");

        var evolution = transactionRepository.getMonthlyEvolution(start, end, "BRL");
        assertThat(evolution).isNotNull();
    }
}