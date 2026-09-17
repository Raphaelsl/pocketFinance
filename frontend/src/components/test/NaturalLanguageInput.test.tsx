import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NaturalLanguageInput } from '../ai/NaturalLanguageInput';
import { useSuggestTransaction } from '../../hooks/useSuggestTransaction';


jest.mock('../../hooks/useSuggestTransaction');



describe('NaturalLanguageInput Component', () => {
    const mockOnSuccess = jest.fn();
    const mockOnError = jest.fn();
    const mockMutate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useSuggestTransaction as jest.Mock).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        });
    });

    it('deve renderizar o input e o botão em estado ocioso', () => {
        render(<NaturalLanguageInput onSuccess={mockOnSuccess} onError={mockOnError} />);


        expect(screen.getByLabelText(/Descreva a transação naturalmente/i)).toBeInTheDocument();


        const button = screen.getByRole('button', { name: /Analisar/i });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it('deve habilitar o botão quando houver texto', () => {
        render(<NaturalLanguageInput onSuccess={mockOnSuccess} onError={mockOnError} />);

        const input = screen.getByLabelText(/Descreva a transação naturalmente/i);
        fireEvent.change(input, { target: { value: 'Gastei 50 no mercado' } });

        const button = screen.getByRole('button', { name: /Analisar/i });
        expect(button).not.toBeDisabled();
    });

    it('deve mostrar estado de carregamento e desabilitar inputs durante a requisição', () => {

        (useSuggestTransaction as jest.Mock).mockReturnValue({
            mutate: mockMutate,
            isPending: true,
        });

        render(<NaturalLanguageInput onSuccess={mockOnSuccess} onError={mockOnError} />);

        const input = screen.getByLabelText(/Descreva a transação naturalmente/i);
        expect(input).toBeDisabled();

        const button = screen.getByRole('button', { name: /Analisando.../i });
        expect(button).toBeDisabled();
    });

    it('deve chamar onSuccess e limpar o input quando a mutação for bem sucedida', async () => {
        render(<NaturalLanguageInput onSuccess={mockOnSuccess} onError={mockOnError} />);


        mockMutate.mockImplementation((text, options) => {
            options.onSuccess({ suggestion: { amount: 50 }, confidence: 'HIGH' });
        });

        const input = screen.getByLabelText(/Descreva a transação naturalmente/i);
        fireEvent.change(input, { target: { value: 'Gastei 50' } });

        const button = screen.getByRole('button', { name: /Analisar/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockOnSuccess).toHaveBeenCalledWith({ suggestion: { amount: 50 }, confidence: 'HIGH' });
            expect(input).toHaveValue('');
        });
    });

    it('deve chamar onError quando a mutação falhar', async () => {
        render(<NaturalLanguageInput onSuccess={mockOnSuccess} onError={mockOnError} />);

        mockMutate.mockImplementation((text, options) => {
            options.onError(new Error('Erro 503'));
        });

        const input = screen.getByLabelText(/Descreva a transação naturalmente/i);
        fireEvent.change(input, { target: { value: 'texto inválido' } });

        const button = screen.getByRole('button', { name: /Analisar/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockOnError).toHaveBeenCalled();

            expect(input).toHaveValue('texto inválido');
        });
    });
});