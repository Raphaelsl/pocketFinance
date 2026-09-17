import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NewTransactionsPage from '../../app/transactions/new/page';
import { TransactionType } from '@/types/transaction';
import { transactionService } from '../../services/transactionService';

const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        refresh: mockRefresh,
    }),
}));

jest.mock('../../services/transactionService', () => ({
    transactionService: {
        create: jest.fn(),
    },
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
    },
});

const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

describe('NewTransactionsPage Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('envia o payload normalizado ao criar uma transação válida', async () => {
        (transactionService.create as jest.Mock).mockResolvedValue({});
        renderWithQueryClient(<NewTransactionsPage />);

        fireEvent.change(screen.getByLabelText(/valor/i), { target: { value: '150.50' } });
        fireEvent.change(screen.getByLabelText(/moeda/i), { target: { value: 'usd' } });
        fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: ' Projeto Freelance ' } });
        fireEvent.change(screen.getByLabelText(/data e hora/i), { target: { value: '2026-06-24T14:30' } });
        fireEvent.change(screen.getByRole('combobox'), { target: { value: TransactionType.INCOME } });

        fireEvent.click(screen.getByRole('button', { name: /Criar trans/i }));

        await waitFor(() => {
            expect(transactionService.create).toHaveBeenCalledWith({
                amount: 150.5,
                type: TransactionType.INCOME,
                currency: 'USD',
                description: 'Projeto Freelance',
                occurredAt: expect.any(String),
            });
        });

        expect(mockPush).toHaveBeenCalledWith('/transactions');
        expect(mockRefresh).toHaveBeenCalled();
    });

    it('exibe erros de validação próximos aos campos quando o formulário está incompleto', async () => {
        renderWithQueryClient(<NewTransactionsPage />);

        fireEvent.change(screen.getByLabelText(/moeda/i), { target: { value: 'us' } });
        fireEvent.click(screen.getByRole('button', { name: /Criar trans/i }));

        expect(await screen.findByText(/valor.*obrig/i)).toBeInTheDocument();
        expect(screen.getByText(/moeda deve ter 3 letras/i)).toBeInTheDocument();
        expect(screen.getByText(/descr.*obrig/i)).toBeInTheDocument();
        expect(screen.getByText(/data.*obrig/i)).toBeInTheDocument();
        expect(transactionService.create).not.toHaveBeenCalled();
    });

    it('rejeita valores nulos, zero ou negativos no campo amount', async () => {
        renderWithQueryClient(<NewTransactionsPage />);

        fireEvent.change(screen.getByLabelText(/valor/i), { target: { value: '0' } });
        fireEvent.change(screen.getByLabelText(/moeda/i), { target: { value: 'BRL' } });
        fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: '...' } });
        fireEvent.change(screen.getByLabelText(/data e hora/i), { target: { value: '2026-06-24T14:30' } });

        fireEvent.click(screen.getByRole('button', { name: /Criar trans/i }));

        expect(await screen.findByText(/valor deve ser maior que zero/i)).toBeInTheDocument();
        expect(transactionService.create).not.toHaveBeenCalled();
    });
});