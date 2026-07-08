# PocketFinance — Project Context

## Visão Geral

Micro-SaaS educacional com dois objetivos:
1. **Produto real** — controle financeiro com backend, frontend e futura IA
2. **Formação técnica** — acelerar o Dev (filho do TL) com práticas reais de engenharia

**Origem e intenção do projeto:** ver `PROJECT-VISION.md`.

## Princípios

- Core first (Transaction antes de Category)
- Arquitetura limpa: DTOs obrigatórios, Service layer, ControllerAdvice, Logging mínimo
- Manual testing primeiro, automação depois
- PRs pequenos com revisão obrigatória (TL)
- Spikes pedagógicos sob demanda

---

## Roadmap

| Épico | Nome | Status |
|-------|------|--------|
| A | Setup & Infraestrutura | ✅ Concluído |
| B | Backend CRUD (Transaction) | ✅ Concluído |
| C | Frontend (Next.js) + Integração | 🚧 Em andamento |
| D | Dashboard & Aggregations | ⏳ Futuro |
| E | LLM Integration | ⏳ Futuro |
| F | Deploy & Productionization | ⏳ Futuro |

**Roadmap por competências:** ver `LEARNING-ROADMAP.md`.

---

## Épico A — Setup & Infra ✅

- Git + templates (README, PR, ISSUE)
- Docker + Postgres + Adminer
- Spring Boot skeleton
- Flyway, Health endpoint, estrutura de pacotes

## Épico B — Backend CRUD (Transaction) ✅

- Entity Transaction com @ManyToOne Category
- Repository + Specifications + Pagination
- DTOs + Mapper + Service layer
- Controller REST completo + ControllerAdvice
- Logging (timing + service)
- Postman manual tests
- Cards do Épico B no Asana (card 9 = SPEC-001 PagedResponse)

### Specs criados no Épico B
- `SPEC-001-paginated-response-dto.md` — substituir `Page<T>` do Spring por `PagedResponse<T>` próprio

## Épico C — Specs criados

| Spec | Card | Tecnologias-chave | Tipo |
|------|------|---|---|
| SPEC-002 | C1 Setup Next.js | Next.js + Tailwind + service layer base | Fundação |
| SPEC-003 | C2 List Transactions | fetch + useState (intencional) | **Pedagógica** |
| SPEC-004 | C3 Create Transaction | useState manual + validação (intencional) | **Pedagógica** |
| SPEC-004 | C3.1 Create Polish | validação, normalização, consistência visual | **Qualidade incremental** |
| SPEC-005 | C4 Edit Transaction | React Query + React Hook Form | **Upgrade** |
| SPEC-006 | C5 Delete Flow | useMutation + ConfirmDeleteModal | **Consolida** |

**📖 Estratégia Pedagógica:** Abordagem progressiva "sentir dor → aprender solução". Ver `PEDAGOGIA-EPICO-C.md` para detalhes de cada spike.

## Épico C — Frontend Next.js + Integração 🚧

### Subépicos planejados
| ID | Escopo | Abordagem |
|----|--------|---|
| C1 | Setup Next.js — estrutura, layout | Fundação (sem lógica assíncrona) |
| C2 | List Transactions — GET paginado, loading, error state | fetch + useState (manual) |
| C3 | Create Transaction — form, POST, feedback visual | useState por campo (manual) |
| C3.1 | Polish Create Transaction — validação e consistência | Sem React Query/RHF ainda |
| C4 | Edit Transaction — React Query + React Hook Form | Upgrade: libs depois de sentir dor |
| C5 | Delete Flow — confirmation modal, mutations | Consolida padrão useMutation |

### Decisões técnicas (fechadas)

| Decisão | C2/C3 | C4/C5 | Racional |
|---------|-------|-------|----------|
| Fetch | `fetch + useState` (manual) | React Query | **Pedagógico**: Sentir a dor de state management antes de aprender a solução |
| Forms | `useState` manual (por campo) | React Hook Form | **Pedagógico**: Entender boilerplate antes de lib que elimina it |
| Estilo | Tailwind | Tailwind | Hábito desde o início, não adiciona complexidade |
| Estrutura | Service layer no frontend | Service layer no frontend | Espelha padrão do backend, organiza desde o C1 |

**Nota:** C2/C3 são intencionalmente "verbosas" para criar momentos pedagógicos onde o Dev vê a "dor" que C4/C5 resolvem. Isso acelera aprendizado real vs apenas aprendizado de APIs.

---

## 📚 Estratégia Pedagógica do Épico C

A progressão C1 → C2 → C3 → C4 → C5 é **intencional e pedagógica**.

**Princípio:** Dev aprende fazendo, sentindo problemas reais antes de aprender soluções.

- **C1:** Fundação (estrutura, variáveis de env, Tailwind)
- **C2:** Fetch manual → Dev sente: "3+ useState pra rastrear 1 requisição"
- **C3:** Forms manuais → Dev sente: "Quantos useState criei? E com 20 campos?"
- **C4:** React Query + RHF → TL mostra: "Essas libs resolvem exatamente o que você sentiu"
- **C5:** Padrão consolida → Dev aplica conhecimento, vê repetição é por design

**Cada spike tem objetivo pedagógico claro:** Ver `PEDAGOGIA-EPICO-C.md` para:
- Mapa de conceitos por card
- 7 sessões práticas com TL (ao vivo no código)
- Razão exata de cada decisão técnica

---

## Estado do Dev (o que ele já sabe)

**Backend:** fluxo HTTP, Controller → Service → Repository, DTO, paginação, Specification, PRs, logs

**Frontend:** em andamento no Épico C. O Dev já está praticando Next.js, React, TypeScript,
React Query, React Hook Form, testes de componentes e integração com backend.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Java 21 + Spring Boot |
| ORM | Spring Data JPA + Hibernate |
| DB | PostgreSQL 15 (Docker) |
| Migrations | Flyway |
| Admin DB | Adminer |
| Frontend | Next.js + React + TypeScript + Tailwind |
| Estado assíncrono | React Query |
| Forms | React Hook Form |
| Testes | JUnit 5 + Spring Boot Test; Jest + React Testing Library |
| API Docs | Postman Collection (`tools/postman/`) |

## Próxima fase após Épico C

Após C5 estar funcionando e com testes verdes, abrir uma fase curta de
**Architecture & Code Quality**. Essa fase não deve bloquear o aprendizado inicial
de React; ela existe para consolidar padrões depois que a repetição ficou visível.

Assuntos previstos:
- hooks de domínio (`useDeleteTransaction`, `useUpdateTransaction`) quando fizerem sentido
- normalização consistente de payloads create/edit
- testes menos acoplados a classes CSS
- acessibilidade de modal
- limpeza de comentários e `eslint-disable` obsoletos

## Convenções

- Specs ficam em `tools/specs/` no formato `SPEC-NNN-descricao.md`
- Collections Postman em `tools/postman/`
- Cards Asana referenciam o ID do spec (ex: SPEC-001)
