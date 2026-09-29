# Card Asana — G4: Transaction History UX

## Task Name

```text
[SPEC-011] G4 — Improve transaction history, discovery and row actions
```

## Description

```text
## Objective

Help users understand and find a transaction, then edit or delete it without losing
their place or confusing financial direction and amount.

## Acceptance Criteria

- [ ] Income and expense display as Receita and Despesa
- [ ] Amount, date, description and category have a clear scan order
- [ ] Search and filters are visible and preserve useful context
- [ ] Pagination controls show current position and disabled states clearly
- [ ] Empty result differs from loading and API failure
- [ ] Edit and delete actions are discoverable on desktop and mobile
- [ ] Delete confirmation names the selected transaction and reports failures
- [ ] List content is scoped to the current owner per SPEC-010

## Full Spec

tools/specs/SPEC-011-epic-g-web-product-experience.md
```

## Subtasks

```text
1. Define row/card hierarchy for wide and narrow screens
2. Translate domain values to human-readable labels
3. Improve search, filter and pagination feedback
4. Refine empty, loading, error and delete confirmation states
5. Verify edit/delete navigation returns to a sensible list context
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | G — Web Product Experience |
| Priority | High |
| Estimate | A estimar |
| Tags | `frontend`, `transactions`, `ux`, `responsive` |
| Spec ID | SPEC-011 |
| Depends on | G2, F3 |
| Blocks | G6 |
