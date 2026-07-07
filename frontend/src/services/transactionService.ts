import { PagedResponse, Transaction, TransactionCreateRequest, TransactionUpdateRequest } from '@/types/transaction'


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById: async (id: string): Promise<Transaction> => {
    const response = await fetch(`${API_URL}/transactions/${id}`);
    if (!response.ok) {
      throw new Error('Transação não encontrada');
    }
    return response.json();
  },

  create: async (data: TransactionCreateRequest): Promise<Transaction> => {
    // Implementado em SPEC-004 (C3)
    // POST to /transactions endpoint
    const response = await fetch(`${API_URL}/transactions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if(!response.ok){
      throw new Error("Erro ao criar a Transação");
    }
    return response.json();
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir transação');
    }
  },
}
