-- V1__create_tables.sql

CREATE TABLE categories (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            name VARCHAR(100) NOT NULL,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE transactions (
                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              amount NUMERIC(12,2) NOT NULL,
                              currency VARCHAR(10) NOT NULL DEFAULT 'BRL',
                              description TEXT,
                              occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
                              category_id UUID REFERENCES categories(id),
                              metadata JSONB,
                              created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                              updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
