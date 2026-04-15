# Implementation Sequence — SPEC-TRANSACTION-TYPES → SPEC-005

## 📊 Dependência Crítica

```
SPEC-004 (Create Transaction)
    ✅ COMPLETO
    ↓
SPEC-TRANSACTION-TYPES (Add Income/Expense Type Field)
    🔜 NEXT — PREREQUISITO PARA SPEC-005
    ├─ Backend: Add Enum + Migration
    ├─ DTOs: Atualizar com field `type`
    └─ Postman: Testar INCOME + EXPENSE
    ↓ (após concluído)
SPEC-005 (Edit Transaction with React Query + RHF)
    ⏳ BLOQUEADO até SPEC-TRANSACTION-TYPES estar pronto
    ├─ Frontend: Atualizado para incluir select de tipo
    └─ Integração: type no formulário + persistência
    ↓
SPEC-006 (Delete Transaction)
```

---

## ⛔ Por que SPEC-005 está BLOQUEADO?

### Problema: SPEC-005 precisa de `type` no backend

**SPEC-005 tenta:**
```typescript
// app/transactions/[id]/edit/page.tsx
const { data: transaction } = useQuery({
  queryFn: () => transactionService.getById(id),
})

// Renderiza:
<select {...register('type')}>
  <option value="INCOME">Receita</option>
  <option value="EXPENSE">Despesa</option>
</select>
```

**Problema:** Se `Transaction` DTO não tem `type`, o TypeScript quebra:
```
❌ Property 'type' does not exist on type 'Transaction'
```

**Solução:** SPEC-TRANSACTION-TYPES deve vir **antes**.

---

## ✅ O que fazer agora (Sequência)

### **Fase 1: SPEC-TRANSACTION-TYPES (Backend)**
**Duração: 2h**
**Status:** 🔜 READY

#### Backend tasks:
1. ✅ Criar Enum `TransactionType` (INCOME, EXPENSE)
2. ✅ Adicionar field `type` em Entity `Transaction`
3. ✅ Criar Flyway migration `V003__add_transaction_type.sql`
4. ✅ Atualizar DTOs: `TransactionCreateRequest`, `TransactionUpdateRequest`, `TransactionDTO`
5. ✅ Atualizar `TransactionMapper` — mapear novo field
6. ✅ Testar manualmente via Postman
7. ✅ Postman collection atualizada com exemplos

**Resultado esperado:**
- Backend compila sem erros
- `POST /api/transactions` aceita `{ type: "INCOME", ... }`
- `GET /api/transactions/{id}` retorna transaction com `type`
- Dados históricos têm `type: "EXPENSE"` (default)

**Dev:** Isso é **pure backend**. Frontend pode esperar.

---

### **Fase 2: Validação (Manual)**
**Duração: 30min**

Após Fase 1:

1. Verificar banco com Adminer:
   ```sql
   SELECT id, description, type, amount FROM transactions LIMIT 5;
   ```
   Esperado: coluna `type` existe, valores = "EXPENSE" ou "INCOME"

2. Testar via Postman (4 requisições):
   - `POST /api/transactions` com type="INCOME" → salva
   - `POST /api/transactions` com type="EXPENSE" → salva
   - `GET /api/transactions/{id}` → retorna com type
   - `PUT /api/transactions/{id}` mudar type → persiste

3. Atualizar `tools/postman/pocketFinance_collection.json` com exemplos

**Dev:** Garante que tudo funciona antes do frontend pegar

---

### **Fase 3: SPEC-005 (Frontend)**
**Duração: 4h + 1h (integração tipo) = 5h total**
**Status:** ⏳ BLOQUEADO ATÉ FASE 1 ESTAR PRONTA

#### Frontend tasks (mesmas de antes, com adições):
1. ✅ Instalar React Query + React Hook Form
2. ✅ Criar `app/providers.tsx`
3. ✅ Implementar `transactionService.getById()` e `update()`
4. ✅ Criar página edit com `useQuery`
5. ✅ Integrar `useForm` com reset
6. ✅ **NEW:** Adicionar `<select>` de tipo (INCOME/EXPENSE)
7. ✅ Implementar `useMutation` para PUT
8. ✅ Invalidar cache no `onSuccess`
9. ✅ Conectar botão "Editar" na lista
10. ✅ **NEW:** Testar: editar tipo e verificar persistência

**Resultado esperado:**
- Editar transação funciona (como antes)
- **Novo:** Pode editar o tipo (INCOME ↔ EXPENSE)
- Frontend renderiza select com emojis 💰/💸
- Type persiste no banco

---

## 🎯 Asana Workflow

### Para **SPEC-TRANSACTION-TYPES** (novo card):

```
Title: SPEC-TRANSACTION-TYPES — Add Income/Expense Type Field
Status: READY
Priority: HIGH (urgente, bloqueia SPEC-005)
Assignee: [Dev name]
Estimated: 2h
Due: [data]
Section: Backend

Description:
Adicionar campo `type: INCOME | EXPENSE` ao modelo Transaction.
Prerequisito para SPEC-005 (Edit Transaction).

Checklist:
☐ Enum TransactionType criado (INCOME, EXPENSE)
☐ Entity Transaction com field type
☐ Flyway migration V003 criada e rodou
☐ DTOs atualizados
☐ Postman collection com exemplos
☐ Testes manuais INCOME + EXPENSE
```

### Para **SPEC-005** (existente):

```
Status: BLOCKED
Blocked By: SPEC-TRANSACTION-TYPES

Add comment:
"🚫 Bloqueado: aguardando SPEC-TRANSACTION-TYPES para incluir campo `type` no backend.
Estimativa revisada: 5h (4h + 1h integração tipo)
Resumo das mudanças:
- Formulário ganha select de tipo (INCOME/EXPENSE)
- Pre-preenchimento inclui type
- Update envia type ao backend
Será desbloqueado após SPEC-TRANSACTION-TYPES estar DONE."
```

---

## 📋 Checklist de Unblock (quando SPEC-TRANSACTION-TYPES está DONE)

Antes de Dev mover pra SPEC-005, verificar:

- [ ] Backend compila
- [ ] Flyway migration rodou (sem rollback)
- [ ] `GET /api/transactions` retorna com campo `type`
- [ ] `POST /api/transactions` aceita type no body
- [ ] Postman collection atualizada e testada
- [ ] Dados históricos tem type="EXPENSE"
- [ ] DTOs em frontend podem ser regenerados com tipo
- [ ] TypeScript aceita `transaction.type` sem errors

**Após tudo passar → Desbloquear SPEC-005**

---

## ⚠️ Riscos de Fazer Fora de Ordem

### Se Dev tentasse fazer SPEC-005 ANTES de SPEC-TRANSACTION-TYPES:

```typescript
// ❌ ERRO: type não existe
const { data: transaction } = useQuery({...})
const typeValue = transaction.type  // ❌ Property 'type' does not exist

// ❌ ERRO: enum não existe
<select value={type}>
  <option value={TransactionType.INCOME}>...  // ❌ não definido
</select>

// ❌ ERRO: service não aceita type
await transactionService.update(id, { type: "INCOME", ... })
// Erro: type is not a property of TransactionUpdateRequest
```

**Resultado:** Dev perdia 2-3h debugando antes de perceber que backend não tem tipo.

---

## 📝 Migração de Dados (Nota)

Após SPEC-TRANSACTION-TYPES rodar:

```sql
-- Todos os registros históricos ganham tipo padrão
SELECT COUNT(*), type FROM transactions GROUP BY type;
-- Esperado: COUNT(*) | type
--          2        | EXPENSE (padrão)

-- Se quiser categorizar melhor depois:
UPDATE transactions SET type='INCOME' WHERE description LIKE '%salário%';
UPDATE transactions SET type='INCOME' WHERE description LIKE '%depósito%';
```

Mas isso é **out of scope** agora. Dev foca em fazer SPEC-TRANSACTION-TYPES correto.

---

## 🔗 Documentos Relacionados

- `SPEC-TRANSACTION-TYPES.md` — Spec completa com backend + frontend
- `SPEC-005-edit-transaction-page.md` — Atualizado com campo type
- `PROJECT-CONTEXT.md` — Visão geral do projeto
- `PEDAGOGIA-EPICO-C.md` — Estratégia pedagógica

---

## ✨ Resultado Final

Após ambas SPECs:

✅ Frontend consegue listar transações (C2)
✅ Frontend consegue criar transações com tipo (C3 + tipos)
✅ Frontend consegue **editar tipo** (SPEC-005 + tipos)
✅ Frontend consegue deletar (C5)
✅ Dashboard consegue filtrar/agregar por tipo (D)
✅ Dev aprendeu: enums, migrations, state management, forms

**Tudo pronto para Épico D (Dashboard & Aggregations).**
