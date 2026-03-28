/**
 * SPEC-004 Code Reference
 * File: src/app/transactions/new/page.tsx
 *
 * Página de criação de transação.
 * Demonstra: useState (um por campo), validação manual, form handling
 *
 * ⚠️ Este é o código "verboso" propositalmente.
 * Em SPEC-005 (C4) React Hook Form vai reduzir isso 50%.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { transactionService } from '@/services/transactionService'

export default function NewTransactionPage() {
  const router = useRouter()

  /**
   * CAMPOS DO FORMULÁRIO (4 campos = 4 useState)
   */
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('BRL')
  const [description, setDescription] = useState('')
  const [occurredAt, setOccurredAt] = useState('')

  /**
   * ESTADO DE VALIDAÇÃO
   * Dicionário: campo → mensagem de erro
   * Record<string, string> = { [key: string]: string }
   */
  const [errors, setErrors] = useState<Record<string, string>>({})

  /**
   * ESTADO DE SUBMISSÃO
   * Flag: está salvando no backend?
   */
  const [submitting, setSubmitting] = useState(false)

  /**
   * ESTADO DE ERRO DA API
   * Se POST falhar, guarda mensagem
   */
  const [apiError, setApiError] = useState<string | null>(null)

  /**
   * FUNÇÃO: Validar formulário
   * Retorna objeto com erros (vazio se válido)
   */
  function validate() {
    const newErrors: Record<string, string> = {}

    // Validar amount
    if (!amount) {
      newErrors.amount = 'Valor é obrigatório'
    } else if (Number(amount) <= 0) {
      newErrors.amount = 'Valor deve ser positivo'
    }

    // Validar currency
    if (!currency) {
      newErrors.currency = 'Moeda é obrigatória'
    }

    // Validar description
    if (!description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    }

    // Validar date
    if (!occurredAt) {
      newErrors.occurredAt = 'Data é obrigatória'
    }

    return newErrors
  }

  /**
   * FUNÇÃO: Lidar com submit do formulário
   */
  async function handleSubmit(e: React.FormEvent) {
    // Previne reload da página
    e.preventDefault()

    // Validar campos
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      // Tem erros: mostra e para
      setErrors(validationErrors)
      return
    }

    // Sem erros de validação: pode prosseguir
    setSubmitting(true)
    setApiError(null)

    try {
      // Chamar service para criar
      await transactionService.create({
        amount: Number(amount),        // converter string para number
        currency,
        description,
        occurredAt: new Date(occurredAt).toISOString(),  // converter para ISO
      })

      // Sucesso! Redirecionar para listagem
      router.push('/transactions')
    } catch (err: any) {
      // Erro na API: guardar mensagem
      setApiError(err.message)
    } finally {
      // Sempre: resetar flag de submissão
      setSubmitting(false)
    }
  }

  /**
   * RENDERIZAR FORMULÁRIO
   */
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Nova Transação</h1>

      {/* Campo: Amount */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Valor</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="0.00"
        />
        {errors.amount && (
          <span className="text-red-500 text-sm">{errors.amount}</span>
        )}
      </div>

      {/* Campo: Currency */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Moeda</label>
        <input
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="BRL"
        />
        {errors.currency && (
          <span className="text-red-500 text-sm">{errors.currency}</span>
        )}
      </div>

      {/* Campo: Description */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Descrição</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Ex: Compra no mercado"
        />
        {errors.description && (
          <span className="text-red-500 text-sm">{errors.description}</span>
        )}
      </div>

      {/* Campo: Date */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Data</label>
        <input
          type="datetime-local"
          value={occurredAt}
          onChange={(e) => setOccurredAt(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        {errors.occurredAt && (
          <span className="text-red-500 text-sm">{errors.occurredAt}</span>
        )}
      </div>

      {/* Erro da API (se houver) */}
      {apiError && (
        <p className="text-red-500 mb-4 bg-red-50 p-2 rounded">{apiError}</p>
      )}

      {/* Botão Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white font-bold py-2 rounded disabled:opacity-50"
      >
        {submitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  )
}

/**
 * 🧠 O que o Dev aprende:
 *
 * ✅ useState: um por campo (amount, currency, description, occurredAt)
 * ✅ useState: errors Record (dicionário de erros por campo)
 * ✅ Validação manual: função validate()
 * ✅ Form handling: e.preventDefault(), handleSubmit
 * ✅ Try/catch: erro handling na submissão
 * ✅ Router: redirecionar após sucesso
 * ✅ Loading state: desabilitar botão enquanto salva
 *
 * ⚠️ Problema que ele vai SENTIR:
 *
 * "Que quantidade de useState!
 *  - 4 campos = 4 useState
 *  - 1 errors = 1 useState
 *  - 1 submitting = 1 useState
 *  - 1 apiError = 1 useState
 *  Total: 7 useState em 1 componente!!!
 *
 *  Se tiver 20 campos, vou ter 24 useState?
 *  Isso é escalável? Como não misturar estados?"
 *
 * Resposta TL em C4:
 * "Exatamente. React Hook Form gerencia TUDO com 1 hook.
 *  register() = automático para cada campo
 *  validation = integrado
 *  errors = automático"
 *
 * 🎯 Aprendizado progressivo:
 * C3 = Dev sente dor
 * C4 = Dev aprende solução
 * C5+ = Dev aplica padrão que já conhece
 */
