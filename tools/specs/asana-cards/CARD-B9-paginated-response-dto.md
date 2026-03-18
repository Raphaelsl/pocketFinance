# Card Asana — B9: Paginated Response DTO

## Nome da tarefa
```
[SPEC-001] B9 — PagedResponse DTO: remover campos internos do Spring do payload de listagem
```

---

## Descrição

```
## 🎯 Problema

O endpoint GET /api/transactions retorna o tipo Page<T> do Spring Data diretamente,
expondo campos internos do framework que não agregam valor ao cliente da API:
pageable, sort (duplicado), paged, unpaged, numberOfElements, offset.

## ✅ Critérios de aceite

- [ ] Campos removidos do response: pageable, sort (objeto), paged, unpaged, offset, numberOfElements, number, empty
- [ ] Campos presentes: content, page, size, totalElements, totalPages, first, last
- [ ] PagedResponse<T> é genérico e reutilizável em outros endpoints
- [ ] Todos os testes de integração continuam passando

## 📐 Contrato esperado após a mudança

Antes:
{
  "content": [...],
  "pageable": { "pageNumber": 0, "pageSize": 10, "sort": {...}, ... },
  "totalElements": 1,
  "totalPages": 1,
  "numberOfElements": 1,
  "number": 0,
  "size": 10,
  "sort": { ... },
  "empty": false
}

Depois:
{
  "content": [...],
  "page": 0,
  "size": 10,
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}

## ⚠️ Importante
Deve ser entregue antes do Épico C (C2 consome esse endpoint).

## 🔗 Spec completo
tools/specs/SPEC-001-paginated-response-dto.md
```

---

## Subtasks

```
1. Criar dto/PagedResponse.java com factory method estático from(Page<T>)
2. Atualizar TransactionController — tipo de retorno do listTransactions
3. Atualizar teste shouldListTransactionsWithPagination — validar novo formato
4. Atualizar Postman Collection com novo contrato
```

---

## Campos do card

| Campo | Valor |
|-------|-------|
| Projeto | PocketFinance |
| Épico | B — Backend CRUD |
| Prioridade | High |
| Estimativa | 1h |
| Tags | `backend`, `api-contract`, `enhancement` |
| Spec ID | SPEC-001 |
| Bloqueia | C2 (SPEC-003) |
