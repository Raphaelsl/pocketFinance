# SPEC-006 — C5: Delete Transaction Flow

## Metadata

| Campo | Valor |
|-------|-------|
| **ID** | SPEC-006 |
| **Épico** | C — Frontend |
| **Status** | Draft |
| **Tipo** | Feature |
| **Prioridade** | Medium |
| **Estimativa** | 2h |
| **Depende de** | SPEC-005 (Edit Page — React Query já configurado) |

---

## 1. Overview

Implementar o fluxo de exclusão de transação com modal de confirmação. Usa React Query (`useMutation`) para o DELETE e invalida o cache da listagem após sucesso. Este é o card mais curto do Épico C — foca em UX de ação destrutiva e reutilização do padrão de mutation já visto no C4.

---

## 2. Goal

Permitir excluir uma transação com confirmação prévia, feedback visual e atualização automática da lista.

---

## 2.5 Conceitos Ensinados

**O Dev aprenderá:**
- `useMutation()` para operações destrutivas (DELETE)
- Modal de confirmação como UX pattern
- Error handling em mutations
- Cache invalidation após sucesso
- Padrão `mutationFn` + `onSuccess` + `onError`
- Estado de loading no modal/botão
- Reutilização de padrão visto em C4

**Insight:**
> "O `useMutation` é idêntico ao de C4. A única diferença é a URL.
> Então sempre que eu precisar criar/editar/deletar, é sempre `useMutation`?
> Sim. É por design. Um padrão, aplicado 100 vezes."

**Spike pedagógico (TL):** Ver `PEDAGOGIA-EPICO-C.md` — "padrão de mutations é consistente".

---

## 3. Acceptance Criteria

- [ ] Botão "Excluir" em cada item da lista abre modal de confirmação
- [ ] Modal exibe: nome/descrição da transação e botões "Cancelar" / "Excluir"
- [ ] Ao confirmar: chama `DELETE /api/transactions/{id}`
- [ ] Durante o DELETE: botão "Excluir" exibe estado de loading e fica desabilitado
- [ ] Em sucesso: modal fecha e item some da lista (cache invalidado)
- [ ] Em erro: exibe mensagem de erro no modal
- [ ] `transactionService.delete()` implementado

---

## 4. API Contract consumida

`DELETE /api/transactions/{id}` → `204 No Content`

---

## 5. Technical Spec

### 5.1 Service

```typescript
delete: async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/transactions/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Erro ao excluir transação')
},
```

### 5.2 Componente Modal (`components/ConfirmDeleteModal.tsx`)

```typescript
interface Props {
  description: string
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
  error: string | null
}

export function ConfirmDeleteModal({ description, onConfirm, onCancel, isLoading, error }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-2">Excluir transação</h2>
        <p className="text-gray-600 mb-4">
          Tem certeza que deseja excluir <strong>{description}</strong>? Esta ação não pode ser desfeita.
        </p>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} disabled={isLoading}>
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="bg-red-500 text-white">
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

### 5.3 Integração na listagem (`app/transactions/page.tsx`)

```typescript
// Adicionar ao TransactionsPage existente:

const queryClient = useQueryClient()
const [deletingId, setDeletingId] = useState<string | null>(null)
const [deleteError, setDeleteError] = useState<string | null>(null)

const deleteMutation = useMutation({
  mutationFn: (id: string) => transactionService.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
    setDeletingId(null)
  },
  onError: (err: Error) => setDeleteError(err.message),
})

// No JSX, após a lista:
{deletingId && (
  <ConfirmDeleteModal
    description={data!.content.find((t) => t.id === deletingId)?.description ?? ''}
    onConfirm={() => deleteMutation.mutate(deletingId)}
    onCancel={() => { setDeletingId(null); setDeleteError(null) }}
    isLoading={deleteMutation.isPending}
    error={deleteError}
  />
)}
```

### 5.4 Botão Excluir no `TransactionItem`

```typescript
// Adicionar prop onDelete ao componente
interface Props {
  transaction: Transaction
  onDelete: (id: string) => void
}

// Botão existente (placeholder do C2) agora recebe o handler:
<button onClick={() => onDelete(transaction.id)} className="text-red-500">
  Excluir
</button>
```

### 5.5 Arquivos criados/alterados

| Arquivo | Ação |
|---------|------|
| `services/transactionService.ts` | Implementar `delete()` |
| `components/ConfirmDeleteModal.tsx` | Criar |
| `components/TransactionItem.tsx` | Adicionar prop `onDelete` no botão |
| `app/transactions/page.tsx` | Integrar mutation + modal |

---

## 6. Dev Plan

| # | Task | Critério |
|---|------|----------|
| 1 | Implementar `transactionService.delete()` | Faz DELETE e retorna void |
| 2 | Criar `ConfirmDeleteModal` | Renderiza com props corretas |
| 3 | Adicionar `useMutation` na página de listagem | Mutation configurada com invalidate |
| 4 | Conectar botão "Excluir" no `TransactionItem` | Abre modal ao clicar |
| 5 | Implementar loading no botão do modal durante DELETE | Botão desabilitado durante chamada |
| 6 | Implementar tratamento de erro no modal | Mensagem aparece se DELETE falhar |
| 7 | Testar fluxo completo | Item some da lista após confirmação |

---

## 7. Spike Pedagógico

> "Perceba que o padrão `useMutation + invalidateQueries` é o mesmo do C4. O React Query deixa o frontend e o backend sempre sincronizados sem você gerenciar estado manualmente."

---

## 8. Out of Scope

- Soft delete (backend não suporta ainda)
- Desfazer exclusão (undo)
- Exclusão em lote
