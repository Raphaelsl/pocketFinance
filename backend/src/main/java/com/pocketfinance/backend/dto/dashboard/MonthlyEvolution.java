package com.pocketfinance.backend.dto.dashboard;

import java.math.BigDecimal;

public record MonthlyEvolution(
        String month, // Formato esperado: "YYYY-MM"
        BigDecimal income,
        BigDecimal expense,
        BigDecimal balance
) {}