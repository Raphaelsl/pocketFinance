# Card Asana — C4: Edit Transaction Page

## Nome da tarefa
```
[SPEC-005] C4 — Edit Transaction: React Query + React Hook Form
```

---

## Descrição

```
## 🎯 Objetivo

Criar a página de edição de transação introduzindo duas tecnologias novas:
React Query (substituindo fetch + useState manual do C2) e React Hook Form
(substituindo useState por campo do C3).

O Dev vai sentir a diferença direta em relação ao que foi feito nos cards anteriores.

## ✅ Critérios de aceite

- [ ] Página acessível em /transactions/{id}/edit
- [ ] Busca a transação pelo ID ao carregar (GET /api/transactions/{id})
- [ ] Formulário pré-preenchido com os dados da transação
- [ ] Validação via React Hook Form (register + errors)
- [ ] Submit chama PUT /api/transactions/{id}
- [ ] Sucesso: redireciona para /transactions com cache invalidado
- [ ] Erro: exibe mensagem
- [ ] Botão "Editar" na lista navega para /transactions/{id}/edit
- [ ] transactionService.getById() e update() implementados

## 📡 Endpoints consumidos

GET /api/transactions/{id} → 200 OK com Transaction
PUT /api/transactions/{id} com body TransactionUpdateRequest → 200 OK

## 🧠 Spike pedagógico (TL aplica antes de fechar o card)

Comparar lado a lado com o Dev:
- C2: useState(loading) + useState(error) + useEffect + try/catch + finally
  → C4: useQuery() faz tudo isso
- C3: um useState por campo + validate() manual
  → C4: register('campo', { required }) faz tudo isso

"Essas libs existem para resolver problemas que você já sentiu."

## 🔗 Spec completo
tools/specs/SPEC-005-edit-transaction-page.md
```

---

## Subtasks

```
1. Instalar @tanstack/react-query e react-hook-form
2. Criar app/providers.tsx com QueryClientProvider
3. Envolver app/layout.tsx com <Providers>
4. Implementar transactionService.getById(id) e update(id, data)
5. Criar app/transactions/[id]/edit/page.tsx com useQuery
6. Integrar useForm com reset() para pré-preencher o formulário
7. Implementar useMutation para o PUT com invalidateQueries no onSuccess
8. Conectar botão "Editar" na lista — navegar para /transactions/{id}/edit
```

---

## Campos do card

| Campo | Valor |
|-------|-------|
| Projeto | PocketFinance |
| Épico | C — Frontend |
| Prioridade | High |
| Estimativa | 4h |
| Tags | `frontend`, `react-query`, `react-hook-form`, `put` |
| Spec ID | SPEC-005 |
| Depende de | C3 (SPEC-004) |
