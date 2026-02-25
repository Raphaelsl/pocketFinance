package com.pocketfinance.backend.dto;

import java.time.Instant;
import java.util.List;

public record ApiError(
    Instant timestamp,
    Integer status,
    String error,
    String message,
    String path,
    List<String> details
) {
}
