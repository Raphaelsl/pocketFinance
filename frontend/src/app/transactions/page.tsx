'use client';

import {useState} from 'react';
import TransactionItem from '@/components/TransactionItem';
import Button from "@/components/Button";
import {useTransactions} from "@/hooks/useTransactions";


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
        return <p className="p-10 text-center text-gray-400 font-bold mt-20">Carregando transações...</p>;
    }

    if (error) {
        return <p className="p-10 text-center text-red-500 font-bold mt-20">{error}</p>;
    }

    // ==========================================
    // RENDER PRINCIPAL
    // ==========================================
    return (
        <main className="container mx-auto p-6 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Minhas Transações</h1>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-col divide-y">

                    {transactions.map((t) => (
                        <TransactionItem key={t.id} transaction={t}/>
                    ))}

                    {transactions.length === 0 && (
                        <p className="p-10 text-center text-gray-500">Nenhuma transação encontrada nesta página.</p>
                    )}

                    {/* Barra de paginação */}
                    <div className="p-4 flex justify-between items-center bg-gray-50 border-t mt-4">
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
        </main>
    );
}