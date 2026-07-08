import { useQuery } from '@tanstack/react-query';
import { transactionService } from '@/services/transactionService';

export function useTransactions(page: number) {
        const { data, isLoading, isError } = useQuery({

            queryKey: ['transactions', page],
            queryFn: () => transactionService.list(page, 10),
        });


        return {
            transactions: data?.content || [],
            loading: isLoading,
            error: isError ? 'Não foi possível carregar as transações.' : null,
            totalPages: data?.totalPages || 0,
        };
}