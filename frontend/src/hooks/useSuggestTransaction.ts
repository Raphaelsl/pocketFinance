import {useMutation} from "@tanstack/react-query";
import {transactionService, SuggestResponse} from "../services/transactionService";

export const useSuggestTransaction = () =>{
    return useMutation<SuggestResponse, Error, string>({
        mutationFn: (input: string) =>transactionService.suggestTransaction(input),
    });
};