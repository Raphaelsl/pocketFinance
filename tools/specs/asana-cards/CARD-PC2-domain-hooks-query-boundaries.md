# Card Asana — PC2: Domain Hooks & Query Boundaries

## Task Name
```
[SPEC-007] PC2 — Extract transaction domain hooks and thin pages
```

---

## Description

```
## Objective

Move repeated React Query orchestration into transaction-specific hooks after the
Dev has already implemented the patterns directly in C4 and C5.

The goal is not to create a generic abstraction. Keep hooks named after the domain:
useTransactions, useUpdateTransaction, useDeleteTransaction and, if useful,
useCreateTransaction.

## Acceptance Criteria

- [ ] Existing useTransactions remains the list query entry point
- [ ] Delete mutation orchestration moves out of app/transactions/page.tsx
- [ ] Update mutation orchestration can be reused by the edit page
- [ ] Create mutation is evaluated after comparing with the manual C3 implementation
- [ ] Query keys are consistent and local to the hooks module
- [ ] Pages still own route navigation and screen layout
- [ ] No CRUD behavior changes
- [ ] npm test passes for touched tests

## Security and Quality Notes

- Mutations must keep the correct HTTP verbs: POST, PUT, DELETE.
- Hooks should not swallow errors silently; expose safe UI states to the page.
- Do not log transaction payloads, amounts or user-entered descriptions.

## Full Spec
tools/specs/SPEC-007-post-c-architecture-code-quality.md
```

---

## Subtasks

```
1. Review the current useTransactions hook
2. Define transaction query keys in one local place
3. Extract delete mutation behavior into a transaction hook
4. Extract update mutation behavior if it makes the edit page clearer
5. Evaluate whether create should move now or stay manual for pedagogy
6. Update pages to consume hooks without changing route/UI behavior
7. Run the relevant frontend tests
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Phase | Pos-C — Architecture & Code Quality |
| Priority | High |
| Estimate | 1h30 |
| Tags | `frontend`, `react-query`, `hooks`, `refactor` |
| Spec ID | SPEC-007 |
| Depends on | PC1 |
| Blocks | PC5 |

