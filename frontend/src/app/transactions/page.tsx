'use client';

import {useState} from 'react';
import TransactionItem from '@/components/TransactionItem';
import Button from "@/components/Button";
import {useTransactions} from "@/hooks/useTransactions";
import Link from "next/link";



export default function TransactionsPage() {

    // A tela só controla em qual página estamos
    const [page, setPage] = useState<number>(0);

    // Puxa os dados Custom Hook
    const {transactions, loading, error, totalPages} = useTransactions(page);
    const hasNextPage = page < totalPages - 1;

    // ==========================================
    // EARLY RETURNS
    // ==========================================
    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 px-4 py-10">
                <p className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-8 text-center font-medium text-slate-500 shadow-sm">
                    Carregando transações...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-slate-50 px-4 py-10">
                <p className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 p-8 text-center font-medium text-red-700">
                    {error}
                </p>
            </main>
        );
    }

    // ==========================================
    // RENDER PRINCIPAL
    // ==========================================
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10">
            <section className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Financeiro</p>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Minhas transações</h1>
                    </div>

                    <Link
                        href="/transactions/new"
                        className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                    >
                        Nova transação
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col divide-y divide-slate-100">

                    {transactions.map((t) => (
                        <TransactionItem key={t.id} transaction={t}/>
                    ))}

                    {transactions.length === 0 && (
                        <p className="p-10 text-center text-sm font-medium text-slate-500">Nenhuma transação encontrada nesta página.</p>
                    )}

                    {/* Barra de paginação */}
                    <div className="flex items-center justify-between bg-slate-50 p-4">
                        <Button
                            text="Anterior"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 0}
                        />

                        <span className="text-sm text-gray-600 font-medium">
                            Página {page + 1} de {totalPages || 1}
                        </span>

                        <Button
                            text="Próxima"
                            onClick={() => setPage(page + 1)}
                            disabled={!hasNextPage}
                        />
                    </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
