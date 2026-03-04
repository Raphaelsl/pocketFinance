# SPEC-001 — Paginated Response DTO

## Metadata

| Campo         | Valor                          |
|---------------|--------------------------------|
| **ID**        | SPEC-001                       |
| **Status**    | Draft                          |
| **Tipo**      | Enhancement                    |
| **Prioridade**| Medium                         |
| **Estimativa**| 2h                             |
| **Criado em** | 2026-03-03                     |
| **Autor**     | —                              |
| **Assignee**  | —                              |

---

## 1. Overview

Atualmente o endpoint `GET /api/transactions` retorna o tipo `Page<TransactionResponse>` do Spring Data diretamente no response body. Isso expõe metadados internos do framework que não agregam valor ao cliente da API (ex: `pageable`, `unpaged`, `paged`, `sort` duplicado), poluindo o contrato e acoplando a resposta ao Spring Data.

---

## 2. Problem Statement

O payload atual contém campos redundantes e de implementação interna:

```json
{
  "content": [...],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": { "empty": true, "sorted": false, "unsorted": true },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "last": true,
  "totalPages": 1,
  "totalElements": 1,
  "first": true,
  "size": 10,
  "number": 0,
  "numberOfElements": 1,
  "sort": { "empty": true, "sorted": false, "unsorted": true },
  "empty": false
}
```

**Problemas identificados:**
- `pageable` é um objeto interno do Spring — o cliente não precisa saber disso
- `sort` aparece **duas vezes** (dentro de `pageable` e na raiz)
- `paged`, `unpaged`, `offset`, `numberOfElements` são redundantes
- `number` e `size` duplicam `pageNumber` e `pageSize`
- Acopla o contrato da API ao Spring Data (`PageImpl`)

---

## 3. Goal

Criar um DTO de resposta paginada próprio (`PagedResponse<T>`) que exponha apenas os campos semânticamente relevantes para o cliente, tornando o contrato limpo, estável e independente do framework.

---

## 4. Acceptance Criteria

- [ ] O endpoint `GET /api/transactions` retorna o novo formato de paginação
- [ ] O response **não contém** os campos: `pageable`, `sort` (objeto), `paged`, `unpaged`, `offset`, `numberOfElements`, `number`, `empty`
- [ ] O response **contém** os campos: `content`, `page`, `size`, `totalElements`, `totalPages`, `first`, `last`
- [ ] Todos os testes de integração existentes continuam passando
- [ ] O tipo genérico `PagedResponse<T>` pode ser reutilizado em outros endpoints futuros

---

## 5. API Contract

### Antes (atual)

`GET /api/transactions?page=0&size=10`

```json
{
  "content": [ { "id": "...", "amount": 150.50, "..." } ],
  "pageable": { "pageNumber": 0, "pageSize": 10, "sort": {...}, "..." },
  "totalElements": 1,
  "totalPages": 1,
  "last": true,
  "first": true,
  "size": 10,
  "number": 0,
  "numberOfElements": 1,
  "sort": { "empty": true, "sorted": false, "unsorted": true },
  "empty": false
}
```

### Depois (esperado)

```json
{
  "content": [ { "id": "...", "amount": 150.50, "..." } ],
  "page": 0,
  "size": 10,
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

---

## 6. Technical Spec

### 6.1 Novo DTO — `PagedResponse<T>`

Criar em `backend/src/main/java/com/pocketfinance/backend/dto/PagedResponse.java`:

```java
package com.pocketfinance.backend.dto;

import org.springframework.data.domain.Page;
import java.util.List;

public record PagedResponse<T>(
    List<T> content,
    int page,
    int size,
    long totalElements,
    int totalPages,
    boolean first,
    boolean last
) {
    public static <T> PagedResponse<T> from(Page<T> page) {
        return new PagedResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.isFirst(),
            page.isLast()
        );
    }
}
```

### 6.2 Alteração no Controller

Arquivo: `backend/src/main/java/com/pocketfinance/backend/controller/TransactionController.java`

```java
// ANTES
@GetMapping
public ResponseEntity<Page<TransactionResponse>> listTransactions(...) {
    Page<TransactionResponse> response = transactionService.list(...);
    return ResponseEntity.ok(response);
}

// DEPOIS
@GetMapping
public ResponseEntity<PagedResponse<TransactionResponse>> listTransactions(...) {
    Page<TransactionResponse> page = transactionService.list(...);
    return ResponseEntity.ok(PagedResponse.from(page));
}
```

### 6.3 Arquivos impactados

| Arquivo | Tipo de mudança |
|---------|----------------|
| `dto/PagedResponse.java` | Criar |
| `controller/TransactionController.java` | Alterar tipo de retorno do `listTransactions` |
| `TransactionIntegrationTest.java` | Atualizar assertions da listagem |

### 6.4 Sem mudança necessária em

- `TransactionService` — continua retornando `Page<TransactionResponse>`
- `TransactionRepository` — sem alteração
- Endpoints de `GET /{id}`, `POST`, `PUT`, `DELETE` — não afetados

---

## 7. Dev Plan

### Task 1 — Criar `PagedResponse<T>`
- Criar o record genérico em `dto/PagedResponse.java`
- Implementar o factory method estático `from(Page<T>)`
- **Critério:** classe compila sem erros

### Task 2 — Atualizar `TransactionController`
- Substituir `Page<TransactionResponse>` por `PagedResponse<TransactionResponse>` na assinatura do método `listTransactions`
- Envolver o retorno do service com `PagedResponse.from(...)`
- **Critério:** aplicação sobe e endpoint responde com novo formato

### Task 3 — Atualizar testes de integração
- Em `TransactionIntegrationTest`, ajustar assertions do teste `shouldListTransactionsWithPagination`
- Verificar presença dos campos: `content`, `page`, `size`, `totalElements`, `totalPages`
- Verificar **ausência** dos campos: `pageable`, `numberOfElements`
- **Critério:** todos os testes passam com `./mvnw test`

### Task 4 — Atualizar Postman Collection
- Atualizar exemplo de response na collection `tools/postman/pocketFinance_collection.json`
- **Critério:** campos da collection refletem o novo contrato

---

## 8. Out of Scope

- Outros endpoints que possam usar paginação no futuro (serão cobertos quando implementados)
- Mudança no formato de ordenação (`sort` como string no response)
- Versionamento de API (`/v1/`, `/v2/`)