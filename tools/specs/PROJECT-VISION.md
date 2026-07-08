# PocketFinance — Visão do Projeto

## Origem

PocketFinance nasceu como um projeto prático de longo prazo para ser construído
entre Tech Lead e Dev em formação.

A ideia inicial era simples:

> Construir, em ritmo leve e com PRs pequenos, um micro-SaaS de controle financeiro
> que pudesse virar produto real, portfólio e laboratório de engenharia.

O projeto evoluiu ao longo do tempo. Algumas decisões técnicas mudaram, mas a
essência continua a mesma: aprender engenharia construindo algo concreto.

---

## Objetivos

PocketFinance tem dois objetivos simultâneos:

1. **Produto real**
   - Registrar transações financeiras.
   - Editar, listar e excluir transações.
   - Evoluir para dashboard, analytics e uso de IA.
   - Ter potencial de deploy público e apresentação em portfólio.

2. **Formação técnica**
   - Ensinar engenharia de software em contexto real.
   - Praticar Git, branches, commits, PRs e review.
   - Aprender backend, frontend, arquitetura, testes, produto, IA e deploy.
   - Criar rotina de entrega com feedback técnico constante.

---

## Papéis

### Tech Lead

Responsabilidades:

- Definir direção técnica e pedagógica.
- Quebrar trabalho em tarefas pequenas.
- Revisar PRs com rigor e intenção de ensino.
- Fazer pair programming quando necessário.
- Proteger o escopo para não atropelar o aprendizado.
- Ajudar o Dev a entender tradeoffs, não apenas copiar soluções.

### Dev

Responsabilidades:

- Implementar as tasks.
- Abrir PRs pequenos.
- Rodar validações combinadas.
- Responder feedback de review.
- Fazer perguntas quando a intenção da task não estiver clara.
- Evoluir gradualmente de execução guiada para autonomia técnica.

---

## Produto Imaginado

O produto final esperado é um app de finanças pessoais com:

- CRUD de transações.
- Tipos de transação:
  - `INCOME`
  - `EXPENSE`
- Dashboard financeiro.
- Categorias.
- Input por linguagem natural no futuro.
- Deploy público.

Exemplo futuro de entrada por linguagem natural:

```text
Gastei R$ 150 no mercado ontem.
```

Saída esperada em uma fase futura:

```json
{
  "amount": 150,
  "type": "EXPENSE",
  "category": "Mercado",
  "description": "Mercado",
  "occurredAt": "data inferida"
}
```

Esse fluxo ainda não está implementado. Ele pertence à fase futura de
**AI Engineering / Épico E**.

---

## Roadmap Original Adaptado

| Épico | Competência | Status | Intenção |
|-------|-------------|--------|----------|
| A | Foundation Engineering | Concluído | Setup, repo, Docker, Postgres, Spring Boot, Flyway |
| B | Backend Engineering | Concluído | CRUD real com DTOs, service layer, repository, pagination e testes |
| C | Frontend Engineering | Em andamento | Next.js, React, TypeScript, forms, API integration e React Query |
| Pós-C | Architecture & Code Quality | Planejado | Refatorar padrões, melhorar testes, acessibilidade e boundaries |
| D | Product Engineering | Planejado | Dashboard, KPIs, filtros, UX e analytics |
| E | AI Engineering | Planejado | Parsing por linguagem natural, categorização e assistente financeiro |
| F | Platform Engineering | Planejado | Deploy, CI/CD, ambientes, logs e observabilidade |

Ver também `LEARNING-ROADMAP.md`.

---

## Princípios de Trabalho

### PRs pequenos

Cada PR deve tentar ensinar ou validar uma coisa por vez.

Exemplos:

- Uma PR para setup.
- Uma PR para listagem.
- Uma PR para criação.
- Uma PR para edição.
- Uma PR para delete.

### Review pedagógico

O objetivo do review não é apenas bloquear bugs. O review deve ajudar o Dev a
entender por que uma decisão é melhor que outra.

Ordem sugerida de review:

1. A feature funciona?
2. O contrato com API/payload está correto?
3. Testes e typecheck acompanham a mudança?
4. O código está legível e consistente com o projeto?
5. Há uma abstração necessária agora, ou é cedo demais?

### Aprender sentindo a dor

O projeto intencionalmente começa com soluções mais manuais antes de introduzir
bibliotecas ou abstrações.

Exemplos:

- Primeiro `fetch + useState`.
- Depois React Query.
- Primeiro forms com `useState`.
- Depois React Hook Form.
- Primeiro `useMutation` direto na page.
- Depois, se a repetição justificar, hooks de domínio como `useDeleteTransaction`.

Essa progressão está documentada em `PEDAGOGIA-EPICO-C.md`.

---

## Decisões que Mudaram desde a Ideia Inicial

Alguns pontos da ideia original foram atualizados:

- O backend final é **Java + Spring Boot**, não Python.
- O banco principal é **PostgreSQL**, não SQLite.
- O frontend usa **Next.js + React + TypeScript + Tailwind**.
- O frontend usa `fetch` via service layer; Axios não é uma decisão atual.
- O domínio deixou de ser apenas "despesas" e virou `Transaction` com:
  - `amount` sempre positivo.
  - `type` definindo entrada ou saída.
- LLM continua no roadmap, mas ainda não existe spec detalhada nem implementação.

---

## O que este Documento Não É

Este documento não substitui:

- Specs técnicas (`SPEC-*.md`).
- Roadmap de aprendizado (`LEARNING-ROADMAP.md`).
- Estratégia pedagógica do Épico C (`PEDAGOGIA-EPICO-C.md`).
- Regras de domínio detalhadas (`DOMAIN-KNOWLEDGE.md`).

Ele existe para preservar a intenção original do projeto e orientar decisões
quando houver dúvida entre "fazer perfeito agora" e "ensinar no momento certo".

---

## Próximos Documentos Úteis

Depois deste documento, os próximos candidatos naturais são:

- `DEFINITION-OF-DONE.md` — checklist para aceitar PRs.
- `TL-REVIEW-PLAYBOOK.md` — guia de review pedagógico para o Tech Lead.
