package com.pocketfinance.backend.repository;

import com.pocketfinance.backend.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID>, JpaSpecificationExecutor<Transaction> {

    Page<Transaction> findByCategoryId(UUID categoryId, Pageable pageable);

    Page<Transaction> findByOccurredAtBetween(Instant dateFrom, Instant dateTo, Pageable pageable);

    Page<Transaction> findByCategoryIdAndOccurredAtBetween(UUID categoryId, Instant dateFrom, Instant dateTo, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE " +
           "(:categoryId IS NULL OR t.category.id = :categoryId) AND " +
           "(:dateFrom IS NULL OR t.occurredAt >= :dateFrom) AND " +
           "(:dateTo IS NULL OR t.occurredAt <= :dateTo) AND " +
           "(:search IS NULL OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Transaction> findWithFilters(@Param("categoryId") UUID categoryId,
                                     @Param("dateFrom") Instant dateFrom,
                                     @Param("dateTo") Instant dateTo,
                                     @Param("search") String search,
                                     Pageable pageable);
}