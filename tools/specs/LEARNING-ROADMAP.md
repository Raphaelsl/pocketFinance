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
| 3 | Frontend Engineering | Épico C | Concluído | UI Next.js consumindo o CRUD do backend |
| 4 | Architecture & Code Quality | Pós-C | Em andamento | Refatorar padrões repetidos, melhorar testes, acessibilidade e boundaries |
| 5 | Product Engineering | Épico D | Planejado | Dashboard, analytics, UX e KPIs financeiros |
| 6 | AI Engineering | Épico E | Planejado | Parsing de transações em linguagem natural, categorização e fluxos assistidos |
| 7 | Platform Engineering | Épico F | Planejado | Deploy, CI/CD, ambientes, logs e observabilidade |

---

## Fase Atual

**Fase atual:** Architecture & Code Quality / Pós-C

Objetivo atual:

- Consolidar o CRUD frontend depois do Épico C.
- Extrair padrões que ficaram repetidos em React Query, forms e services.
- Melhorar testes, acessibilidade e boundaries antes do Épico D.

Trilha concluída do Épico C:

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

Não introduzir isso cedo demais. Durante o Épico C, o Dev primeiro aprendeu
os padrões básicos de React e React Query escrevendo-os diretamente.

Como C5 está concluído, iniciar esta fase agora.

Tasks:

- PC1 — Architecture baseline review
- PC2 — Domain hooks e boundaries de React Query
- PC3 — Normalização de payloads e contrato do service
- PC4 — Acessibilidade de modal e forms
- PC5 — Test cleanup e quality gate

Spec principal: `SPEC-007-post-c-architecture-code-quality.md`.

Pergunta pedagógica:

> "Agora que você repetiu `useQuery` e `useMutation`, onde a page começa a saber
> detalhes demais? O que pode virar hook de domínio sem esconder o aprendizado?"

---

## Épico D: Product Engineering

O Épico D transforma o CRUD em uma experiência de produto. O dashboard não deve
calcular totais a partir da página visível; agregações pertencem ao backend e usam
todo o período filtrado.

Cards planejados:

- D1 — Dashboard Aggregation API
- D2 — Dashboard Shell & KPI Summary
- D3 — Period & Currency Filters
- D4 — Expense Category Breakdown
- D5 — Monthly Financial Evolution
- D6 — Dashboard Quality Gate

Spec principal: `SPEC-008-epic-d-dashboard-aggregations.md`.

Decisão de domínio:

> O dashboard sempre agrega uma moeda por vez. Sem uma fonte de cotação, somar BRL,
> USD e EUR produziria um número visualmente convincente, mas financeiramente errado.

Pergunta pedagógica:

> "Por que somar as dez transações da página atual não representa o período inteiro?
> Como o banco pode devolver o resultado correto sem carregar tudo em memória?"

---

## Épico E: AI Engineering

O Épico E forma o Dev como AI Engineer — não apenas alguém que chama uma API,
mas alguém que projeta software confiável com IA como componente.

Stack: Spring AI + OpenAI (GPT-4o mini) + input de texto livre no frontend.

A progressão pedagógica é a mesma do Épico C: sentir o problema antes de aprender a solução.

| Card | Spec | Módulo | Intenção pedagógica |
|------|------|--------|---------------------|
| E1 | `SPEC-009` | Integration | Fazer a primeira chamada e sentir o problema do texto livre |
| E2 | `SPEC-009` | Integration | Structured Output resolve parsing, mas LLM viola regras de domínio |
| E3 | `SPEC-009` | Workflows + Reliability | Validação pós-LLM e workflow de dois passos (sugerir → confirmar) |
| E4 | `SPEC-009` | Reliability | Fallbacks, observabilidade de custo e guardrails de input |
| E5 | `SPEC-009` | AI Product | Frontend: input de texto pré-preenche o formulário existente |
| E6 | `SPEC-009` | Reliability | Quality gate: testes sem chamada real à OpenAI |

Spec principal: `SPEC-009-epic-e-ai-engineering.md`.

Pergunta pedagógica:

> "Você sabe fazer o LLM devolver um JSON. O que acontece quando ele devolve
> `amount: -50`? E quando a OpenAI fica fora por 2 minutos? E quanto custou
> cada chamada que você fez essa semana?"

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
