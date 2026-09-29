# Card Asana — G3: Dashboard Experience

## Task Name

```text
[SPEC-011] G3 — Improve dashboard hierarchy, filters and data states
```

## Description

```text
## Objective

Make the dashboard communicate the user's financial picture at a glance, with clear
period and currency context and useful recovery states.

## Acceptance Criteria

- [ ] Summary prioritizes Receitas, Despesas and Saldo with readable hierarchy
- [ ] Selected period and currency remain visible near the numbers
- [ ] Period and currency controls work on desktop and mobile
- [ ] Empty period explains that no movements were found and offers a next action
- [ ] Loading, error, refresh and retry states are consistent with the shell
- [ ] Category breakdown and monthly evolution include text or table alternatives
- [ ] Balance meaning is clear without relying on color alone
- [ ] All values use backend aggregates and localized formatting

## Full Spec

tools/specs/SPEC-011-epic-g-web-product-experience.md
```

## Subtasks

```text
1. Rework dashboard heading, summary hierarchy and period context
2. Restyle KPI cards and filter controls using shared tokens
3. Refine charts, legends and accessible text alternatives
4. Implement empty, loading, refresh and retry visual states
5. Review dashboard at mobile and desktop widths
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | G — Web Product Experience |
| Priority | High |
| Estimate | A estimar |
| Tags | `frontend`, `dashboard`, `responsive`, `accessibility` |
| Spec ID | SPEC-011 |
| Depends on | G2, D6, F3 |
| Blocks | G6, H4 |
