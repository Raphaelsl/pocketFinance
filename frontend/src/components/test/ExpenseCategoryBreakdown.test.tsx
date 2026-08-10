import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ExpenseCategoryBreakdown } from '../../components/dashboard/ExpenseCategoryBreakdown';

describe('ExpenseCategoryBreakdown Component', () => {
    it('deve renderizar o estado vazio (zero despesas)', () => {
        render(<ExpenseCategoryBreakdown breakdown={[]} currency="BRL" />);

        expect(screen.getByText('Nenhuma despesa registrada neste período.')).toBeInTheDocument();
    });

    it('deve ignorar receitas (amount zero) e renderizar apenas despesas válidas', () => {
        const mockBreakdown = [
            { category: 'Salário', amount: 0 },
            { category: 'Mercado', amount: 150.50 },
        ];

        render(<ExpenseCategoryBreakdown breakdown={mockBreakdown} currency="BRL" />);

        expect(screen.getByText('Mercado')).toBeInTheDocument();
        expect(screen.queryByText('Salário')).not.toBeInTheDocument();
    });

    it('deve renderizar "Sem categoria" quando a categoria for vazia ou nula', () => {
        const mockBreakdown = [
            { category: '', amount: 50 },
        ];

        render(<ExpenseCategoryBreakdown breakdown={mockBreakdown} currency="BRL" />);

        expect(screen.getByText('Sem categoria')).toBeInTheDocument();
    });

    it('deve ordenar as categorias da maior para a menor despesa', () => {
        const mockBreakdown = [
            { category: 'Lazer', amount: 50 },
            { category: 'Aluguel', amount: 1000 },
            { category: 'Mercado', amount: 300 },
        ];

        render(<ExpenseCategoryBreakdown breakdown={mockBreakdown} currency="BRL" />);

        const categories = screen.getAllByText(/Lazer|Aluguel|Mercado/);

        expect(categories[0]).toHaveTextContent('Aluguel');
        expect(categories[1]).toHaveTextContent('Mercado');
        expect(categories[2]).toHaveTextContent('Lazer');
    });
});