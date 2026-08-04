# Card Asana — D5: Monthly Financial Evolution

## Task Name

```text
[SPEC-008] D5 — Show monthly income and expense evolution
```

---

## Description

```text
## Objective

Show how income, expense and balance change month by month using the selected period.
The first version should teach data visualization fundamentals without introducing a
chart library.

## Acceptance Criteria

- [ ] Render every month returned by monthlyEvolution in chronological order
- [ ] Show income, expense and balance values for each month
- [ ] Months with zero activity remain visible
- [ ] Scale visual bars against the largest value in the current response
- [ ] Zero-only periods do not cause division-by-zero or invalid styles
- [ ] Income and expense are distinguishable by labels and pattern, not color alone
- [ ] A textual list or table exposes the same data to assistive technology
- [ ] Labels and values do not overlap at mobile or desktop widths
- [ ] No chart dependency is added for this first version
- [ ] Tests cover chronological rendering, zero months and negative monthly balance

## Security Notes

- Use typed numeric values from the API for dimensions
- Do not build raw HTML, SVG markup or style text from API strings

## Full Spec

tools/specs/SPEC-008-epic-d-dashboard-aggregations.md
```

---

## Subtasks

```text
1. Create MonthlyFinancialEvolution component
2. Implement safe scale calculation for positive numeric amounts
3. Add labels and accessible textual representation
4. Add responsive layout constraints
5. Test chronology, empty months and balances
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | D — Product Engineering |
| Priority | Medium |
| Estimate | 2h |
| Tags | `frontend`, `analytics`, `monthly`, `accessibility` |
| Spec ID | SPEC-008 |
| Depends on | D3 |
| Blocks | D6 |

