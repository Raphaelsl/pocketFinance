package com.pocketfinance.backend.controller;

import com.pocketfinance.backend.dto.dashboard.DashboardResponse;
import com.pocketfinance.backend.dto.dashboard.DashboardSummary;
import com.pocketfinance.backend.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DashboardController.class)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    @Test
    void getDashboard_ComParametrosValidos_Retorna200Ok() throws Exception {

        DashboardSummary summary = new DashboardSummary(
                new BigDecimal("5000.00"),
                new BigDecimal("2000.00"),
                new BigDecimal("3000.00"),
                15L
        );
        DashboardResponse mockResponse = new DashboardResponse(summary, List.of(), List.of());

        Mockito.when(dashboardService.getDashboard(any(Instant.class), any(Instant.class), eq("BRL")))
                .thenReturn(mockResponse);


        mockMvc.perform(get("/api/dashboard")
                        .param("start", "2026-01-01T00:00:00Z")
                        .param("end", "2026-12-31T23:59:59Z")
                        .param("currency", "brl"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.summary.totalIncome").value(5000.00))
                .andExpect(jsonPath("$.summary.balance").value(3000.00));
    }

    @Test
    void getDashboard_ComMoedaInvalida_Retorna400BadRequest() throws Exception {
        mockMvc.perform(get("/api/dashboard")
                        .param("start", "2026-01-01T00:00:00Z")
                        .param("end", "2026-12-31T23:59:59Z")
                        .param("currency", "BR"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getDashboard_FaltandoDataDeInicio_Retorna400BadRequest() throws Exception {
        mockMvc.perform(get("/api/dashboard")
                        .param("end", "2026-12-31T23:59:59Z")
                        .param("currency", "BRL"))
                .andExpect(status().isBadRequest());
    }
}
