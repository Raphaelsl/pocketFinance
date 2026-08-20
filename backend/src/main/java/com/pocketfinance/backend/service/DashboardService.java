package com.pocketfinance.backend.service;

import com.pocketfinance.backend.dto.dashboard.CategoryBreakdown;
import com.pocketfinance.backend.dto.dashboard.DashboardResponse;
import com.pocketfinance.backend.dto.dashboard.DashboardSummary;
import com.pocketfinance.backend.dto.dashboard.MonthlyEvolution;
import com.pocketfinance.backend.repository.TransactionRepository;
import com.pocketfinance.backend.repository.projection.DashboardSummaryProjection;
import com.pocketfinance.backend.repository.projection.MonthlyEvolutionProjection;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;

    public DashboardService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Instant start, Instant end, String currency) {
        validatePeriod(start, end);

        DashboardSummaryProjection summaryProj = transactionRepository.getDashboardSummary(start, end, currency);
        BigDecimal totalIncome = summaryProj.getTotalIncome() != null ? summaryProj.getTotalIncome() : BigDecimal.ZERO;
        BigDecimal totalExpense = summaryProj.getTotalExpense() != null ? summaryProj.getTotalExpense() : BigDecimal.ZERO;
        Long count = summaryProj.getTransactionCount() != null ? summaryProj.getTransactionCount() : 0L;

        DashboardSummary summary = new DashboardSummary(
                totalIncome,
                totalExpense,
                totalIncome.subtract(totalExpense), // Calcula o balance
                count
        );

        List<CategoryBreakdown> breakdown = transactionRepository.getCategoryBreakdown(start, end, currency).stream()
                .map(p -> new CategoryBreakdown(p.getCategory(), p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO))
                .collect(Collectors.toList());

        List<MonthlyEvolution> evolution = buildMonthlyEvolution(start, end, currency);

        return new DashboardResponse(summary, breakdown, evolution);
    }

    private void validatePeriod(Instant start, Instant end) {
        if (start.isAfter(end)) {
            throw new IllegalArgumentException("A data de início não pode ser posterior à data de fim.");
        }

        YearMonth startMonth = YearMonth.from(start.atZone(ZoneId.of("UTC")));
        YearMonth endMonth = YearMonth.from(end.atZone(ZoneId.of("UTC")));


        if (ChronoUnit.MONTHS.between(startMonth, endMonth) > 12) {
            throw new IllegalArgumentException("O período solicitado não pode exceder 12 meses.");
        }
    }

    private List<MonthlyEvolution> buildMonthlyEvolution(Instant start, Instant end, String currency) {
        List<MonthlyEvolutionProjection> rawProjections = transactionRepository.getMonthlyEvolution(start, end, currency);

        Map<String, MonthlyEvolutionProjection> projectionMap = rawProjections.stream()
                .collect(Collectors.toMap(
                        p -> String.format("%04d-%02d", p.getYear(), p.getMonth()),
                        p -> p
                ));

        List<MonthlyEvolution> evolution = new ArrayList<>();
        YearMonth currentMonth = YearMonth.from(start.atZone(ZoneId.of("UTC")));
        YearMonth endMonth = YearMonth.from(end.atZone(ZoneId.of("UTC")));


        while (currentMonth.isBefore(endMonth)) {
            String monthKey = currentMonth.toString(); // Formato automático do toString é "YYYY-MM"
            MonthlyEvolutionProjection proj = projectionMap.get(monthKey);

            if (proj != null) {
                BigDecimal inc = proj.getIncome() != null ? proj.getIncome() : BigDecimal.ZERO;
                BigDecimal exp = proj.getExpense() != null ? proj.getExpense() : BigDecimal.ZERO;
                evolution.add(new MonthlyEvolution(monthKey, inc, exp, inc.subtract(exp)));
            } else {
                evolution.add(new MonthlyEvolution(monthKey, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO));
            }

            currentMonth = currentMonth.plusMonths(1);
        }

        return evolution;
    }
}