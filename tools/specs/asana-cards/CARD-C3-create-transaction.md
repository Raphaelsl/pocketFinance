# Card Asana — C3: Create Transaction Page

## Task Name
```
[SPEC-004] C3 — Create Transaction: useState manual + form validation
```

---

## Description

```
## 🎯 Objective

Create a transaction creation page consuming POST /api/transactions.
Uses manual useState for each field and manual validation intentionally
so Dev feels the boilerplate before knowing React Hook Form in C4.

## ✅ Acceptance Criteria

- [ ] Form accessible at /transactions/new
- [ ] Form fields: amount, currency, description, occurredAt
- [ ] Local validation before submit (empty field, negative amount)
- [ ] Validation error message displayed per field
- [ ] Loading state while POST is in flight
- [ ] On success: redirect to /transactions
- [ ] On API error: display error message
- [ ] "New Transaction" button added to list page (C2)
- [ ] transactionService.create() implemented

## 📡 Endpoint consumed

POST /api/transactions
Request: { amount, currency, description, occurredAt, categoryId?, metadata? }
Response: 201 Created with Transaction object

## 🧠 Pedagogical Intention

Use manual useState for each field to feel:
- How many useState do I need for 4 fields? 7 total!
- State management becomes verbose quickly
- Validation logic is repetitive and error-prone
(In C4 React Hook Form eliminates this boilerplate with register())

## 🔗 Full Spec
tools/specs/SPEC-004-create-transaction-page.md
```

---

## Subtasks

```
1. Implement transactionService.create(data)
2. Create app/transactions/new/page.tsx with useState for each field
3. Implement validate() function with field-level validation rules
4. Implement handleSubmit with loading state and redirect on success
5. Display validation errors per field in the form
6. Display API error message when POST fails
7. Add "New Transaction" button to list page (link to /transactions/new)
8. Test full flow — transaction appears in list after creation
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | C — Frontend |
| Priority | High |
| Estimate | 3h |
| Tags | `frontend`, `form`, `useState`, `validation` |
| Spec ID | SPEC-004 |
| Depends on | C2 (SPEC-003) |
