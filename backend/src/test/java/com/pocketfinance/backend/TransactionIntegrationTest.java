package com.pocketfinance.backend;

import com.pocketfinance.backend.dto.TransactionCreateRequest;
import com.pocketfinance.backend.dto.TransactionUpdateRequest;
import com.pocketfinance.backend.model.TransactionType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@DisplayName("Transaction Integration Tests")
class TransactionIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String baseUrl;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/api/transactions";
    }

    // Integration tests use the H2 test profile.
    @Test
    @DisplayName("Should create a valid transaction successfully")
    void shouldCreateValidTransaction() {
        // Arrange
        TransactionCreateRequest request = new TransactionCreateRequest(
                TransactionType.EXPENSE,  // NEW: add type
                new BigDecimal("150.50"),
                "BRL",
                "Compra no mercado",
                Instant.now(),
                null,
                null
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TransactionCreateRequest> entity = new HttpEntity<>(request, headers);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl,
                HttpMethod.POST,
                entity,
                String.class
        );

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).contains("150.50");
        assertThat(response.getBody()).contains("BRL");
        assertThat(response.getBody()).contains("Compra no mercado");
        assertThat(response.getHeaders().getLocation()).isNotNull();
    }

    @Test
    @DisplayName("Should return 400 when creating transaction with invalid data")
    void shouldReturn400WhenCreatingInvalidTransaction() {
        // Arrange - Invalid request with negative amount and empty description
        TransactionCreateRequest request = new TransactionCreateRequest(
                TransactionType.EXPENSE,  // NEW: add type
                new BigDecimal("-50.00"),
                "",
                "",
                null,
                null,
                null
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TransactionCreateRequest> entity = new HttpEntity<>(request, headers);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl,
                HttpMethod.POST,
                entity,
                String.class
        );

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    @DisplayName("Should list transactions with pagination using PagedResponse DTO")
    void shouldListTransactionsWithPagination() {
        // Arrange - Create a transaction first
        TransactionCreateRequest createRequest = new TransactionCreateRequest(
                TransactionType.EXPENSE,  // NEW: add type
                new BigDecimal("200.00"),
                "BRL",
                "Compra de roupas",
                Instant.now(),
                null,
                null
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TransactionCreateRequest> createEntity = new HttpEntity<>(createRequest, headers);

        restTemplate.exchange(
                baseUrl,
                HttpMethod.POST,
                createEntity,
                String.class
        );
        // Act - Fetch the paginated list
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + "?page=0&size=10",
                HttpMethod.GET,
                null,
                String.class
        );
        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        // 1. Verificamos se as chaves do nosso novo DTO estão presentes no JSON
        assertThat(response.getBody()).contains("\"content\":");
        assertThat(response.getBody()).contains("\"page\":");
        assertThat(response.getBody()).contains("\"size\":");
        assertThat(response.getBody()).contains("\"totalElements\":");
        assertThat(response.getBody()).contains("\"totalPages\":");
        assertThat(response.getBody()).contains("\"first\":");
        assertThat(response.getBody()).contains("\"last\":");

        // 2. A PROVA DE FOGO: Garantimos que o "lixo" do Spring sumiu!
        // Usamos o doesNotContain para ter certeza absoluta de que não vazou implementação.
        assertThat(response.getBody()).doesNotContain("\"pageable\":");
        assertThat(response.getBody()).doesNotContain("\"sort\":");
        assertThat(response.getBody()).contains("\"type\"");
    }

    @Test
    @DisplayName("Should get transaction by ID")
    void shouldGetTransactionById() {
        // Arrange - Create a transaction first
        TransactionCreateRequest createRequest = new TransactionCreateRequest(
                TransactionType.EXPENSE,  // NEW: add type
                new BigDecimal("100.00"),
                "BRL",
                "Lanche",
                Instant.now(),
                null,
                null
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TransactionCreateRequest> createEntity = new HttpEntity<>(createRequest, headers);

        ResponseEntity<String> createResponse = restTemplate.exchange(
                baseUrl,
                HttpMethod.POST,
                createEntity,
                String.class
        );

        UUID transactionId = extractIdFromResponse(createResponse.getBody());

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + "/" + transactionId,
                HttpMethod.GET,
                null,
                String.class
        );

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).contains("100.00");
        assertThat(response.getBody()).contains("Lanche");
        assertThat(response.getBody()).contains("\"type\":\"EXPENSE\"");
    }

    @Test
    @DisplayName("Should update an existing transaction")
    void shouldUpdateTransaction() {
        // Arrange - Create a transaction first
        TransactionCreateRequest createRequest = new TransactionCreateRequest(
                TransactionType.EXPENSE,  // NEW: add type
                new BigDecimal("50.00"),
                "BRL",
                "Café",
                Instant.now(),
                null,
                null
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TransactionCreateRequest> createEntity = new HttpEntity<>(createRequest, headers);

        ResponseEntity<String> createResponse = restTemplate.exchange(
                baseUrl,
                HttpMethod.POST,
                createEntity,
                String.class
        );

        UUID transactionId = extractIdFromResponse(createResponse.getBody());

        // Update the transaction
        TransactionUpdateRequest updateRequest = new TransactionUpdateRequest(
                TransactionType.INCOME,  // NEW: switch type to verify update
                new BigDecimal("75.00"),
                "BRL",
                "Café e bolo",
                Instant.now(),
                null,
                null
        );

        HttpEntity<TransactionUpdateRequest> updateEntity = new HttpEntity<>(updateRequest, headers);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + "/" + transactionId,
                HttpMethod.PUT,
                updateEntity,
                String.class
        );

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).contains("75.00");
        assertThat(response.getBody()).contains("Café e bolo");
        assertThat(response.getBody()).contains("\"type\":\"INCOME\"");
    }

    @Test
    @DisplayName("Should delete a transaction")
    void shouldDeleteTransaction() {
        // Arrange - Create a transaction first
        TransactionCreateRequest createRequest = new TransactionCreateRequest(
                TransactionType.EXPENSE,  // NEW: add type
                new BigDecimal("300.00"),
                "BRL",
                "Restaurante",
                Instant.now(),
                null,
                null
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TransactionCreateRequest> createEntity = new HttpEntity<>(createRequest, headers);

        ResponseEntity<String> createResponse = restTemplate.exchange(
                baseUrl,
                HttpMethod.POST,
                createEntity,
                String.class
        );

        UUID transactionId = extractIdFromResponse(createResponse.getBody());

        // Act
        ResponseEntity<String> deleteResponse = restTemplate.exchange(
                baseUrl + "/" + transactionId,
                HttpMethod.DELETE,
                null,
                String.class
        );

        // Assert
        assertThat(deleteResponse.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        // Verify the transaction is deleted
        ResponseEntity<String> getResponse = restTemplate.exchange(
                baseUrl + "/" + transactionId,
                HttpMethod.GET,
                null,
                String.class
        );

        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Should return 404 when getting non-existent transaction")
    void shouldReturn404WhenGettingNonExistentTransaction() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + "/" + nonExistentId,
                HttpMethod.GET,
                null,
                String.class
        );

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Should return 404 when updating non-existent transaction")
    void shouldReturn404WhenUpdatingNonExistentTransaction() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        TransactionUpdateRequest updateRequest = new TransactionUpdateRequest(
                TransactionType.EXPENSE,  // NEW: add type
                new BigDecimal("100.00"),
                "BRL",
                "Test",
                Instant.now(),
                null,
                null
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TransactionUpdateRequest> entity = new HttpEntity<>(updateRequest, headers);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + "/" + nonExistentId,
                HttpMethod.PUT,
                entity,
                String.class
        );

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Should return 404 when deleting non-existent transaction")
    void shouldReturn404WhenDeletingNonExistentTransaction() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + "/" + nonExistentId,
                HttpMethod.DELETE,
                null,
                String.class
        );

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Should create INCOME transaction and return type in response")
    void shouldCreateIncomeTransactionWithType() {
        // Arrange - Create request with type=INCOME
        TransactionCreateRequest request = new TransactionCreateRequest(
                TransactionType.INCOME,  // NEW: type field (first parameter)
                new BigDecimal("5000.00"),
                "USD",
                "Monthly salary",
                Instant.now(),
                null,
                null
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TransactionCreateRequest> entity = new HttpEntity<>(request, headers);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl,
                HttpMethod.POST,
                entity,
                String.class
        );

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).contains("\"type\"");
        assertThat(response.getBody()).contains("INCOME");
        assertThat(response.getBody()).contains("5000.00");
    }

    @Test
    @DisplayName("Should create EXPENSE transaction and return type in response")
    void shouldCreateExpenseTransactionWithType() {
        // Arrange - Create request with type=EXPENSE
        TransactionCreateRequest request = new TransactionCreateRequest(
                TransactionType.EXPENSE,  // NEW: type field (first parameter)
                new BigDecimal("50.00"),
                "USD",
                "Grocery shopping",
                Instant.now(),
                null,
                null
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TransactionCreateRequest> entity = new HttpEntity<>(request, headers);

        // Act
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl,
                HttpMethod.POST,
                entity,
                String.class
        );

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).contains("\"type\"");
        assertThat(response.getBody()).contains("EXPENSE");
        assertThat(response.getBody()).contains("50.00");
    }

    /**
     * Helper method to extract UUID from JSON response
     */
    private UUID extractIdFromResponse(String responseBody) {
        Pattern pattern = Pattern.compile("\"id\"\\s*:\\s*\"([0-9a-fA-F-]+)\"");
        Matcher matcher = pattern.matcher(responseBody);
        if (matcher.find()) {
            return UUID.fromString(matcher.group(1));
        }
        throw new IllegalArgumentException("Could not extract ID from response: " + responseBody);
    }
}
