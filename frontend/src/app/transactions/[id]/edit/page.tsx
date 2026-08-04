'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { transactionService } from '@/services/transactionService';
import { TransactionUpdateRequest, TransactionType } from '@/types/transaction';
import { useEffect } from 'react';
import { useUpdateTransaction, transactionKeys } from '@/hooks/useTransactions';

export default function EditTransactionPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();


    const { data: transaction, isLoading, error } = useQuery({
        queryKey: transactionKeys.detail(id),
        queryFn: () => transactionService.getById(id),
    });


    const { register, handleSubmit, reset, formState: { errors } } = useForm<TransactionUpdateRequest>();


    useEffect(() => {
        if (transaction) {
            reset({
                amount: transaction.amount,
                type: transaction.type,
                currency: transaction.currency,
                description: transaction.description,
                occurredAt: transaction.occurredAt.substring(0, 16),
            });
        }
    }, [transaction, reset]);


    const updateMutation = useUpdateTransaction(id);
    const onSubmit = (data: TransactionUpdateRequest) => {
        updateMutation.mutate(data, {
            onSuccess: () => {
                router.push('/transactions');
                router.refresh();
            }
        });
    };


    if (isLoading) {
        return (
            <main className="container mx-auto max-w-3xl p-6 text-white">
                {/* role="status" avisa o leitor de tela que algo está carregando */}
                <p role="status" aria-live="polite">Carregando transação...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container mx-auto max-w-3xl p-6">
                {/* role="alert" avisa o leitor de tela imediatamente sobre o erro */}
                <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    Erro ao carregar a transação. Ela pode não existir mais.
                </p>
            </main>
        );
    }

    return (
        <main className="container mx-auto max-w-3xl p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Editar Transação</h1>
                    <p className="mt-1 text-sm text-white">
                        Altere os dados abaixo para atualizar a transação.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border bg-white p-6 shadow-sm">
                {updateMutation.isError && (
                    <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        Erro ao salvar alterações.
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
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            aria-invalid={errors.amount ? "true" : "false"}
                            aria-describedby={errors.amount ? "amount-error" : undefined}
                            {...register('amount', { required: 'Valor é obrigatório', min: { value: 0.01, message: 'Deve ser maior que zero' } })}
                        />
                        {errors.amount && <p id="amount-error" role="alert" className="text-sm text-red-600">{errors.amount.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Tipo
                        </label>
                        <select
                            id="type"
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            aria-invalid={errors.type ? "true" : "false"}
                            aria-describedby={errors.type ? "type-error" : undefined}
                            {...register('type', { required: 'Tipo é obrigatório' })}
                        >
                            <option value="">Selecione...</option>
                            <option value={TransactionType.EXPENSE}>EXPENSE</option>
                            <option value={TransactionType.INCOME}>INCOME</option>
                        </select>
                        {errors.type && <p id="type-error" role="alert" className="text-sm text-red-600">{errors.type.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                            Moeda
                        </label>
                        <input
                            id="currency"
                            type="text"
                            maxLength={3}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            aria-invalid={errors.currency ? "true" : "false"}
                            aria-describedby={errors.currency ? "currency-error" : undefined}
                            {...register('currency', {
                                required: 'Moeda é obrigatória',
                                pattern: { value: /^[A-Za-z]{3}$/, message: 'Deve ter 3 letras (ex: BRL)' }
                            })}
                        />
                        {errors.currency && <p id="currency-error" role="alert" className="text-sm text-red-600">{errors.currency.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="occurredAt" className="block text-sm font-medium text-gray-700">
                            Data e hora
                        </label>
                        <input
                            id="occurredAt"
                            type="datetime-local"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            aria-invalid={errors.occurredAt ? "true" : "false"}
                            aria-describedby={errors.occurredAt ? "occurredAt-error" : undefined}
                            {...register('occurredAt', { required: 'Data é obrigatória' })}
                        />
                        {errors.occurredAt && <p id="occurredAt-error" role="alert" className="text-sm text-red-600">{errors.occurredAt.message as string}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descrição
                    </label>
                    <input
                        id="description"
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        aria-invalid={errors.description ? "true" : "false"}
                        aria-describedby={errors.description ? "description-error" : undefined}
                        {...register('description', { required: 'Descrição é obrigatória' })}
                    />
                    {errors.description && <p id="description-error" role="alert" className="text-sm text-red-600">{errors.description.message as string}</p>}
                </div>

                <div className="flex items-center justify-end gap-3 border-t pt-4">
                    <button
                        type="button"
                        onClick={() => router.push('/transactions')}
                        className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {updateMutation.isPending ? 'Salvando...' : 'Salvar transação'}
                    </button>
                </div>
            </form>
        </main>
    );
}