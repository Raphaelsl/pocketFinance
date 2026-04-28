-- V003__add_transaction_type.sql
-- Add transaction type with conservative default for historical data

ALTER TABLE transactions
ADD COLUMN type VARCHAR(20);

UPDATE transactions
SET type = 'EXPENSE'
WHERE type IS NULL;

ALTER TABLE transactions
    ALTER COLUMN type SET NOT NULL;

ALTER TABLE transactions
    ADD CONSTRAINT chk_transactions_type
        CHECK (type IN ('INCOME', 'EXPENSE'));