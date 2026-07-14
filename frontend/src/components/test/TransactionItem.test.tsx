import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransactionItem from '@/components/TransactionItem';


import { Transaction, TransactionType } from '../../types/transaction';

describe('TransactionItem Unit Tests', () => {
    const mockOnDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar os dados de uma DESPESA (EXPENSE) corretamente', () => {
        const mockExpense = {
            id: '1',
            amount: 150.50,
            description: 'Compra no Mercado',
            type: TransactionType.EXPENSE,
            currency: 'BRL',
            occurredAt: '2026-06-24T14:00:00Z'
        } as Transaction;

        render(<TransactionItem transaction={mockExpense} onDelete={mockOnDelete} />);

        // Testa o que realmente importa para o usuário: o conteúdo!
        expect(screen.getByText('Compra no Mercado')).toBeInTheDocument();
        expect(screen.getByText(/150,50/)).toBeInTheDocument();
        expect(screen.getByText('Despesa')).toBeInTheDocument();
    });

    it('deve renderizar os dados de uma RECEITA (INCOME) corretamente', () => {
        const mockIncome = {
            id: '2',
            amount: 5000.00,
            description: 'Salário',
            type: TransactionType.INCOME,
            currency: 'BRL',
            occurredAt: '2026-06-24T14:00:00Z'
        } as Transaction;

        render(<TransactionItem transaction={mockIncome} onDelete={mockOnDelete} />);

        // Testa comportamento e dados, ignorando classes do Tailwind
        expect(screen.getByText('Salário')).toBeInTheDocument();
        expect(screen.getByText(/5\.000,00/)).toBeInTheDocument();
        expect(screen.getByText('Receita')).toBeInTheDocument();
    });

    it('deve acionar a função onDelete com o ID da transação ao clicar no botão', () => {
        const mockExpense = {
            id: 'abc-123',
            amount: 100,
            description: 'Teste de Exclusão',
            type: TransactionType.EXPENSE,
            currency: 'BRL',
            occurredAt: '2026-06-24T14:00:00Z'
        } as Transaction;

        render(<TransactionItem transaction={mockExpense} onDelete={mockOnDelete} />);


        const deleteButton = screen.getByRole('button');


        fireEvent.click(deleteButton);


        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledWith('abc-123');
    });
});