package com.pocketfinance.backend.service;

import com.pocketfinance.backend.dto.TransactionCreateRequest;
import com.pocketfinance.backend.dto.TransactionResponse;
import com.pocketfinance.backend.dto.TransactionUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.UUID;

public interface TransactionService {
    TransactionResponse create(TransactionCreateRequest request);
    Page<TransactionResponse> list(Pageable pageable, UUID categoryId, Instant start, Instant end, String search);
    TransactionResponse getById(UUID id);
    TransactionResponse update(UUID id, TransactionUpdateRequest request);
    void delete(UUID id);
}
