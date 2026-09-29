# Card Asana — H1: WhatsApp Webhook Adapter

## Task Name

```text
[SPEC-012] H1 — Receive and validate WhatsApp messages through a channel adapter
```

## Description

```text
## Objective

Create the inbound/outbound channel boundary for WhatsApp messages. Validate
provider events and normalize them before conversation or finance logic runs.

## Acceptance Criteria

- [ ] Webhook origin is validated using the selected provider's mechanism
- [ ] Valid inbound text events are normalized to a provider-independent contract
- [ ] Invalid or unsupported events are rejected safely and observably
- [ ] Duplicate provider event IDs are not processed twice
- [ ] Outbound replies use a channel port and do not leak provider details to domain
- [ ] Provider credentials are configured outside the repository
- [ ] Adapter tests use provider mocks; no test calls a real provider
- [ ] Sandbox smoke test confirms inbound and outbound text delivery

## Security Notes

- Verify every webhook before processing its sender or message
- Do not log full message content, access tokens or phone numbers
- Apply request-size and basic abuse limits before model calls

## Full Spec

tools/specs/SPEC-012-epic-h-whatsapp-assistant.md
```

## Subtasks

```text
1. Select provider and record API/webhook contract from the technical spec
2. Define normalized inbound and outbound message ports
3. Implement webhook verification and event normalization
4. Add event idempotency and safe failure responses
5. Add provider-mocked tests and sandbox smoke instructions
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | H — WhatsApp Financial Assistant |
| Priority | High |
| Estimate | A estimar |
| Tags | `backend`, `whatsapp`, `webhook`, `integration`, `security` |
| Spec ID | SPEC-012 |
| Depends on | F5, G6 |
| Blocks | H2 |
