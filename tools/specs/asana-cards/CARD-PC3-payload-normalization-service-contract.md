# Card Asana — PC3: Payload Normalization & Service Contract

## Task Name
```
[SPEC-007] PC3 — Normalize transaction payloads and service contract
```

---

## Description

```
## Objective

Make create and edit send transaction payloads consistently.

Today the project already normalizes currency, description, amount and occurredAt
in the UI. Pos-C should centralize the shared transformation enough to avoid drift,
without hiding validation rules from the Dev.

## Acceptance Criteria

- [ ] Create and edit produce the same TransactionCreateRequest/TransactionUpdateRequest shape
- [ ] currency is trimmed and uppercased consistently
- [ ] description is trimmed consistently
- [ ] amount is converted to number at the boundary, not during every keystroke
- [ ] occurredAt is converted to ISO string consistently
- [ ] transactionService methods remain small and typed
- [ ] User-facing errors stay generic and safe
- [ ] Existing create/edit tests still pass or are updated behavior-first

## Security and Quality Notes

- Frontend validation improves UX but backend remains the source of truth.
- Do not expose raw API error bodies directly to the user.
- Do not put sensitive data or secrets in request URLs.

## Full Spec
tools/specs/SPEC-007-post-c-architecture-code-quality.md
```

---

## Subtasks

```
1. Compare payload construction in new/page.tsx and [id]/edit/page.tsx
2. Create a small local mapper/helper only if it removes real duplication
3. Apply the same normalization rules to create and edit
4. Keep TransactionCreateRequest and TransactionUpdateRequest types explicit
5. Remove comments that only repeat what the code says
6. Update tests around submitted payloads
7. Run npm test for affected frontend tests
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Phase | Pos-C — Architecture & Code Quality |
| Priority | High |
| Estimate | 1h |
| Tags | `frontend`, `types`, `service-layer`, `validation` |
| Spec ID | SPEC-007 |
| Depends on | PC1 |
| Blocks | PC5 |

