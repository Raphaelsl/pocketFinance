package com.pocketfinance.backend.service;

import com.pocketfinance.backend.dto.dashboard.DashboardResponse;
import com.pocketfinance.backend.repository.TransactionRepository;
import com.pocketfinance.backend.repository.projection.DashboardSummaryProjection;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private DashboardService dashboardService;

    private Instant start;
    private Instant end;
    private String currency;

    @BeforeEach
    void setUp() {
        start = Instant.parse("2026-01-01T00:00:00Z");
        end = Instant.parse("2026-02-01T00:00:00Z");
        currency = "BRL";
    }

    @Test
    void getDashboard_WithKnownFinancialExample_ShouldCalculateCorrectBalance() {

        DashboardSummaryProjection summaryMock = Mockito.mock(DashboardSummaryProjection.class);
        when(summaryMock.getTotalIncome()).thenReturn(new BigDecimal("5500.50"));
        when(summaryMock.getTotalExpense()).thenReturn(new BigDecimal("2150.25"));
        when(summaryMock.getTransactionCount()).thenReturn(10L);

        when(transactionRepository.getDashboardSummary(start, end, currency)).thenReturn(summaryMock);
        when(transactionRepository.getCategoryBreakdown(start, end, currency)).thenReturn(List.of());
        when(transactionRepository.getMonthlyEvolution(start, end, currency)).thenReturn(List.of());

        DashboardResponse response = dashboardService.getDashboard(start, end, currency);

        assertEquals(new BigDecimal("5500.50"), response.summary().totalIncome());
        assertEquals(new BigDecimal("2150.25"), response.summary().totalExpense());
        assertEquals(new BigDecimal("3350.25"), response.summary().balance());
        assertEquals(10L, response.summary().transactionCount());
    }

    @Test
    void getDashboard_ShouldFillEmptyMonths_WhenThereIsNoData() {
        DashboardSummaryProjection summaryMock = Mockito.mock(DashboardSummaryProjection.class);
        when(summaryMock.getTotalIncome()).thenReturn(null);
        when(summaryMock.getTotalExpense()).thenReturn(null);
        when(summaryMock.getTransactionCount()).thenReturn(0L);


        Instant endThreeMonths = Instant.parse("2026-04-01T00:00:00Z");

        when(transactionRepository.getDashboardSummary(start, endThreeMonths, currency)).thenReturn(summaryMock);
        when(transactionRepository.getCategoryBreakdown(start, endThreeMonths, currency)).thenReturn(List.of());
        when(transactionRepository.getMonthlyEvolution(start, endThreeMonths, currency)).thenReturn(List.of());

        DashboardResponse response = dashboardService.getDashboard(start, endThreeMonths, currency);

        assertEquals(3, response.monthlyEvolution().size());
        assertEquals("2026-01", response.monthlyEvolution().get(0).month());
        assertEquals("2026-03", response.monthlyEvolution().get(2).month());
        assertEquals(BigDecimal.ZERO, response.monthlyEvolution().get(1).income());
    }
}