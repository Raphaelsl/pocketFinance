# SPEC-005 — C4: Edit Transaction Page

## Metadata

| Campo | Valor |
|-------|-------|
| **ID** | SPEC-005 |
| **Épico** | C — Frontend |
| **Status** | Draft |
| **Tipo** | Feature |
| **Prioridade** | High |
| **Estimativa** | 4h |
| **Depende de** | SPEC-004 (Create Page) |

---

## 1. Overview

Criar a página de edição de transação. Este card introduce duas tecnologias novas: **React Query** (substituindo fetch + useState manual) e **React Hook Form** (substituindo useState por campo). O Dev vai sentir a diferença direta em relação ao C2/C3.

---

## 2. Goal

Permitir editar uma transação existente usando `GET /api/transactions/{id}` e `PUT /api/transactions/{id}`, com React Query gerenciando o cache/loading/error e React Hook Form gerenciando o formulário.

---

## 2.5 Conceitos Ensinados

**O Dev aprenderá:**
- `useQuery()` do React Query: automático loading, error, refetch
- `useMutation()` do React Query para operações que modificam estado
- `queryClient.invalidateQueries()` para sincronizar cache
- `useForm()` + `register()` do React Hook Form
- Validação declarativa com `register({ required, min, etc })`
- Pre-população de form com `reset()`
- Padrão: `useQuery` + `useMutation` + form setup

**Insight após comparar com C2/C3:**
> "Espera... em C2 eu tinha 4 useState + useEffect. Aqui é só 1 useQuery!
> Em C3 eu tinha 7 useState. Aqui é só 1 useForm!
> Essas libs existem porque todo dev estava escrevendo a mesma coisa repetida."

**Spike pedagógico (TL):** Ver `PEDAGOGIA-EPICO-C.md` — spikes "React Query Fundamentals" e "React Hook Form".

---

## 3. Acceptance Criteria

- [ ] Página acessível em `/transactions/{id}/edit`
- [ ] Busca a transação pelo ID ao carregar (`GET /api/transactions/{id}`)
- [ ] Formulário pré-preenchido com os dados da transação
- [ ] Validação via React Hook Form
- [ ] Submit chama `PUT /api/transactions/{id}`
- [ ] Em sucesso: redireciona para `/transactions` com cache invalidado
- [ ] Em erro: exibe mensagem
- [ ] Botão "Editar" na lista (C2) agora navega para `/transactions/{id}/edit`
- [ ] `transactionService.getById()` e `transactionService.update()` implementados

---

## 4. API Contracts consumidas

`GET /api/transactions/{id}` → `200 OK` com `Transaction`

`PUT /api/transactions/{id}` com body `TransactionUpdateRequest` → `200 OK` com `Transaction`

---

## 5. Technical Spec

### 5.1 Instalar dependências

```bash
npm install @tanstack/react-query react-hook-form
```

### 5.2 Configurar React Query (`app/providers.tsx`)

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

Adicionar `<Providers>` no `app/layout.tsx`.

### 5.3 Service

```typescript
getById: async (id: string): Promise<Transaction> => {
  const response = await fetch(`${API_URL}/api/transactions/${id}`)
  if (!response.ok) throw new Error('Transação não encontrada')
  return response.json()
},

update: async (id: string, data: TransactionUpdateRequest): Promise<Transaction> => {
  const response = await fetch(`${API_URL}/api/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Erro ao atualizar transação')
  return response.json()
},
```

### 5.4 Página (`app/transactions/[id]/edit/page.tsx`)

```typescript
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useRouter, useParams } from 'next/navigation'
import { transactionService } from '@/services/transactionService'
import { TransactionUpdateRequest } from '@/types/transaction'
import { useEffect } from 'react'

export default function EditTransactionPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()

  // React Query: fetch automático com cache, loading e error
  const { data: transaction, isLoading, error } = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionService.getById(id),
  })

  // React Hook Form: gerencia estado, validação e submit
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TransactionUpdateRequest>()

  // Pré-preenche o form quando os dados carregam
  useEffect(() => {
    if (transaction) {
      reset({
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        occurredAt: transaction.occurredAt.slice(0, 16), // para input datetime-local
      })
    }
  }, [transaction, reset])

  const mutation = useMutation({
    mutationFn: (data: TransactionUpdateRequest) =>
      transactionService.update(id, {
        ...data,
        occurredAt: new Date(data.occurredAt).toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      router.push('/transactions')
    },
  })

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p className="text-red-500">Transação não encontrada.</p>

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <h1>Editar Transação</h1>

      <div>
        <label>Valor</label>
        <input type="number" step="0.01"
          {...register('amount', { required: 'Obrigatório', min: { value: 0.01, message: 'Deve ser positivo' } })}
        />
        {errors.amount && <span className="text-red-500">{errors.amount.message}</span>}
      </div>

      <div>
        <label>Moeda</label>
        <input {...register('currency', { required: 'Obrigatório' })} />
        {errors.currency && <span className="text-red-500">{errors.currency.message}</span>}
      </div>

      <div>
        <label>Descrição</label>
        <input {...register('description', { required: 'Obrigatório' })} />
        {errors.description && <span className="text-red-500">{errors.description.message}</span>}
      </div>

      <div>
        <label>Data</label>
        <input type="datetime-local" {...register('occurredAt', { required: 'Obrigatório' })} />
        {errors.occurredAt && <span className="text-red-500">{errors.occurredAt.message}</span>}
      </div>

      {mutation.isError && <p className="text-red-500">Erro ao salvar.</p>}

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  )
}
```

### 5.5 Arquivos criados/alterados

| Arquivo | Ação |
|---------|------|
| `services/transactionService.ts` | Implementar `getById()` e `update()` |
| `app/providers.tsx` | Criar com QueryClientProvider |
| `app/layout.tsx` | Envolver com `<Providers>` |
| `app/transactions/[id]/edit/page.tsx` | Criar |
| `components/TransactionItem.tsx` | Botão "Editar" navega para `/transactions/{id}/edit` |

---

## 6. Dev Plan

| # | Task | Critério |
|---|------|----------|
| 1 | Instalar `@tanstack/react-query` e `react-hook-form` | `npm install` sem erros |
| 2 | Criar `app/providers.tsx` e adicionar no `layout.tsx` | App sobe sem erro |
| 3 | Implementar `transactionService.getById()` e `update()` | Funções tipadas |
| 4 | Criar página `[id]/edit/page.tsx` com `useQuery` | Dados carregam do backend |
| 5 | Integrar `useForm` com `reset()` para pré-preencher | Form exibe dados da transação |
| 6 | Implementar `useMutation` para o PUT | Submit atualiza no backend |
| 7 | Invalidar cache e redirecionar no `onSuccess` | Lista atualiza após edição |
| 8 | Conectar botão "Editar" na lista | Navegação funciona |

---

## 7. Spike Pedagógico

O TL deve comparar lado a lado com o Dev:

> "No C2 você escreveu: `useState(loading)`, `useState(error)`, `useEffect`, `try/catch`, `finally`. Aqui o `useQuery` faz tudo isso. No C3 você criou um `useState` por campo. Aqui o `register()` substitui tudo. Essas libs existem para resolver problemas que você já sentiu."

---

## 8. Out of Scope

- Otimistic updates
- Debounce no form
- Histórico de edições