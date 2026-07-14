# SPEC-TRANSACTION-TYPES: Add Transaction Types (INCOME/EXPENSE)

**Status:** Ready for Planning  
**Spec ID:** SPEC-TRANSACTION-TYPES  
**Priority:** High | **Estimate:** 3h  
**Blocks:** SPEC-005 (Edit Transaction) | **Depends on:** Backend CRUD (Epic B) complete

---

## 📋 Overview

Currently, `pocketFinance` only accepts positive amounts via `@Positive` validation, making it impossible to differentiate between revenue (INCOME) and expenses (EXPENSE). This spec adds semantic transaction types across the full stack: backend model, migrations, DTOs, frontend types, form inputs, and UI rendering.

After this change, the system can:
- Register both INCOME (salary, deposits, refunds) and EXPENSE (purchases, spending, transfers)
- Calculate real financial balance: `totalIncome - totalExpenses`
- Assign semantic meaning to every transaction
- Frontend can style transactions by type (not by negative amounts)

---

## 🎯 Objectives

1. **Add Transaction.type field** to the backend model (Enum: INCOME | EXPENSE)
2. **Migrate existing data** safely — all historical transactions default to EXPENSE (conservative)
3. **Update all DTOs** to include type (TransactionCreateRequest, TransactionUpdateRequest, TransactionDTO)
4. **Update frontend types and components** — form field, service layer, display logic
5. **Maintain validation** — amounts remain `@Positive` (always positive, regardless of type)
6. **Verify end-to-end** — manual tests in Postman with both INCOME and EXPENSE transactions

---

## ✅ Acceptance Criteria

### Backend: Model & Database

- [ ] `TransactionType` Enum created with values: `INCOME`, `EXPENSE`
- [ ] `Transaction` Entity has new field: `type: TransactionType` (non-null)
- [ ] Flyway migration `V003__add_transaction_type.sql` created and executes successfully
- [ ] Migration sets `type = 'EXPENSE'` for all historical records (conservative default)
- [ ] Migration adds CHECK constraint: `type IN ('INCOME', 'EXPENSE')`
- [ ] Database schema change verified (no errors, no data loss)

### Backend: DTOs & Mappers

- [ ] `TransactionCreateRequest` DTO includes `type: TransactionType` (required field)
- [ ] `TransactionUpdateRequest` DTO includes `type: TransactionType` (required field)
- [ ] `TransactionDTO` (response) includes `type: TransactionType`
- [ ] `TransactionMapper` correctly maps all three entities
- [ ] Type field is never null in DTOs (validation enforced)

### Backend: Endpoints & Validation

- [ ] `POST /api/transactions` accepts `type` in request body (required)
- [ ] `GET /api/transactions` returns `type` for each transaction
- [ ] `PUT /api/transactions/{id}` accepts `type` in request body (required)
- [ ] `DELETE /api/transactions/{id}` works as before (no changes needed)
- [ ] Amount validation remains `@Positive` (always positive, independent of type)
- [ ] Validation error on missing type: returns HTTP 400 with descriptive message

### Backend: Testing

- [ ] Unit test: Creating INCOME transaction succeeds
- [ ] Unit test: Creating EXPENSE transaction succeeds
- [ ] Unit test: Creating transaction without type fails (HTTP 400)
- [ ] Integration test: POST with INCOME, GET returns INCOME
- [ ] Integration test: POST with EXPENSE, GET returns EXPENSE
- [ ] Integration test: Migration runs without errors
- [ ] All existing tests still pass (no regression)

### Frontend: Types

- [ ] `types/transaction.ts`:
  - `enum TransactionType { INCOME = 'INCOME', EXPENSE = 'EXPENSE' }`
  - `interface Transaction` includes `type: TransactionType`
  - `interface TransactionCreateRequest` includes `type: TransactionType`
- [ ] Types compile without errors

### Frontend: Service Layer

- [ ] `services/transactionService.ts`:
  - `create(data: TransactionCreateRequest)` sends `type` in POST body
  - Parsed response includes `type` field
  - No breaking changes to existing methods (GET, PUT, DELETE)

### Frontend: Form & Input

- [ ] `app/transactions/new/page.tsx`:
  - Add `<select>` or `<radio>` for TransactionType (INCOME | EXPENSE)
  - Default: EXPENSE
  - Type selection is required (cannot submit without choosing)
  - Form submission includes type in request body

### Frontend: Display & Styling

- [ ] `components/TransactionItem.tsx`:
  - Render transaction type badge (INCOME: green/blue, EXPENSE: red)
  - Color logic uses `transaction.type` (not `amount < 0`)
  - Amount always displays as positive (no negative sign)
  - Display pattern: `[Type Badge] $amount — description`

### Frontend: Testing

- [ ] Component test: TransactionItem renders INCOME with correct color
- [ ] Component test: TransactionItem renders EXPENSE with correct color
- [ ] Form test: Submitting without type shows validation error
- [ ] Form test: Submitting with INCOME sends correct request body
- [ ] Integration smoke test: Create INCOME, verify GET returns INCOME

### Documentation & Examples

- [ ] `tools/postman/pocketFinance_collection.json` updated with:
  - POST example: creating INCOME transaction
  - POST example: creating EXPENSE transaction
  - GET example response showing both types
  - PUT example: updating transaction type
- [ ] README clarifies the change in CLI examples (if any)

### Code Quality

- [ ] No secrets or credentials in code
- [ ] No console.logs or debug code left behind
- [ ] Consistent code style (match project conventions)
- [ ] All imports are used (no dead code)
- [ ] Backend compiles: `./mvnw clean compile` succeeds
- [ ] Frontend builds: `npm run build` succeeds
- [ ] No TypeScript errors: `npx tsc --noEmit`

---

## 📡 Data Model & Contracts

### Entity: Transaction

```java
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;  // NEW FIELD

    @Positive
    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;

    private String description;

    @Column(nullable = false)
    private LocalDateTime occurredAt;

    private String categoryId;

    private Map<String, Object> metadata;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // getters, setters, equals, hashCode
}

public enum TransactionType {
    INCOME,
    EXPENSE
}
```

### API Contract: POST /api/transactions

**Request:**
```json
{
  "type": "INCOME",
  "amount": 5000.00,
  "currency": "USD",
  "description": "Monthly salary",
  "occurredAt": "2026-05-02T09:00:00Z",
  "categoryId": "cat-001",
  "metadata": { "source": "employer" }
}
```

**Response: 201 Created**
```json
{
  "id": "txn-12345",
  "type": "INCOME",
  "amount": 5000.00,
  "currency": "USD",
  "description": "Monthly salary",
  "occurredAt": "2026-05-02T09:00:00Z",
  "categoryId": "cat-001",
  "metadata": { "source": "employer" },
  "createdAt": "2026-05-02T10:30:00Z"
}
```

**Error: 400 Bad Request (missing type)**
```json
{
  "timestamp": "2026-05-02T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Field 'type' is required. Must be one of: INCOME, EXPENSE",
  "path": "/api/transactions"
}
```

### API Contract: GET /api/transactions

**Response: 200 OK**
```json
{
  "content": [
    {
      "id": "txn-001",
      "type": "INCOME",
      "amount": 5000.00,
      "currency": "USD",
      "description": "Salary",
      "occurredAt": "2026-05-01T00:00:00Z",
      "createdAt": "2026-05-01T08:00:00Z"
    },
    {
      "id": "txn-002",
      "type": "EXPENSE",
      "amount": 50.00,
      "currency": "USD",
      "description": "Coffee",
      "occurredAt": "2026-05-02T10:00:00Z",
      "createdAt": "2026-05-02T10:15:00Z"
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "currentPage": 0
}
```

### Frontend Types

```typescript
// types/transaction.ts
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Transaction {
  id: string;
  type: TransactionType;  // NEW FIELD
  amount: number;
  currency: string;
  description?: string;
  occurredAt: string;
  categoryId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface TransactionCreateRequest {
  type: TransactionType;  // NEW FIELD (required)
  amount: number;
  currency: string;
  description?: string;
  occurredAt: string;
  categoryId?: string;
  metadata?: Record<string, unknown>;
}

export interface TransactionUpdateRequest extends TransactionCreateRequest {}
```

---

## 🗂️ File Changes Summary

### Backend Files to Create/Modify

| File | Action | Scope |
|------|--------|-------|
| `backend/src/main/java/com/pocketfinance/backend/entity/Transaction.java` | Modify | Add `type: TransactionType` field |
| `backend/src/main/java/com/pocketfinance/backend/entity/TransactionType.java` | Create | New Enum |
| `backend/src/main/resources/db/migration/V003__add_transaction_type.sql` | Create | Database migration |
| `backend/src/main/java/com/pocketfinance/backend/dto/TransactionCreateRequest.java` | Modify | Add `type` field |
| `backend/src/main/java/com/pocketfinance/backend/dto/TransactionUpdateRequest.java` | Modify | Add `type` field |
| `backend/src/main/java/com/pocketfinance/backend/dto/TransactionDTO.java` | Modify | Add `type` field |
| `backend/src/main/java/.../TransactionMapper.java` | Modify | Map `type` field |
| `backend/src/test/java/.../TransactionControllerTest.java` | Modify | Add tests for new type field |
| `backend/src/test/java/.../TransactionRepositoryTest.java` | Modify | Add tests for new type field |
| `tools/postman/pocketFinance_collection.json` | Modify | Add INCOME/EXPENSE examples |

### Frontend Files to Create/Modify

| File | Action | Scope |
|------|--------|-------|
| `frontend/src/types/transaction.ts` | Modify | Add `TransactionType` enum, update `Transaction` interface |
| `frontend/src/services/transactionService.ts` | Modify | Send `type` in POST/PUT bodies |
| `frontend/src/app/transactions/new/page.tsx` | Modify | Add type select field to form |
| `frontend/src/components/TransactionItem.tsx` | Modify | Render type badge, update color logic |

---

## 🚨 Breaking Changes & Migration

### ⚠️ Frontend Will Break After Backend Deploys

**Until frontend is updated:**
- `POST /api/transactions` will return **HTTP 400** (type is required but frontend doesn't send it)
- Existing transactions will appear with `type: EXPENSE` (historical default)
- Frontend form will submit requests without `type` (validation fails)

**Solution:** Deploy frontend changes **on the same release** or use feature flags to gate the type field requirement.

### Migration Strategy: Safe Defaults

- All existing transactions get `type = 'EXPENSE'` (conservative: assume spending)
- No data loss
- Existing balance calculations unaffected (all positive amounts)
- Dashboard can optionally recalculate with new logic after migration

---

## 🔧 Code Style & Conventions

### Backend

- Java: Follow `pocketFinance` project conventions (Spring Boot, Hibernate, Lombok if used)
- Enum: Use UPPERCASE names (INCOME, EXPENSE)
- Validation: Use `@NotNull`, `@Positive`, standard JSR-303 annotations
- DTO: Use immutable records or standard Lombok `@Data` + `@Builder`
- Mapper: Use MapStruct or manual mapper (match existing project style)
- Tests: Follow existing test structure (unit + integration)

### Frontend

- TypeScript: Strict mode (`strict: true` in tsconfig)
- React: Functional components, hooks (match Next.js 14 conventions)
- Styling: Match existing CSS/TailwindCSS approach (check existing TransactionItem.tsx)
- Form: Use existing form patterns (library or vanilla HTML)
- Types: Enums capitalized, interfaces start with `I` or pascal case (match project)

---

## 🧪 Testing Strategy

### Backend Tests

| Test | Framework | Scope |
|------|-----------|-------|
| `TransactionTypeEnumTest` | JUnit 5 | Enum values exist and serialize correctly |
| `TransactionEntityTest` | JUnit 5 | Entity has type field, non-null constraint |
| `TransactionCreateRequestValidationTest` | JUnit 5, RestAssured | Missing type → 400 Bad Request |
| `TransactionControllerTest` | JUnit 5, MockMvc | POST with INCOME/EXPENSE works |
| `TransactionIntegrationTest` | JUnit 5, TestRestTemplate | Full stack: POST → GET → verify type |
| `TransactionRepositoryTest` | JUnit 5, DataJpaTest | Query by type, find all INCOME vs EXPENSE |
| `FlywayMigrationTest` | JUnit 5 | Migration V003 runs, data intact, not null enforced |

### Frontend Tests

| Test | Framework | Scope |
|------|-----------|-------|
| `TransactionType.test.ts` | Jest | Enum values exported and correct |
| `TransactionItem.test.tsx` | React Testing Library | INCOME → green badge, EXPENSE → red badge |
| `new/page.test.tsx` | React Testing Library | Type select visible, required, validates |
| `transactionService.test.ts` | Jest, MSW | create() sends type, parses response |

### Manual Tests (Postman / Browser)

1. **Create INCOME transaction** → POST /api/transactions with type=INCOME → verify response has type
2. **Create EXPENSE transaction** → POST /api/transactions with type=EXPENSE → verify response has type
3. **List transactions** → GET /api/transactions → verify both types appear
4. **Update transaction type** → PUT /api/transactions/{id} with new type → verify change
5. **Form submission (frontend)** → Fill form with type, submit → verify request body includes type

---

## ⏱️ Implementation Sequence

**Phase 1: Backend Foundation (1.5h)**
1. Create TransactionType enum
2. Add migration V003
3. Update Entity Transaction
4. Update DTOs (Create, Update, Response)
5. Update Mapper
6. Run `./mvnw test` — ensure no failures

**Phase 2: Backend Testing (0.5h)**
1. Write unit tests (enum, entity, validation)
2. Write integration tests (POST/GET with both types)
3. Verify migration test
4. All tests pass

**Phase 3: Frontend Integration (1h)**
1. Update types/transaction.ts
2. Update transactionService.ts
3. Update new/page.tsx (add type field)
4. Update TransactionItem.tsx (render type, update colors)
5. Run `npm test` + `npm run build`

**Phase 4: Documentation & QA (0.5h)**
1. Update Postman collection
2. Manual smoke tests (Postman + browser)
3. Verify no console errors
4. Update README if needed

**Total: ~3.5h**

---

## 📊 Verification Checklist

Before marking this spec as DONE:

- [ ] Backend compiles: `./mvnw clean compile` ✓
- [ ] All backend tests pass: `./mvnw test` ✓
- [ ] Frontend builds: `npm run build` ✓
- [ ] Frontend tests pass: `npm test` ✓
- [ ] No TypeScript errors: `npx tsc --noEmit` ✓
- [ ] Postman collection updated with examples ✓
- [ ] Manual test: Create INCOME, GET returns INCOME ✓
- [ ] Manual test: Create EXPENSE, GET returns EXPENSE ✓
- [ ] Manual test: Missing type returns HTTP 400 ✓
- [ ] No secrets in code ✓
- [ ] No debug/console.log left behind ✓
- [ ] Git commit message is clear and concise ✓
- [ ] PR description links to this spec ✓

---

## 🔗 Related Specs & Issues

- **Blocks:** SPEC-005 (Edit Transaction) — requires type field in UI
- **Depends on:** Backend CRUD complete (POST, GET, PUT, DELETE working)
- **Future:** SPEC-006 (Dashboard Balance) — will use type to calculate income - expenses

---

## 📝 Notes

- **Why always positive amounts?** Semantic meaning comes from `type`, not sign. This is clearer and prevents accidental negative deposits.
- **Why EXPENSE as default?** Conservative approach — if uncertain, assume it's spending. Can be reviewed later if needed.
- **Why frontend must update together?** Type is `required` on backend, so frontend form must collect it. Deploying backend alone breaks existing transactions.

---

**Version:** 1.0  
**Last Updated:** 2026-05-02  
**Author:** Spec Driven Development
