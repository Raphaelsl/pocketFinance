import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditTransactionPage from '../../app/transactions/[id]/edit/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { transactionService } from '../../services/transactionService';
import { useRouter, useParams } from 'next/navigation';
import { TransactionType } from '../../types/transaction';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useParams: jest.fn(),
}));

jest.mock('../../services/transactionService', () => ({
    transactionService: {
        getById: jest.fn(),
        update: jest.fn(),
    },
}));

describe('EditTransactionPage Behavior & A11y', () => {
    let queryClient: QueryClient;
    const mockRouterPush = jest.fn();

    const mockTransaction = {
        id: '123',
        amount: 150.5,
        type: TransactionType.EXPENSE,
        currency: 'BRL',
        description: 'Compra no mercado',
        occurredAt: '2026-07-06T15:00:00.000Z',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush, refresh: jest.fn() });
        (useParams as jest.Mock).mockReturnValue({ id: '123' });
    });

    const renderPage = () => {
        render(
            <QueryClientProvider client={queryClient}>
                <EditTransactionPage />
            </QueryClientProvider>
        );
    };

    it('deve exibir feedback de carregamento acessível (role="status") inicialmente', () => {
        (transactionService.getById as jest.Mock).mockReturnValue(new Promise(() => {}));
        renderPage();

        const statusElement = screen.getByRole('status');
        expect(statusElement).toBeInTheDocument();
        expect(statusElement).toHaveTextContent(/carregando/i);
    });

    it('deve preencher o formulário corretamente baseado nos dados carregados', async () => {
        (transactionService.getById as jest.Mock).mockResolvedValue(mockTransaction);
        renderPage();

        await waitFor(() => {
            expect(screen.getByLabelText(/valor/i)).toHaveValue(150.5);
            expect(screen.getByLabelText(/tipo/i)).toHaveValue('EXPENSE');
            expect(screen.getByLabelText(/moeda/i)).toHaveValue('BRL');
            expect(screen.getByLabelText(/descrição/i)).toHaveValue('Compra no mercado');
        });
    });

    it('deve formatar e enviar o payload correto ao salvar alterações', async () => {
        (transactionService.getById as jest.Mock).mockResolvedValue(mockTransaction);
        (transactionService.update as jest.Mock).mockResolvedValue({});

        renderPage();

        await waitFor(() => {
            expect(screen.getByLabelText(/descrição/i)).toHaveValue('Compra no mercado');
        });

        const descriptionInput = screen.getByLabelText(/descrição/i);
        fireEvent.change(descriptionInput, { target: { value: 'Compra no shopping' } });

        const submitButton = screen.getByRole('button', { name: /salvar transação/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(transactionService.update).toHaveBeenCalledWith('123', expect.objectContaining({
                description: 'Compra no shopping',
                amount: 150.5,
            }));
            expect(mockRouterPush).toHaveBeenCalledWith('/transactions');
        });
    });
});