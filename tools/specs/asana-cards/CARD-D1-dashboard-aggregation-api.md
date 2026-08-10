# Card Asana — D1: Dashboard Aggregation API

## Task Name

```text
[SPEC-008] D1 — Build the dashboard aggregation API
```

---

## Description

```text
## Objective

Create GET /api/dashboard as a read-only projection over transactions. The endpoint
must calculate the complete dashboard for one period and one currency without loading
all transactions into application memory.

## Acceptance Criteria

- [ ] Add DashboardController, DashboardService and dashboard response DTOs
- [ ] GET /api/dashboard accepts start, end and currency query parameters
- [ ] start is inclusive, end is exclusive and the range is limited to 12 months
- [ ] currency is normalized to uppercase and validated as a three-letter code
- [ ] summary returns totalIncome, totalExpense, balance and transactionCount
- [ ] categoryBreakdown includes EXPENSE only and groups null category as "Sem categoria"
- [ ] monthlyEvolution returns income, expense and balance per month
- [ ] Missing months in the requested period are returned with zero values
- [ ] A valid period without transactions returns 200 with zero totals, empty breakdown and zero-filled months
- [ ] Aggregation queries run in PostgreSQL through bound parameters
- [ ] No transaction entity is exposed by the API
- [ ] Unit and integration tests cover calculations, boundaries and validation errors

## API

GET /api/dashboard?start={ISO_INSTANT}&end={ISO_INSTANT}&currency={ISO_CODE}

## Security and Domain Notes

- Never concatenate request parameters into SQL or JPQL
- Use Jakarta validation and explicit domain validation at the HTTP boundary
- Keep unexpected error responses generic through ControllerAdvice
- Do not log financial values or raw query parameters in error messages
- This project has no authentication yet; do not imply user-level data isolation

## Full Spec

tools/specs/SPEC-008-epic-d-dashboard-aggregations.md
```

---

## Subtasks

```text
1. Define dashboard response records and repository projections
2. Add parameterized aggregate queries to TransactionRepository
3. Implement DashboardService calculations and missing-month fill
4. Implement and validate GET /api/dashboard
5. Add repository/service tests with known financial examples
6. Add controller integration tests for success, empty and 400 responses
7. Add a Postman example for the dashboard endpoint
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | D — Product Engineering |
| Priority | High |
| Estimate | 5h |
| Tags | `backend`, `spring-boot`, `aggregation`, `dashboard`, `tests` |
| Spec ID | SPEC-008 |
| Depends on | PC5 |
| Blocks | D2 |
