'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { transactionService } from '@/services/transactionService';
import { TransactionType } from '@/types/transaction';

type FormErrors = {
    amount: string;
    type: string;
    currency: string;
    description: string;
    occurredAt: string;
};

type FormValues = {
    amount: string;
    type: TransactionType;
    currency: string;
    description: string;
    occurredAt: string;
};

const currencyPattern = /^[A-Z]{3}$/;

function normalizeCurrency(currency: string) {
    return currency.trim().toUpperCase();
}

function validateForm(values: FormValues): FormErrors {
    const normalizedCurrency = normalizeCurrency(values.currency);

    return {
        amount: values.amount.trim() ? '' : 'Valor é obrigatório',
        type: values.type ? '' : 'Tipo é obrigatório',
        currency: currencyPattern.test(normalizedCurrency)
            ? ''
            : 'Moeda deve ter 3 letras (ex: BRL)',
        description: values.description.trim() ? '' : 'Descrição é obrigatória',
        occurredAt: values.occurredAt.trim() ? '' : 'Data é obrigatória',
    };
}

export default function NewTransactionsPage() {
    const router = useRouter();

    const [amount, setAmount] = useState<string>('');
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [currency, setCurrency] = useState<string>('BRL');
    const [description, setDescription] = useState<string>('');
    const [occurredAt, setOccurredAt] = useState<string>('');
    const [errors, setErrors] = useState<FormErrors>({
        amount: '',
        type: '',
        currency: '',
        description: '',
        occurredAt: '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string>('');

    const validate = (): boolean => {
        const values: FormValues = { amount, type, currency, description, occurredAt };
        const newErrors = validateForm(values);

        setErrors(newErrors);
        return Object.values(newErrors).every((msg) => msg === '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');

        if (!validate()) {
            return;
        }

        const amountValue = Number(amount);

        if (!Number.isFinite(amountValue) || amountValue <= 0) {
            setErrors((current) => ({
                ...current,
                amount: 'Valor deve ser maior que zero',
            }));
            return;
        }

        setLoading(true);

        try {
            await transactionService.create({
                amount: amountValue,
                type,
                currency: normalizeCurrency(currency),
                description: description.trim(),
                occurredAt: new Date(occurredAt).toISOString(),
            });
            router.push('/transactions');
            router.refresh();
        } catch (err) {
            setApiError(err instanceof Error ? err.message : 'Erro ao criar transação');
        } finally {
            setLoading(false);
        }
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

            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-white p-6 shadow-sm">
                {apiError && (
                    <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {apiError}
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
                            inputMode="decimal"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            aria-invalid={Boolean(errors.amount)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="0,00"
                        />
                        {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Tipo
                        </label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value as TransactionType)}
                            aria-invalid={Boolean(errors.type)}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value={TransactionType.EXPENSE}>EXPENSE</option>
                            <option value={TransactionType.INCOME}>INCOME</option>
                        </select>
                        {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                            Moeda
                        </label>
                        <input
                            id="currency"
                            type="text"
                            maxLength={3}
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            aria-invalid={Boolean(errors.currency)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="BRL"
                        />
                        {errors.currency && <p className="text-sm text-red-600">{errors.currency}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="occurredAt" className="block text-sm font-medium text-gray-700">
                            Data e hora
                        </label>
                        <input
                            id="occurredAt"
                            type="datetime-local"
                            value={occurredAt}
                            onChange={(e) => setOccurredAt(e.target.value)}
                            aria-invalid={Boolean(errors.occurredAt)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        {errors.occurredAt && <p className="text-sm text-red-600">{errors.occurredAt}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descrição
                    </label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        aria-invalid={Boolean(errors.description)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Pagamento de serviço"
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                </div>

                <div className="flex items-center justify-end gap-3 border-t pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {loading ? 'Criando...' : 'Criar transação'}
                    </button>
                </div>
            </form>
        </main>
    );

}