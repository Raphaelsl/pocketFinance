# Card Asana — E6: AI Quality Gate

## Task Name

```text
[SPEC-009] E6 — Run the AI Engineering quality gate
```

---

## Description

```text
## Objective

Verify that the entire Épico E is complete, consistent and production-ready before
closing the epic. This card does not add new features — it confirms that everything
built in E1–E5 meets the acceptance criteria of SPEC-009 as a whole.

## Acceptance Criteria

- [ ] POST /api/transactions/suggest returns a valid suggestion for a clear Portuguese sentence
- [ ] amount negative from LLM returns 422, not 200
- [ ] type lowercase from LLM returns 422, not 200
- [ ] Empty input returns 400 without calling the LLM
- [ ] Input with 501 characters returns 400 without calling the LLM
- [ ] Mocked LLM exception returns 503 with correct error body
- [ ] OPENAI_API_KEY does not appear in any committed file
      (run: git grep OPENAI_API_KEY -- ':!*.env*' ':!*.gitignore' ':!*.yml.example')
- [ ] Token usage is logged per call (verify in terminal output)
- [ ] Frontend shows all states: loading, HIGH, MEDIUM, LOW confidence, PARSING_FAILED, 503
- [ ] Form is fully editable after pre-fill
- [ ] Confirmed transaction has metadata.source: "LLM" (verify in database or response)
- [ ] Transactions created via the manual form do not have metadata.source: "LLM"
- [ ] All backend and frontend tests pass: build, lint, test
- [ ] No regressions in E1–E5 tests
- [ ] Spike endpoints from E1 are removed from the codebase

## How to verify

Backend:
  ./mvnw verify

Frontend:
  npm run build && npm run lint && npm test -- --watchAll=false

Manual smoke test:
  1. Start the app (docker-compose up + npm run dev)
  2. Go to /transactions/new
  3. Type "Gastei R$ 80 em farmácia ontem" — click Analisar
  4. Confirm the suggestion is correct and pre-fills the form
  5. Save — check the transaction in the list
  6. Type "aaaa" — confirm PARSING_FAILED banner appears
  7. Disconnect from the internet — confirm 503 banner appears

## Full Spec

tools/specs/SPEC-009-epic-e-ai-engineering.md
```

---

## Subtasks

```text
1. Run full backend test suite and fix any failures
2. Run full frontend test suite and fix any failures
3. Run git grep to confirm API key is not committed
4. Run smoke test manually in the browser (steps above)
5. Confirm token logging appears in backend terminal output
6. Confirm metadata in a saved transaction via database or API response
7. Close Épico E cards in Asana
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | E — AI Engineering |
| Priority | High |
| Estimate | 1h |
| Tags | `quality-gate`, `backend`, `frontend`, `ai-engineering`, `tests` |
| Spec ID | SPEC-009 |
| Depends on | E4, E5 |
| Blocks | Épico F |
