# Card Asana — D3: Period & Currency Filters

## Task Name

```text
[SPEC-008] D3 — Add dashboard period and currency filters
```

---

## Description

```text
## Objective

Let the user change the dashboard period and currency without mixing incomparable
values. Keep the selection in the URL so refresh and shared links preserve context.

## Acceptance Criteria

- [ ] Default selection is the last six months including the current month
- [ ] Provide clear presets for current month, 3 months, 6 months and 12 months
- [ ] Provide a currency control with BRL as the initial value
- [ ] A filter change updates start, end and currency in the URL
- [ ] A reload restores valid filters from the URL
- [ ] Invalid URL values fall back to safe defaults without crashing
- [ ] Every valid filter change creates the expected React Query key and API request
- [ ] The UI prevents start >= end and periods longer than 12 months
- [ ] Previous dashboard data may remain visible while the next period loads, with a clear updating state
- [ ] Tests cover defaults, URL restoration and filter changes

## Domain Notes

- One request always represents exactly one currency
- No currency conversion belongs to this card
- The backend remains responsible for rejecting invalid ranges

## Full Spec

tools/specs/SPEC-008-epic-d-dashboard-aggregations.md
```

---

## Subtasks

```text
1. Define dashboard filter parsing and serialization helpers
2. Build accessible period presets and currency control
3. Synchronize valid filters with URL search params
4. Connect filters to useDashboard
5. Add updating feedback without clearing current content
6. Test defaults, invalid URL fallback and user changes
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | D — Product Engineering |
| Priority | High |
| Estimate | 2h |
| Tags | `frontend`, `filters`, `url-state`, `currency`, `react-query` |
| Spec ID | SPEC-008 |
| Depends on | D2 |
| Blocks | D4, D5 |

