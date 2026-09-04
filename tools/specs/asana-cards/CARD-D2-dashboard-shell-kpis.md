# Card Asana — D2: Dashboard Shell & KPI Summary

## Task Name

```text
[SPEC-008] D2 — Create the dashboard shell and KPI summary
```

---

## Description

```text
## Objective

Create /dashboard and consume the aggregation API through the frontend service and a
domain hook. This card displays only the financial summary so the async data flow and
product hierarchy are clear before adding filters and visualizations.

## Acceptance Criteria

- [ ] Add typed DashboardResponse and filter types
- [ ] Add dashboardService.getDashboard(filters)
- [ ] Add useDashboard(filters) with a stable React Query key
- [ ] Create /dashboard with Receita, Despesa, Saldo and Transações KPIs
- [ ] Format values with Intl.NumberFormat and the response currency
- [ ] Positive, zero and negative balances remain understandable without color alone
- [ ] Add stable loading skeletons that do not shift the page layout
- [ ] Add generic error state with a retry action
- [ ] Add an empty-period state with a link to create a transaction
- [ ] Add Dashboard navigation to the application header
- [ ] Component tests cover loading, error, empty and success

## Security Notes

- Render API text as normal React text; do not use dangerouslySetInnerHTML
- Do not display backend exception details in the error state
- NEXT_PUBLIC_API_URL is a public endpoint location and must not contain credentials

## Full Spec

tools/specs/SPEC-008-epic-d-dashboard-aggregations.md
```

---

## Subtasks

```text
1. Define dashboard frontend types
2. Implement dashboardService.getDashboard
3. Implement useDashboard with filter-based query keys
4. Create the dashboard page shell and KPI components
5. Add loading, retry and empty states
6. Add Dashboard and Transactions navigation links
7. Test all KPI page states
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | D — Product Engineering |
| Priority | High |
| Estimate | 2h30 |
| Tags | `frontend`, `nextjs`, `react-query`, `dashboard`, `kpi` |
| Spec ID | SPEC-008 |
| Depends on | D1 |
| Blocks | D3 |

