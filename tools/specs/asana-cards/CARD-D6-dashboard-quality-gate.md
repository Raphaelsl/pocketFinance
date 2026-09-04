# Card Asana — D6: Dashboard Quality Gate

## Task Name

```text
[SPEC-008] D6 — Complete the dashboard quality gate
```

---

## Description

```text
## Objective

Close Epic D by validating the dashboard end to end: calculations, filters, responsive
layout, accessibility and failure states must work together against the local backend.

## Acceptance Criteria

- [ ] Backend tests cover summary, currency isolation, boundaries, categories and monthly gaps
- [ ] Frontend tests cover KPI, filters, category breakdown and monthly evolution
- [ ] Test assertions focus on user-visible behavior rather than Tailwind classes
- [ ] Keyboard navigation reaches header links, filters, retry and empty-state actions
- [ ] Loading, error, empty and updating states are visually stable
- [ ] Dashboard is checked at mobile and desktop widths without overlap
- [ ] Manual smoke test compares API totals with known database transactions
- [ ] Mixed-currency smoke test proves currencies are never summed together
- [ ] Backend test suite passes
- [ ] npm run lint, npm test and npm run build pass or pre-existing issues are documented
- [ ] Postman collection contains a valid dashboard request
- [ ] Epic D notes and remaining limitations are documented for the PR

## Security Gate

- Query params are validated and aggregation queries are parameterized
- Error states do not expose stack traces, SQL or internal exception messages
- Category names are rendered as React text without raw HTML
- No credentials or financial payloads are logged or stored in frontend configuration
- The current absence of authentication remains documented as a product limitation

## Full Spec

tools/specs/SPEC-008-epic-d-dashboard-aggregations.md
```

---

## Subtasks

```text
1. Review backend and frontend coverage against SPEC-008
2. Add missing behavior-focused tests
3. Run backend test suite
4. Run frontend lint, tests and production build
5. Smoke test known totals and mixed currencies
6. Inspect responsive and keyboard behavior
7. Document known limitations and Epic D completion evidence
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | D — Product Engineering |
| Priority | High |
| Estimate | 2h |
| Tags | `fullstack`, `tests`, `accessibility`, `security`, `quality-gate` |
| Spec ID | SPEC-008 |
| Depends on | D4, D5 |
| Blocks | Epic E |

