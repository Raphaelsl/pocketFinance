# Card Asana — PC4: Accessibility Pass for Modal and Forms

## Task Name
```
[SPEC-007] PC4 — Accessibility pass for delete modal and transaction forms
```

---

## Description

```
## Objective

Improve accessibility for the destructive delete flow and transaction forms.

The modal already works visually. Pos-C should make it behave like a real dialog:
screen-reader semantics, keyboard handling and clear error associations.

## Acceptance Criteria

- [ ] ConfirmDeleteModal exposes dialog semantics with role="dialog"
- [ ] Modal has aria-modal, accessible title and description
- [ ] Cancel/confirm actions are reachable and clear by keyboard
- [ ] Escape closes the modal or there is a documented reason not to support it
- [ ] Error message is announced or associated with the dialog content
- [ ] Form inputs keep label/htmlFor associations
- [ ] Invalid fields expose aria-invalid and, where useful, aria-describedby
- [ ] Tests assert accessibility behavior with Testing Library roles

## Security and Quality Notes

- Render transaction description as plain React text; do not use dangerouslySetInnerHTML.
- Keep destructive action explicit; no delete without user confirmation.
- Error messages should be useful without leaking internal API details.

## Full Spec
tools/specs/SPEC-007-post-c-architecture-code-quality.md
```

---

## Subtasks

```
1. Add dialog semantics to ConfirmDeleteModal
2. Wire accessible title and description IDs
3. Add keyboard behavior for Escape if feasible without new dependency
4. Review form labels and error associations in create/edit pages
5. Update ConfirmDeleteModal tests to query by role and accessible name
6. Add one regression test for destructive confirmation behavior
7. Run npm test for modal and form tests
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Phase | Pos-C — Architecture & Code Quality |
| Priority | Medium |
| Estimate | 1h |
| Tags | `frontend`, `accessibility`, `modal`, `forms`, `tests` |
| Spec ID | SPEC-007 |
| Depends on | PC1 |
| Blocks | PC5 |

