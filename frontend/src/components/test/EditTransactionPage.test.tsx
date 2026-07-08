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

describe('EditTransactionPage', () => {
    let queryClient: QueryClient;
    const mockRouterPush = jest.fn();

    // Uma transação falsa para o nosso mock devolver
    const mockTransaction = {
        id: '123',
        amount: 150.5,
        type: TransactionType.EXPENSE,
        currency: 'BRL',
        description: 'Compra no mercado',
        occurredAt: '2026-07-06T15:00:00.000Z',
    };

    beforeEach(() => {
        // Limpa os mocks antes de cada teste
        jest.clearAllMocks();

        // Cria um QueryClient novo e zerado para cada teste não influenciar o outro
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } }, // Desliga as retentativas no teste
        });

        // Configura os mocks do Next.js
        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush, refresh: jest.fn() });
        (useParams as jest.Mock).mockReturnValue({ id: '123' });
    });

    // Função auxiliar para renderizar a página dentro do Provedor do React Query
    const renderPage = () => {
        render(
            <QueryClientProvider client={queryClient}>
                <EditTransactionPage />
            </QueryClientProvider>
        );
    };

    it('deve mostrar mensagem de carregamento inicialmente', () => {
        // Configuramos o mock para demorar um pouco (simulando internet)
        (transactionService.getById as jest.Mock).mockReturnValue(new Promise(() => {}));

        renderPage();

        expect(screen.getByText('Carregando transação...')).toBeInTheDocument();
    });

    it('deve preencher o formulário com os dados da transação', async () => {
        // O mock agora devolve nossa transação falsa rapidamente
        (transactionService.getById as jest.Mock).mockResolvedValue(mockTransaction);

        renderPage();

        // Esperamos o React Query terminar e a tela carregar
        await waitFor(() => {
            expect(screen.getByDisplayValue('150.5')).toBeInTheDocument(); // amount
            expect(screen.getByDisplayValue('EXPENSE')).toBeInTheDocument(); // type
            expect(screen.getByDisplayValue('BRL')).toBeInTheDocument(); // currency
            expect(screen.getByDisplayValue('Compra no mercado')).toBeInTheDocument(); // description
        });
    });

    it('deve enviar os dados atualizados ao salvar', async () => {
        (transactionService.getById as jest.Mock).mockResolvedValue(mockTransaction);
        (transactionService.update as jest.Mock).mockResolvedValue({});

        renderPage();

        // Espera carregar os dados
        await waitFor(() => {
            expect(screen.getByDisplayValue('Compra no mercado')).toBeInTheDocument();
        });

        // Altera a descrição simulando o usuário digitando
        const descriptionInput = screen.getByLabelText('Descrição');
        fireEvent.change(descriptionInput, { target: { value: 'Compra no shopping' } });

        // Clica em Salvar
        const submitButton = screen.getByRole('button', { name: /salvar transação/i });
        fireEvent.click(submitButton);

        // Verifica se a função update foi chamada com a nova descrição e o ID correto
        await waitFor(() => {
            expect(transactionService.update).toHaveBeenCalledWith('123', expect.objectContaining({
                description: 'Compra no shopping',
                amount: 150.5, // Garante que não perdeu o valor antigo
            }));
            // Verifica se redirecionou pra lista
            expect(mockRouterPush).toHaveBeenCalledWith('/transactions');
        });
    });
});