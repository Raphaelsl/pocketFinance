import { useQuery } from '@tanstack/react-query';
import { transactionService } from '@/services/transactionService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

//dicionario
export const transactionKeys = {
    all: ['transactions'],
    list: (page: number) => ['transactions', 'list', page],
    detail: (id: string) => ['transactions', 'detail', id],
};

export function useTransactions(page: number) {
    const { data, isLoading, isError } = useQuery({

        queryKey: transactionKeys.list(page),
        queryFn: () => transactionService.list(page, 10),
    });

    return {
        transactions: data?.content || [],
        loading: isLoading,
        error: isError ? 'Não foi possível carregar as transações.' : null,
        totalPages: data?.totalPages || 0,
    };
}
export function useDeleteTransaction() {
    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: (id: string) => transactionService.delete(id),
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
        },

    });
}