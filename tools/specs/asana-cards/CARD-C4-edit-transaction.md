# Card Asana — C4: Edit Transaction Page

## Task Name
```
[SPEC-005] C4 — Edit Transaction: React Query + React Hook Form
```

---

## Description

```
## 🎯 Objective

Create a transaction edit page introducing two new technologies:
React Query (replacing manual fetch + useState from C2) and React Hook Form
(replacing manual useState-per-field from C3).

Dev will directly feel the difference compared to what was done in previous cards.

## ✅ Acceptance Criteria

- [ ] Page accessible at /transactions/{id}/edit
- [ ] Fetches transaction by ID on load (GET /api/transactions/{id})
- [ ] Form is pre-populated with transaction data
- [ ] Form validation via React Hook Form (register + errors)
- [ ] Submit calls PUT /api/transactions/{id}
- [ ] On success: redirect to /transactions with cache invalidated
- [ ] On error: display error message
- [ ] "Edit" button on list page navigates to /transactions/{id}/edit
- [ ] transactionService.getById() and update() implemented

## 📡 Endpoints consumed

GET /api/transactions/{id} → 200 OK with Transaction
PUT /api/transactions/{id} with TransactionUpdateRequest → 200 OK

## 🧠 Pedagogical Spike (TL applies before closing card)

Compare side-by-side with Dev:
- C2: useState(loading) + useState(error) + useEffect + try/catch + finally
  → C4: useQuery() does all of this
- C3: one useState per field + manual validate()
  → C4: register('field', { required, min }) does all of this

"These libraries exist because you were writing the same thing repeatedly."

## 🔗 Full Spec
tools/specs/SPEC-005-edit-transaction-page.md
```

---

## Subtasks

```
1. Install @tanstack/react-query and react-hook-form
2. Create app/providers.tsx with QueryClientProvider
3. Wrap app/layout.tsx with <Providers>
4. Implement transactionService.getById(id) and update(id, data)
5. Create app/transactions/[id]/edit/page.tsx with useQuery
6. Integrate useForm with reset() to pre-populate form fields
7. Implement useMutation for PUT with invalidateQueries on onSuccess
8. Connect "Edit" button on list page — navigate to /transactions/{id}/edit
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | C — Frontend |
| Priority | High |
| Estimate | 4h |
| Tags | `frontend`, `react-query`, `react-hook-form`, `put` |
| Spec ID | SPEC-005 |
| Depends on | C3 (SPEC-004) |
