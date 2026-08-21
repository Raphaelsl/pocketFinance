package com.pocketfinance.backend.repository.projection;

import java.math.BigDecimal;

public interface CategoryBreakdownProjection {
    String getCategory();
    BigDecimal getAmount();
}