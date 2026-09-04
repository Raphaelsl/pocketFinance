# Card Asana — E3: Suggest Workflow, Validation & API

## Task Name

```text
[SPEC-009] E3 — Build the suggest workflow with domain validation and HTTP API
```

---

## Description

```text
## Objective

Build POST /api/transactions/suggest as a production-ready endpoint. This includes
domain validation of the LLM output, the TransactionParserPort interface to isolate
Spring AI from business logic, and the two-step flow: suggest → user confirms → save.

## Acceptance Criteria

- [ ] Create TransactionParserPort interface with a single parse(String input) method
- [ ] Create SpringAiTransactionParser implementing TransactionParserPort
- [ ] Create TransactionSuggestionValidator that applies all domain rules to the result:
      amount > 0, type is INCOME or EXPENSE (uppercase), currency is 3 uppercase letters,
      occurredAt is parseable to OffsetDateTime, description is non-empty after trim
- [ ] Create TransactionSuggestService that uses the port and runs the validator
- [ ] Create TransactionSuggestController with POST /api/transactions/suggest
- [ ] Input validation in the controller: reject empty input and input > 500 characters with 400
- [ ] Return 200 with SuggestionResponse on success
      (suggestion fields + confidence + rawInput)
- [ ] Return 422 PARSING_FAILED when validation fails, with a human-readable message
- [ ] Return 503 AI_SERVICE_UNAVAILABLE by translating LLM exceptions in ControllerAdvice
- [ ] Remove the spike endpoint from E1
- [ ] Unit tests for TransactionSuggestService using a mock TransactionParserPort
- [ ] Unit tests for TransactionSuggestionValidator covering each invalid field case
- [ ] Integration test for 400, 422 and 200 via controller

## API

POST /api/transactions/suggest
Body: { "input": "Gastei R$ 150 no mercado ontem." }

Success 200:
{
  "suggestion": { amount, type, currency, description, occurredAt, suggestedCategoryName },
  "confidence": "HIGH",
  "rawInput": "..."
}

Failure 422: { "error": "PARSING_FAILED", "message": "...", "rawInput": "..." }
Failure 400: { "error": "INVALID_INPUT", "message": "..." }
Failure 503: { "error": "AI_SERVICE_UNAVAILABLE", "message": "..." }

## Security Notes

- Validate input length before calling the LLM — do not spend tokens on invalid input
- Never concatenate rawInput into SQL or JPQL
- Translate LLM exceptions through ControllerAdvice — never expose SDK internals
- Do not log rawInput at INFO level — it may contain sensitive financial data

## Full Spec

tools/specs/SPEC-009-epic-e-ai-engineering.md
```

---

## Subtasks

```text
1. Create TransactionParserPort interface
2. Create SpringAiTransactionParser implementing the port
3. Create TransactionSuggestionValidator with all domain rules
4. Create TransactionSuggestService orchestrating port + validator
5. Create TransactionSuggestController with input validation
6. Add ControllerAdvice entries for 422 and 503 cases
7. Remove spike endpoint from E1
8. Write unit tests for service (mocked port) and validator
9. Write integration tests for controller
10. Test manually end-to-end with Postman
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | E — AI Engineering |
| Priority | High |
| Estimate | 4h |
| Tags | `backend`, `spring-ai`, `validation`, `workflow`, `tests` |
| Spec ID | SPEC-009 |
| Depends on | E2 |
| Blocks | E4, E5 |
