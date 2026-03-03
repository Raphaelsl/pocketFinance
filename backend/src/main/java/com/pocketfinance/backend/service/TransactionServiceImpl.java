package com.pocketfinance.backend.service;

import com.pocketfinance.backend.dto.TransactionCreateRequest;
import com.pocketfinance.backend.dto.TransactionResponse;
import com.pocketfinance.backend.dto.TransactionUpdateRequest;
import com.pocketfinance.backend.model.Transaction;
import com.pocketfinance.backend.repository.TransactionRepository;
import com.pocketfinance.backend.specification.TransactionSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class TransactionServiceImpl implements TransactionService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionServiceImpl.class);

    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public TransactionResponse create(TransactionCreateRequest request) {
        Transaction transaction = Transaction.builder()
                .amount(request.amount())
                .currency(request.currency())
                .description(request.description())
                .occurredAt(request.occurredAt())
                .metadata(request.metadata())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Transaction saved = transactionRepository.save(transaction);
        logger.info("Transaction created with id: {}", saved.getId());
        return mapToResponse(saved);
    }

    @Override
    public Page<TransactionResponse> list(Pageable pageable, UUID categoryId, Instant start, Instant end, String search) {
        Specification<Transaction> spec = Specification.where((root, query, criteriaBuilder) -> criteriaBuilder.conjunction());

        Specification<Transaction> categorySpec = TransactionSpecification.byCategoryId(categoryId);
        if (categorySpec != null) {
            spec = spec.and(categorySpec);
        }

        Specification<Transaction> dateRangeSpec = TransactionSpecification.byDateRange(start, end);
        if (dateRangeSpec != null) {
            spec = spec.and(dateRangeSpec);
        }

        Specification<Transaction> descriptionSpec = TransactionSpecification.byDescription(search);
        if (descriptionSpec != null) {
            spec = spec.and(descriptionSpec);
        }

        return transactionRepository.findAll(spec, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public TransactionResponse update(UUID id, TransactionUpdateRequest request) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found with id: " + id));

        transaction.setAmount(request.amount());
        transaction.setCurrency(request.currency());
        transaction.setDescription(request.description());
        transaction.setOccurredAt(request.occurredAt());
        transaction.setMetadata(request.metadata());
        transaction.setUpdatedAt(Instant.now());

        Transaction updated = transactionRepository.save(transaction);
        logger.info("Transaction updated with id: {}", id);
        return mapToResponse(updated);
    }

    @Override
    public void delete(UUID id) {
        if (!transactionRepository.existsById(id)) {
            throw new IllegalArgumentException("Transaction not found with id: " + id);
        }
        transactionRepository.deleteById(id);
        logger.info("Transaction deleted with id: {}", id);
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getCurrency(),
                transaction.getDescription(),
                transaction.getOccurredAt(),
                transaction.getCategory() != null ? transaction.getCategory().getId() : null,
                transaction.getCategory() != null ? transaction.getCategory().getName() : null,
                transaction.getMetadata(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt()
        );
    }
}
