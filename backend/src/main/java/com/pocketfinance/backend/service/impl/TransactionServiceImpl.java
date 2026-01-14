package com.pocketfinance.backend.service.impl;

import com.pocketfinance.backend.dto.TransactionCreateRequest;
import com.pocketfinance.backend.dto.TransactionFilter;
import com.pocketfinance.backend.dto.TransactionResponse;
import com.pocketfinance.backend.dto.TransactionUpdateRequest;
import com.pocketfinance.backend.mapper.TransactionMapper;
import com.pocketfinance.backend.model.Category;
import com.pocketfinance.backend.model.Transaction;
import com.pocketfinance.backend.repository.CategoryRepository;
import com.pocketfinance.backend.repository.TransactionRepository;
import com.pocketfinance.backend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionMapper transactionMapper;

    @Override
    @Transactional
    public TransactionResponse create(TransactionCreateRequest request) {
        // Validate category if provided
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
        }

        // Convert request to entity
        Transaction transaction = transactionMapper.toEntity(request);
        transaction.setCategory(category);

        // Save transaction
        Transaction savedTransaction = transactionRepository.save(transaction);

        // Return response
        return transactionMapper.toResponse(savedTransaction);
    }

    @Override
    public Page<TransactionResponse> list(Pageable pageable, TransactionFilter filter) {
        Page<Transaction> transactions = transactionRepository.findWithFilters(
                filter.getCategoryId(),
                filter.getDateFrom(),
                filter.getDateTo(),
                filter.getSearch(),
                pageable
        );

        return transactions.map(transactionMapper::toResponse);
    }

    @Override
    @Transactional
    public TransactionResponse update(UUID id, TransactionUpdateRequest request) {
        // Find existing transaction
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

        // If request has categoryId, verify if category exists
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
            transaction.setCategory(category);
        }

        // Update only non-null fields (partial update)
        transactionMapper.updateEntityFromRequest(request, transaction);

        // Save and return response
        Transaction updatedTransaction = transactionRepository.save(transaction);
        return transactionMapper.toResponse(updatedTransaction);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        // Verify if transaction exists
        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("Transaction not found with id: " + id);
        }

        // Delete transaction
        transactionRepository.deleteById(id);
    }
}
