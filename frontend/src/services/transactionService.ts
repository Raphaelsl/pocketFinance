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

  getById: async (id: string): Promise<Transaction> => {
    // Implementado em SPEC-005 (C4)
    throw new Error('Not implemented')
  },

  create: async (data: TransactionCreateRequest): Promise<Transaction> => {
    // Implementado em SPEC-004 (C3)
    const response = await fetch(API_URL, {method: 'POST', headers: {'Content-Type':'application/json' }, body: JSON.stringify(data)});
    if(!response.ok){
      throw new Error("Erro ao criar a Transação");
    }
    return response.json();
  },

  update: async (id: string, data: TransactionUpdateRequest): Promise<Transaction> => {
    // Implementado em SPEC-005 (C4)
    throw new Error('Not implemented')
  },

  delete: async (id: string): Promise<void> => {
    // Implementado em SPEC-006 (C5)
    throw new Error('Not implemented')
  },
}
