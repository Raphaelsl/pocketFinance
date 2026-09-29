# Card Asana — H5: Correct or Cancel a Transaction in WhatsApp

## Task Name

```text
[SPEC-012] H5 — Find and confirm a transaction correction or cancellation
```

## Description

```text
## Objective

Let a user correct or cancel an existing transaction through a conversation while
preventing edits to the wrong record.

## Acceptance Criteria

- [ ] Search is restricted to the verified owner and a bounded recent/history set
- [ ] One exact candidate is summarized before requesting confirmation
- [ ] Multiple matching transactions produce a short choice list
- [ ] Update and delete require explicit confirmation tied to the selected record
- [ ] Canceling the operation leaves the original transaction unchanged
- [ ] Successful changes are reflected in the web dashboard/history
- [ ] Missing or inaccessible records return a privacy-safe response
- [ ] Tests cover one result, multiple results, no result, cancel and retry

## Full Spec

tools/specs/SPEC-012-epic-h-whatsapp-assistant.md
```

## Subtasks

```text
1. Define search phrases and supported correction fields
2. Search recent transactions within the verified owner scope
3. Implement single-candidate summary and multiple-candidate selection
4. Confirm and execute update/delete using existing domain services
5. Add tests for ambiguity, cancellation, ownership and duplicate events
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | H — WhatsApp Financial Assistant |
| Priority | Medium |
| Estimate | A estimar |
| Tags | `backend`, `whatsapp`, `transactions`, `conversation`, `safety` |
| Spec ID | SPEC-012 |
| Depends on | H3, F3 |
| Blocks | H6 |
