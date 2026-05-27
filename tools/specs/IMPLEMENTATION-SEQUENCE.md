# IMPLEMENTATION-SEQUENCE: Transaction Types (INCOME/EXPENSE)

**Spec Reference:** `SPEC-TRANSACTION-TYPES.md`  
**Estimated Duration:** 3-3.5 hours  
**Approach:** Backend-first (with tests), then frontend integration

---

## Phase 1: Backend Foundation (1.5 hours)

### 1.1 Create TransactionType Enum

**File:** `backend/src/main/java/com/pocketfinance/backend/entity/TransactionType.java`

```java
package com.pocketfinance.backend.entity;

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

**Verify:** Compiles without errors.

---

### 1.2 Create Flyway Migration V003

**File:** `backend/src/main/resources/db/migration/V003__add_transaction_type.sql`

```sql
-- V003__add_transaction_type.sql
-- Add transaction type with conservative default for historical data

ALTER TABLE transactions
ADD COLUMN type VARCHAR(20);

UPDATE transactions
SET type = 'EXPENSE'
WHERE type IS NULL;

ALTER TABLE transactions
    ALTER COLUMN type SET NOT NULL;

ALTER TABLE transactions
    ADD CONSTRAINT chk_transactions_type
        CHECK (type IN ('INCOME', 'EXPENSE'));
```

**Verify:** 
- Migration syntax is correct for your database (PostgreSQL/MySQL/H2)
- Backup data before running

---

### 1.3 Update Transaction Entity

**File:** `backend/src/main/java/com/pocketfinance/backend/entity/Transaction.java`

**Changes:**
- Add field: `@Enumerated(EnumType.STRING) @Column(nullable = false) private TransactionType type;`
- Add getter/setter for `type`
- Update constructor (if any) and builder to include `type`

```java
@Entity
@Table(name = "transactions")
public class Transaction {
    // ... existing fields ...

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    // ... existing methods ...

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }
}
```

**Verify:** Entity compiles, Lombok (if used) generates correct methods.

---

### 1.4 Update DTOs

**File:** `backend/src/main/java/com/pocketfinance/backend/dto/TransactionCreateRequest.java`

```java
public class TransactionCreateRequest {
    @NotNull(message = "Type is required (INCOME or EXPENSE)")
    private TransactionType type;

    @Positive
    @NotNull
    private BigDecimal amount;

    @NotBlank
    private String currency;

    private String description;

    @NotNull
    private LocalDateTime occurredAt;

    private String categoryId;

    private Map<String, Object> metadata;

    // ... getters, setters, constructor ...
}
```

**File:** `backend/src/main/java/com/pocketfinance/backend/dto/TransactionUpdateRequest.java`

Same as `TransactionCreateRequest` (or extend it).

**File:** `backend/src/main/java/com/pocketfinance/backend/dto/TransactionDTO.java`

```java
public class TransactionDTO {
    private String id;
    private TransactionType type;  // NEW
    private BigDecimal amount;
    private String currency;
    private String description;
    private LocalDateTime occurredAt;
    private String categoryId;
    private Map<String, Object> metadata;
    private LocalDateTime createdAt;

    // ... getters, setters ...
}
```

**Verify:** DTOs compile, no missing imports.

---

### 1.5 Update Mapper

**File:** `backend/src/main/java/.../TransactionMapper.java` (or similar)

```java
@Mapper(componentModel = "spring")
public interface TransactionMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Transaction toEntity(TransactionCreateRequest dto);

    Transaction toEntity(TransactionUpdateRequest dto);

    TransactionDTO toDTO(Transaction entity);

    List<TransactionDTO> toDTOList(List<Transaction> entities);
}
```

Or if using manual mapper:

```java
public TransactionDTO toDTO(Transaction entity) {
    return new TransactionDTO(
        entity.getId(),
        entity.getType(),        // NEW
        entity.getAmount(),
        entity.getCurrency(),
        // ... rest of fields
    );
}
```

**Verify:** Mapper compiles, all fields mapped.

---

### 1.6 Update Controller (if needed)

**File:** `backend/src/main/java/.../TransactionController.java`

Usually no changes needed if using DTOs with validation. Validate that:
- `POST /api/transactions` accepts `TransactionCreateRequest` (with type)
- `PUT /api/transactions/{id}` accepts `TransactionUpdateRequest` (with type)
- `GET` returns `TransactionDTO` (with type)

Example (if manual):

```java
@PostMapping
public ResponseEntity<TransactionDTO> createTransaction(
    @Valid @RequestBody TransactionCreateRequest request) {
    // ... service call, will include type
    return ResponseEntity.status(HttpStatus.CREATED).body(dto);
}
```

**Verify:** Validation errors return 400 with descriptive message.

---

### 1.7 Run Backend Tests & Build

```bash
cd backend
./mvnw clean compile
./mvnw test
```

**Expected:** 
- Compilation succeeds
- All tests pass (new migration test included)
- No warnings

---

## Phase 2: Backend Testing (0.5 hours)

### 2.1 Write Unit Tests

**File:** `backend/src/test/java/.../TransactionControllerTest.java`

```java
@Test
void testCreateTransactionWithINCOME() {
    TransactionCreateRequest request = new TransactionCreateRequest();
    request.setType(TransactionType.INCOME);
    request.setAmount(BigDecimal.valueOf(5000));
    request.setCurrency("USD");
    
    // POST and verify response includes type
    ResponseEntity<TransactionDTO> response = restTemplate.postForEntity(
        "/api/transactions", request, TransactionDTO.class);
    
    assertEquals(HttpStatus.CREATED, response.getStatusCode());
    assertEquals(TransactionType.INCOME, response.getBody().getType());
}

@Test
void testCreateTransactionWithoutType() {
    TransactionCreateRequest request = new TransactionCreateRequest();
    // type NOT set
    request.setAmount(BigDecimal.valueOf(50));
    request.setCurrency("USD");
    
    // POST and expect 400
    ResponseEntity<String> response = restTemplate.postForEntity(
        "/api/transactions", request, String.class);
    
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
}

@Test
void testGetTransactionsIncludesType() {
    // Create INCOME and EXPENSE
    // GET /api/transactions
    // Verify both types appear in response
}
```

**Verify:** All tests pass.

---

### 2.2 Write Integration Tests

**File:** `backend/src/test/java/.../TransactionIntegrationTest.java`

```java
@Test
void testTransactionLifecycleWithType() {
    // 1. POST INCOME
    // 2. GET and verify type=INCOME
    // 3. PUT to change to EXPENSE
    // 4. GET and verify type=EXPENSE
    // 5. DELETE
}
```

**Verify:** Integration tests pass.

---

### 2.3 Verify Migration

```bash
./mvnw clean test -Dspring.datasource.url=jdbc:h2:mem:test
```

**Expected:** Migration V003 runs without errors, historical data gets type='EXPENSE'.

---

## Phase 3: Frontend Integration (1 hour)

### 3.1 Update Types

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
  currency: string;
  description?: string;
  occurredAt: string;
  categoryId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface TransactionCreateRequest {
  type: TransactionType;  // NEW (required)
  amount: number;
  currency: string;
  description?: string;
  occurredAt: string;
  categoryId?: string;
  metadata?: Record<string, unknown>;
}

export interface TransactionUpdateRequest extends TransactionCreateRequest {}
```

**Verify:** TypeScript compiles: `npx tsc --noEmit`

---

### 3.2 Update Service Layer

**File:** `frontend/src/services/transactionService.ts`

```typescript
export async function create(
  transaction: TransactionCreateRequest
): Promise<Transaction> {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),  // Includes type
  });
  
  if (!response.ok) throw new Error('Failed to create transaction');
  return response.json();
}

export async function update(
  id: string,
  transaction: TransactionUpdateRequest
): Promise<Transaction> {
  const response = await fetch(`/api/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),  // Includes type
  });
  
  if (!response.ok) throw new Error('Failed to update transaction');
  return response.json();
}
```

**Verify:** Service compiles, no unused imports.

---

### 3.3 Update Create Form

**File:** `frontend/src/app/transactions/new/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { TransactionType, type TransactionCreateRequest } from '@/types/transaction';
import { create } from '@/services/transactionService';

export default function NewTransactionPage() {
  const [formData, setFormData] = useState<TransactionCreateRequest>({
    type: TransactionType.EXPENSE,  // Default
    amount: 0,
    currency: 'USD',
    occurredAt: new Date().toISOString(),
  });

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      type: e.target.value as TransactionType,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type) {
      alert('Please select transaction type');
      return;
    }

    await create(formData);
    // Redirect or reset form
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Type *</label>
        <select 
          value={formData.type} 
          onChange={handleTypeChange}
          required
        >
          <option value={TransactionType.INCOME}>Income</option>
          <option value={TransactionType.EXPENSE}>Expense</option>
        </select>
      </div>

      {/* Existing fields: amount, currency, description, date, etc. */}
      
      <button type="submit">Create Transaction</button>
    </form>
  );
}
```

**Verify:** Form renders, type field is visible and required.

---

### 3.4 Update Transaction Item Component

**File:** `frontend/src/components/TransactionItem.tsx`

```typescript
import { TransactionType, type Transaction } from '@/types/transaction';

interface Props {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: Props) {
  const isIncome = transaction.type === TransactionType.INCOME;
  const bgColor = isIncome ? 'bg-green-50' : 'bg-red-50';
  const badgeColor = isIncome ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';
  const badgeLabel = isIncome ? 'Income' : 'Expense';

  return (
    <div className={`p-4 rounded ${bgColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <span className={`px-2 py-1 rounded text-sm font-medium ${badgeColor}`}>
            {badgeLabel}
          </span>
          <p className="mt-2 font-semibold">{transaction.description}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">
            ${transaction.amount.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(transaction.occurredAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Key Changes:**
- Color logic now uses `transaction.type` (not sign of amount)
- Always display amount as positive
- Badge shows "Income" or "Expense"

**Verify:** Component renders correctly, no className errors.

---

### 3.5 Frontend Build & Test

```bash
cd frontend
npm test
npm run build
npx tsc --noEmit
```

**Expected:** 
- Tests pass
- Build succeeds
- No TypeScript errors

---

## Phase 4: Documentation & QA (0.5 hours)

### 4.1 Update Postman Collection

**File:** `tools/postman/pocketFinance_collection.json`

Add request:
```json
{
  "name": "Create INCOME Transaction",
  "request": {
    "method": "POST",
    "url": "{{baseUrl}}/api/transactions",
    "body": {
      "type": "INCOME",
      "amount": 5000,
      "currency": "USD",
      "description": "Monthly salary",
      "occurredAt": "2026-05-02T09:00:00Z"
    }
  }
}
```

And similar for EXPENSE.

**Verify:** Postman collection is valid JSON.

---

### 4.2 Manual Smoke Tests

1. **Create INCOME:**
   ```bash
   curl -X POST http://localhost:8080/api/transactions \
     -H "Content-Type: application/json" \
     -d '{"type":"INCOME","amount":5000,"currency":"USD","description":"Salary","occurredAt":"2026-05-02T09:00:00Z"}'
   ```
   ✓ Expect 201 with type in response

2. **Create EXPENSE:**
   ```bash
   curl -X POST http://localhost:8080/api/transactions \
     -H "Content-Type: application/json" \
     -d '{"type":"EXPENSE","amount":50,"currency":"USD","description":"Coffee","occurredAt":"2026-05-02T10:00:00Z"}'
   ```
   ✓ Expect 201 with type in response

3. **List (GET):**
   ```bash
   curl http://localhost:8080/api/transactions
   ```
   ✓ Expect both INCOME and EXPENSE in results

4. **Missing type (should fail):**
   ```bash
   curl -X POST http://localhost:8080/api/transactions \
     -H "Content-Type: application/json" \
     -d '{"amount":50,"currency":"USD"}'
   ```
   ✓ Expect 400 Bad Request

5. **Browser smoke test:**
   - Navigate to `/transactions/new`
   - Fill form with type=INCOME, amount=5000
   - Submit
   - Verify transaction appears in list with green badge

---

### 4.3 Final Verifications

```bash
# Backend
cd backend
./mvnw clean test    # All tests pass
./mvnw clean compile # No compilation errors
git log --oneline -1 # Clear commit message

# Frontend
cd frontend
npm test             # All tests pass
npm run build        # Build succeeds
git log --oneline -1 # Clear commit message
```

---

## ✅ Done Checklist

- [ ] TransactionType enum created & compiles
- [ ] Migration V003 created & executes successfully
- [ ] Transaction entity updated with type field
- [ ] All DTOs updated (Create, Update, Response)
- [ ] Mapper updated to include type
- [ ] Backend tests written & passing
- [ ] `./mvnw test` passes
- [ ] Frontend types updated (TypeScript compiles)
- [ ] Frontend service updated (sends type)
- [ ] Frontend form updated (collects type)
- [ ] Frontend component updated (renders type badge)
- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] Postman collection updated
- [ ] Manual smoke tests pass (POST INCOME, POST EXPENSE, GET)
- [ ] No console.logs or debug code
- [ ] Git commit message is clear
- [ ] PR description links to SPEC-TRANSACTION-TYPES.md

---

## 🎯 Success Criteria

**Backend:** 
- ✓ `POST /api/transactions` with type=INCOME returns 201 with INCOME in response
- ✓ `POST /api/transactions` with type=EXPENSE returns 201 with EXPENSE in response
- ✓ `POST /api/transactions` without type returns 400 Bad Request
- ✓ `GET /api/transactions` returns list with both types
- ✓ All historical data has type=EXPENSE

**Frontend:**
- ✓ Create form has type select field
- ✓ Form submission sends type in request body
- ✓ Transaction list shows INCOME with green badge, EXPENSE with red badge
- ✓ TypeScript compiles without errors
- ✓ All tests pass

**Overall:**
- ✓ Feature ready for testing
- ✓ No breaking changes in existing endpoints
- ✓ Code quality: clean, tested, documented

---

**Last Updated:** 2026-05-02  
**Estimated Total Duration:** 3-3.5 hours

