package com.pocketfinance.backend.service;

import com.pocketfinance.backend.dto.TransactionCreateRequest;
import com.pocketfinance.backend.dto.TransactionFilter;
import com.pocketfinance.backend.dto.TransactionResponse;
import com.pocketfinance.backend.dto.TransactionUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface TransactionService {

    TransactionResponse create(TransactionCreateRequest request);

    Page<TransactionResponse> list(Pageable pageable, TransactionFilter filter);

    TransactionResponse update(UUID id, TransactionUpdateRequest request);

    void delete(UUID id);
}
