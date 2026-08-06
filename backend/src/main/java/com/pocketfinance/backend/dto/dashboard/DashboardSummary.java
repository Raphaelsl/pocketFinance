package com.pocketfinance.backend.dto.dashboard;

import java.math.BigDecimal;

public record DashboardSummary(
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal balance,
        Long transactionCount
) {}