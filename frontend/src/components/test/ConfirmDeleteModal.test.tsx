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

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
});