# Card Asana — C5: Delete Transaction Flow

## Task Name
```
[SPEC-006] C5 — Delete Transaction: confirmation modal + useMutation
```

---

## Description

```
## 🎯 Objective

Implement the transaction deletion flow with confirmation modal,
reusing the useMutation pattern already learned in C4.

Focus on destructive action UX: mandatory confirmation, button loading state,
error feedback, and automatic list update via React Query cache.

## ✅ Acceptance Criteria

- [ ] "Delete" button on each item opens confirmation modal
- [ ] Modal displays transaction description and Cancel / Delete buttons
- [ ] On confirm: calls DELETE /api/transactions/{id}
- [ ] During DELETE: button disabled with loading state
- [ ] On success: modal closes and item disappears from list (cache invalidated)
- [ ] On error: error message displayed in modal
- [ ] transactionService.delete() implemented

## 📡 Endpoint consumed

DELETE /api/transactions/{id} → 204 No Content

## 🧠 Pedagogical Spike (TL applies before closing card)

"Notice that useMutation + invalidateQueries is the same pattern as C4.
Once you learn the pattern, it repeats — DELETE, POST, PUT, GET,
they all follow the same structure. That's by design."

## 🔗 Full Spec
tools/specs/SPEC-006-delete-transaction-flow.md
```

---

## Subtasks

```
1. Implement transactionService.delete(id)
2. Create components/ConfirmDeleteModal.tsx
3. Add useMutation to list page for DELETE operation
4. Connect "Delete" button in TransactionItem — open modal with id and description
5. Implement loading state on modal button during DELETE
6. Implement error handling inside modal
7. Test full flow — item disappears from list after confirmation
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | C — Frontend |
| Priority | Medium |
| Estimate | 2h |
| Tags | `frontend`, `delete`, `modal`, `ux` |
| Spec ID | SPEC-006 |
| Depends on | C4 (SPEC-005) |
