'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import {transactionService} from "@/services/transactionService";
import TransactionItem from '@/components/TransactionItem';
import '@/web-components/MeuBotao';
//  ignora a regra de namespace aqui
/* eslint-disable @typescript-eslint/no-namespace */

// Injeta a tag diretamente dentro do módulo do React (Padrão moderno)
declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'meu-botao-novo': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                texto?: string;
                disabled?: boolean | string | undefined;
            };
        }
    }
}

export default function TransactionsPage() {

    //UserStates
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                    {isMounted && (
                    <div className="p-4 flex justify-between items-center bg-gray-50 border-t mt-4">

                        <meu-botao-novo
                            texto="Anterior"
                            onClick={()=>{
                                if(page > 0 && !loading) {
                                    setPage(page - 1);
                        }}}
                            // Usamos undefined em vez de false, para o React remover o atributo do HTML
                            disabled={page === 0 || loading ? true : undefined}
                        ></meu-botao-novo>

                        <span className="text-sm text-blue-700 font-medium">
                            Página {page + 1}
                        </span>


                        <meu-botao-novo
                            texto="Próxima"
                            onClick={()=>{
                                if(!loading && transactions.length === 10) {
                                    setPage(page + 1);
                                }}}
                            disabled={loading || transactions.length < 10 ? true : undefined}
                        ></meu-botao-novo>

                    </div>)}

                    {transactions.length === 0 && !loading && (
                        <p className="p-10 text-center text-gray-500">Nenhuma transação encontrada.</p>
                    )}
                </div>
            </div>


        </main>

    );
}