package com.pocketfinance.backend.controller;

import com.pocketfinance.backend.dto.dashboard.DashboardResponse;
import com.pocketfinance.backend.service.DashboardService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/dashboard")
@Validated
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(
            @RequestParam @NotNull(message = "Start date is required") Instant start,
            @RequestParam @NotNull(message = "End date is required") Instant end,
            @RequestParam @NotBlank(message = "Currency is required")
            @Pattern(regexp = "^[a-zA-Z]{3}$", message = "Currency must be a 3-letter code") String currency) {


        String normalizedCurrency = currency.toUpperCase();

        DashboardResponse response = dashboardService.getDashboard(start, end, normalizedCurrency);

        return ResponseEntity.ok(response);
    }
}