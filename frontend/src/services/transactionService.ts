import { PagedResponse, Transaction, TransactionCreateRequest, TransactionUpdateRequest } from '@/types/transaction'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const transactionService = {
  list: async (page = 0, size = 10): Promise<PagedResponse<Transaction>> => {
    // Implementado em SPEC-003 (C2)
    throw new Error('Not implemented')
  },

  getById: async (id: string): Promise<Transaction> => {
    // Implementado em SPEC-005 (C4)
    throw new Error('Not implemented')
  },

  create: async (data: TransactionCreateRequest): Promise<Transaction> => {
    // Implementado em SPEC-004 (C3)
    throw new Error('Not implemented')
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
