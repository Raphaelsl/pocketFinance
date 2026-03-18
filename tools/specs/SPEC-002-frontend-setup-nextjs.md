# SPEC-002 — C1: Setup Next.js

## Metadata

| Campo | Valor |
|-------|-------|
| **ID** | SPEC-002 |
| **Épico** | C — Frontend |
| **Status** | Draft |
| **Tipo** | Setup |
| **Prioridade** | High |
| **Estimativa** | 2h |
| **Depende de** | Épico B concluído |

---

## 1. Overview

Criar o projeto frontend em Next.js com estrutura de pastas profissional, Tailwind configurado, service layer base e layout global. Este setup é a fundação para todos os cards C2–C5.

---

## 2. Goal

Ter um projeto Next.js rodando localmente, integrado ao backend via variável de ambiente, com estrutura organizada e layout base renderizando.

---

## 2.5 Conceitos Ensinados

**O Dev aprenderá:**
- Estrutura de projeto Next.js (app router vs pages router)
- Organização de pastas: `components/`, `services/`, `types/`, `app/`
- Variáveis de ambiente (`.env.local` com `NEXT_PUBLIC_` prefix)
- Tailwind CSS (utility-first CSS framework)
- Componentes React reutilizáveis (Header, Layout)
- Integração com backend via URL de API

**Nenhum problema pedagógico ainda** — C1 é apenas fundação. Problema real surge em C2.

---

## 3. Acceptance Criteria

- [ ] Projeto Next.js criado com TypeScript
- [ ] Tailwind CSS configurado e funcionando
- [ ] Variável de ambiente `NEXT_PUBLIC_API_URL` apontando para o backend
- [ ] Estrutura de pastas criada conforme spec
- [ ] `transactionService.ts` base criado (só com tipagem, sem lógica ainda)
- [ ] Layout global com header simples renderizando em `http://localhost:3000`
- [ ] `docker-compose.yml` atualizado com serviço `frontend`

---

## 4. Estrutura de Pastas

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout global (header, nav)
│   │   ├── page.tsx            # Redirect para /transactions
│   │   └── transactions/
│   │       └── page.tsx        # Placeholder — implementado no C2
│   ├── components/
│   │   └── layout/
│   │       └── Header.tsx
│   ├── services/
│   │   └── transactionService.ts  # Camada de acesso à API
│   └── types/
│       └── transaction.ts      # Tipos TypeScript
├── .env.local
├── tailwind.config.ts
└── package.json
```

---

## 5. Technical Spec

### 5.1 Tipos TypeScript (`types/transaction.ts`)

```typescript
export interface Transaction {
  id: string
  amount: number
  currency: string
  description: string
  occurredAt: string
  categoryId: string | null
  categoryName: string | null
  metadata: string | null
  createdAt: string
  updatedAt: string
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface TransactionCreateRequest {
  amount: number
  currency: string
  description: string
  occurredAt: string
  categoryId?: string | null
  metadata?: string | null
}

export interface TransactionUpdateRequest extends TransactionCreateRequest {}
```

### 5.2 Service base (`services/transactionService.ts`)

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL

export const transactionService = {
  // Implementado no C2
  list: async () => {},
  // Implementado no C3
  create: async () => {},
  // Implementado no C4
  getById: async () => {},
  update: async () => {},
  // Implementado no C5
  delete: async () => {},
}
```

### 5.3 Variável de ambiente (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 5.4 Docker Compose — adicionar serviço frontend

```yaml
frontend:
  build: ./frontend
  ports:
    - "3000:3000"
  environment:
    - NEXT_PUBLIC_API_URL=http://backend:8080
  depends_on:
    - db
```

---

## 6. Dev Plan

| # | Task | Critério |
|---|------|----------|
| 1 | Criar projeto com `npx create-next-app@latest frontend --typescript --tailwind --app` | Projeto sobe em localhost:3000 |
| 2 | Criar estrutura de pastas (`services/`, `types/`, `components/layout/`) | Pastas existem |
| 3 | Criar `types/transaction.ts` com todos os tipos | TypeScript compila sem erros |
| 4 | Criar `services/transactionService.ts` base | Arquivo existe com estrutura vazia |
| 5 | Criar `Header.tsx` com nome do app | Renderiza no layout |
| 6 | Criar `layout.tsx` global com Header | Visível em localhost:3000 |
| 7 | Configurar `.env.local` | Variável acessível no código |
| 8 | Atualizar `docker-compose.yml` | `docker compose up` sobe frontend |

---

## 7. Out of Scope

- Autenticação
- Qualquer página além do layout base
- Estilização elaborada do Header
