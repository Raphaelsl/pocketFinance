# Card Asana — H3: Record a Transaction with Confirmation

## Task Name

```text
[SPEC-012] H3 — Capture, review and confirm a transaction in WhatsApp
```

## Description

```text
## Objective

Let a linked user describe an income or expense in text, resolve missing required
fields, review the result and explicitly confirm before saving.

## Acceptance Criteria

- [ ] Clear text uses the existing transaction suggestion and validation services
- [ ] Missing or ambiguous required fields generate a concise clarification
- [ ] A review message shows amount, type, date and description in human language
- [ ] Confirm persists exactly one transaction for the verified owner
- [ ] Edit or cancel response does not persist the draft
- [ ] Repeated webhook delivery cannot create a duplicate transaction
- [ ] Service or model failure clearly says that no transaction was saved
- [ ] Tests mock the LLM and message provider

## Security Notes

- Confirmation must reference the active draft and verified sender
- Never allow model output to choose a user ID or invoke persistence directly
- Do not store unconfirmed drafts as financial transactions

## Full Spec

tools/specs/SPEC-012-epic-h-whatsapp-assistant.md
tools/specs/SPEC-009-epic-e-ai-engineering.md
```

## Subtasks

```text
1. Route transaction intent through TransactionSuggestService
2. Ask for missing date, amount or transaction type when needed
3. Build localized review, confirm, correct and cancel messages
4. Persist only after explicit confirmation through the transaction service
5. Add idempotency and tests for retries, cancellation and failure
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | H — WhatsApp Financial Assistant |
| Priority | High |
| Estimate | A estimar |
| Tags | `backend`, `whatsapp`, `spring-ai`, `transactions`, `confirmation` |
| Spec ID | SPEC-012 |
| Depends on | H2, E6, F3 |
| Blocks | H5, H6 |
