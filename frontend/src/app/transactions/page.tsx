'use client';

import { useState } from 'react';
import { Transaction } from '@/types/transaction';
import TransactionItem from '@/components/TransactionItem';

// 1. Dados fictícios para testar o visual (Mock)
const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        description: 'Salário Mensal',
        amount: 2000.00,
        occurredAt: new Date().toISOString(),
        currency: 'BRL',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        categoryId: null,
        categoryName: null,
        metadata: null
    },
    {
        id: '2',
        description: 'Supermercado',
        amount: -350.25,
        occurredAt: new Date().toISOString(),
        currency: 'BRL',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        categoryId: null,
        categoryName: null,
        metadata: null
    },
    {
        id: '3',
        description: 'Assinaturas de Streaming',
        amount: -425.70,
        occurredAt: new Date().toISOString(),
        currency: 'BRL',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        categoryId: null,
        categoryName: null,
        metadata: null
    }
];

export default function TransactionsPage() {
    // 2. Iniciamos o estado já com os dados mockados para teste visual
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [loading, setLoading] = useState<boolean>(false); // Falso por enquanto para vermos o mock
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);

    return (
        <main className="container mx-auto p-6 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Minhas Transações</h1>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-col divide-y">
                    {/* 3. Percorremos a lista e renderizamos o componente criado na Subtask 2 */}
                    {transactions.map((t) => (
                        <TransactionItem key={t.id} transaction={t} />
                    ))}

                    {transactions.length === 0 && !loading && (
                        <p className="p-10 text-center text-gray-500">Nenhuma transação encontrada.</p>
                    )}
                </div>
            </div>
        </main>
    );
}