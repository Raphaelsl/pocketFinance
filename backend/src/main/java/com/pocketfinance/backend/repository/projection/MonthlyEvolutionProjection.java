package com.pocketfinance.backend.repository.projection;

import java.math.BigDecimal;

public interface MonthlyEvolutionProjection {
    Integer getYear();
    Integer getMonth();
    BigDecimal getIncome();
    BigDecimal getExpense();
}