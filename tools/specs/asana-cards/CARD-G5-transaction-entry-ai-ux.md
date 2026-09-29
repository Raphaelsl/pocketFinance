# Card Asana — G5: Transaction Entry and AI UX

## Task Name

```text
[SPEC-011] G5 — Unify manual and natural-language transaction entry
```

## Description

```text
## Objective

Make creating and editing a transaction clear and low-friction. Integrate the
existing suggestion flow as an optional fast path and keep the manual form available.

## Acceptance Criteria

- [ ] Page heading, supporting copy and actions have readable contrast
- [ ] Form labels and validation messages use friendly Portuguese
- [ ] Type options display Receita and Despesa, never raw enum values
- [ ] Natural-language suggestion is clearly optional and separate from saving
- [ ] Suggested values remain editable and require explicit submit to persist
- [ ] Parsing failure leaves the manual form usable and preserves useful feedback
- [ ] Success, submitting and save-error states are visually distinct
- [ ] Create/edit forms share spacing, fields, buttons and responsive behavior

## Security Notes

- Render model output as text, never as HTML
- Do not expose rawInput or technical metadata in the UI
- Do not imply a transaction was saved before the create API succeeds

## Full Spec

tools/specs/SPEC-011-epic-g-web-product-experience.md
tools/specs/SPEC-009-epic-e-ai-engineering.md
```

## Subtasks

```text
1. Normalize page layout and headings for create/edit routes
2. Replace internal enum labels and improve value/date input guidance
3. Restyle NaturalLanguageInput and confidence/error feedback
4. Preserve editable fields and explicit confirmation semantics
5. Verify keyboard, validation, loading and save-failure states
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | G — Web Product Experience |
| Priority | High |
| Estimate | A estimar |
| Tags | `frontend`, `forms`, `natural-language`, `ux`, `accessibility` |
| Spec ID | SPEC-011 |
| Depends on | G2, E6 |
| Blocks | G6 |
