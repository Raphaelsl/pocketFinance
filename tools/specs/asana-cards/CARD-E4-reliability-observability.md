# Card Asana — E4: Fallbacks, Observability & Guardrails

## Task Name

```text
[SPEC-009] E4 — Add fallbacks, token observability and input guardrails
```

---

## Description

```text
## Objective

Make the suggest endpoint production-grade. This card does not add visible product
features — it makes the system reliable, observable and cost-aware. The Dev will
learn what separates a demo from software that can run in production.

## Acceptance Criteria

- [ ] Log prompt tokens, completion tokens and model name per LLM call at INFO level:
      "AI suggest | tokens_prompt={} tokens_completion={} model={}"
- [ ] Use ChatResponse.getMetadata().getUsage() to extract token counts
- [ ] The 503 handler set in E3 is verified to work: mock the parser to throw an
      exception and confirm the response is 503 with the correct error body
- [ ] Input guardrail already exists (400 for empty / >500 chars from E3) — verify
      with a test that a 501-character input never reaches the LLM
- [ ] Add a TL spike session: open the OpenAI usage dashboard and calculate the cost
      of the calls made during E1–E3. Document the estimated cost per 1000 requests.
- [ ] No rawInput content appears in INFO-level logs
- [ ] All existing E3 tests continue to pass

## Pedagogical Spike (TL session)

This card exists to make a specific point:

"You now know how to call an LLM and get a structured response.
What happens when it's down? How much did every call we made this week cost?
If 1000 users use this daily, what's the monthly bill?
What happens if someone sends 500 characters of garbage to exploit token usage?"

The Dev should leave this card understanding that AI components have operational
cost, failure modes and attack surface — just like any other external dependency.

## Full Spec

tools/specs/SPEC-009-epic-e-ai-engineering.md
```

---

## Subtasks

```text
1. Add structured token logging using ChatResponse.getMetadata().getUsage()
2. Write a test that mocks the parser to throw — verify 503 response body
3. Write a test that sends 501 characters — verify the LLM is never called
4. TL spike: open OpenAI dashboard, review usage from E1–E3, estimate cost at scale
5. Document cost estimate in a comment or card notes
6. Run full test suite and confirm no regressions
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | E — AI Engineering |
| Priority | High |
| Estimate | 3h |
| Tags | `backend`, `observability`, `reliability`, `guardrails`, `cost`, `tests` |
| Spec ID | SPEC-009 |
| Depends on | E3 |
| Blocks | E6 |
