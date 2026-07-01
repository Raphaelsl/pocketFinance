-- V1__create_tables.sql (Clone adaptado para H2 nos testes)

CREATE TABLE categories (
                            id UUID DEFAULT random_uuid() PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE transactions (
                              id UUID DEFAULT random_uuid() PRIMARY KEY,
                              amount NUMERIC(12,2) NOT NULL,
                              currency VARCHAR(10) NOT NULL DEFAULT 'BRL',
                              description TEXT,
                              occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
                              category_id UUID REFERENCES categories(id),
                              metadata VARCHAR(255),
                              created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                              updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);