# Card Asana — E5: Frontend — Natural Language Input UI

## Task Name

```text
[SPEC-009] E5 — Add natural language input that pre-fills the transaction form
```

---

## Description

```text
## Objective

Add a natural language input section above the existing form on /transactions/new.
When the user clicks "Analisar", the system calls POST /api/transactions/suggest and
pre-fills the form with the suggestion. The user reviews, edits if needed, and saves
normally. The manual form must always remain accessible.

## Acceptance Criteria

- [ ] Add suggestTransaction(input) to transactionService.ts
- [ ] Add useSuggestTransaction() hook using useMutation
- [ ] Add NaturalLanguageInput component above the form on /transactions/new
- [ ] "Analisar" button is disabled while loading; show spinner and "Analisando..." text
- [ ] On success: show confidence banner (green = HIGH, yellow = MEDIUM/LOW)
- [ ] On success: call reset(suggestion) to pre-fill all matching form fields
- [ ] Fields remain fully editable after pre-fill
- [ ] "Limpar sugestão" link resets the form to the empty initial state
- [ ] On 422 PARSING_FAILED: show red banner with the backend message; form is cleared
- [ ] On 503: show red banner "Serviço indisponível. Use o formulário abaixo."; form stays usable
- [ ] On confirmation: POST /api/transactions payload includes metadata
      { source: "LLM", model: "gpt-4o-mini", rawInput: "...", confidence: "..." }
- [ ] metadata is assembled in transactionService.ts — invisible to the user
- [ ] Component tests cover: idle, loading, success HIGH, success LOW, PARSING_FAILED, 503
- [ ] Tests query elements by role and label — no CSS class coupling

## Security Notes

- Render all suggestion fields as React text — never use dangerouslySetInnerHTML
- Do not show rawInput or metadata to the user in the UI
- suggestedCategoryName is treated as plain text — no HTML rendering

## Full Spec

tools/specs/SPEC-009-epic-e-ai-engineering.md
```

---

## Subtasks

```text
1. Add suggestTransaction(input) to transactionService.ts
2. Add types for SuggestionResponse and SuggestionRequest
3. Implement useSuggestTransaction() with useMutation
4. Build NaturalLanguageInput component (input + Analisar button)
5. Add confidence banner with HIGH/MEDIUM/LOW visual treatment
6. Wire reset(suggestion) to pre-fill the existing React Hook Form
7. Add "Limpar sugestão" link and reset to empty state behavior
8. Add metadata to the confirmation payload in transactionService.ts
9. Write component tests for all UI states
10. Test the full flow manually end-to-end in the browser
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | E — AI Engineering |
| Priority | High |
| Estimate | 3h |
| Tags | `frontend`, `nextjs`, `react-query`, `natural-language`, `ai-product`, `tests` |
| Spec ID | SPEC-009 |
| Depends on | E3 |
| Blocks | E6 |
