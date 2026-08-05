import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransactionItem from '@/components/TransactionItem';
import { Transaction, TransactionType } from '../../types/transaction';

describe('TransactionItem Behavior', () => {
    const mockOnDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve exibir semanticamente os dados de uma despesa (EXPENSE)', () => {
        const mockExpense = {
            id: '1',
            amount: 150.50,
            description: 'Compra no Mercado',
            type: TransactionType.EXPENSE,
            currency: 'BRL',
            occurredAt: '2026-06-24T14:00:00Z'
        } as Transaction;

        render(<TransactionItem transaction={mockExpense} onDelete={mockOnDelete} />);

        expect(screen.getByText('Compra no Mercado')).toBeInTheDocument();
        expect(screen.getByText(/150,50/)).toBeInTheDocument();
        expect(screen.getByText('Despesa')).toBeInTheDocument();
    });

    it('deve exibir semanticamente os dados de uma receita (INCOME)', () => {
        const mockIncome = {
            id: '2',
            amount: 5000.00,
            description: 'Salário',
            type: TransactionType.INCOME,
            currency: 'BRL',
            occurredAt: '2026-06-24T14:00:00Z'
        } as Transaction;

        render(<TransactionItem transaction={mockIncome} onDelete={mockOnDelete} />);

        expect(screen.getByText('Salário')).toBeInTheDocument();
        expect(screen.getByText(/5\.000,00/)).toBeInTheDocument();
        expect(screen.getByText('Receita')).toBeInTheDocument();
    });

    it('deve acionar onConfirm com o ID da transação ao interagir com o botão de exclusão', () => {
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