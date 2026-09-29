# Card Asana — F5: Platform Quality Gate

## Task Name

```text
[SPEC-010] F5 — Verify platform identity, isolation and deployment readiness
```

## Description

```text
## Objective

Verify that the identity and production foundation meets SPEC-010 before the web
experience and WhatsApp channel rely on it.

## Acceptance Criteria

- [ ] All SPEC-010 acceptance criteria have evidence or a tracked follow-up
- [ ] Cross-owner access tests pass for CRUD and dashboard data
- [ ] Existing data is still present and assigned to the intended pilot owner
- [ ] Phone association and revocation behave as specified
- [ ] HTTPS, secret handling, health checks and database isolation are verified
- [ ] Backup and restore procedure is recorded
- [ ] No credentials or sensitive financial messages appear in logs
- [ ] Open risks and limitations are documented before closing Epic F

## How to verify

Follow the backend, platform and manual smoke-test plan in SPEC-010 and its technical
spec. Use a non-production environment and disposable test identities.

## Full Spec

tools/specs/SPEC-010-epic-f-platform-engineering.md
```

## Subtasks

```text
1. Run backend build and test checks
2. Verify ownership isolation with two test identities
3. Verify phone association lifecycle and revoked-number behavior
4. Verify deployment, HTTPS, secrets, health checks and database exposure
5. Record evidence, follow-ups and final quality-gate result
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | F — Platform Engineering |
| Priority | High |
| Estimate | A estimar |
| Tags | `quality-gate`, `security`, `platform`, `backend` |
| Spec ID | SPEC-010 |
| Depends on | F2, F3, F4 |
| Blocks | G2, H1, H2 |
