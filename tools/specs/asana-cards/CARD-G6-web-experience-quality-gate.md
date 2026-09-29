# Card Asana — G6: Web Experience Quality Gate

## Task Name

```text
[SPEC-011] G6 — Verify the redesigned web experience
```

## Description

```text
## Objective

Verify the redesigned journeys and shared UI against SPEC-011 before using the web
app as the companion surface for the WhatsApp assistant.

## Acceptance Criteria

- [ ] All SPEC-011 acceptance criteria have evidence or a tracked follow-up
- [ ] Walkthrough covers dashboard, create, list, edit and delete tasks
- [ ] Mobile and desktop layouts have no blocking overflow or clipped controls
- [ ] Keyboard navigation, focus, labels, contrast and chart alternatives are checked
- [ ] Empty, loading, error, success and refreshing states are checked
- [ ] No raw enum values or demo values appear as user-facing product content
- [ ] Build, lint and component tests pass
- [ ] Critical usability findings are fixed or explicitly recorded

## How to verify

Use the walkthrough and accessibility checks defined in SPEC-011. Include at least
one narrow viewport and one desktop viewport.

## Full Spec

tools/specs/SPEC-011-epic-g-web-product-experience.md
```

## Subtasks

```text
1. Run frontend build, lint and component tests
2. Walk through first dashboard visit and empty state
3. Create by natural language and by manual form
4. Find, edit and delete a transaction
5. Check responsive behavior and keyboard accessibility
6. Record quality-gate evidence and remaining issues
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | G — Web Product Experience |
| Priority | High |
| Estimate | A estimar |
| Tags | `quality-gate`, `frontend`, `ux`, `accessibility` |
| Spec ID | SPEC-011 |
| Depends on | G3, G4, G5 |
| Blocks | H1 |
