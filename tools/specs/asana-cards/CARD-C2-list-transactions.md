# Card Asana — C2: List Transactions Page

## Task Name
```
[SPEC-003] C2 — List Transactions: fetch + useState + pagination
```

---

## Description

```
## 🎯 Objective

Create a transactions list page consuming GET /api/transactions.
Uses fetch + useState intentionally so Dev feels the manual work
of loading, error, and pagination management — before learning React Query in C4.

## ✅ Acceptance Criteria

- [ ] Page accessible at /transactions
- [ ] Displays list of transactions from backend
- [ ] Shows loading state while waiting for response
- [ ] Displays error message if fetch fails
- [ ] Displays message when list is empty
- [ ] Functional pagination (Previous / Next buttons)
- [ ] transactionService.list() implemented and called by page
- [ ] Edit and Delete buttons visible on each item (logic not yet implemented)

## 📡 Endpoint consumed

GET /api/transactions?page=0&size=10

## 🧠 Pedagogical Intention

Use fetch + useState manually to feel:
- manual loading state management
- manual error state management
- manual refetch when changing page
(In C4 React Query handles all of this automatically)

## 🔗 Full Spec
tools/specs/SPEC-003-list-transactions-page.md
```

---

## Subtasks

```
1. Implement transactionService.list(page, size)
2. Create TransactionItem component
3. Create TransactionsPage with useState for data/loading/error/page
4. Implement useEffect that calls service on mount and when page changes
5. Implement loading state (display "Loading...")
6. Implement error state (display error message)
7. Implement pagination (Previous/Next buttons with state)
8. Test with backend running — real data from Postgres
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | C — Frontend |
| Priority | High |
| Estimate | 3h |
| Tags | `frontend`, `list`, `fetch`, `pagination` |
| Spec ID | SPEC-003 |
| Depends on | C1 (SPEC-002) |
