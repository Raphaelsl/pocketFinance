import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MonthlyFinancialEvolution } from '../../components/dashboard/MonthlyFinancialEvolution';

describe('MonthlyFinancialEvolution Component', () => {

    const mockEvolution = [
        { month: 'Jan', income: 5123.50, expense: 2123.50, balance: 3000 },
        { month: 'Fev', income: 0, expense: 0, balance: 0 },
        { month: 'Mar', income: 3123.50, expense: 4123.50, balance: -1000 },
    ];

    it('deve renderizar todos os meses fornecidos cronologicamente', () => {
        render(<MonthlyFinancialEvolution evolution={mockEvolution} currency="BRL" />);

        expect(screen.getAllByText('Jan').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Fev').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Mar').length).toBeGreaterThan(0);
    });

    it('deve calcular a altura de meses vazios (zero) sem quebrar o layout', () => {
        render(<MonthlyFinancialEvolution evolution={mockEvolution} currency="BRL" />);


        const zeroIncomeBars = screen.getAllByTitle((title) => title.includes('Receita') && title.includes('0,00'));
        const zeroExpenseBars = screen.getAllByTitle((title) => title.includes('Despesa') && title.includes('0,00'));

        expect(zeroIncomeBars.length).toBeGreaterThan(0);
        expect(zeroExpenseBars.length).toBeGreaterThan(0);

        expect(zeroIncomeBars[0]).toHaveStyle({ height: '0%' });
    });

    it('deve lidar corretamente com saldo negativo na tabela de acessibilidade', () => {
        render(<MonthlyFinancialEvolution evolution={mockEvolution} currency="BRL" />);

        const negativeBalance = screen.getByText((content) => content.includes('-') && content.includes('1.000'));
        expect(negativeBalance).toBeInTheDocument();
    });

    it('deve lidar com o cenário onde todos os meses estão zerados (sem divisão por zero)', () => {
        const zeroEvolution = [
            { month: 'Jan', income: 0, expense: 0, balance: 0 },
        ];

        render(<MonthlyFinancialEvolution evolution={zeroEvolution} currency="BRL" />);

        const zeroBar = screen.getAllByTitle((title) => title.includes('Receita') && title.includes('0,00'))[0];
        expect(zeroBar).toHaveStyle({ height: '0%' });
    });
});