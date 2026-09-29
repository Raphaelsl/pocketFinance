# Card Asana — H4: Deterministic Finance Queries

## Task Name

```text
[SPEC-012] H4 — Answer WhatsApp finance questions from backend aggregates
```

## Description

```text
## Objective

Answer supported questions about spending, income and categories using the
dashboard/domain services, with the requested period and currency made explicit.

## Acceptance Criteria

- [ ] Supported intents and query limits are documented
- [ ] Period and currency are parsed or clarified before calculating
- [ ] Totals and category values come from backend aggregation services
- [ ] All queries are scoped to the verified owner
- [ ] Response includes the period and currency used
- [ ] Empty results are explained without inventing values
- [ ] Unsupported questions receive a clear fallback and web-dashboard path
- [ ] Tests validate totals against known backend fixtures; model does not calculate

## Full Spec

tools/specs/SPEC-012-epic-h-whatsapp-assistant.md
tools/specs/SPEC-008-epic-d-dashboard-aggregations.md
```

## Subtasks

```text
1. Define supported finance-query intents and sample phrases
2. Resolve period and currency, asking for clarification when ambiguous
3. Call owner-scoped dashboard aggregation service
4. Format concise response with value, period and currency
5. Add tests for totals, empty periods, invalid ranges and unsupported intents
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | H — WhatsApp Financial Assistant |
| Priority | High |
| Estimate | A estimar |
| Tags | `backend`, `whatsapp`, `dashboard`, `aggregation`, `llm-guardrails` |
| Spec ID | SPEC-012 |
| Depends on | H2, D6, F3 |
| Blocks | H6 |
