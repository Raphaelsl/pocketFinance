package com.pocketfinance.backend.dto.dashboard;

import java.util.List;

public record DashboardResponse(
        DashboardSummary summary,
        List<CategoryBreakdown> categoryBreakdown,
        List<MonthlyEvolution> monthlyEvolution
) {}