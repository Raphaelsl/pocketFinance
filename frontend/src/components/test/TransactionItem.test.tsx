import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import TransactionItem from '../TransactionItem';
// Importamos a interface Transaction junto com o Enum
import { Transaction, TransactionType } from '../../types/transaction';

describe('TransactionItem Unit Tests', () => {
    it('deve renderizar os estilos corretos para uma DESPESA (EXPENSE)', () => {
        // Adicionamos o "as Transaction" para o TypeScript ignorar os campos não obrigatórios
        const mockExpense = {
            id: '1',
            amount: 150.50,
            description: 'Compra no Mercado',
            type: TransactionType.EXPENSE,
            currency: 'BRL',
            occurredAt: '2026-06-24T14:00:00Z'
        } as Transaction;

        render(<TransactionItem transaction={mockExpense} />);

        // Verifica se a descrição renderizou
        expect(screen.getByText('Compra no Mercado')).toBeInTheDocument();

        // Verifica o valor e a cor da fonte
        const amountElement = screen.getByText(/150,50/);
        expect(amountElement).toBeInTheDocument();
        expect(amountElement).toHaveClass('text-red-500');

        // Verifica o badge de tipo
        const badgeElement = screen.getByText(TransactionType.EXPENSE);
        expect(badgeElement).toBeInTheDocument();
        expect(badgeElement).toHaveClass('bg-red-100', 'text-red-700');
    });

    it('deve renderizar os estilos corretos para uma RECEITA (INCOME)', () => {
        // Adicionamos o "as Transaction" aqui também
        const mockIncome = {
            id: '2',
            amount: 5000.00,
            description: 'Salário',
            type: TransactionType.INCOME,
            currency: 'BRL',
            occurredAt: '2026-06-24T14:00:00Z'
        } as Transaction;

        render(<TransactionItem transaction={mockIncome} />);

        expect(screen.getByText('Salário')).toBeInTheDocument();

        const amountElement = screen.getByText(/5\.000,00/);
        expect(amountElement).toBeInTheDocument();
        expect(amountElement).toHaveClass('text-green-500');

        const badgeElement = screen.getByText(TransactionType.INCOME);
        expect(badgeElement).toBeInTheDocument();
        expect(badgeElement).toHaveClass('bg-green-100', 'text-green-700');
    });
});