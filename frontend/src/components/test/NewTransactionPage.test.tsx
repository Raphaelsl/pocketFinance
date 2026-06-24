import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Sai de test/ (../), sai de components/ (../), entra em new/
import NewTransactionsPage from '../../app/transactions/new/page';
import { TransactionType } from '@/types/transaction';
import { transactionService } from '../../services/transactionService';

// 1. Mock do Next.js Router
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        refresh: jest.fn(),
    }),
}));

// 2. Mock do Service
jest.mock('../../services/transactionService', () => ({
    transactionService: {
        create: jest.fn(),
    },
}));
describe('NewTransactionsPage Unit Tests', () => {
    beforeEach(() => {
        // Limpa o histórico de Mocks antes de cada teste
        jest.clearAllMocks();
    });

    it('deve enviar o formulário com sucesso alterando o tipo para INCOME', async () => {
        // Prepara o mock do service para retornar uma promessa resolvida (Sucesso)
        (transactionService.create as jest.Mock).mockResolvedValue({});

        // Usamos o 'container' para buscar inputs que não possuem placeholder (como a data)
        const { container } = render(<NewTransactionsPage />);

        // 1. Preenche os inputs de texto e número usando os placeholders
        fireEvent.change(screen.getByPlaceholderText('Valor'), { target: { value: '150.50' } });
        fireEvent.change(screen.getByPlaceholderText('BRL'), { target: { value: 'USD' } });
        fireEvent.change(screen.getByPlaceholderText('Descrição'), { target: { value: 'Projeto Freelance' } });

        // 2. Preenche a data buscando diretamente pela tag input com o tipo correto
        const dateInput = container.querySelector('input[type="datetime-local"]');
        // Garante que o input existe na tela antes de digitar
        expect(dateInput).not.toBeNull();
        fireEvent.change(dateInput!, { target: { value: '2026-06-24T14:30' } });

        // 3. Altera o Select (Combobox) de EXPENSE (Padrão) para INCOME
        const typeSelect = screen.getByRole('combobox');
        fireEvent.change(typeSelect, { target: { value: TransactionType.INCOME } });

        // 4. Clica no botão
        const submitButton = screen.getByRole('button', { name: /Criar Transação/i });
        fireEvent.click(submitButton);

        // 5. Aguarda a requisição assíncrona acontecer e valida se o pacote montado está perfeito
        await waitFor(() => {
            expect(transactionService.create).toHaveBeenCalledWith({
                amount: 150.5,
                type: TransactionType.INCOME, // Garante que a troca de tipo funcionou
                currency: 'USD',
                description: 'Projeto Freelance',
                // O expect.any(String) é usado porque a sua função handleSubmit transforma
                // a data em ISOString gerando precisão de milissegundos que é variável
                occurredAt: expect.any(String),
            });
        });
    });

    it('deve exibir mensagens de erro do ValidationSchema ao enviar formulário vazio', async () => {
        render(<NewTransactionsPage />);

        // Clica em salvar imediatamente, sem preencher nada
        const submitButton = screen.getByRole('button', { name: /Criar Transação/i });
        fireEvent.click(submitButton);

        // Aguarda a renderização das mensagens de erro exatas definidas no seu validationSchema
        expect(await screen.findByText('Valor deve ser maior que zero')).toBeInTheDocument();
        expect(screen.getByText('Descricao obrigatoria')).toBeInTheDocument();
        expect(screen.getByText('Data obrigatoria')).toBeInTheDocument();

        // Garante que a API não foi chamada, pois a validação barrou a requisição com sucesso
        expect(transactionService.create).not.toHaveBeenCalled();
    });
});