/**
 * SPEC-003 Code Reference
 * File: src/components/TransactionItem.tsx
 *
 * Componente que renderiza 1 item da lista (1 linha da tabela)
 */

import { Transaction } from '@/types/transaction'

/**
 * Props do componente
 * Recebe 1 transação e renderiza
 */
interface Props {
  transaction: Transaction
}

export function TransactionItem({ transaction }: Props) {
  /**
   * Formatar data
   * "2024-03-03T10:30:00Z" → "03/03/2024"
   */
  const formattedDate = new Date(transaction.occurredAt).toLocaleDateString(
    'pt-BR'
  )

  return (
    <tr className="border hover:bg-gray-100">
      {/* Descrição */}
      <td className="border p-2">{transaction.description}</td>

      {/* Valor */}
      <td className="border p-2 text-right">
        {transaction.currency} {transaction.amount.toFixed(2)}
      </td>

      {/* Data */}
      <td className="border p-2">{formattedDate}</td>

      {/* Botões (sem funcionalidade ainda) */}
      <td className="border p-2 text-center space-x-2">
        <button className="px-2 py-1 bg-blue-500 text-white rounded text-sm">
          Editar
        </button>
        <button className="px-2 py-1 bg-red-500 text-white rounded text-sm">
          Deletar
        </button>
      </td>
    </tr>
  )
}

/**
 * 🧠 Props Pattern:
 *
 * Props = argumentos passados para componente
 * Como função normal:
 *   function myFunction(name: string) { ... }
 *   myFunction('João')
 *
 * Como componente:
 *   function TransactionItem({ transaction }: Props) { ... }
 *   <TransactionItem transaction={t} />
 *
 * Destructuring: { transaction } extrai campo do objeto Props
 *
 * 💡 Por que separar em componente?
 *
 * ❌ Sem separar:
 * TransactionsPage renderiza tudo na mesma função = muita lógica
 *
 * ✅ Com separar:
 * TransactionsPage = orquestra (lista, paginação)
 * TransactionItem = renderiza 1 item
 * Responsabilidades separadas = código mais limpo
 *
 * 🎯 Em C5:
 * TransactionItem vai receber prop onDelete() para deletar
 * Nenhuma mudança estrutural, só adiciona funcionalidade
 */
