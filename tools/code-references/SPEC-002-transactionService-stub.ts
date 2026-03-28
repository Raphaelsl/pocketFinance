/**
 * SPEC-002 Code Reference
 * File: src/services/transactionService.ts
 *
 * Serviço stub (vazio) em SPEC-002.
 * Cada método será implementado conforme o card avança.
 *
 * ✅ Arquivo criado em C1, implementações em C2-C5
 */

import {
  PagedResponse,
  Transaction,
  TransactionCreateRequest,
  TransactionUpdateRequest,
} from '@/types/transaction'

// Pegar a URL base do .env.local
// NEXT_PUBLIC_API_URL=http://localhost:8080
const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * 🧠 Por que process.env.NEXT_PUBLIC_API_URL?
 *
 * NEXT_PUBLIC_ = variável acessível no browser
 * Útil para: mudar URL entre dev/prod sem refatorar código
 *
 * Em .env.local: NEXT_PUBLIC_API_URL=http://localhost:8080
 * Em .env.prod:  NEXT_PUBLIC_API_URL=https://api.pocketfinance.com
 */

export const transactionService = {
  /**
   * Listar transações com paginação
   * @param page - página (0-based)
   * @param size - items por página
   * @returns PagedResponse com array de Transactions
   *
   * Implementado em: SPEC-003 (C2)
   */
  list: async (page = 0, size = 10): Promise<PagedResponse<Transaction>> => {
    // TODO: Implementar em C2
    throw new Error('Not implemented')
  },

  /**
   * Buscar 1 transação por ID
   * @param id - UUID da transação
   * @returns 1 Transaction
   *
   * Implementado em: SPEC-005 (C4)
   */
  getById: async (id: string): Promise<Transaction> => {
    // TODO: Implementar em C4
    throw new Error('Not implemented')
  },

  /**
   * Criar nova transação
   * @param data - Campos da transação (sem id, createdAt, updatedAt)
   * @returns Transaction criada (com id, createdAt, updatedAt do backend)
   *
   * Implementado em: SPEC-004 (C3)
   */
  create: async (data: TransactionCreateRequest): Promise<Transaction> => {
    // TODO: Implementar em C3
    throw new Error('Not implemented')
  },

  /**
   * Atualizar transação existente
   * @param id - UUID da transação
   * @param data - Campos a atualizar
   * @returns Transaction atualizada
   *
   * Implementado em: SPEC-005 (C4)
   */
  update: async (
    id: string,
    data: TransactionUpdateRequest
  ): Promise<Transaction> => {
    // TODO: Implementar em C4
    throw new Error('Not implemented')
  },

  /**
   * Deletar transação
   * @param id - UUID da transação
   * @returns void (204 No Content)
   *
   * Implementado em: SPEC-006 (C5)
   */
  delete: async (id: string): Promise<void> => {
    // TODO: Implementar em C5
    throw new Error('Not implemented')
  },
}

/**
 * 🧠 Por que um objeto com métodos?
 *
 * ❌ Ruim:
 * export async function listTransactions() { ... }
 * export async function createTransaction() { ... }
 * Sem organização, fica caotico
 *
 * ✅ Bom:
 * transactionService.list()
 * transactionService.create()
 * Tudo junto, relacionado, fácil de encontrar
 */
