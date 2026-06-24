package com.pocketfinance.backend;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests to verify that Flyway migrations are properly executed.
 * This test class uses a special profile (test-with-migration) that enables Flyway
 * instead of relying on Hibernate's DDL auto-generation.
 */
@SpringBootTest
@ActiveProfiles("test-with-migration")
@DisplayName("Flyway Migration Tests")
class FlywayMigrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @DisplayName("Should have 'type' column after V003 migration")
    void shouldHaveTypeColumnAfterMigration() {
        // Query H2 INFORMATION_SCHEMA to check if the 'type' column exists
        String sql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
                    "WHERE TABLE_NAME = 'TRANSACTIONS' AND COLUMN_NAME = 'TYPE'";

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);

        assertThat(count).isEqualTo(1)
                .withFailMessage("Column 'type' should exist in 'transactions' table after V003 migration");
    }

    @Test
    @DisplayName("Should have CHECK constraint on type column")
    void shouldHaveCheckConstraintOnType() {
        // Verify that the CHECK constraint for type (INCOME or EXPENSE) exists
        String sql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS " +
                    "WHERE TABLE_NAME = 'TRANSACTIONS' AND CONSTRAINT_NAME = 'CHK_TRANSACTIONS_TYPE'";

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);

        assertThat(count).isEqualTo(1)
                .withFailMessage("CHECK constraint 'CHK_TRANSACTIONS_TYPE' should exist after V003 migration");
    }

    @Test
    @DisplayName("Should have 'type' column as NOT NULL")
    void shouldHaveTypeColumnAsNotNull() {
        // Verify that the type column is NOT NULL
        String sql = "SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS " +
                    "WHERE TABLE_NAME = 'TRANSACTIONS' AND COLUMN_NAME = 'TYPE'";

        String isNullable = jdbcTemplate.queryForObject(sql, String.class);

        assertThat(isNullable).isEqualTo("NO")
                .withFailMessage("Column 'type' should be NOT NULL");
    }

    @Test
    @DisplayName("Should have 'type' column with VARCHAR(20) data type")
    void shouldHaveTypeColumnWithCorrectDataType() {
        // Verify that the type column has VARCHAR(20) data type
        String sql = "SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS " +
                    "WHERE TABLE_NAME = 'TRANSACTIONS' AND COLUMN_NAME = 'TYPE'";

        String columnType = jdbcTemplate.queryForObject(sql, String.class);

        assertThat(columnType).isEqualTo("CHARACTER VARYING(20)")
                .withFailMessage("Column 'type' should be VARCHAR(20) data type");
    }
}

