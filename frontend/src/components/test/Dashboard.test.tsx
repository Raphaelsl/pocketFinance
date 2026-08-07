import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '../../app/dashboard/page';
import { useDashboard } from '../../hooks/useDashboard';


jest.mock('../../hooks/useDashboard');
const mockedUseDashboard = useDashboard as jest.Mock;

describe('DashboardPage Component', () => {
    beforeEach(() => {
        mockedUseDashboard.mockClear();
    });

    it('deve renderizar o estado de carregamento (Skeletons)', () => {
        mockedUseDashboard.mockReturnValue({
            isLoading: true,
            data: null,
            isError: false,
        });

        render(<DashboardPage />);


        expect(screen.getByText('Visão Geral')).toBeInTheDocument();
        const skeletons = document.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('deve renderizar o estado de erro e permitir retry', () => {
        const mockRefetch = jest.fn();
        mockedUseDashboard.mockReturnValue({
            isLoading: false,
            data: null,
            isError: true,
            refetch: mockRefetch,
        });

        render(<DashboardPage />);


        expect(screen.getByText('Ops! Não foi possível carregar o painel.')).toBeInTheDocument();

        const retryButton = screen.getByText('Tentar Novamente');
        fireEvent.click(retryButton);
        expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar o estado vazio com link para criar transação', () => {
        mockedUseDashboard.mockReturnValue({
            isLoading: false,
            isError: false,
            data: {
                summary: { totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0 }
            },
        });

        render(<DashboardPage />);


        expect(screen.getByText('Nenhuma movimentação neste período')).toBeInTheDocument();
        expect(screen.getByText('Criar minha primeira transação')).toHaveAttribute('href', '/transactions/new');
    });

    it('deve renderizar os KPIs de sucesso formatados corretamente', () => {
        mockedUseDashboard.mockReturnValue({
            isLoading: false,
            isError: false,
            data: {
                summary: {
                    totalIncome: 5000.50,
                    totalExpense: 2000.00,
                    balance: 3000.50,
                    transactionCount: 15
                }
            },
        });

        render(<DashboardPage />);

        expect(screen.getByText('15')).toBeInTheDocument();

        const incomeNode = screen.getByText((content) => content.includes('5.000,50'));
        const expenseNode = screen.getByText((content) => content.includes('2.000,00'));
        expect(incomeNode).toBeInTheDocument();
        expect(expenseNode).toBeInTheDocument();

        const balanceNode = screen.getByText((content) => content.includes('+') && content.includes('3.000,50'));
        expect(balanceNode).toBeInTheDocument();
    });
});