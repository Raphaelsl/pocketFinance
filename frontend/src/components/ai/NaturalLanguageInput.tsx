import { useState } from 'react';
import { useSuggestTransaction } from '@/hooks/useSuggestTransaction';
import { SuggestResponse } from '@/services/transactionService';


interface NaturalLanguageInputProps {
    onSuccess: (data: SuggestResponse) => void;
    onError: (error: Error) => void;
}

export const NaturalLanguageInput = ({ onSuccess, onError }: NaturalLanguageInputProps) => {
    const [text, setText] = useState('');

    const { mutate, isPending } = useSuggestTransaction();

    const handleAnalyze = () => {
        if (!text.trim()) return;
        mutate(text, {
            onSuccess: (data) => {
                onSuccess(data);
                setText('');
            },
            onError: (error: Error) => {
                onError(error);
            }
        });
    };
    return (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50 border-gray-200">
            <label htmlFor="ai-input" className="block text-sm font-medium text-gray-700 mb-2">
                Descreva a transação naturalmente
            </label>
            <textarea
                id="ai-input"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Gastei 45,50 na padaria ontem..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isPending}
            />

            <button
                type="button"
                onClick={handleAnalyze}
                disabled={isPending || !text.trim()}
                className="mt-3 px-4 py-2 bg-blue-600 text-white font-medium rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center transition-colors"
            >
                {isPending ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analisando...
                    </>
                ) : (
                    'Analisar'
                )}
            </button>
        </div>
    );
};