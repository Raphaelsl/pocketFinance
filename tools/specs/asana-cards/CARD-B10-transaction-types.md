# Card Asana — B10: Add Transaction Type Field

## Task Name
```
[SPEC-TRANSACTION-TYPES] B10 — Add Transaction Type: diferenciar INCOME/EXPENSE no modelo
```

---

## Description

```
## 🎯 Objective

Add support for transaction types (INCOME/EXPENSE) to the backend model.
Currently the system only accepts positive amounts (@Positive validation),
making it impossible to differentiate revenue from expenses.

After this change:
- Dev can register both INCOME (salary, deposits) and EXPENSE (purchases, spending)
- Dashboard can calculate real balance: totalIncome - totalExpenses
- Transactions have semantic meaning (income vs expense)

## ✅ Acceptance Criteria

### Backend
- [ ] Enum TransactionType created (INCOME, EXPENSE)
- [ ] Entity Transaction has new field type
- [ ] Flyway migration V003 created and executed successfully
- [ ] DTOs updated: TransactionCreateRequest, TransactionUpdateRequest, TransactionDTO
- [ ] TransactionMapper maps new field
- [ ] Amount validation remains @Positive (always positive amount)
- [ ] Historical data gets type='EXPENSE' (conservative default)
- [ ] Postman collection updated with INCOME + EXPENSE examples
- [ ] Manual tests pass: POST/GET/PUT with both types
- [ ] Backend compiles without errors

### Frontend (existing code must not break)
- [ ] types/transaction.ts: add TransactionType enum + type field to Transaction and TransactionCreateRequest
- [ ] new/page.tsx: add type select field (INCOME/EXPENSE) to create form
- [ ] transactionService.ts: create() sends type in POST body
- [ ] TransactionItem.tsx: color logic uses transaction.type instead of amount < 0

## 📡 Endpoint contract

POST /api/transactions (updated)
Request: { amount, type, currency, description, occurredAt, categoryId?, metadata? }
- type is required, values: INCOME | EXPENSE
- amount is always positive (no negative values)
Response: 201 Created with Transaction including type field

PUT /api/transactions/{id} (updated)
Same contract as POST

GET /api/transactions (updated)
Response includes type field for each transaction

## ⚠️ Frontend Breaking Change

The existing frontend WILL break after backend ships type as required:
- POST /api/transactions → 400 Bad Request (type missing in body)
- TransactionItem color logic (amount < 0) always renders green since amount is always positive

All 4 frontend files must be updated in this same card.

## 🧠 Pedagogical Intention

This is a schema change that impacts entire stack:
- Backend: Enum + migration + DTOs + mapper
- Frontend: types, service, form, component all need updating
Dev learns: one model change cascades through every layer.

## 🔗 Full Spec
tools/specs/SPEC-TRANSACTION-TYPES.md

## 🔗 Implementation Sequence
tools/specs/IMPLEMENTATION-SEQUENCE.md
```

---

## Subtasks

```
Backend
1. Create Enum TransactionType (INCOME, EXPENSE)
2. Add type field to Entity Transaction
3. Create Flyway migration V003__add_transaction_type.sql
4. Update TransactionCreateRequest with type field
5. Update TransactionUpdateRequest with type field
6. Update TransactionDTO with type field
7. Update TransactionMapper to map type
8. Test POST with type=INCOME
9. Test POST with type=EXPENSE
10. Test GET returns type field
11. Test PUT updates type field
12. Update Postman collection with examples

Frontend
13. Add TransactionType enum to types/transaction.ts
14. Add type field to Transaction and TransactionCreateRequest interfaces
15. Add type select (INCOME/EXPENSE) to new/page.tsx form
16. Update transactionService.create() to send type in body
17. Fix TransactionItem.tsx: replace amount < 0 with type === 'EXPENSE' for color
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | B — Backend CRUD |
| Priority | High |
| Estimate | 3h |
| Tags | `backend`, `frontend`, `schema-change`, `enum`, `migration` |
| Spec ID | SPEC-TRANSACTION-TYPES |
| Blocks | C4 (SPEC-005) |
| Depends on | Épico B completo |
