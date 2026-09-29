# Card Asana — F2: User and Verified Phone Identity

## Task Name

```text
[SPEC-010] F2 — Create PocketFinance user identity and verified phone association
```

## Description

```text
## Objective

Create the domain and service flow that links a verified phone number to one
PocketFinance user. Keep verification details and channel-specific behavior outside
the transaction domain.

## Acceptance Criteria

- [ ] Introduce a user identity model consistent with the F1 pilot decision
- [ ] A phone number is associated only after the approved verification flow
- [ ] An active phone number cannot identify two users
- [ ] A user can revoke the phone association
- [ ] Unverified or revoked numbers cannot resolve to a financial-data owner
- [ ] Tests cover verification, duplicate association, revocation and unknown phone
- [ ] No verification code, token or full phone number appears in normal logs

## Security Notes

- Never accept a user ID supplied by an unauthenticated message as proof of identity
- Store only the phone representation required by the selected provider and policy
- Keep verification secrets short-lived and out of logs

## Full Spec

tools/specs/SPEC-010-epic-f-platform-engineering.md
```

## Subtasks

```text
1. Add user and phone-association domain models
2. Add persistence migration and repository constraints
3. Implement verification and association service
4. Implement revocation and duplicate-number handling
5. Add unit and integration tests for identity lifecycle
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | F — Platform Engineering |
| Priority | High |
| Estimate | A estimar |
| Tags | `backend`, `identity`, `privacy`, `security` |
| Spec ID | SPEC-010 |
| Depends on | F1, D6, E6 |
| Blocks | F3, F4, H2 |
