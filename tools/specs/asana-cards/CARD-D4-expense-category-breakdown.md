# Card Asana — D4: Expense Category Breakdown

## Task Name

```text
[SPEC-008] D4 — Show expense distribution by category
```

---

## Description

```text
## Objective

Turn categoryBreakdown into a scannable view of where money was spent. Keep the
visualization useful when most transactions still have no category.

## Acceptance Criteria

- [ ] Render categories ordered by totalExpense descending
- [ ] Show category name, formatted amount and proportional bar
- [ ] Render null category as "Sem categoria"
- [ ] Calculate visual proportions safely when totalExpense is zero
- [ ] Do not rely only on color to communicate the values
- [ ] Category names remain readable on mobile and long names do not overlap amounts
- [ ] The complete values are available as text for assistive technology
- [ ] No chart dependency is added for this first version
- [ ] Tests cover ordered categories, uncategorized expenses and zero-expense state

## Security Notes

- Render categoryName as text content only
- Never inject category values into raw HTML or dynamic CSS strings

## Full Spec

tools/specs/SPEC-008-epic-d-dashboard-aggregations.md
```

---

## Subtasks

```text
1. Create ExpenseCategoryBreakdown component
2. Derive safe percentage widths from response values
3. Add uncategorized and zero-expense states
4. Verify responsive text and amount layout
5. Add behavior and accessibility tests
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | D — Product Engineering |
| Priority | Medium |
| Estimate | 1h30 |
| Tags | `frontend`, `analytics`, `categories`, `accessibility` |
| Spec ID | SPEC-008 |
| Depends on | D3 |
| Blocks | D6 |

