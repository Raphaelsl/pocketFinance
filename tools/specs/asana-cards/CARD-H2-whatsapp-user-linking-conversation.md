# Card Asana — H2: Link User and Start Conversation

## Task Name

```text
[SPEC-012] H2 — Resolve verified user identity and conversation state
```

## Description

```text
## Objective

Connect a validated inbound sender to a verified PocketFinance user and maintain a
small, safe conversation state for clarification and confirmation flows.

## Acceptance Criteria

- [ ] Linked sender resolves only to the verified owner from SPEC-010
- [ ] Unknown or revoked sender receives an association/help path without data
- [ ] A conversation can hold a pending draft or clarification, not a saved record
- [ ] Conversation state is isolated by sender and owner
- [ ] Expired or canceled state cannot be used to confirm an old draft
- [ ] Help and opt-out behavior follow the selected provider requirements
- [ ] Tests cover linked, unlinked, revoked, expired and cross-sender cases

## Full Spec

tools/specs/SPEC-012-epic-h-whatsapp-assistant.md
```

## Subtasks

```text
1. Define conversation state and expiration in the technical spec
2. Resolve verified owner from the inbound sender
3. Implement start, resume, expire and cancel conversation operations
4. Add help and opt-out handling
5. Test isolation and expiry behavior
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | H — WhatsApp Financial Assistant |
| Priority | High |
| Estimate | A estimar |
| Tags | `backend`, `identity`, `whatsapp`, `conversation` |
| Spec ID | SPEC-012 |
| Depends on | H1, F2, F5 |
| Blocks | H3, H4 |
