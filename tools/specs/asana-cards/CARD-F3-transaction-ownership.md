# Card Asana — F3: Transaction Ownership and Isolation

## Task Name

```text
[SPEC-010] F3 — Scope transactions and financial queries to their owner
```

## Description

```text
## Objective

Associate existing and new transactions with a user and enforce ownership across
CRUD and dashboard queries. Preserve current data with an explicit Flyway backfill.

## Acceptance Criteria

- [ ] Every transaction has a valid owner after migration
- [ ] Existing transactions are backfilled to the pilot owner without data loss
- [ ] Create, list, detail, update and delete use the authenticated owner
- [ ] Dashboard totals and breakdowns are scoped to the same owner
- [ ] A user cannot read or mutate another user's transaction by UUID
- [ ] Missing identity never falls back to a global query
- [ ] Tests cover cross-owner access for CRUD and dashboard aggregation
- [ ] Migration and rollback/recovery notes are documented

## Full Spec

tools/specs/SPEC-010-epic-f-platform-engineering.md
```

## Subtasks

```text
1. Add transaction ownership relation and database constraints
2. Create and verify the historical-data backfill migration
3. Pass owner context through transaction services and repositories
4. Scope dashboard queries and category behavior per F1 decision
5. Add cross-owner authorization and migration tests
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | F — Platform Engineering |
| Priority | High |
| Estimate | A estimar |
| Tags | `backend`, `database`, `authorization`, `privacy` |
| Spec ID | SPEC-010 |
| Depends on | F1, F2 |
| Blocks | F4, F5, G3, G4, H3, H4, H5 |
