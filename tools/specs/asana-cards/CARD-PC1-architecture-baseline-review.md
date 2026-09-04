# Card Asana — PC1: Architecture Baseline Review

## Task Name
```
[SPEC-007] PC1 — Architecture baseline review after Epic C
```

---

## Description

```
## Objective

Map the current frontend architecture after Epic C and identify exactly what should
be refactored in Pos-C.

This card is intentionally short. Do not refactor yet; first make the repetition
visible to the Dev and decide what belongs in page, hook, service and component.

## Acceptance Criteria

- [ ] Review /transactions, /transactions/new and /transactions/{id}/edit
- [ ] Identify repeated React Query mutation patterns
- [ ] Identify repeated payload normalization between create and edit
- [ ] Identify page responsibilities that can move to domain hooks
- [ ] Identify comments or eslint-disable lines that are no longer useful
- [ ] Write a short checklist in the PR description or task comment
- [ ] No production code behavior changes in this card

## Security and Quality Notes

- Keep API errors user-safe; do not expose stack traces or raw backend internals.
- Do not introduce secrets into NEXT_PUBLIC_* variables.
- Do not replace server-side validation with frontend-only checks.

## Full Spec
tools/specs/SPEC-007-post-c-architecture-code-quality.md
```

---

## Subtasks

```
1. Read the transaction pages and service files end-to-end
2. Mark what is page orchestration vs reusable domain behavior
3. Compare create vs edit payload construction
4. Inspect delete modal responsibilities in the list page
5. Inspect tests for behavior vs CSS/class coupling
6. Produce a short refactor checklist for PC2-PC5
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Phase | Pos-C — Architecture & Code Quality |
| Priority | High |
| Estimate | 45min |
| Tags | `frontend`, `architecture`, `review`, `pos-c` |
| Spec ID | SPEC-007 |
| Depends on | Epic C complete |
| Blocks | PC2, PC3, PC4 |

