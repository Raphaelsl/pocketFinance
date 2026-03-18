# SPEC-003 — C2: List Transactions Page

## Metadata

| Campo | Valor |
|-------|-------|
| **ID** | SPEC-003 |
| **Épico** | C — Frontend |
| **Status** | Draft |
| **Tipo** | Feature |
| **Prioridade** | High |
| **Estimativa** | 3h |
| **Depende de** | SPEC-002 (Setup Next.js) |

---

## 1. Overview

Criar a página de listagem de transações que consome `GET /api/transactions` do backend. Usa `fetch + useState` de forma intencional para o Dev sentir o trabalho manual de loading, error e paginação — antes de conhecer React Query.

---

## 2. Goal

Exibir a lista de transações com paginação, loading state e error state usando apenas primitivos do React.

---

## 2.5 Conceitos Ensinados

**O Dev aprenderá:**
- `fetch()` API e como retorna Promise
- `async/await` para operações assíncronas
- `useState()` para gerenciar data, loading, error, pagination
- `useEffect()` para efeitos colaterais (buscar dados)
- Padrão: múltiplos `useState` para rastrear 1 requisição
- `try/catch` em async/await
- Tratamento de erro do servidor
- Paginação manual com estado

**Problema sentido após implementar:**
> "Espera... preciso de `useState(data)`, `useState(loading)`, `useState(error)`, `useState(page)`?
> E um `useEffect` que chama o service com `.then()`, `.catch()`, `.finally()`?
> Vou repetir esse padrão em C3, C4, C5... todo endpoint?
> Tem que ter jeito mais fácil..."

**Spike pedagógico (TL):** Ver `PEDAGOGIA-EPICO-C.md` — spike "Async State Management".

---

## 3. Acceptance Criteria

- [ ] Página acessível em `/transactions`
- [ ] Exibe lista de transações vindas do backend
- [ ] Exibe loading enquanto aguarda a resposta
- [ ] Exibe mensagem de erro se o fetch falhar
- [ ] Exibe mensagem quando a lista está vazia
- [ ] Paginação funcional (botões Anterior / Próximo)
- [ ] `transactionService.list()` implementado e chamado pela página
- [ ] Botões de Editar e Excluir visíveis em cada item (sem lógica ainda — C4/C5)

---

## 4. API Contract consumida

`GET /api/transactions?page=0&size=10`

```json
{
  "content": [
    {
      "id": "uuid",
      "amount": 150.50,
      "currency": "BRL",
      "description": "Compra no mercado",
      "occurredAt": "2024-03-03T10:30:00Z",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

---

## 5. Technical Spec

### 5.1 Service (`services/transactionService.ts`)

```typescript
import { PagedResponse, Transaction } from '@/types/transaction'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const transactionService = {
  list: async (page = 0, size = 10): Promise<PagedResponse<Transaction>> => {
    const response = await fetch(
      `${API_URL}/api/transactions?page=${page}&size=${size}`
    )
    if (!response.ok) throw new Error('Erro ao carregar transações')
    return response.json()
  },
}
```

### 5.2 Página (`app/transactions/page.tsx`)

```typescript
'use client'

import { useEffect, useState } from 'react'
import { transactionService } from '@/services/transactionService'
import { PagedResponse, Transaction } from '@/types/transaction'

export default function TransactionsPage() {
  const [data, setData] = useState<PagedResponse<Transaction> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    transactionService
      .list(page)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [page])

  if (loading) return <p>Carregando...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (!data || data.content.length === 0) return <p>Nenhuma transação encontrada.</p>

  return (
    <div>
      <h1>Transações</h1>
      <ul>
        {data.content.map((t) => (
          <TransactionItem key={t.id} transaction={t} />
        ))}
      </ul>
      <div>
        <button disabled={data.first} onClick={() => setPage((p) => p - 1)}>
          Anterior
        </button>
        <span>{data.page + 1} / {data.totalPages}</span>
        <button disabled={data.last} onClick={() => setPage((p) => p + 1)}>
          Próximo
        </button>
      </div>
    </div>
  )
}
```

### 5.3 Componente de item (`components/TransactionItem.tsx`)

```typescript
interface Props {
  transaction: Transaction
}

export function TransactionItem({ transaction }: Props) {
  return (
    <li>
      <span>{transaction.description}</span>
      <span>{transaction.currency} {transaction.amount.toFixed(2)}</span>
      <span>{new Date(transaction.occurredAt).toLocaleDateString('pt-BR')}</span>
      <button>Editar</button>   {/* funcional no C4 */}
      <button>Excluir</button>  {/* funcional no C5 */}
    </li>
  )
}
```

### 5.4 Arquivos criados/alterados

| Arquivo | Ação |
|---------|------|
| `services/transactionService.ts` | Implementar `list()` |
| `app/transactions/page.tsx` | Criar |
| `components/TransactionItem.tsx` | Criar |

---

## 6. Dev Plan

| # | Task | Critério |
|---|------|----------|
| 1 | Implementar `transactionService.list()` | Retorna `PagedResponse<Transaction>` tipado |
| 2 | Criar `TransactionItem` componente | Renderiza dados de uma transação |
| 3 | Criar `TransactionsPage` com `useState` para data/loading/error/page | Página renderiza |
| 4 | Implementar `useEffect` que chama o service | Dados carregam ao montar |
| 5 | Implementar loading state | Texto "Carregando..." aparece durante fetch |
| 6 | Implementar error state | Mensagem de erro aparece se fetch falhar |
| 7 | Implementar paginação (botões + estado) | Navegar entre páginas funciona |
| 8 | Testar com backend rodando | Lista exibe dados reais do Postgres |

---

## 7. Spike Pedagógico

Após implementar, o TL deve mostrar ao Dev:

> "Percebeu quanto código manual escrevemos para loading, error e refetch? No C4 vamos ver como o React Query resolve tudo isso com 5 linhas."

---

## 8. Out of Scope

- Filtro/busca por texto
- Ordenação de colunas
- Modal de criação (C3)