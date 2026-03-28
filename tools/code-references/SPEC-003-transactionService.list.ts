/**
 * SPEC-003 Code Reference
 * File: src/services/transactionService.ts
 *
 * Implementação do método list() - parte do transactionService
 *
 * ⚠️ Este é apenas o método list().
 * O arquivo completo já tem os outros métodos como stubs.
 */

import { PagedResponse, Transaction } from '@/types/transaction'

const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Implementação do transactionService.list
 * Substitui o throw de SPEC-002
 */
export const transactionService = {
  list: async (page = 0, size = 10): Promise<PagedResponse<Transaction>> => {
    /**
     * Passo 1: Construir URL com query params
     * /api/transactions?page=0&size=10
     */
    const url = `${API_URL}/api/transactions?page=${page}&size=${size}`

    /**
     * Passo 2: Fazer requisição fetch
     * fetch() retorna uma Promise
     */
    const response = await fetch(url)

    /**
     * Passo 3: Verificar se deu erro HTTP
     * response.ok = true se status 200-299
     * response.ok = false se status 400+
     */
    if (!response.ok) {
      throw new Error('Erro ao carregar transações')
    }

    /**
     * Passo 4: Parse JSON
     * response.json() retorna Promise<any>
     * TypeScript infere que é PagedResponse<Transaction>
     */
    const data: PagedResponse<Transaction> = await response.json()

    /**
     * Passo 5: Retornar dados
     * Dev que chama este método recebe PagedResponse
     */
    return data
  },

  // ... outros métodos ainda como throw (C3, C4, C5)
}

/**
 * 🧠 Fluxo de execução:
 *
 * 1. transactionService.list(0, 10) é chamado
 * 2. await fetch() → aguarda resposta do servidor
 * 3. response.ok check → se não OK, throw error
 * 4. await response.json() → converte para objeto JS
 * 5. return data → retorna PagedResponse<Transaction>
 *
 * ⚠️ Armadilhas comuns:
 *
 * ❌ Ruim: não checar response.ok
 *    fetch() NÃO lança erro em 404/500
 *    Você recebe a resposta de erro, não uma Exception
 *
 * ❌ Ruim: esquecer await
 *    const data = response.json()  // retorna Promise, não o JSON!
 *    const data = await response.json()  // correto
 *
 * ❌ Ruim: colocar lógica de UI aqui
 *    Service é SÓ para chamar API
 *    useState, loading state = responsabilidade do componente
 */
