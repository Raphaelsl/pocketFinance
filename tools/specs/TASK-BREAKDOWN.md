# TASK-BREAKDOWN: Transaction Types Feature

**Spec:** `SPEC-TRANSACTION-TYPES.md`  
**Implementation Guide:** `IMPLEMENTATION-SEQUENCE.md`  
**Total Duration:** ~3.5 hours  
**Approach:** Backend-first (with tests), then frontend integration

---

## 📊 Task Dependency Graph

```
PHASE 1: Backend Foundation (1.5h)
├── TASK-B1: Create TransactionType Enum (0.25h)
├── TASK-B2: Create Migration V003 (0.25h)
├── TASK-B3: Update Transaction Entity (0.25h)
├── TASK-B4: Update DTOs + Mapper (0.5h)
└── TASK-B5: Verify Backend Builds (0.25h)
     ↓ (depends on all above)
PHASE 2: Backend Testing (0.5h)
├── TASK-B6: Write Unit Tests (0.25h)
├── TASK-B7: Write Integration Tests (0.25h)
     ↓ (all tests must pass)
PHASE 3: Frontend Integration (1h)
├── TASK-F1: Update Types (0.2h)
├── TASK-F2: Update Service (0.2h)
├── TASK-F3: Update Form (0.3h)
├── TASK-F4: Update Component (0.3h)
     ↓ (all must compile/pass)
PHASE 4: QA & Docs (0.5h)
├── TASK-QA1: Update Postman Collection (0.25h)
└── TASK-QA2: Manual Smoke Tests (0.25h)
```

---

## 🎯 Tasks in Execution Order

### TASK-B1: Create TransactionType Enum (0.25h)
**Depends on:** Nothing  
**Blocks:** B3, B4, B6  
**Files:** 1 new

```java
// backend/src/main/java/com/pocketfinance/backend/entity/TransactionType.java
public enum TransactionType {
    INCOME("Income from various sources"),
    EXPENSE("Expense or spending");

    private final String description;

    TransactionType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
```

**Verification:**
```bash
cd backend
./mvnw clean compile
```

**Expected:** Zero errors, enum compiles.

---

### TASK-B2: Create Migration V003 (0.25h)
**Depends on:** Nothing  
**Blocks:** B5, B6  
**Files:** 1 new

```sql
-- backend/src/main/resources/db/migration/V003__add_transaction_type.sql
ALTER TABLE transactions ADD COLUMN type VARCHAR(20);
UPDATE transactions SET type = 'EXPENSE' WHERE type IS NULL;
ALTER TABLE transactions ALTER COLUMN type SET NOT NULL;
ALTER TABLE transactions ADD CONSTRAINT chk_transactions_type CHECK (type IN ('INCOME', 'EXPENSE'));
```

**Verification:**
- File syntax correct
- SQL valid for your DB (PostgreSQL/MySQL/H2)

---

### TASK-B3: Update Transaction Entity (0.25h)
**Depends on:** B1 (Enum created)  
**Blocks:** B4, B6  
**Files:** 1 modified

**Changes:**
- Import `TransactionType`
- Add field: `@Enumerated(EnumType.STRING) @Column(nullable = false) private TransactionType type;`
- Add getter/setter

**Verification:**
```bash
cd backend
./mvnw clean compile
```

---

### TASK-B4: Update DTOs & Mapper (0.5h)
**Depends on:** B1 (Enum), B3 (Entity)  
**Blocks:** B5, B6  
**Files:** 3 modified (2 DTOs + 1 Mapper)

**Files to update:**
1. `TransactionCreateRequest.java` — add `@NotNull type: TransactionType`
2. `TransactionUpdateRequest.java` — same as above
3. `TransactionDTO.java` — add `type: TransactionType`
4. `TransactionMapper.java` — map type field

**Verification:**
```bash
cd backend
./mvnw clean compile
```

---

### TASK-B5: Verify Backend Builds (0.25h)
**Depends on:** B1, B2, B3, B4  
**Blocks:** B6  
**Files:** None

```bash
cd backend
./mvnw clean compile
./mvnw test
```

**Expected:** 
- Compilation succeeds
- Existing tests pass (no regressions)
- Migration V003 applies successfully

---

### TASK-B6: Write & Run Unit Tests (0.25h)
**Depends on:** B1, B3, B4, B5  
**Blocks:** B7  
**Files:** 1 modified (test file)

**Add tests for:**
1. POST with type=INCOME → 201 with INCOME in response
2. POST with type=EXPENSE → 201 with EXPENSE in response
3. POST without type → 400 Bad Request
4. GET returns transactions with type field

**Verification:**
```bash
cd backend
./mvnw test
```

**Expected:** All tests pass, green.

---

### TASK-B7: Write & Run Integration Tests (0.25h)
**Depends on:** B6  
**Blocks:** F1  
**Files:** 1 modified (integration test file)

**Add integration tests:**
1. POST INCOME → GET → verify INCOME returned
2. POST EXPENSE → GET → verify EXPENSE returned
3. PUT to change type → GET → verify change persisted
4. Migration: historical data has type=EXPENSE

**Verification:**
```bash
cd backend
./mvnw verify
```

**Expected:** All integration tests pass.

---

### TASK-F1: Update Frontend Types (0.2h)
**Depends on:** B7 (Backend tests pass)  
**Blocks:** F2, F3, F4  
**Files:** 1 modified

**File:** `frontend/src/types/transaction.ts`

```typescript
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Transaction {
  id: string;
  type: TransactionType;  // NEW
  amount: number;
  // ... rest
}

export interface TransactionCreateRequest {
  type: TransactionType;  // NEW
  amount: number;
  // ... rest
}
```

**Verification:**
```bash
cd frontend
npx tsc --noEmit
```

**Expected:** Zero TypeScript errors.

---

### TASK-F2: Update Transaction Service (0.2h)
**Depends on:** F1 (Types updated)  
**Blocks:** F3  
**Files:** 1 modified

**File:** `frontend/src/services/transactionService.ts`

**Changes:**
- `create(data: TransactionCreateRequest)` sends type in body
- `update(id, data: TransactionUpdateRequest)` sends type in body
- Parsed responses include type field

**Verification:**
```bash
cd frontend
npx tsc --noEmit
```

---

### TASK-F3: Update Create Form (0.3h)
**Depends on:** F1, F2  
**Blocks:** QA1  
**Files:** 1 modified

**File:** `frontend/src/app/transactions/new/page.tsx`

**Changes:**
- Add `<select>` for TransactionType (INCOME | EXPENSE)
- Default to EXPENSE
- Require selection before submit
- Pass type in request body

**Verification:**
```bash
cd frontend
npm test  # Form validation tests pass
npx tsc --noEmit
```

---

### TASK-F4: Update Transaction Item Component (0.3h)
**Depends on:** F1, F2  
**Blocks:** QA2  
**Files:** 1 modified

**File:** `frontend/src/components/TransactionItem.tsx`

**Changes:**
- Render type badge (INCOME: green, EXPENSE: red)
- Color logic uses `transaction.type` (not amount < 0)
- Display amount as always positive
- Pattern: `[Badge] $amount — description`

**Verification:**
```bash
cd frontend
npm test  # Component tests pass
npx tsc --noEmit
npm run build
```

---

### TASK-QA1: Update Postman Collection (0.25h)
**Depends on:** F3 (Form ready)  
**Blocks:** QA2  
**Files:** 1 modified

**File:** `tools/postman/pocketFinance_collection.json`

**Changes:**
- Add POST request example: INCOME transaction
- Add POST request example: EXPENSE transaction
- Add GET request: verify both types appear

**Verification:**
- JSON valid
- Examples copy/paste without errors

---

### TASK-QA2: Manual Smoke Tests (0.25h)
**Depends on:** B7, F4, QA1  
**Blocks:** Done!  
**Files:** None

**Smoke Tests:**
1. Backend running: `cd backend && ./mvnw spring-boot:run`
2. Frontend running: `cd frontend && npm run dev`
3. Create INCOME via Postman: POST /api/transactions
4. Create EXPENSE via frontend: Fill form, submit
5. List via GET: Verify both types appear
6. Missing type error: POST without type field → 400
7. Browser visual: INCOME green badge, EXPENSE red badge

---

## 📋 Execution Plan by Phase

### Phase 1 Execution (1.5h) — Backend Foundation

1. Clone or open the project
2. **TASK-B1** (0.25h): Create enum — paste code, compile, done
3. **TASK-B2** (0.25h): Create migration — paste SQL, validate syntax
4. **TASK-B3** (0.25h): Update entity — add field + getter/setter
5. **TASK-B4** (0.5h): Update DTOs + mapper — map all fields
6. **TASK-B5** (0.25h): Verify builds — `./mvnw clean test`

**Checkpoint:** Backend compiles, existing tests still pass

---

### Phase 2 Execution (0.5h) — Backend Testing

7. **TASK-B6** (0.25h): Unit tests — test enum, validation, POST/GET with type
8. **TASK-B7** (0.25h): Integration tests — full lifecycle with type changes

**Checkpoint:** All backend tests green. `./mvnw test` passes.

---

### Phase 3 Execution (1h) — Frontend Integration

9. **TASK-F1** (0.2h): Types — add enum, update interfaces
10. **TASK-F2** (0.2h): Service — send/receive type in API calls
11. **TASK-F3** (0.3h): Form — add type select field, validate
12. **TASK-F4** (0.3h): Component — render badge, update colors

**Checkpoint:** Frontend compiles. `npm test && npm run build` passes.

---

### Phase 4 Execution (0.5h) — QA & Docs

13. **TASK-QA1** (0.25h): Postman — add INCOME/EXPENSE examples
14. **TASK-QA2** (0.25h): Smoke tests — manual verification

**Checkpoint:** All systems tested end-to-end. ✅ Feature complete.

---

## 🔗 Dependency Summary

```
        B1, B2          (parallel start)
         ↓    ↓
        B3 ← B1
        B4 ← B1, B3
        B5 ← B3, B4, B2
        B6 ← B5
        B7 ← B6
             ↓
        F1 ← B7         (frontend can start after backend tests pass)
        F2 ← F1
        F3 ← F1, F2
        F4 ← F1, F2
             ↓    ↓
        QA1 ← F3
        QA2 ← F4, QA1
             ↓
          DONE ✅
```

**Critical Path:** B1 → B3 → B4 → B5 → B6 → B7 → F1 → F2 → F3 → QA1 → QA2

**Parallelizable:**
- B1 and B2 (can start at same time)
- F3 and F4 (can start at same time once F1, F2 done)

---

## ⏱️ Time Breakdown

| Task | Duration | Phase |
|------|----------|-------|
| B1 - Enum | 0.25h | Backend Foundation |
| B2 - Migration | 0.25h | Backend Foundation |
| B3 - Entity | 0.25h | Backend Foundation |
| B4 - DTOs + Mapper | 0.5h | Backend Foundation |
| B5 - Verify Build | 0.25h | Backend Foundation |
| **Phase 1 Total** | **1.5h** | |
| B6 - Unit Tests | 0.25h | Backend Testing |
| B7 - Integration Tests | 0.25h | Backend Testing |
| **Phase 2 Total** | **0.5h** | |
| F1 - Types | 0.2h | Frontend Integration |
| F2 - Service | 0.2h | Frontend Integration |
| F3 - Form | 0.3h | Frontend Integration |
| F4 - Component | 0.3h | Frontend Integration |
| **Phase 3 Total** | **1h** | |
| QA1 - Postman | 0.25h | QA & Docs |
| QA2 - Smoke Tests | 0.25h | QA & Docs |
| **Phase 4 Total** | **0.5h** | |
| | | |
| **GRAND TOTAL** | **3.5h** | |

---

## ✅ Done Checklist (by Task)

### Phase 1
- [ ] TASK-B1: Enum compiles
- [ ] TASK-B2: Migration SQL valid
- [ ] TASK-B3: Entity has type field, getter/setter
- [ ] TASK-B4: All DTOs updated, mapper maps type
- [ ] TASK-B5: `./mvnw clean test` passes

### Phase 2
- [ ] TASK-B6: Unit tests written, all pass
- [ ] TASK-B7: Integration tests written, all pass

### Phase 3
- [ ] TASK-F1: Types compile, `npx tsc --noEmit` passes
- [ ] TASK-F2: Service sends/receives type
- [ ] TASK-F3: Form has type field, validates
- [ ] TASK-F4: Component renders badge, colors correct

### Phase 4
- [ ] TASK-QA1: Postman collection valid JSON, examples work
- [ ] TASK-QA2: Manual tests pass (POST INCOME, POST EXPENSE, GET, badge colors)

---

## 🚀 How to Start

**Option 1: I execute (Recommended)**
```
@test-engineer
Implement TASK-B1: Create TransactionType enum.
File: backend/src/main/java/com/pocketfinance/backend/entity/TransactionType.java
Requirements from IMPLEMENTATION-SEQUENCE.md.
Write test first, then code.
```

**Option 2: You execute**
- Follow Phase 1 tasks in order
- After each task, run verify command
- Move to next task when checkpoint passes

**Option 3: Hybrid**
- I do backend (Phases 1-2)
- You do frontend (Phases 3-4) + QA

---

## 📌 Notes for Executors

1. **Commit after each phase** (not after each task)
   - After B5: "feat: add TransactionType enum, migration, entity, DTOs"
   - After B7: "test: add backend tests for transaction type"
   - After F4: "feat: frontend support for transaction types"
   - After QA2: "docs: update postman, manual smoke tests pass"

2. **If a task fails:**
   - Read error message carefully
   - Check file names and package paths match your project
   - Verify imports are correct
   - Recompile after each change

3. **If blocked (dependency not ready):**
   - Skip to parallel task (e.g., B2 if B1 not ready)
   - Or ping to unblock earlier task

4. **When in doubt:**
   - Refer to `IMPLEMENTATION-SEQUENCE.md` for full code examples
   - Refer to `SPEC-TRANSACTION-TYPES.md` for requirements

---

**Version:** 1.0  
**Last Updated:** 2026-05-02  
**Ready to execute? Say which task you want to start with!**

