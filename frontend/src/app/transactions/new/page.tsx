'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCreateTransaction } from '@/hooks/useTransactions';
import { TransactionType, TransactionCreateRequest } from '@/types/transaction';
import { useQueryClient } from '@tanstack/react-query';
import { NaturalLanguageInput } from '@/components/ai/NaturalLanguageInput';
import { SuggestResponse } from '@/services/transactionService';


export default function NewTransactionsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const createMutation = useCreateTransaction();

    const [aiFeedback, setAiFeedback] = useState<{
        type: 'SUCCESS' | 'ERROR';
        confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
        message: string;
        rawInput?: string;
    } | null>(null);


    const { register, handleSubmit,reset, formState: { errors } } = useForm<TransactionCreateRequest>({
        defaultValues: {
            type: TransactionType.EXPENSE,
            currency: 'BRL',
        }
    });
    const handleAiSuccess = (data: SuggestResponse) => {

        let formattedDate = data.suggestion.occurredAt;
        if (formattedDate.includes('T')) {
            formattedDate = formattedDate.slice(0, 16);
        } else {
            formattedDate = `${formattedDate}T12:00`;
        }

        reset({
            amount: data.suggestion.amount,
            type: data.suggestion.type as unknown as TransactionType,
            currency: data.suggestion.currency || 'BRL',
            description: data.suggestion.description,
            occurredAt: formattedDate,
        });


        setAiFeedback({
            type: 'SUCCESS',
            confidence: data.confidence,
            message: 'Formulário preenchido. Por favor, revise os dados antes de salvar.',
            rawInput: data.rawInput,
        });
    };
    const handleAiError = (error: Error) => {
        reset({ type: TransactionType.EXPENSE, currency: 'BRL' }); // Limpa o form para o estado inicial

        const errorMessage = error.message.includes("503")
            ? "Serviço indisponível. Use o formulário abaixo."
            : "Não foi possível entender a transação. Verifique o texto e tente novamente.";

        setAiFeedback({
            type: 'ERROR',
            message: errorMessage,
        });
    };
    const handleClearSuggestion = () => {
        reset({
            amount: '' as unknown as number,
            description: '',
            occurredAt: '',
            type: TransactionType.EXPENSE,
            currency: 'BRL'
        });
        setAiFeedback(null);
    };


    const onSubmit = (data: TransactionCreateRequest) => {
        if (aiFeedback?.type === 'SUCCESS') {
            data.metadata = JSON.stringify({
                source: "LLM",
                model: "gpt-4o-mini",
                rawInput: aiFeedback.rawInput,
                confidence: aiFeedback.confidence
            });
        }
        createMutation.mutate(data, {
            onSuccess: async () => {

                await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                await queryClient.invalidateQueries({ queryKey: ['transactions'] });


                router.push('/transactions');
                router.refresh();
            }
        });
    };

    return (
        <main className="container mx-auto max-w-3xl p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Nova Transação</h1>
                    <p className="mt-1 text-sm text-white">
                        Preencha os dados abaixo para adicionar uma transação.
                    </p>
                </div>
            </div>
            <NaturalLanguageInput onSuccess={handleAiSuccess} onError={handleAiError} />

            {aiFeedback && (
                <div className={`mb-6 p-4 rounded-xl border ${
                    aiFeedback.type === 'ERROR' ? 'bg-red-50 border-red-200 text-red-800' :
                        aiFeedback.confidence === 'HIGH' ? 'bg-green-50 border-green-200 text-green-800' :
                            'bg-yellow-50 border-yellow-200 text-yellow-800'
                }`}>
                    <p className="text-sm font-medium">
                        {aiFeedback.type === 'SUCCESS' && (
                            <span className="mr-2 font-bold uppercase">
                                {aiFeedback.confidence === 'HIGH' ? '🟢' : '🟡'} CONFIANÇA {aiFeedback.confidence} -
                            </span>
                        )}
                        {aiFeedback.message}
                    </p>
                    {aiFeedback.type === 'SUCCESS' && (
                        <button
                            type="button"
                            onClick={handleClearSuggestion}
                            className="ml-4 text-sm font-semibold underline opacity-80 hover:opacity-100 transition-opacity"
                        >
                            Limpar sugestão
                        </button>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border bg-white p-6 shadow-sm">

                {createMutation.isError && (
                    <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        Erro ao criar transação. Tente novamente.
                    </p>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Valor
                        </label>
                        <input
                            id="amount"
                            type="number"
                            step="0.01"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="0.00"
                            aria-invalid={errors.amount ? "true" : "false"}
                            aria-describedby={errors.amount ? "amount-error" : undefined}
                            {...register('amount', {
                                required: 'Valor é obrigatório',
                                min: { value: 0.01, message: 'Valor deve ser maior que zero' },
                            })}
                        />
                        {errors.amount && <p id="amount-error" role="alert" className="text-sm text-red-600">{errors.amount.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Tipo
                        </label>
                        <select
                            id="type"
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            aria-invalid={errors.type ? "true" : "false"}
                            aria-describedby={errors.type ? "type-error" : undefined}
                            {...register('type', { required: 'Tipo é obrigatório' })}
                        >
                            <option value={TransactionType.EXPENSE}>EXPENSE</option>
                            <option value={TransactionType.INCOME}>INCOME</option>
                        </select>
                        {errors.type && <p id="type-error" role="alert" className="text-sm text-red-600">{errors.type.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                            Moeda
                        </label>
                        <input
                            id="currency"
                            type="text"
                            maxLength={3}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="BRL"
                            aria-invalid={errors.currency ? "true" : "false"}
                            aria-describedby={errors.currency ? "currency-error" : undefined}
                            {...register('currency', {
                                required: 'Moeda é obrigatória',
                                pattern: { value: /^[A-Za-z]{3}$/, message: 'Moeda deve ter 3 letras (ex: BRL)' }
                            })}
                        />
                        {errors.currency && <p id="currency-error" role="alert" className="text-sm text-red-600">{errors.currency.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="occurredAt" className="block text-sm font-medium text-gray-700">
                            Data e hora
                        </label>
                        <input
                            id="occurredAt"
                            type="datetime-local"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            aria-invalid={errors.occurredAt ? "true" : "false"}
                            aria-describedby={errors.occurredAt ? "occurredAt-error" : undefined}
                            {...register('occurredAt', { required: 'Data é obrigatória' })}
                        />
                        {errors.occurredAt && <p id="occurredAt-error" role="alert" className="text-sm text-red-600">{errors.occurredAt.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descrição
                    </label>
                    <input
                        id="description"
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Ex: Compra no mercado"
                        aria-invalid={errors.description ? "true" : "false"}
                        aria-describedby={errors.description ? "description-error" : undefined}
                        {...register('description', { required: 'Descrição é obrigatória' })}
                    />
                    {errors.description && <p id="description-error" role="alert" className="text-sm text-red-600">{errors.description.message}</p>}
                </div>

                <div className="flex items-center justify-end gap-3 border-t pt-4">
                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {createMutation.isPending ? 'Criando...' : 'Criar transação'}
                    </button>
                </div>
            </form>
        </main>
    );
}