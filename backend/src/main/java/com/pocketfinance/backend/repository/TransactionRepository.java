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
import java.util.List;
import java.util.UUID;

import com.pocketfinance.backend.repository.projection.DashboardSummaryProjection;
import com.pocketfinance.backend.repository.projection.CategoryBreakdownProjection;
import com.pocketfinance.backend.repository.projection.MonthlyEvolutionProjection;

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


    @Query("""
        SELECT 
            COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) AS totalIncome,
            COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) AS totalExpense,
            COUNT(t) AS transactionCount
        FROM Transaction t
        WHERE t.occurredAt >= :start AND t.occurredAt < :end
        AND t.currency = :currency
    """)
    DashboardSummaryProjection getDashboardSummary(
            @Param("start") Instant start,
            @Param("end") Instant end,
            @Param("currency") String currency
    );


    @Query("""
        SELECT 
            COALESCE(c.name, 'Sem categoria') AS category,
            SUM(t.amount) AS amount
        FROM Transaction t
        LEFT JOIN t.category c
        WHERE t.occurredAt >= :start AND t.occurredAt < :end
        AND t.currency = :currency
        AND t.type = 'EXPENSE'
        GROUP BY c.name
        ORDER BY amount DESC
    """)
    List<CategoryBreakdownProjection> getCategoryBreakdown(
            @Param("start") Instant start,
            @Param("end") Instant end,
            @Param("currency") String currency
    );


    @Query(value = """
        SELECT 
            CAST(EXTRACT(YEAR FROM occurred_at) AS INTEGER) AS "year",
            CAST(EXTRACT(MONTH FROM occurred_at) AS INTEGER) AS "month",
            COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS income,
            COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS expense
        FROM transactions
        WHERE occurred_at >= :start AND occurred_at < :end
        AND currency = :currency
        GROUP BY EXTRACT(YEAR FROM occurred_at), EXTRACT(MONTH FROM occurred_at)
        ORDER BY "year", "month"
    """, nativeQuery = true)
    List<MonthlyEvolutionProjection> getMonthlyEvolution(
            @Param("start") Instant start,
            @Param("end") Instant end,
            @Param("currency") String currency
    );
}