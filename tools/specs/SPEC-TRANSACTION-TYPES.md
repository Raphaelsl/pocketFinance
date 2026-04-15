# SPEC-TRANSACTION-TYPES — Add Income/Expense Type Field

## Metadata

| Campo | Valor |
|-------|-------|
| **ID** | SPEC-TRANSACTION-TYPES |
| **Épico** | B+ — Backend Enhancement (Prerequisito para Épico C) |
| **Status** | Draft |
| **Tipo** | Schema Change |
| **Prioridade** | High |
| **Estimativa** | 2h |
| **Depende de** | Épico B concluído |
| **Bloqueado por** | Nada |
| **Bloqueia** | SPEC-002 (C1 Setup) — recomendado fazer isso antes do frontend |

---

## 1. Overview

O sistema atual aceita **apenas transações positivas** (validação `@Positive` no backend). Para um verdadeiro controle financeiro pessoal, precisamos diferenciar:
- **INCOME** — Receitas, salários, depósitos, ganhos
- **EXPENSE** — Despesas, gastos, compras, devoluções

Esta SPEC adiciona um campo `type: TransactionType` ao modelo Transaction, permitindo diferenciar fluxos de caixa e preparar o Dashboard (Épico D) para calcular saldo real.

---

## 2. Goal

Adicionar suporte a transações de dois tipos (receita e despesa), mantendo backward compatibility onde possível, e preparar o modelo de dados para aggregations no Dashboard.

---

## 2.5 Conceitos Ensinados

**O Dev aprenderá:**
- Enums em Java + JPA
- Migrations (Flyway) — ALTER TABLE + ADD COLUMN
- Impacto de mudança de schema em DTOs
- Validação condicional (nem sempre amount > 0)
- Filtering por tipo (queries no Dashboard)

**Problema resolvido:**
- ✅ Pode registrar gastos (não só receitas)
- ✅ Dashboard consegue calcular: saldo = receitas - despesas
- ✅ Queries podem filtrar/agrupar por tipo

---

## 3. Acceptance Criteria

### Backend
- [ ] Enum `TransactionType` criado (INCOME, EXPENSE)
- [ ] Entity `Transaction` adiciona campo `type`
- [ ] Flyway migration criada (ADD COLUMN type)
- [ ] `TransactionCreateRequest` atualizado com field `type`
- [ ] `TransactionUpdateRequest` atualizado com field `type`
- [ ] `TransactionDTO` atualizado com field `type` (resposta)
- [ ] Validação `@Positive` mantida em `amount` (sempre positivo)
- [ ] Dados históricos recebem `type='EXPENSE'` (default conservador)
- [ ] Postman collection atualizada com exemplos INCOME + EXPENSE
- [ ] Backend compila sem erros

### Frontend (frontend existente não pode quebrar)
- [ ] `types/transaction.ts` — adicionar `TransactionType` enum + campo `type` em `Transaction` e `TransactionCreateRequest`
- [ ] `app/transactions/new/page.tsx` — adicionar `<select>` de tipo no form + estado `type` + validação
- [ ] `services/transactionService.ts` — `create()` envia `type` no body do POST
- [ ] `components/TransactionItem.tsx` — cor usa `transaction.type === 'EXPENSE'` em vez de `amount < 0`

---

## 4. Problem Statement

### Atual (❌ Limitado)
```java
// TransactionCreateRequest.java
@Positive  // <-- BLOQUEIA qualquer valor negativo
BigDecimal amount
```

**Consequência:**
- Dev não consegue criar transação de gasto (despesa)
- Todos os registros são interpretados como "receita"
- Dashboard não consegue calcular saldo

### Proposto (✅ Flexível)
```java
// TransactionCreateRequest.java
enum TransactionType {
  INCOME,    // receita
  EXPENSE    // despesa
}

@Positive  // amount é sempre positivo
BigDecimal amount,

@NotNull
TransactionType type
```

**Benefício:**
- ✅ Semanticamente clara (INCOME vs EXPENSE)
- ✅ Amount sempre positivo (sem confusão de sinal)
- ✅ Fácil filtrar/agrupar por tipo
- ✅ Suporta caso de uso: "Recebi R$5000" E "Gastei R$1200"

---

## 5. Technical Spec

### 5.1 Enum (`model/TransactionType.java`)

```java
package com.pocketfinance.backend.model;

public enum TransactionType {
  INCOME,   // Receita, salário, depósito, ganho
  EXPENSE   // Despesa, gasto, compra, serviço
}
```

### 5.2 Entity Update (`model/Transaction.java`)

```java
@Entity
@Table(name = "transactions")
public class Transaction {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column
  private BigDecimal amount;

  @Column
  @Enumerated(EnumType.STRING)  // armazena como "INCOME" ou "EXPENSE"
  private TransactionType type;   // <-- NEW

  @Column
  private String currency;

  @Column
  private String description;

  @Column(name = "occurred_at")
  private Instant occurredAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id")
  private Category category;

  @Column
  private String metadata;

  @Column(name = "created_at")
  private Instant createdAt;

  @Column(name = "updated_at")
  private Instant updatedAt;

  // Getters
  public TransactionType getType() {
    return type;
  }

  // Setter
  public void setType(TransactionType type) {
    this.type = type;
  }

  // ... resto do código
}
```

### 5.3 Flyway Migration (`db/migration/V003__add_transaction_type.sql`)

```sql
-- Add new column 'type' to transactions table
ALTER TABLE transactions
ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'EXPENSE';

-- Create index for filtering by type
CREATE INDEX idx_transactions_type ON transactions(type);
```

**Nota:** `DEFAULT 'EXPENSE'` é temporário — dados históricos serão marcados como EXPENSE (mais conservador).

### 5.4 Request DTOs

#### `TransactionCreateRequest.java`
```java
public record TransactionCreateRequest(
  @NotNull(message = "Amount is required")
  @Positive(message = "Amount must be positive")  // <-- MANTÉM @Positive
  BigDecimal amount,

  @NotNull(message = "Type is required")  // <-- NEW
  TransactionType type,

  @NotBlank(message = "Currency is required")
  String currency,

  @NotBlank(message = "Description is required")
  String description,

  @NotNull(message = "Occurred at is required")
  Instant occurredAt,

  UUID categoryId,

  String metadata
) {
}
```

#### `TransactionUpdateRequest.java`
```java
public record TransactionUpdateRequest(
  @NotNull(message = "Amount is required")
  @Positive(message = "Amount must be positive")
  BigDecimal amount,

  @NotNull(message = "Type is required")  // <-- NEW
  TransactionType type,

  @NotBlank(message = "Currency is required")
  String currency,

  @NotBlank(message = "Description is required")
  String description,

  @NotNull(message = "Occurred at is required")
  Instant occurredAt,

  UUID categoryId,

  String metadata
) {
}
```

### 5.5 Response DTO

#### `TransactionDTO.java`
```java
public record TransactionDTO(
  UUID id,
  BigDecimal amount,
  TransactionType type,  // <-- NEW
  String currency,
  String description,
  Instant occurredAt,
  UUID categoryId,
  String categoryName,
  String metadata,
  Instant createdAt,
  Instant updatedAt
) {
}
```

### 5.6 Service Layer

#### `TransactionService.java` (exemplo: método `create`)
```java
@Transactional
public TransactionDTO create(TransactionCreateRequest request) {
  log.info("Creating transaction: type={}, amount={}", request.type(), request.amount());

  Transaction transaction = new Transaction();
  transaction.setAmount(request.amount());
  transaction.setType(request.type());  // <-- NEW
  transaction.setCurrency(request.currency());
  transaction.setDescription(request.description());
  transaction.setOccurredAt(request.occurredAt());
  // ... resto

  Transaction saved = transactionRepository.save(transaction);
  log.info("Transaction created: id={}, type={}", saved.getId(), saved.getType());

  return transactionMapper.toDTO(saved);
}
```

### 5.7 Mapper Update

#### `TransactionMapper.java`
```java
@Component
public class TransactionMapper {

  public TransactionDTO toDTO(Transaction entity) {
    return new TransactionDTO(
      entity.getId(),
      entity.getAmount(),
      entity.getType(),  // <-- NEW
      entity.getCurrency(),
      entity.getDescription(),
      entity.getOccurredAt(),
      entity.getCategory() != null ? entity.getCategory().getId() : null,
      entity.getCategory() != null ? entity.getCategory().getName() : null,
      entity.getMetadata(),
      entity.getCreatedAt(),
      entity.getUpdatedAt()
    );
  }
}
```

---

## 6. Frontend Impact — Arquivos Existentes

> ⚠️ Estes são os arquivos **reais do projeto**. Todos os 4 devem ser atualizados nesta SPEC.

### 6.1 `src/types/transaction.ts`

Arquivo atual **não tem** `type`. Precisa adicionar enum + campo nas duas interfaces.

```typescript
// ADICIONAR no topo
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Transaction {
  id: string
  amount: number
  type: TransactionType  // <-- NEW
  currency: string
  description: string
  occurredAt: string
  categoryId: string | null
  categoryName: string | null
  metadata: string | null
  createdAt: string
  updatedAt: string
}

export interface TransactionCreateRequest {
  amount: number
  type: TransactionType  // <-- NEW
  currency: string
  description: string
  occurredAt: string
  categoryId?: string | null
  metadata?: string | null
}

export interface TransactionUpdateRequest extends TransactionCreateRequest {}
```

---

### 6.2 `src/services/transactionService.ts`

`create()` atualmente envia body **sem `type`** → backend retorna `400`.

```typescript
// ANTES (quebra com novo backend)
await transactionService.create({
  amount,
  currency: currency.trim().toUpperCase(),
  description: description.trim(),
  occurredAt: new Date(occurredAt).toISOString(),
})

// DEPOIS (envia type)
await transactionService.create({
  amount,
  type,                                   // <-- NEW
  currency: currency.trim().toUpperCase(),
  description: description.trim(),
  occurredAt: new Date(occurredAt).toISOString(),
})
```

---

### 6.3 `src/app/transactions/new/page.tsx`

Form atual **não tem campo type**. Precisa de estado + select + validação.

```typescript
// ADICIONAR estado
const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE)

// ADICIONAR no FormValues e FormErrors
type FormValues = {
  amount: number
  type: TransactionType  // <-- NEW
  currency: string
  description: string
  occurredAt: string
}

// ADICIONAR no validationSchema
type: [
  (values) => (!values.type ? 'Tipo obrigatório' : ''),
],

// ADICIONAR no JSX (antes do campo amount)
<select
  value={type}
  onChange={(e) => setType(e.target.value as TransactionType)}
>
  <option value={TransactionType.EXPENSE}>Despesa</option>
  <option value={TransactionType.INCOME}>Receita</option>
</select>
{errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
```

---

### 6.4 `src/components/TransactionItem.tsx`

Lógica atual usa `amount < 0` para cor — sempre verde agora (amount é sempre positivo).

```typescript
// ANTES (sempre verde porque amount nunca é negativo)
className={`font-semibold ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}

// DEPOIS (usa type para determinar cor)
className={`font-semibold ${transaction.type === TransactionType.EXPENSE ? 'text-red-500' : 'text-green-500'}`}
```

---

## 7. API Contract Atualizado

### Create: `POST /api/transactions`

**Request:**
```json
{
  "amount": 1500.00,
  "type": "INCOME",
  "currency": "BRL",
  "description": "Salário mensal",
  "occurredAt": "2024-03-01T00:00:00Z",
  "categoryId": null,
  "metadata": null
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 1500.00,
  "type": "INCOME",
  "currency": "BRL",
  "description": "Salário mensal",
  "occurredAt": "2024-03-01T00:00:00Z",
  "categoryId": null,
  "categoryName": null,
  "metadata": null,
  "createdAt": "2024-03-10T14:30:00Z",
  "updatedAt": "2024-03-10T14:30:00Z"
}
```

### Expense Example: `POST /api/transactions`

**Request:**
```json
{
  "amount": 250.00,
  "type": "EXPENSE",
  "currency": "BRL",
  "description": "Compra no supermercado",
  "occurredAt": "2024-03-10T10:15:00Z",
  "categoryId": null,
  "metadata": null
}
```

### List: `GET /api/transactions?page=0&size=10`

```json
{
  "content": [
    {
      "id": "...",
      "amount": 1500.00,
      "type": "INCOME",
      "currency": "BRL",
      "description": "Salário mensal",
      "occurredAt": "2024-03-01T00:00:00Z",
      "createdAt": "2024-03-10T14:30:00Z",
      "updatedAt": "2024-03-10T14:30:00Z"
    },
    {
      "id": "...",
      "amount": 250.00,
      "type": "EXPENSE",
      "currency": "BRL",
      "description": "Compra no supermercado",
      "occurredAt": "2024-03-10T10:15:00Z",
      "createdAt": "2024-03-10T14:20:00Z",
      "updatedAt": "2024-03-10T14:20:00Z"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 2,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

---

## 8. Dev Plan

### Backend (2h)

| # | Task | Critério |
|---|------|----------|
| 1 | Criar Enum `TransactionType` (INCOME, EXPENSE) | Compila |
| 2 | Atualizar Entity `Transaction` — adicionar `type` field | Compila, JPA reconhece |
| 3 | Criar Flyway migration `V003__add_transaction_type.sql` | Migration roda sem erro |
| 4 | Atualizar `TransactionCreateRequest` com field `type` | DTO válido |
| 5 | Atualizar `TransactionUpdateRequest` com field `type` | DTO válido |
| 6 | Atualizar `TransactionDTO` com field `type` | DTO válido |
| 7 | Atualizar `TransactionMapper` — mapeiar novo field | Mapper cobre 100% dos campos |
| 8 | Atualizar `TransactionService` — logs + validações | Service cria ambos tipos |
| 9 | Testar manualmente via Postman (create INCOME + EXPENSE) | Ambos tipos salvam corretamente |
| 10 | Atualizar `tools/postman/pocketFinance_collection.json` com exemplos | Collection tem exemplos claros |

### Frontend (Integrado em C2, C3, C4)

| # | Task | Quando | Critério |
|---|------|--------|----------|
| A | Atualizar `types/transaction.ts` com `TransactionType` enum | C2 | TypeScript compila |
| B | Exibir tipo em `TransactionItem` (C2) | C2 | Lista mostra "💰 Receita" ou "💸 Despesa" |
| C | Adicionar select de tipo em form (C3) | C3 | Form permite escolher tipo |
| D | Permitir editar tipo (C4) | C4 | Update preserva tipo ou permite mudar |

---

## 9. Spike Pedagógico

Após implementar, o TL deve explorar com o Dev:

1. **Por quê Enum?** (vs string "INCOME" / "EXPENSE")
   - Type-safe em Java
   - Evita typos
   - Fácil de validar

2. **Flyway Migration** (como schema evolui)
   - Versioning de BD
   - Rastreabilidade
   - Como DEFAULT 'EXPENSE' protege dados históricos

3. **Impacto em cascata**
   - Mudança de modelo → DTOs mudam → Frontend muda
   - Por que é importante planejar mudanças de schema cedo

4. **Filtering no Dashboard** (próximo passo)
   - `GET /api/transactions?type=EXPENSE` — filtrar por tipo
   - `SELECT SUM(amount) WHERE type='INCOME'` — calcular receita total

---

## 10. Migration Workflow

### Dev local:

```bash
# 1. Backend já tem V001, V002... adiciona V003
# 2. Rodeia backend com `mvn spring-boot:run`
#    Flyway executa V003 automaticamente
# 3. Verifica banco com Adminer
#    SELECT * FROM transactions;
#    Column 'type' agora existe com default 'EXPENSE'

# 4. Testa POST /api/transactions com type=INCOME
# 5. Testa POST /api/transactions com type=EXPENSE
```

### Banco existente (já tem dados):

```sql
-- Após migration rodar, todos os registros históricos têm type='EXPENSE'
-- Dev pode categorizar melhor depois se quiser:
-- UPDATE transactions SET type='INCOME' WHERE description LIKE '%salário%'
```

---

## 11. Risk Assessment

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Dados históricos perdidos | Baixa | Alto | Flyway com DEFAULT 'EXPENSE' mantém dados |
| Quebra API existente | Média | Alto | Field `type` é obrigatório — rejeitará requests antigos |
| Confusão com "negative amounts" | Baixa | Baixo | Documentar: amount é SEMPRE positivo, type define direção |

---

## 12. Backward Compatibility

**❌ NÃO é totalmente backward compatible:**
- Clientes antigos que enviam `{ amount: 150, currency: "BRL", ... }` sem `type` receberão `400 Bad Request`
- **Mitigação:** Documentar na changelog que `type` é novo field obrigatório

**✅ Dados antigos não são perdidos:**
- Flyway migration usa DEFAULT, então registros históricos não são deletados

---

## 13. Out of Scope

- Balancing (calculara saldo = receitas - despesas) — será no Dashboard (Épico D)
- Categorias diferenciadas por tipo (INCOME_CATEGORIES vs EXPENSE_CATEGORIES) — futuro
- Recurring transactions (transações recorrentes) — futuro
- Orçamentos — futuro

---

## 14. References

- `PROJECT-CONTEXT.md` — Visão geral
- `SPEC-003` — Como frontend lista (será atualizado para exibir type)
- `SPEC-004` — Como frontend cria (será atualizado para selecionar type)
- Entity: `backend/src/main/java/com/pocketfinance/backend/model/Transaction.java`
- DTOs: `backend/src/main/java/com/pocketfinance/backend/dto/`

---

## 15. Done Checklist

Antes de dar "Done", verificar:

- [ ] Enum criado e testado
- [ ] Entity com novo field compilando
- [ ] Migration rodou sem erro (Adminer mostra coluna `type`)
- [ ] DTOs atualizados (create, update, response)
- [ ] Service passando tests
- [ ] Postman collection com 4 requisições: GET, POST (INCOME), POST (EXPENSE), PUT
- [ ] Sem erros de compilação/runtime
- [ ] Dev entende conceito de "type = semântica, amount = sempre positivo"
