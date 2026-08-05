# Card Asana — E2: Structured Output — TransactionSuggestionResult

## Task Name

```text
[SPEC-009] E2 — Parse natural language into a structured transaction using Structured Output
```

---

## Description

```text
## Objective

Replace the spike's free-text response with a typed Java record using Spring AI's
Structured Output. The LLM must return a JSON that maps directly to
TransactionSuggestionResult. This card closes the problem opened in E1.

## Acceptance Criteria

- [ ] Create TransactionSuggestionResult record with fields:
      amount (BigDecimal), type (String), currency (String), description (String),
      occurredAt (String), suggestedCategoryName (String), confidence (String)
- [ ] Replace spike call with .entity(TransactionSuggestionResult.class) via Spring AI
- [ ] Write the system prompt with domain rules injected (currentDate, uppercase type,
      positive amount, ISO-8601 occurredAt, BRL default currency)
- [ ] Keep the spike endpoint for manual comparison during the spike session with TL
- [ ] Test manually: "Gastei R$ 150 no mercado ontem" must return a populated record
- [ ] Test manually: "Recebi meu salário hoje" must return type INCOME
- [ ] Test manually: edge case where the input is ambiguous — observe the result and
      note whether amount or type could be wrong

## Pedagogical Spike

After this card the TL should show:
- Run the same input 3 times. Is the result always identical?
- Change the input to "me devia 200 reais" — does amount come back as -200?
- Change to "expense" lowercase in the prompt — does the model always uppercase it?

The Dev will see that the LLM does not always follow domain rules.
This discomfort is intentional. E3 adds the validator.

## Full Spec

tools/specs/SPEC-009-epic-e-ai-engineering.md
```

---

## Subtasks

```text
1. Create TransactionSuggestionResult record
2. Write the system prompt with all domain rules
3. Replace free-text call with .entity(TransactionSuggestionResult.class)
4. Test happy path manually with at least three different inputs
5. Test edge cases: ambiguous date, negative amount, lowercase type
6. Document findings in a comment or card notes for the TL spike session
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | E — AI Engineering |
| Priority | High |
| Estimate | 2h |
| Tags | `backend`, `spring-ai`, `structured-output`, `openai`, `parsing` |
| Spec ID | SPEC-009 |
| Depends on | E1 |
| Blocks | E3 |
