import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmDeleteModal } from '../ConfirmDeleteModal';

describe('ConfirmDeleteModal Acessibilidade e Comportamento', () => {
    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });


    it('deve renderizar o modal com semântica correta de dialog (a11y)', () => {
        render(
            <ConfirmDeleteModal
                description="Compra no Mercado"
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
                isLoading={false}
                error={null}
            />
        );


        const dialog = screen.getByRole('dialog', { name: /excluir transação/i });
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute('aria-modal', 'true');


        expect(dialog).toHaveAccessibleDescription(/Tem certeza que deseja excluir Compra no Mercado\s*\? Esta ação não pode ser desfeita\./i);
    });

    it('deve chamar onCancel ao pressionar a tecla Escape', () => {
        render(
            <ConfirmDeleteModal
                description="Teste"
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
                isLoading={false}
                error={null}
            />
        );

        // Simula o pressionamento da tecla Escape no teclado
        fireEvent.keyDown(document, { key: 'Escape' });

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
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
        const btnConfirm = screen.getByRole('button', { name: /excluindo\.\.\./i });

        expect(btnCancel).toBeDisabled();
        expect(btnConfirm).toBeDisabled();
    });

    // Subtask 5: Busca o alerta pelo seu role de acessibilidade
    it('deve exibir a mensagem de erro em um container de alerta (role="alert")', () => {
        render(
            <ConfirmDeleteModal
                description="Teste"
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
                isLoading={false}
                error="Erro de conexão com o banco"
            />
        );

        // Garante que a mensagem não é apenas um texto visual, mas um alerta para o leitor de tela
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent('Erro de conexão com o banco');
    });
});