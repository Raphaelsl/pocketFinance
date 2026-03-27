import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { transactionService } from '@/services/transactionService';

export function useTransactions(page: number) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await transactionService.list(page, 10);
                setTransactions(response.content);
                setTotalPages(response.totalPages);
            } catch (err) {
                setError('Não foi possível carregar as transações.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [page]);

    // Devolve para a tela apenas o que importa!
    return { transactions, loading, error, totalPages };
}