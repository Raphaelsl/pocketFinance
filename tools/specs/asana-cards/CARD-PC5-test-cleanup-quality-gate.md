# Card Asana — PC5: Test Cleanup & Quality Gate

## Task Name
```
[SPEC-007] PC5 — Test cleanup and Pos-C quality gate
```

---

## Description

```
## Objective

Close Pos-C with a quality gate: tests should describe user-visible behavior,
not implementation details or Tailwind classes.

This card validates the refactors from PC2-PC4 and prepares the codebase for
Epic D without adding new product scope.

## Acceptance Criteria

- [ ] Tests prefer role/text/user behavior over CSS class assertions
- [ ] Tests cover list, create, edit and delete happy paths at the right level
- [ ] Modal tests include accessibility-oriented queries
- [ ] Obvious comments and stale eslint-disable lines are removed
- [ ] npm run lint passes or unrelated pre-existing issues are documented
- [ ] npm test passes
- [ ] Manual smoke test covers list, create, edit and delete against local backend
- [ ] Pos-C notes are added to PR description or task comment

## Security and Quality Notes

- Tests should not require real secrets or production endpoints.
- Do not snapshot sensitive payloads.
- Keep API failure assertions generic and user-safe.

## Full Spec
tools/specs/SPEC-007-post-c-architecture-code-quality.md
```

---

## Subtasks

```
1. Review tests touched by PC2-PC4
2. Replace brittle class assertions with behavior-oriented assertions
3. Remove stale comments and eslint-disable lines
4. Run npm run lint
5. Run npm test
6. Smoke test list/create/edit/delete locally
7. Document remaining known issues before opening Epic D
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Phase | Pos-C — Architecture & Code Quality |
| Priority | High |
| Estimate | 45min |
| Tags | `frontend`, `tests`, `cleanup`, `quality-gate` |
| Spec ID | SPEC-007 |
| Depends on | PC2, PC3, PC4 |
| Blocks | Epic D |

