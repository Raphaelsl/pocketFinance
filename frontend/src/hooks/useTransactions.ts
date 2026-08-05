import { useQuery } from '@tanstack/react-query';
import { transactionService } from '@/services/transactionService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {TransactionCreateRequest, TransactionUpdateRequest} from '@/types/transaction';


//dicionario
export const transactionKeys = {
    all: ['transactions'],
    list: (page: number) => ['transactions', 'list', page],
    detail: (id: string) => ['transactions', 'detail', id],
};

export const normalizeTransactionPayload = (
    data: TransactionCreateRequest | TransactionUpdateRequest
) => {
    return {
        ...data,
        amount: Number(data.amount),
        currency: data.currency.trim().toUpperCase(),
        description: data.description.trim(),
        occurredAt: new Date(data.occurredAt).toISOString(),
    };
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
export function useUpdateTransaction(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TransactionUpdateRequest) => {
            const payloadFormatado = normalizeTransactionPayload(data);
            return transactionService.update(id, payloadFormatado);
        },
        onSuccess: () => {
            // inavalida lista e cache
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
            queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) });
        },
    });
}
export function useCreateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TransactionCreateRequest) => {

            const payloadFormatado = normalizeTransactionPayload(data);
            return transactionService.create(payloadFormatado);
        },
        onSuccess: () => {
            // Invalida a lista para a nova transação aparecer imediatamente
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
        },
    });
}
