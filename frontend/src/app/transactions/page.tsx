'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import {transactionService} from "@/services/transactionService";
import TransactionItem from '@/components/TransactionItem';
import Button from "@/components/Button";



export default function TransactionsPage() {

    //UserStates
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);

    useEffect(() => {
        //func assincrona interna
        const fetchTransactions = async () => {
            try {
                // Avisa a tela que começou a buscar e limpa erros antigos
                setLoading(true);
                setError(null);

                //Chama o Service
                const response = await transactionService.list(page, 10);

                // guardando a lista no estado
                setTransactions(response.content);

            } catch (err) {
                //Qualquer erro(ate quando estiver desligado)
                setError('Não foi possível carregar as transações.');
                console.error(err);

            } finally {
                //fim do carregamento(de qlqr forma)
                setLoading(false);
            }
        };
        // chamada normal
        fetchTransactions();

    }, [page]);

    return (
        <main className="container mx-auto p-6 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Minhas Transações</h1>
            {/* Forçando o Tailwind a compilar essas cores: bg-blue-600 hover:bg-blue-700 bg-gray-300 text-gray-700 text-white */}

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-col divide-y">
                    {/* 3. Percorremos a lista e renderizamos o componente criado na Subtask 2 */}
                    {transactions.map((t) => (
                        <TransactionItem key={t.id} transaction={t} />
                    ))}
                    {/* A barra de paginação agora é 100% React nativo! */}
                    <div className="p-4 flex justify-between items-center bg-gray-50 border-t mt-4">

                        <Button
                            text="Anterior"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 0 || loading}
                        />

                        <span className="text-sm text-gray-600 font-medium">
                            Página {page + 1}
                        </span>

                        <Button
                            text="Próxima"
                            // A lógica limpa: se não tem 10 itens, desabilita. Se tentar clicar, o próprio React+HTML bloqueia.
                            onClick={() => setPage(page + 1)}
                            disabled={loading || transactions.length < 10}
                        />

                    </div>


                    {transactions.length === 0 && !loading && (
                        <p className="p-10 text-center text-gray-500">Nenhuma transação encontrada.</p>
                    )}
                </div>
            </div>


        </main>

    );
}