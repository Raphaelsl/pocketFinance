import { PagedResponse, Transaction, TransactionCreateRequest, TransactionUpdateRequest } from '@/types/transaction'


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface SuggestionRequest{
  input: string;
}
export interface TransactionSuggestion{
  amount: number;
  type: 'INCOME'|'EXPENSE';
  currency: string;
  description: string;
  occurredAt: string;
  suggestedCategoryName: string;
  confidence: 'LOW'|'MEDIUM'|'HIGH';
}
export interface SuggestResponse{
  suggestion: TransactionSuggestion;
  confidence: 'LOW'|'MEDIUM'|'HIGH';
  rawInput: string;
}

export const transactionService = {
  list: async (page = 0, size = 10): Promise<PagedResponse<Transaction>> => {
    const response =  await fetch(`${API_URL}/transactions?page=${page}&size=${size}`);
    //async: promessa de entrega
    //await : espera o resultado
    if(!response.ok){
      throw new Error("Erro ao carregar a Transação");
    }
    return response.json();
  },


  getById: async (id: string): Promise<Transaction> => {
    const response = await fetch(`${API_URL}/transactions/${id}`);
    if (!response.ok) {
      throw new Error('Transação não encontrada');
    }
    return response.json();
  },

  create: async (data: TransactionCreateRequest): Promise<Transaction> => {
    const response = await fetch(`${API_URL}/transactions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if(!response.ok){
      throw new Error("Erro ao criar a Transação");
    }
    return response.json();
  },


  update: async (id: string, data: TransactionUpdateRequest): Promise<Transaction> => {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar transação');
    }
    return response.json();
  },


  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir transação');
    }
  },
  suggestTransaction: async (input: string): Promise<SuggestResponse> => {
    const response =  await fetch(`${API_URL}/transactions/suggest`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });
    if (!response.ok){
      throw new Error('Erro ao excluir suggest');
    }
    return response.json();
  }
}

