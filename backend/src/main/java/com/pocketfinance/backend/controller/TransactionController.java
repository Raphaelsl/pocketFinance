package com.pocketfinance.backend.controller;

import com.pocketfinance.backend.dto.PagedResponse;
import com.pocketfinance.backend.dto.TransactionCreateRequest;
import com.pocketfinance.backend.dto.TransactionResponse;
import com.pocketfinance.backend.dto.TransactionUpdateRequest;
import com.pocketfinance.backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.Instant;
import java.util.UUID;

/**
 * REST Controller for managing financial transactions.
 * <p>
 * This controller provides CRUD operations for transactions, including creation,
 * listing with pagination and filters, updating, and deletion. All endpoints follow
 * RESTful conventions and return appropriate HTTP status codes.
 * </p>
 *
 * @author Pocket Finance Team
 * @version 1.0
 * @since 2025-01-28
 */

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    /**
     * Creates a new financial transaction.
     * <p>
     * This endpoint accepts a transaction creation request with all required fields
     * validated. Upon successful creation, it returns HTTP 201 Created status with
     * Location header pointing to the newly created resource.
     * </p>
     *
     * @param request the transaction creation request containing amount, currency,
     *                description, occurredAt, categoryId (optional), and metadata (optional)
     * @return ResponseEntity containing the created transaction response with HTTP 201 status
     *         and Location header pointing to /api/transactions/{id}
     */
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @RequestBody @Valid TransactionCreateRequest request) {
        TransactionResponse response = transactionService.create(request);
        var location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        return ResponseEntity.created(location).body(response);
    }

    /**
     * Lists transactions with pagination support and optional filters.
     * <p>
     * This endpoint allows clients to retrieve transactions with pagination and apply
     * optional filters for category, date range, and text search. All filter parameters
     * are optional and can be combined.
     * </p>
     *
     * @param pageable  pagination information (page number, size, sort) provided by Spring Data
     * @param categoryId optional UUID to filter transactions by category
     * @param start      optional Instant representing the start of the date range filter (inclusive)
     * @param end        optional Instant representing the end of the date range filter (inclusive)
     * @param search     optional String to perform case-insensitive search in transaction descriptions
     * @return ResponseEntity containing a paginated list of TransactionResponse objects with HTTP 200 status
     */
    @GetMapping
    public ResponseEntity<PagedResponse<TransactionResponse>> listTransactions(
            Pageable pageable,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) Instant start,
            @RequestParam(required = false) Instant end,
            @RequestParam(required = false) String search) {

        Page<TransactionResponse> response = transactionService.list(pageable, categoryId, start, end, search);

        // Passamos a "response" (suja) para dentro do nosso PagedResponse (o filtro)
        return ResponseEntity.ok(new PagedResponse<>(response));
    }

    /**
     * Gets a transaction by its ID.
     * <p>
     * This endpoint retrieves a specific transaction by its unique identifier.
     * </p>
     *
     * @param id the UUID of the transaction to retrieve
     * @return ResponseEntity containing the transaction response with HTTP 200 status
     * @throws NotFoundException if the transaction with the given ID is not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable UUID id) {
        TransactionResponse response = transactionService.getById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Updates an existing transaction.
     * <p>
     * This endpoint allows clients to update transaction details by providing the
     * transaction ID and the updated information. All fields in the request body
     * are validated before processing.
     * </p>
     *
     * @param id      the UUID of the transaction to update
     * @param request the transaction update request containing the new values for
     *                amount, currency, description, occurredAt, categoryId (optional), and metadata (optional)
     * @return ResponseEntity containing the updated transaction response with HTTP 200 status
     * @throws NotFoundException if the transaction with the given ID is not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable UUID id,
            @RequestBody @Valid TransactionUpdateRequest request) {
        TransactionResponse response = transactionService.update(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes a transaction by its ID.
     * <p>
     * This endpoint permanently removes a transaction from the system. The operation
     * is irreversible and returns HTTP 204 No Content status upon successful deletion.
     * </p>
     *
     * @param id the UUID of the transaction to delete
     * @return ResponseEntity with HTTP 204 No Content status
     * @throws NotFoundException if the transaction with the given ID is not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable UUID id) {
        transactionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
