import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmDeleteModal } from '../ConfirmDeleteModal'; // Caminho relativo para o componente

describe('ConfirmDeleteModal', () => {
    // Funções falsas (mocks) para sabermos se os botões foram clicados
    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks(); // Limpa o histórico de cliques antes de cada teste
    });

    it('deve renderizar a descrição da transação corretamente', () => {
        render(
            <ConfirmDeleteModal
                description="Compra no Mercado"
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
                isLoading={false}
                error={null}
            />
        );

        // Verifica se o texto principal e o nome da transação aparecem na tela
        expect(screen.getByText(/Tem certeza que deseja excluir/i)).toBeInTheDocument();
        expect(screen.getByText(/Compra no Mercado/i)).toBeInTheDocument();
    });

    it('deve chamar onCancel ao clicar no botão Cancelar', () => {
        render(
            <ConfirmDeleteModal
                description="Teste"
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
                isLoading={false}
                error={null}
            />
        );

        const btnCancel = screen.getByRole('button', { name: /cancelar/i });
        fireEvent.click(btnCancel);

        // Verifica se a função foi disparada 1 vez
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onConfirm ao clicar no botão Excluir', () => {
        render(
            <ConfirmDeleteModal
                description="Teste"
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
                isLoading={false}
                error={null}
            />
        );

        const btnConfirm = screen.getByRole('button', { name: 'Excluir' });
        fireEvent.click(btnConfirm);

        // Verifica se a função de deletar foi disparada 1 vez
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('deve desabilitar os botões e mostrar texto de loading quando isLoading for true', () => {
        render(
            <ConfirmDeleteModal
                description="Teste"
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
                isLoading={true}
                error={null}
            />
        );

        const btnCancel = screen.getByRole('button', { name: /cancelar/i });
        // Quando está carregando, o texto do botão muda para "Excluindo..."
        const btnConfirm = screen.getByRole('button', { name: /excluindo\.\.\./i });

        expect(btnCancel).toBeDisabled();
        expect(btnConfirm).toBeDisabled();
    });

    it('deve exibir a mensagem de erro quando houver falha', () => {
        render(
            <ConfirmDeleteModal
                description="Teste"
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
                isLoading={false}
                error="Erro de conexão com o banco"
            />
        );

        // Garante que o box vermelho de erro vai aparecer
        expect(screen.getByText('Erro de conexão com o banco')).toBeInTheDocument();
    });
});