# Card Asana — C3: Create Transaction Page

## Nome da tarefa
```
[SPEC-004] C3 — Create Transaction: formulário com useState manual
```

---

## Descrição

```
## 🎯 Objetivo

Criar a página de criação de transação consumindo POST /api/transactions.
Usa useState por campo e validação manual de forma intencional — para o Dev
sentir o boilerplate antes de conhecer React Hook Form no C4.

## ✅ Critérios de aceite

- [ ] Formulário acessível em /transactions/new
- [ ] Campos: amount, currency, description, occurredAt
- [ ] Validação local antes de submeter (campo vazio, amount negativo)
- [ ] Erro de validação exibido por campo
- [ ] Loading durante o POST
- [ ] Sucesso: redireciona para /transactions
- [ ] Erro da API: exibe mensagem
- [ ] Botão "Nova Transação" adicionado na página de listagem (C2)
- [ ] transactionService.create() implementado

## 📡 Endpoint consumido

POST /api/transactions
Body: { amount, currency, description, occurredAt, categoryId, metadata }

## 🧠 Intenção pedagógica

Usar um useState por campo para sentir:
- boilerplate de estado por campo
- validação manual campo a campo
- controle manual de submitting
(No C4 o React Hook Form resolve tudo com register())

## 🔗 Spec completo
tools/specs/SPEC-004-create-transaction-page.md
```

---

## Subtasks

```
1. Implementar transactionService.create(data)
2. Criar app/transactions/new/page.tsx com useState por campo
3. Implementar função validate() com regras por campo
4. Implementar handleSubmit com loading e redirect no sucesso
5. Exibir erros de validação por campo no formulário
6. Exibir erro da API quando POST falhar
7. Adicionar botão "Nova Transação" na listagem (link para /transactions/new)
8. Testar fluxo completo — transação aparece na lista após criação
```

---

## Campos do card

| Campo | Valor |
|-------|-------|
| Projeto | PocketFinance |
| Épico | C — Frontend |
| Prioridade | High |
| Estimativa | 3h |
| Tags | `frontend`, `formulário`, `post`, `validação` |
| Spec ID | SPEC-004 |
| Depende de | C2 (SPEC-003) |
