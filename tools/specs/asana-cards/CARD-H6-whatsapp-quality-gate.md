# Card Asana — H6: WhatsApp Assistant Quality Gate

## Task Name

```text
[SPEC-012] H6 — Verify the WhatsApp assistant end-to-end
```

## Description

```text
## Objective

Verify that the WhatsApp channel, conversation workflows and financial protections
meet SPEC-012 in the provider sandbox before closing the epic.

## Acceptance Criteria

- [ ] All SPEC-012 acceptance criteria have evidence or tracked follow-up
- [ ] Unlinked, linked, revoked and opt-out sender journeys are verified
- [ ] Create flow covers clear input, clarification, edit, confirm and cancel
- [ ] Duplicate webhooks do not duplicate messages or transactions
- [ ] Queries match backend aggregates for period, currency and owner
- [ ] Correction/cancellation identifies the right transaction and confirms first
- [ ] Provider/model outages are reported without false success
- [ ] Logs contain no full financial message, credentials or verification codes
- [ ] Automated tests use mocks; sandbox manual test completes successfully

## How to verify

Use the sandbox procedure and test identities defined in SPEC-012. Do not use
production financial data.

## Full Spec

tools/specs/SPEC-012-epic-h-whatsapp-assistant.md
```

## Subtasks

```text
1. Run backend build and tests
2. Verify webhook signature, retry and idempotency behavior
3. Run create, query, correction and cancellation journeys in sandbox
4. Verify user isolation and opt-out behavior
5. Review logs and failure messages for sensitive data
6. Record evidence, limitations and quality-gate outcome
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | H — WhatsApp Financial Assistant |
| Priority | High |
| Estimate | A estimar |
| Tags | `quality-gate`, `whatsapp`, `backend`, `security`, `product` |
| Spec ID | SPEC-012 |
| Depends on | H1, H2, H3, H4, H5 |
| Blocks | Next channel/automation epic |
