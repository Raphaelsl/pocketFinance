import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '../../app/dashboard/page';
import { useDashboard } from '../../hooks/useDashboard';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';


jest.mock('../../hooks/useDashboard');
const mockedUseDashboard = useDashboard as jest.Mock;


jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
}));

const mockedUseRouter = useRouter as jest.Mock;
const mockedUsePathname = usePathname as jest.Mock;
const mockedUseSearchParams = useSearchParams as jest.Mock;

describe('DashboardPage Component (Filtros e URL)', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();


        mockedUseRouter.mockReturnValue({ push: mockPush });
        mockedUsePathname.mockReturnValue('/dashboard');
        mockedUseSearchParams.mockReturnValue(new URLSearchParams(''));


        mockedUseDashboard.mockReturnValue({
            isLoading: false,
            isFetching: false,
            isError: false,
            data: {
                summary: { totalIncome: 5000, totalExpense: 2000, balance: 3000, transactionCount: 10 }
            },
        });
    });

    it('deve carregar os filtros padrão (6 meses) quando a URL estiver vazia', () => {
        render(<DashboardPage />);
        expect(screen.getByText('Visão Geral')).toBeInTheDocument();

        expect(mockedUseDashboard).toHaveBeenCalledWith(expect.objectContaining({
            currency: 'BRL'
        }));
    });

    it('deve usar valores de fallback seguros caso a URL tenha dados inválidos', () => {

        mockedUseSearchParams.mockReturnValue(new URLSearchParams('start=invalido&end=bizarro&currency=YYZ'));

        render(<DashboardPage />);


        expect(mockedUseDashboard).toHaveBeenCalledWith(expect.objectContaining({
            currency: 'BRL'
        }));
    });

    it('deve atualizar a URL ao clicar no preset de "3 Meses"', () => {
        render(<DashboardPage />);

        const btn3Meses = screen.getByText('3 Meses');
        fireEvent.click(btn3Meses);


        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush.mock.calls[0][0]).toContain('?start=');
        expect(mockPush.mock.calls[0][0]).toContain('end=');
    });

    it('deve aplicar classe de opacidade na tela quando isFetching for true (Atualizando)', () => {

        mockedUseDashboard.mockReturnValue({
            isLoading: false,
            isFetching: true,
            isError: false,
            data: {
                summary: { totalIncome: 100, totalExpense: 50, balance: 50, transactionCount: 1 }
            },
        });

        render(<DashboardPage />);


        const containerGrid = screen.getByText('Receitas').closest('.grid');
        expect(containerGrid).toHaveClass('opacity-50');
    });

    it('deve renderizar o estado de carregamento (Skeletons) na primeira montagem', () => {
        mockedUseDashboard.mockReturnValue({
            isLoading: true,
            data: null,
            isError: false,
        });

        render(<DashboardPage />);

        const skeletons = document.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });
});