# Card Asana — F1: Pilot Identity Scope

## Task Name

```text
[SPEC-010] F1 — Decide pilot identity, account and data ownership scope
```

## Description

```text
## Objective

Close product and domain decisions needed before user ownership and authentication
are implemented. Record the pilot audience, web access and category ownership in
SPEC-010 so downstream cards have one agreed contract.

## Acceptance Criteria

- [ ] Decide whether the pilot accepts one authorized number or multiple users
- [ ] Decide whether the web dashboard requires login in the pilot
- [ ] Decide whether categories are shared or owned by each user
- [ ] Define the verified-phone association and revocation user journeys
- [ ] Record decisions and their rationale in SPEC-010
- [ ] Identify the data migration/backfill impact for current transactions

## Full Spec

tools/specs/SPEC-010-epic-f-platform-engineering.md
```

## Subtasks

```text
1. Review current user, transaction, category and API model
2. Confirm the pilot audience and onboarding expectation
3. Define the expected dashboard authentication experience
4. Decide shared versus user-owned categories
5. Update SPEC-010 decisions and dependencies
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | F — Platform Engineering |
| Priority | High |
| Estimate | A estimar |
| Tags | `product`, `identity`, `domain`, `decision` |
| Spec ID | SPEC-010 |
| Depends on | None — can start now |
| Blocks | F2, F3, G2 |
