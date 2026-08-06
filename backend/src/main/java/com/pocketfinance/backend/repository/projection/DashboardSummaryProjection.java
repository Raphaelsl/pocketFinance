package com.pocketfinance.backend.repository.projection;

import java.math.BigDecimal;

public interface DashboardSummaryProjection {
    BigDecimal getTotalIncome();
    BigDecimal getTotalExpense();
    Long getTransactionCount();
}