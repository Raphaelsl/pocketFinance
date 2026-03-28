/**
 * SPEC-004 Code Reference
 * File: src/services/transactionService.ts
 *
 * Implementação do método create() - parte do transactionService
 */

import { Transaction, TransactionCreateRequest } from '@/types/transaction'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const transactionService = {
  create: async (data: TransactionCreateRequest): Promise<Transaction> => {
    /**
     * Passo 1: Construir URL
     * POST sempre usa /recurso (sem query params)
     */
    const url = `${API_URL}/api/transactions`

    /**
     * Passo 2: Fazer requisição com método POST
     * fetch() com opções:
     * - method: 'POST'
     * - headers: Content-Type application/json (precisa serializar JSON)
     * - body: JSON.stringify(data)
     */
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    /**
     * Passo 3: Verificar sucesso/erro
     */
    if (!response.ok) {
      throw new Error('Erro ao criar transação')
    }

    /**
     * Passo 4: Converter resposta para objeto
     * Backend retorna 201 Created com a Transaction criada
     */
    const created: Transaction = await response.json()

    /**
     * Passo 5: Retornar Transaction
     */
    return created
  },

  // ... outros métodos ainda como throw (C2, C4, C5)
}

/**
 * 🧠 Diferenças GET vs POST:
 *
 * GET /api/transactions?page=0
 *   - método: GET (padrão, ou explicit)
 *   - sem body
 *   - params na URL
 *
 * POST /api/transactions
 *   - método: POST
 *   - headers: Content-Type: application/json
 *   - body: JSON.stringify(data)
 *
 * ⚠️ Armadilhas comuns:
 *
 * ❌ Ruim: esquecer JSON.stringify()
 *    body: data  // JS object, não é JSON string!
 *    Erro: "body must be a string"
 *
 * ❌ Ruim: esquecer headers
 *    Backend não sabe que é JSON, pode rejeitar
 *
 * ❌ Ruim: colocar validação aqui
 *    "Se data.amount <= 0, throw"
 *    Validação = responsabilidade do componente, não service
 *    Service SÓ chama API
 */
