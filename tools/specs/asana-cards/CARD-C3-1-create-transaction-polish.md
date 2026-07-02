# Card Asana — C3.1: Create Transaction Polish

## Task Name
```
[SPEC-004] C3.1 — Polish Create Transaction: UX, validation and code cleanup
```

---

## Description

```
## 🎯 Objective

Polish the transaction creation flow before starting SPEC-005.
The feature is functionally complete, but needs a small quality pass to make the
form more robust, easier to maintain, and visually consistent with the list page.

This card should stay surgical: do not introduce React Hook Form or React Query here,
because those concepts belong to SPEC-005.

## ✅ Acceptance Criteria

- [ ] /transactions/new keeps the current manual useState implementation
- [ ] Amount input stores raw input as string and converts to number only on submit
- [ ] Currency validation accepts only 3-letter ISO-like values, e.g. BRL, USD, EUR
- [ ] Submit trims and normalizes currency/description before sending to API
- [ ] Validation messages are clear and shown next to each field
- [ ] UI spacing, labels, buttons and error states are consistent with /transactions
- [ ] Comments that explain obvious code are removed or reduced
- [ ] Existing transaction creation flow still redirects to /transactions on success
- [ ] npm run lint has no new errors from the touched files

## 🧠 Feedback to Dev

Good work completing the create flow end-to-end. The implementation shows the right
learning points for C3: controlled inputs, local validation, loading state, service
call and redirect after success.

Before moving to C4, let's do a small polish pass. This is normal junior-level
cleanup: make the form handle empty numeric input better, validate currency more
strictly, reduce noisy comments, and keep the UI consistent with the transactions
list. Do not refactor to React Hook Form yet; that comparison is the purpose of C4.

## 🔗 Related Spec
tools/specs/SPEC-004-create-transaction-page.md
```

---

## Subtasks

```
1. Change amount state from number to string in app/transactions/new/page.tsx
2. Convert amount with Number(amount) only inside handleSubmit
3. Add currency validation for 3-letter uppercase code
4. Normalize payload: currency.trim().toUpperCase(), description.trim()
5. Review error messages and keep them close to the field
6. Remove comments that only restate what the code already says
7. Verify /transactions/new manually with valid and invalid inputs
8. Run npm run lint and document any unrelated pre-existing issue
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | C — Frontend |
| Priority | Medium |
| Estimate | 1h |
| Tags | `frontend`, `form`, `ux-polish`, `validation`, `cleanup` |
| Spec ID | SPEC-004 |
| Depends on | C3 (SPEC-004) |
| Blocks | C4 (SPEC-005) |
