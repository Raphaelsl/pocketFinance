package com.pocketfinance.backend.service;

import com.pocketfinance.backend.dto.TransactionCreateRequest;
import com.pocketfinance.backend.dto.TransactionFilter;
import com.pocketfinance.backend.dto.TransactionResponse;
import com.pocketfinance.backend.dto.TransactionUpdateRequest;
import com.pocketfinance.backend.mapper.TransactionMapper;
import com.pocketfinance.backend.model.Category;
import com.pocketfinance.backend.model.Transaction;
import com.pocketfinance.backend.repository.CategoryRepository;
import com.pocketfinance.backend.repository.TransactionRepository;
import com.pocketfinance.backend.service.impl.TransactionServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceImplTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TransactionMapper transactionMapper;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    @Test
    void create_Success_ShouldCallRepositorySave() {
        // Arrange
        UUID categoryId = UUID.randomUUID();
        Category category = Category.builder()
                .id(categoryId)
                .name("Food")
                .build();

        TransactionCreateRequest request = TransactionCreateRequest.builder()
                .amount(new BigDecimal("100.50"))
                .currency("USD")
                .description("Grocery shopping")
                .occurredAt(Instant.now())
                .categoryId(categoryId)
                .metadata("{\"key\":\"value\"}")
                .build();

        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .description(request.getDescription())
                .occurredAt(request.getOccurredAt())
                .metadata(request.getMetadata())
                .category(category)
                .build();

        Transaction savedTransaction = Transaction.builder()
                .id(UUID.randomUUID())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .description(request.getDescription())
                .occurredAt(request.getOccurredAt())
                .metadata(request.getMetadata())
                .category(category)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        TransactionResponse expectedResponse = TransactionResponse.builder()
                .id(savedTransaction.getId())
                .amount(savedTransaction.getAmount())
                .currency(savedTransaction.getCurrency())
                .description(savedTransaction.getDescription())
                .occurredAt(savedTransaction.getOccurredAt())
                .categoryId(savedTransaction.getCategory().getId())
                .metadata(savedTransaction.getMetadata())
                .createdAt(savedTransaction.getCreatedAt())
                .updatedAt(savedTransaction.getUpdatedAt())
                .build();

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(transactionMapper.toEntity(request)).thenReturn(transaction);
        when(transactionRepository.save(transaction)).thenReturn(savedTransaction);
        when(transactionMapper.toResponse(savedTransaction)).thenReturn(expectedResponse);

        // Act
        TransactionResponse result = transactionService.create(request);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse.getId(), result.getId());
        assertEquals(expectedResponse.getAmount(), result.getAmount());
        assertEquals(expectedResponse.getDescription(), result.getDescription());

        verify(categoryRepository, times(1)).findById(categoryId);
        verify(transactionMapper, times(1)).toEntity(request);
        verify(transactionRepository, times(1)).save(transaction);
        verify(transactionMapper, times(1)).toResponse(savedTransaction);
    }

    @Test
    void create_Error_WhenCategoryDoesNotExist() {
        // Arrange
        UUID categoryId = UUID.randomUUID();
        TransactionCreateRequest request = TransactionCreateRequest.builder()
                .amount(new BigDecimal("100.50"))
                .categoryId(categoryId)
                .build();

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            transactionService.create(request);
        });

        assertEquals("Category not found with id: " + categoryId, exception.getMessage());

        verify(categoryRepository, times(1)).findById(categoryId);
        verify(transactionMapper, never()).toEntity(any());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void update_Success_ShouldUpdateFields() {
        // Arrange
        UUID transactionId = UUID.randomUUID();
        UUID categoryId = UUID.randomUUID();
        Category category = Category.builder()
                .id(categoryId)
                .name("Transport")
                .build();

        Transaction existingTransaction = Transaction.builder()
                .id(transactionId)
                .amount(new BigDecimal("50.00"))
                .currency("USD")
                .description("Old description")
                .occurredAt(Instant.now().minusSeconds(3600))
                .metadata("old metadata")
                .build();

        TransactionUpdateRequest request = TransactionUpdateRequest.builder()
                .amount(new BigDecimal("75.00"))
                .currency("EUR")
                .description("Updated description")
                .categoryId(categoryId)
                .metadata("new metadata")
                .build();

        Transaction updatedTransaction = Transaction.builder()
                .id(transactionId)
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .description(request.getDescription())
                .occurredAt(existingTransaction.getOccurredAt())
                .metadata(request.getMetadata())
                .category(category)
                .build();

        TransactionResponse expectedResponse = TransactionResponse.builder()
                .id(transactionId)
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .description(request.getDescription())
                .categoryId(categoryId)
                .metadata(request.getMetadata())
                .build();

        when(transactionRepository.findById(transactionId)).thenReturn(Optional.of(existingTransaction));
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(updatedTransaction);
        when(transactionMapper.toResponse(updatedTransaction)).thenReturn(expectedResponse);

        // Act
        TransactionResponse result = transactionService.update(transactionId, request);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse.getId(), result.getId());
        assertEquals(expectedResponse.getAmount(), result.getAmount());
        assertEquals(expectedResponse.getCurrency(), result.getCurrency());
        assertEquals(expectedResponse.getDescription(), result.getDescription());
        assertEquals(expectedResponse.getCategoryId(), result.getCategoryId());

        verify(transactionRepository, times(1)).findById(transactionId);
        verify(categoryRepository, times(1)).findById(categoryId);
        verify(transactionMapper, times(1)).updateEntityFromRequest(request, existingTransaction);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        verify(transactionMapper, times(1)).toResponse(updatedTransaction);
    }

    @Test
    void update_Error_WhenTransactionDoesNotExist() {
        // Arrange
        UUID transactionId = UUID.randomUUID();
        TransactionUpdateRequest request = TransactionUpdateRequest.builder()
                .amount(new BigDecimal("75.00"))
                .build();

        when(transactionRepository.findById(transactionId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            transactionService.update(transactionId, request);
        });

        assertEquals("Transaction not found with id: " + transactionId, exception.getMessage());

        verify(transactionRepository, times(1)).findById(transactionId);
        verify(categoryRepository, never()).findById(any());
        verify(transactionMapper, never()).updateEntityFromRequest(any(), any());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void delete_Success() {
        // Arrange
        UUID transactionId = UUID.randomUUID();
        when(transactionRepository.existsById(transactionId)).thenReturn(true);
        doNothing().when(transactionRepository).deleteById(transactionId);

        // Act
        transactionService.delete(transactionId);

        // Assert
        verify(transactionRepository, times(1)).existsById(transactionId);
        verify(transactionRepository, times(1)).deleteById(transactionId);
    }

    @Test
    void list_Success() {
        // Arrange
        UUID categoryId = UUID.randomUUID();
        Category category = Category.builder()
                .id(categoryId)
                .name("Food")
                .build();

        Transaction transaction1 = Transaction.builder()
                .id(UUID.randomUUID())
                .amount(new BigDecimal("100.00"))
                .category(category)
                .description("Transaction 1")
                .build();

        Transaction transaction2 = Transaction.builder()
                .id(UUID.randomUUID())
                .amount(new BigDecimal("200.00"))
                .category(category)
                .description("Transaction 2")
                .build();

        TransactionFilter filter = TransactionFilter.builder()
                .categoryId(categoryId)
                .search("Transaction")
                .build();

        Pageable pageable = PageRequest.of(0, 10);
        Page<Transaction> transactionPage = new PageImpl<>(List.of(transaction1, transaction2), pageable, 2);

        TransactionResponse response1 = TransactionResponse.builder()
                .id(transaction1.getId())
                .amount(transaction1.getAmount())
                .categoryId(categoryId)
                .description(transaction1.getDescription())
                .build();

        TransactionResponse response2 = TransactionResponse.builder()
                .id(transaction2.getId())
                .amount(transaction2.getAmount())
                .categoryId(categoryId)
                .description(transaction2.getDescription())
                .build();

        when(transactionRepository.findWithFilters(categoryId, null, null, "Transaction", pageable))
                .thenReturn(transactionPage);
        when(transactionMapper.toResponse(transaction1)).thenReturn(response1);
        when(transactionMapper.toResponse(transaction2)).thenReturn(response2);

        // Act
        Page<TransactionResponse> result = transactionService.list(pageable, filter);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(2, result.getContent().size());
        assertEquals(response1.getId(), result.getContent().get(0).getId());
        assertEquals(response2.getId(), result.getContent().get(1).getId());

        verify(transactionRepository, times(1)).findWithFilters(categoryId, null, null, "Transaction", pageable);
        verify(transactionMapper, times(1)).toResponse(transaction1);
        verify(transactionMapper, times(1)).toResponse(transaction2);
    }
}
