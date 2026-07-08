import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransactionItem from '@/components/TransactionItem';

// Importamos a interface Transaction junto com o Enum
import { Transaction, TransactionType } from '../../types/transaction';

describe('TransactionItem Unit Tests', () => {
    // 1. Criamos a função mock para satisfazer a nova prop obrigatória
    const mockOnDelete = jest.fn();

    // Limpa o histórico da função entre os testes
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar os estilos corretos para uma DESPESA (EXPENSE)', () => {
        const mockExpense = {
            id: '1',
            amount: 150.50,
            description: 'Compra no Mercado',
            type: TransactionType.EXPENSE,
            currency: 'BRL',
            occurredAt: '2026-06-24T14:00:00Z'
        } as Transaction;

        // 2. Passamos a prop onDelete
        render(<TransactionItem transaction={mockExpense} onDelete={mockOnDelete} />);

        // Verifica se a descrição renderizou
        expect(screen.getByText('Compra no Mercado')).toBeInTheDocument();

        // Verifica o valor e a cor da fonte (atualizado para red-600)
        const amountElement = screen.getByText(/150,50/);
        expect(amountElement).toBeInTheDocument();
        expect(amountElement).toHaveClass('text-red-600');

        // Verifica o badge de tipo (procura por 'Despesa' e verifica as novas classes)
        const badgeElement = screen.getByText('Despesa');
        expect(badgeElement).toBeInTheDocument();
        expect(badgeElement).toHaveClass('bg-red-50', 'text-red-700');
    });

    it('deve renderizar os estilos corretos para uma RECEITA (INCOME)', () => {
        const mockIncome = {
            id: '2',
            amount: 5000.00,
            description: 'Salário',
            type: TransactionType.INCOME,
            currency: 'BRL',
            occurredAt: '2026-06-24T14:00:00Z'
        } as Transaction;

        // 2. Passamos a prop onDelete
        render(<TransactionItem transaction={mockIncome} onDelete={mockOnDelete} />);

        expect(screen.getByText('Salário')).toBeInTheDocument();

        // Atualizado para a cor emerald que você usou no componente
        const amountElement = screen.getByText(/5\.000,00/);
        expect(amountElement).toBeInTheDocument();
        expect(amountElement).toHaveClass('text-emerald-600');

        // Verifica o badge de tipo (procura por 'Receita' e verifica as novas classes emerald)
        const badgeElement = screen.getByText('Receita');
        expect(badgeElement).toBeInTheDocument();
        expect(badgeElement).toHaveClass('bg-emerald-50', 'text-emerald-700');
    });
});