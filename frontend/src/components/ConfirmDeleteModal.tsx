import { useEffect } from 'react';
interface Props {
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
    error: string | null;
}

export function ConfirmDeleteModal({ description, onConfirm, onCancel, isLoading, error }: Props) {
    // Subtask 3: Fecha o modal ao pressionar a tecla Escape
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCancel();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onCancel]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg"
            >
                {/* ID conectado ao aria-labelledby */}
                <h2 id="modal-title" className="mb-2 text-xl font-bold text-gray-900">
                    Excluir transação
                </h2>

                {/* ID conectado ao aria-describedby */}
                <p id="modal-description" className="mb-6 text-sm text-gray-600">
                    Tem certeza que deseja excluir <strong>{description}</strong>? Esta ação não pode ser desfeita.
                </p>

                {error && (
                    <p
                        role="alert"
                        className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                        {error}
                    </p>
                )}

                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                    >
                        {isLoading ? 'Excluindo...' : 'Excluir'}
                    </button>
                </div>
            </div>
        </div>
    );
}