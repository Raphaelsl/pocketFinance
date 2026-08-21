package com.pocketfinance.backend.dto.dashboard;

import java.math.BigDecimal;

public record CategoryBreakdown(
        String category,
        BigDecimal amount
) {}