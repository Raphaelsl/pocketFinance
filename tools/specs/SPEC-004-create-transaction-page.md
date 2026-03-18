# SPEC-004 — C3: Create Transaction Page

## Metadata

| Campo | Valor |
|-------|-------|
| **ID** | SPEC-004 |
| **Épico** | C — Frontend |
| **Status** | Draft |
| **Tipo** | Feature |
| **Prioridade** | High |
| **Estimativa** | 3h |
| **Depende de** | SPEC-003 (List Page) |

---

## 1. Overview

Criar a página/formulário de criação de transação que consome `POST /api/transactions`. Usa `useState` manual para cada campo e validação sem biblioteca — de forma intencional, para o Dev sentir o boilerplate antes de conhecer React Hook Form no C4.

---

## 2. Goal

Permitir ao usuário preencher e submeter um formulário de criação de transação, com validação local básica e feedback visual de sucesso/erro.

---

## 2.5 Conceitos Ensinados

**O Dev aprenderá:**
- Forms em React: controlled components (value + onChange)
- `useState()` por campo (amount, currency, description, occurredAt)
- Validação manual com função `validate()`
- Erros por campo (`Record<string, string>`)
- Submit com `e.preventDefault()`
- Loading state no botão
- Redirect após sucesso (`useRouter().push()`)
- POST com `transactionService.create()`

**Problema sentido após implementar:**
> "Quantos `useState` criei? 1 por campo + `[errors, setErrors]` + `[submitting, setSubmitting]` + `[apiError, setApiError]`.
> Total: 7 useState em 1 componente!
> O que quando esse form tem 20 campos? Vou morrer?
> Tem que ter lib pra isso..."

**Spike pedagógico (TL):** Ver `PEDAGOGIA-EPICO-C.md` — spike "Forms em React" e "React Hook Form".

---

## 3. Acceptance Criteria

- [ ] Formulário acessível em `/transactions/new`
- [ ] Campos: `amount`, `currency`, `description`, `occurredAt`
- [ ] Validação local antes de submeter (campo vazio, amount negativo)
- [ ] Exibe erro de validação por campo
- [ ] Exibe loading durante o POST
- [ ] Em caso de sucesso: redireciona para `/transactions`
- [ ] Em caso de erro da API: exibe mensagem de erro
- [ ] Botão "Nova Transação" adicionado na página de listagem (C2)
- [ ] `transactionService.create()` implementado

---

## 4. API Contract consumida

`POST /api/transactions`

Request:
```json
{
  "amount": 150.50,
  "currency": "BRL",
  "description": "Compra no mercado",
  "occurredAt": "2024-03-03T10:30:00Z",
  "categoryId": null,
  "metadata": null
}
```

Response: `201 Created` com body da transação criada.

---

## 5. Technical Spec

### 5.1 Service (`services/transactionService.ts`)

```typescript
create: async (data: TransactionCreateRequest): Promise<Transaction> => {
  const response = await fetch(`${API_URL}/api/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Erro ao criar transação')
  return response.json()
},
```

### 5.2 Página (`app/transactions/new/page.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { transactionService } from '@/services/transactionService'

export default function NewTransactionPage() {
  const router = useRouter()

  // Estado por campo — o Dev vai perceber o boilerplate
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('BRL')
  const [description, setDescription] = useState('')
  const [occurredAt, setOccurredAt] = useState('')

  // Erros por campo
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!amount || Number(amount) <= 0) newErrors.amount = 'Valor deve ser positivo'
    if (!currency) newErrors.currency = 'Moeda é obrigatória'
    if (!description.trim()) newErrors.description = 'Descrição é obrigatória'
    if (!occurredAt) newErrors.occurredAt = 'Data é obrigatória'
    return newErrors
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setSubmitting(true)
    setApiError(null)
    try {
      await transactionService.create({
        amount: Number(amount),
        currency,
        description,
        occurredAt: new Date(occurredAt).toISOString(),
      })
      router.push('/transactions')
    } catch (err: any) {
      setApiError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Nova Transação</h1>

      <div>
        <label>Valor</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        {errors.amount && <span className="text-red-500">{errors.amount}</span>}
      </div>

      <div>
        <label>Moeda</label>
        <input value={currency} onChange={(e) => setCurrency(e.target.value)} />
        {errors.currency && <span className="text-red-500">{errors.currency}</span>}
      </div>

      <div>
        <label>Descrição</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
        {errors.description && <span className="text-red-500">{errors.description}</span>}
      </div>

      <div>
        <label>Data</label>
        <input type="datetime-local" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} />
        {errors.occurredAt && <span className="text-red-500">{errors.occurredAt}</span>}
      </div>

      {apiError && <p className="text-red-500">{apiError}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  )
}
```

### 5.3 Arquivos criados/alterados

| Arquivo | Ação |
|---------|------|
| `services/transactionService.ts` | Implementar `create()` |
| `app/transactions/new/page.tsx` | Criar |
| `app/transactions/page.tsx` | Adicionar botão "Nova Transação" |

---

## 6. Dev Plan

| # | Task | Critério |
|---|------|----------|
| 1 | Implementar `transactionService.create()` | Faz POST e retorna `Transaction` tipado |
| 2 | Criar `app/transactions/new/page.tsx` com campos via `useState` | Página renderiza |
| 3 | Implementar função `validate()` com regras por campo | Erros aparecem sem chamar API |
| 4 | Implementar `handleSubmit` com loading e redirect | Submit chama service |
| 5 | Exibir erro da API quando POST falhar | Mensagem visível na tela |
| 6 | Adicionar botão "Nova Transação" na listagem (link para `/transactions/new`) | Navegação funciona |
| 7 | Testar fluxo completo com backend | Transação aparece na lista após criação |

---

## 7. Spike Pedagógico

Após implementar, o TL deve perguntar ao Dev:

> "Quantos `useState` você criou só para esse formulário? O que acontece quando o form tem 10 campos? No C4 vamos ver o React Hook Form resolver isso."

---

## 8. Out of Scope

- Select de moeda (dropdown)
- Campo de categoria
- Upload de comprovante