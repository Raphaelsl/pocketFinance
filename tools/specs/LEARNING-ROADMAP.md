# PocketFinance — Roadmap de Aprendizado

## Propósito

PocketFinance tem dois objetivos:

1. Construir um micro-SaaS real de controle financeiro.
2. Formar o Dev como engenheiro de software por meio de passos pequenos,
   revisados e próximos de um fluxo profissional.

Este roadmap descreve a jornada de aprendizado. As especificações de feature
continuam nos arquivos `SPEC-*.md`.

---

## Roadmap por Competências

| Fase | Competência | Épico original | Status | Resultado esperado |
|------|-------------|----------------|--------|--------------------|
| 1 | Foundation Engineering | Épico A | Concluído | Projeto, repo, infra local, Docker, Postgres, Flyway e Spring Boot básico |
| 2 | Backend Engineering | Épico B | Concluído | API CRUD de transações com DTOs, service layer, repository, paginação e testes |
| 3 | Frontend Engineering | Épico C | Em andamento | UI Next.js consumindo o CRUD do backend |
| 4 | Architecture & Code Quality | Pós-C | Planejado | Refatorar padrões repetidos, melhorar testes, acessibilidade e boundaries |
| 5 | Product Engineering | Épico D | Planejado | Dashboard, analytics, UX e KPIs financeiros |
| 6 | AI Engineering | Épico E | Planejado | Parsing de transações em linguagem natural, categorização e fluxos assistidos |
| 7 | Platform Engineering | Épico F | Planejado | Deploy, CI/CD, ambientes, logs e observabilidade |

---

## Fase Atual

**Fase atual:** Frontend Engineering / Épico C

Objetivo atual:

- Fechar o CRUD frontend de transações.
- Ensinar React, Next.js, TypeScript, integração com API, forms e estado assíncrono.
- Seguir a progressão documentada em `PEDAGOGIA-EPICO-C.md`.

Trilha atual do Épico C:

| Card | Spec | Foco | Intenção pedagógica |
|------|------|------|---------------------|
| C1 | `SPEC-002-frontend-setup-nextjs.md` | Setup Next.js | Estrutura antes de lógica |
| C2 | `SPEC-003-list-transactions-page.md` | Listar transações | Sentir a dor do estado assíncrono manual |
| C3 | `SPEC-004-create-transaction-page.md` | Form de criação | Sentir a dor do boilerplate de forms |
| C3.1 | `asana-cards/CARD-C3-1-create-transaction-polish.md` | Polish do create | Melhorar validação e consistência sem novas libs |
| C4 | `SPEC-005-edit-transaction-page.md` | Form de edição | Introduzir React Query e React Hook Form |
| C5 | `SPEC-006-delete-transaction-flow.md` | Delete flow | Consolidar `useMutation` e invalidação de cache |

---

## Pós-Épico C: Architecture & Code Quality

Não introduzir isso cedo demais. Durante o Épico C, o Dev deve primeiro aprender
os padrões básicos de React e React Query escrevendo-os diretamente.

Iniciar esta fase depois que C5 estiver funcionando, revisado e verde.

Tópicos:

- Extrair hooks de domínio somente depois que a repetição ficar visível:
  - `useTransactions`
  - `useUpdateTransaction`
  - `useDeleteTransaction`
- Normalizar payloads de request de forma consistente entre create/edit.
- Reduzir testes de UI acoplados a classes exatas do Tailwind quando comportamento for mais importante.
- Melhorar acessibilidade em modais e ações destrutivas.
- Remover comentários obsoletos e `eslint-disable` não utilizados.
- Revisar boundaries: orquestração na page vs componentes reutilizáveis.

Pergunta pedagógica:

> "Agora que você repetiu `useQuery` e `useMutation`, onde a page começa a saber
> detalhes demais? O que pode virar hook de domínio sem esconder o aprendizado?"

---

## Decisão de Domínio que Afeta as Próximas Fases

O projeto evoluiu de `Transaction.amount` sozinho para:

- `amount` sempre positivo.
- `type` define a direção financeira:
  - `INCOME`
  - `EXPENSE`

Essa decisão suporta dashboard e IA no futuro:

- Dashboard pode calcular totais usando `type`.
- LLM pode classificar a intenção explicitamente.
- UI evita ambiguidade de número negativo.

Ver `SPEC-TRANSACTION-TYPES.md`.

---

## Mapa de Documentação

| Documento | Propósito |
|-----------|-----------|
| `PROJECT-VISION.md` | Origem, intenção e princípios humanos do projeto |
| `PROJECT-CONTEXT.md` | Contexto atual do projeto e visão por épico |
| `LEARNING-ROADMAP.md` | Jornada de aprendizado por competência de engenharia |
| `DOMAIN-KNOWLEDGE.md` | Regras de domínio e semântica do sistema |
| `PEDAGOGIA-EPICO-C.md` | Estratégia pedagógica do Épico C |
| `SPEC-*.md` | Specs funcionais ou técnicas |
| `asana-cards/*.md` | Descrições prontas para cards |
| `SPIKE-STRUCTURE-FRONTEND.md` | Spike de arquitetura frontend |
| `SPEC-TRANSACTION-TYPES.md` | Evolução de domínio para income/expense |
