# Card Asana — C5: Delete Transaction Flow

## Nome da tarefa
```
[SPEC-006] C5 — Delete Transaction: modal de confirmação + useMutation
```

---

## Descrição

```
## 🎯 Objetivo

Implementar o fluxo de exclusão de transação com modal de confirmação,
reutilizando o padrão useMutation já aprendido no C4.

Foco em UX de ação destrutiva: confirmação obrigatória, loading no botão,
feedback de erro e atualização automática da lista via cache do React Query.

## ✅ Critérios de aceite

- [ ] Botão "Excluir" em cada item abre modal de confirmação
- [ ] Modal exibe descrição da transação e botões Cancelar / Excluir
- [ ] Ao confirmar: chama DELETE /api/transactions/{id}
- [ ] Durante o DELETE: botão desabilitado com estado de loading
- [ ] Sucesso: modal fecha e item some da lista (cache invalidado)
- [ ] Erro: mensagem exibida dentro do modal
- [ ] transactionService.delete() implementado

## 📡 Endpoint consumido

DELETE /api/transactions/{id} → 204 No Content

## 🧠 Spike pedagógico (TL aplica antes de fechar o card)

"Perceba que useMutation + invalidateQueries é o mesmo padrão do C4.
Uma vez que você aprende o padrão, ele se repete — DELETE, POST, PUT,
todos seguem a mesma estrutura."

## 🔗 Spec completo
tools/specs/SPEC-006-delete-transaction-flow.md
```

---

## Subtasks

```
1. Implementar transactionService.delete(id)
2. Criar components/ConfirmDeleteModal.tsx
3. Adicionar useMutation na página de listagem para o DELETE
4. Conectar botão "Excluir" no TransactionItem — abrir modal com id e descrição
5. Implementar loading no botão do modal durante DELETE
6. Implementar tratamento de erro dentro do modal
7. Testar fluxo completo — item some da lista após confirmação
```

---

## Campos do card

| Campo | Valor |
|-------|-------|
| Projeto | PocketFinance |
| Épico | C — Frontend |
| Prioridade | Medium |
| Estimativa | 2h |
| Tags | `frontend`, `delete`, `modal`, `ux` |
| Spec ID | SPEC-006 |
| Depende de | C4 (SPEC-005) |
