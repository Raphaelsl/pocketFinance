'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCreateTransaction } from '@/hooks/useTransactions';
import { TransactionType, TransactionCreateRequest } from '@/types/transaction';
export default function NewTransactionsPage() {
    const router = useRouter();


    const createMutation = useCreateTransaction();


    const { register, handleSubmit, formState: { errors } } = useForm<TransactionCreateRequest>({
        defaultValues: {
            type: TransactionType.EXPENSE,
            currency: 'BRL',
        }
    });

    const onSubmit = (data: TransactionCreateRequest) => {
        createMutation.mutate(data, {
            onSuccess: () => {
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


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border bg-white p-6 shadow-sm">


                {createMutation.isError && (
                    <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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

                            {...register('amount', {
                                required: 'Valor é obrigatório',
                                min: { value: 0.01, message: 'Valor deve ser maior que zero' },
                                valueAsNumber: true
                            })}
                        />
                        {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Tipo
                        </label>
                        <select
                            id="type"
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            {...register('type', { required: 'Tipo é obrigatório' })}
                        >
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
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="BRL"
                            {...register('currency', {
                                required: 'Moeda é obrigatória',
                                pattern: { value: /^[A-Za-z]{3}$/, message: 'Moeda deve ter 3 letras (ex: BRL)' }
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
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Ex: Compra no mercado"
                        {...register('description', { required: 'Descrição é obrigatória' })}
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
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