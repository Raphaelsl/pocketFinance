/**
 * SPEC-003 Code Reference
 * File: src/app/transactions/page.tsx
 *
 * Página de listagem de transações.
 * Demonstra: useState, useEffect, fetch manual, paginação
 */

'use client'

import { useEffect, useState } from 'react'
import { transactionService } from '@/services/transactionService'
import { PagedResponse, Transaction } from '@/types/transaction'
import { TransactionItem } from '@/components/TransactionItem'

export default function TransactionsPage() {
  /**
   * Estado 1: Dados da resposta
   * null = nenhum dado ainda (estado inicial)
   * PagedResponse = dados completos com paginação
   */
  const [data, setData] = useState<PagedResponse<Transaction> | null>(null)

  /**
   * Estado 2: Flag de carregamento
   * true = esperando resposta
   * false = resposta chegou (sucesso ou erro)
   */
  const [loading, setLoading] = useState(true)

  /**
   * Estado 3: Mensagem de erro
   * null = tudo OK
   * string = mensagem de erro para exibir
   */
  const [error, setError] = useState<string | null>(null)

  /**
   * Estado 4: Página atual
   * 0 = primeira página (0-based)
   * incrementa com botões Próximo/Anterior
   */
  const [page, setPage] = useState(0)

  /**
   * EFEITO: Carregar dados quando página muda
   *
   * Dependência: [page]
   * Significa: roda toda vez que 'page' muda
   *
   * Passo a passo:
   * 1. setLoading(true) = mostra "Carregando..."
   * 2. setError(null) = limpa erro anterior
   * 3. transactionService.list(page) = fetch
   * 4. .then(setData) = sucesso: salva dados
   * 5. .catch(err => setError(err.message)) = erro: salva mensagem
   * 6. .finally(() => setLoading(false)) = sempre: esconde "Carregando..."
   */
  useEffect(() => {
    setLoading(true)
    setError(null)

    transactionService
      .list(page)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [page])  // ← dependência: roda quando page muda

  /**
   * Estado de carregamento
   * Mostra enquanto fetch não termina
   */
  if (loading) return <p>Carregando...</p>

  /**
   * Estado de erro
   * Se houver erro, mostra mensagem
   */
  if (error) return <p className="text-red-500">{error}</p>

  /**
   * Estado vazio
   * Se dados carregaram mas lista está vazia
   */
  if (!data || data.content.length === 0) {
    return <p>Nenhuma transação encontrada.</p>
  }

  /**
   * Renderizar tabela
   */
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Transações</h1>

      {/* Tabela com transações */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-right">Amount</th>
            <th className="border p-2 text-left">Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.content.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-6">
        {/* Botão Anterior */}
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={data.first}  // desabilita se é primeira página
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          ← Anterior
        </button>

        {/* Número da página */}
        <span>
          Página {data.page + 1} de {data.totalPages}
        </span>

        {/* Botão Próximo */}
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={data.last}  // desabilita se é última página
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Próximo →
        </button>
      </div>
    </div>
  )
}

/**
 * 🧠 O que o Dev aprende:
 *
 * ✅ useState: 4 estados diferentes
 * ✅ useEffect: dependência [page] = roda quando page muda
 * ✅ fetch manual: .then().catch().finally()
 * ✅ Condicional: if (loading) if (error) if (empty)
 * ✅ Paginação: botões habilitados/desabilitados conforme estado
 *
 * ⚠️ Problema que ele vai SENTIR:
 *
 * "4 useState só pra carregar lista?
 *  Se tiver 10 endpoints, vou ter 40 useState?
 *  E se esquecer de chamar setLoading(false)?
 *  Isso fica carregando pra sempre..."
 *
 * Resposta TL em C4:
 * "Exatamente. React Query resolve TUDO com 1 hook: useQuery()"
 */
