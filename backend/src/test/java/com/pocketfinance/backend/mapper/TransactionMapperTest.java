package com.pocketfinance.backend.mapper;

import com.pocketfinance.backend.dto.TransactionCreateRequest;
import com.pocketfinance.backend.dto.TransactionResponse;
import com.pocketfinance.backend.model.Category;
import com.pocketfinance.backend.model.Transaction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("TransactionMapper Unit Tests")
class TransactionMapperTest {

    private TransactionMapper transactionMapper;

    @BeforeEach
    void setUp() {
        transactionMapper = new TransactionMapper();
    }

    @Test
    @DisplayName("toEntity should copy all values from DTO to Entity")
    void toEntity_ShouldCopyAllValuesFromDtoToEntity() {
        // Arrange
        UUID categoryId = UUID.randomUUID();
        TransactionCreateRequest request = new TransactionCreateRequest(
                new BigDecimal("150.50"),
                "Grocery shopping",
                categoryId,
                Instant.parse("2024-01-15T10:30:00Z"),
                "USD"
        );

        // Act
        Transaction entity = transactionMapper.toEntity(request);

        // Assert
        assertNotNull(entity);
        assertEquals(new BigDecimal("150.50"), entity.getAmount());
        assertEquals("Grocery shopping", entity.getDescription());
        assertEquals("USD", entity.getCurrency());
        assertEquals(Instant.parse("2024-01-15T10:30:00Z"), entity.getOccurredAt());
        assertNotNull(entity.getCategory());
        assertEquals(categoryId, entity.getCategory().getId());
    }

    @Test
    @DisplayName("toEntity should create Category with only ID")
    void toEntity_ShouldCreateCategoryWithOnlyId() {
        // Arrange
        UUID categoryId = UUID.randomUUID();
        TransactionCreateRequest request = new TransactionCreateRequest(
                new BigDecimal("100.00"),
                "Test transaction",
                categoryId,
                Instant.now(),
                "BRL"
        );

        // Act
        Transaction entity = transactionMapper.toEntity(request);

        // Assert
        assertNotNull(entity.getCategory());
        assertEquals(categoryId, entity.getCategory().getId());
        assertNull(entity.getCategory().getName());
        assertNull(entity.getCategory().getCreatedAt());
    }

    @Test
    @DisplayName("toResponse should convert Entity to DTO correctly")
    void toResponse_ShouldConvertEntityToDtoCorrectly() {
        // Arrange
        UUID transactionId = UUID.randomUUID();
        UUID categoryId = UUID.randomUUID();
        Category category = Category.builder()
                .id(categoryId)
                .name("Food")
                .createdAt(Instant.parse("2024-01-01T00:00:00Z"))
                .build();

        Transaction entity = Transaction.builder()
                .id(transactionId)
                .amount(new BigDecimal("75.25"))
                .description("Restaurant dinner")
                .category(category)
                .occurredAt(Instant.parse("2024-01-20T19:30:00Z"))
                .currency("EUR")
                .build();

        // Act
        TransactionResponse response = transactionMapper.toResponse(entity);

        // Assert
        assertNotNull(response);
        assertEquals(transactionId, response.id());
        assertEquals(new BigDecimal("75.25"), response.amount());
        assertEquals("Restaurant dinner", response.description());
        assertEquals("Food", response.categoryName());
        assertEquals(Instant.parse("2024-01-20T19:30:00Z"), response.occurredAt());
        assertEquals("EUR", response.currency());
    }

    @Test
    @DisplayName("toResponse should handle null category gracefully")
    void toResponse_ShouldHandleNullCategoryGracefully() {
        // Arrange
        UUID transactionId = UUID.randomUUID();

        Transaction entity = Transaction.builder()
                .id(transactionId)
                .amount(new BigDecimal("50.00"))
                .description("Transaction without category")
                .category(null)
                .occurredAt(Instant.now())
                .currency("USD")
                .build();

        // Act
        TransactionResponse response = transactionMapper.toResponse(entity);

        // Assert
        assertNotNull(response);
        assertEquals(transactionId, response.id());
        assertEquals(new BigDecimal("50.00"), response.amount());
        assertEquals("Transaction without category", response.description());
        assertNull(response.categoryName());
        assertNotNull(response.occurredAt());
        assertEquals("USD", response.currency());
    }

    @Test
    @DisplayName("toResponse should handle category with null name")
    void toResponse_ShouldHandleCategoryWithNullName() {
        // Arrange
        UUID transactionId = UUID.randomUUID();
        UUID categoryId = UUID.randomUUID();
        Category category = Category.builder()
                .id(categoryId)
                .name(null)
                .build();

        Transaction entity = Transaction.builder()
                .id(transactionId)
                .amount(new BigDecimal("200.00"))
                .description("Test")
                .category(category)
                .occurredAt(Instant.now())
                .currency("GBP")
                .build();

        // Act
        TransactionResponse response = transactionMapper.toResponse(entity);

        // Assert
        assertNotNull(response);
        assertNull(response.categoryName());
    }

    @Test
    @DisplayName("toEntity and toResponse should maintain data integrity")
    void toEntityAndToResponse_ShouldMaintainDataIntegrity() {
        // Arrange
        UUID categoryId = UUID.randomUUID();
        TransactionCreateRequest request = new TransactionCreateRequest(
                new BigDecimal("999.99"),
                "End-to-end test",
                categoryId,
                Instant.parse("2024-12-31T23:59:59Z"),
                "JPY"
        );

        // Act
        Transaction entity = transactionMapper.toEntity(request);
        entity.setId(UUID.randomUUID());
        TransactionResponse response = transactionMapper.toResponse(entity);

        // Assert
        assertEquals(request.amount(), response.amount());
        assertEquals(request.description(), response.description());
        assertEquals(request.occurredAt(), response.occurredAt());
        assertEquals(request.currency(), response.currency());
    }
}
