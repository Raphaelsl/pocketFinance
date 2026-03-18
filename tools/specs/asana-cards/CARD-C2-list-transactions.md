# Card Asana — C2: List Transactions Page

## Nome da tarefa
```
[SPEC-003] C2 — List Transactions: fetch + useState + paginação
```

---

## Descrição

```
## 🎯 Objetivo

Criar a página de listagem de transações consumindo GET /api/transactions.
Usa fetch + useState de forma intencional para o Dev sentir o trabalho manual
de loading, error e paginação — antes de conhecer React Query no C4.

## ✅ Critérios de aceite

- [ ] Página acessível em /transactions
- [ ] Exibe lista de transações vindas do backend
- [ ] Exibe loading enquanto aguarda a resposta
- [ ] Exibe mensagem de erro se o fetch falhar
- [ ] Exibe mensagem quando a lista está vazia
- [ ] Paginação funcional (botões Anterior / Próximo)
- [ ] transactionService.list() implementado
- [ ] Botões Editar e Excluir visíveis em cada item (sem lógica ainda)

## 📡 Endpoint consumido

GET /api/transactions?page=0&size=10

## 🧠 Intenção pedagógica

Usar fetch + useState manualmente para sentir:
- loading state manual
- error state manual
- refetch manual ao trocar página
(No C4 o React Query resolve tudo isso automaticamente)

## 🔗 Spec completo
tools/specs/SPEC-003-list-transactions-page.md
```

---

## Subtasks

```
1. Implementar transactionService.list(page, size)
2. Criar componente TransactionItem
3. Criar TransactionsPage com useState para data/loading/error/page
4. Implementar useEffect que chama o service ao montar e ao trocar página
5. Implementar loading state (texto "Carregando...")
6. Implementar error state (mensagem de erro)
7. Implementar paginação (botões Anterior/Próximo com estado)
8. Testar com backend rodando — dados reais do Postgres
```

---

## Campos do card

| Campo | Valor |
|-------|-------|
| Projeto | PocketFinance |
| Épico | C — Frontend |
| Prioridade | High |
| Estimativa | 3h |
| Tags | `frontend`, `listagem`, `fetch`, `paginação` |
| Spec ID | SPEC-003 |
| Depende de | C1 (SPEC-002) |
