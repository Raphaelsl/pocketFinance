'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { transactionService } from '@/services/transactionService';
import { TransactionUpdateRequest, TransactionType } from '@/types/transaction';
import { useEffect } from 'react';

export default function EditTransactionPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    // 1. React Query: Busca os dados automaticamente com cache e loading
    const { data: transaction, isLoading, error } = useQuery({
        queryKey: ['transaction', id],
        queryFn: () => transactionService.getById(id),
    });

    // 2. React Hook Form
    const { register, handleSubmit, reset, formState: { errors } } = useForm<TransactionUpdateRequest>();


    useEffect(() => {
        if (transaction) {
            reset({
                amount: transaction.amount,
                type: transaction.type,
                currency: transaction.currency,
                description: transaction.description,
                // Corta os segundos/fuso para o input datetime-local aceitar (YYYY-MM-DDThh:mm)
                occurredAt: transaction.occurredAt.substring(0, 16),
            });
        }
    }, [transaction, reset]);

    // 4. React Query:
    const mutation = useMutation({
        mutationFn: (data: TransactionUpdateRequest) => transactionService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            router.push('/transactions');
            router.refresh();
        },
    });
    const onSubmit = (data: TransactionUpdateRequest) => {
        const normalizedPayload: TransactionUpdateRequest = {
            ...data,
            amount: Number(data.amount),
            currency: data.currency.trim().toUpperCase(),
            description: data.description.trim(),
            occurredAt: new Date(data.occurredAt).toISOString(),
        };

        mutation.mutate(normalizedPayload);
    };

    if (isLoading) {
        return (
            <main className="container mx-auto max-w-3xl p-6 text-white">
                <p>Carregando transação...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container mx-auto max-w-3xl p-6">
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
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
                {mutation.isError && (
                    <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
                            {...register('amount', { valueAsNumber: true })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            {...register('amount', { required: 'Valor é obrigatório', min: { value: 0.01, message: 'Deve ser maior que zero' } })}
                        />
                        {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Tipo
                        </label>
                        <select
                            id="type"
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            {...register('type', { required: 'Tipo é obrigatório' })}
                        >
                            <option value="">Selecione...</option>
                            <option value={TransactionType.EXPENSE}>EXPENSE</option>
                            <option value={TransactionType.INCOME}>INCOME</option>
                        </select>
                        {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
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
                            {...register('currency', {
                                required: 'Moeda é obrigatória',
                                pattern: { value: /^[A-Za-z]{3}$/, message: 'Deve ter 3 letras (ex: BRL)' }
                            })}
                        />
                        {errors.currency && <p className="text-sm text-red-600">{errors.currency.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="occurredAt" className="block text-sm font-medium text-gray-700">
                            Data e hora
                        </label>
                        <input
                            id="occurredAt"
                            type="datetime-local"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            {...register('occurredAt', { required: 'Data é obrigatória' })}
                        />
                        {errors.occurredAt && <p className="text-sm text-red-600">{errors.occurredAt.message}</p>}
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
                        {...register('description', { required: 'Descrição é obrigatória' })}
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
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
                        disabled={mutation.isPending}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {mutation.isPending ? 'Salvando...' : 'Salvar transação'}
                    </button>
                </div>
            </form>
        </main>
    );
}