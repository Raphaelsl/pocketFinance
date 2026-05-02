# Copilot Agents and Skills - Como usar neste projeto

Este guia mostra como usar os agentes e skills ja configurados em `pocketFinance`.

## O que esta instalado

### Agents
- `@code-reviewer`: revisao tecnica em 5 eixos (corretude, legibilidade, arquitetura, seguranca, performance)
- `@test-engineer`: estrategia de testes, cobertura e fluxo Prove-It
- `@security-auditor`: revisao focada em vulnerabilidades e hardening

### Skills
- `test-driven-development`: usar ao mudar comportamento, corrigir bug ou implementar logica
- `code-review-and-quality`: usar antes de finalizar mudancas relevantes

## Fluxo recomendado por lifecycle

Para implementar uma nova feature, siga este fluxo (baseado em https://github.com/addyosmani/agent-skills):

| Fase | Comando | Use quando | Skill ativada |
|------|---------|-----------|---------------|
| **DEFINE** | `/spec` | Tem ideia ou requisito vago | spec-driven-development |
| **PLAN** | `/plan` | Tem spec pronto | planning-and-task-breakdown |
| **BUILD** | `/build` | Implementando mudanca em multiplos arquivos | incremental-implementation, test-driven-development |
| **VERIFY** | `/test` | Testes falhando ou debug necessario | debugging-and-error-recovery |
| **REVIEW** | `/review` | Pronto para merge | code-review-and-quality |
| **SHIP** | `/ship` | Pronto para deploy | shipping-and-launch |

**Para bugs (mais rapido):**
1. Peca para `@test-engineer` escrever teste que falha (Prove-It)
2. Implemente fix minimo
3. Rode `./mvnw test` (backend) ou `npm test` (frontend)
4. Peca `@code-reviewer` review
5. Se seguranca, rode `@security-auditor`

## Prompts prontos

### Fluxo Feature Completo

#### 1) Definir spec
```text
Crie uma spec (PRD) para esta feature: <descricao>.
Inclua: objetivos, requisitos, estrutura de dados, endpoints, testes minimos, limites e dependencias.
```

#### 2) Planejar decomposicao
```text
Decompor esta spec em tarefas pequenas (<3h cada):
- Cada tarefa com criterio de aceicao claro
- Listar dependencias
- Ordem recomendada
```

#### 3) Implementar incrementalmente
```text
Implementar esta tarefa em slice vertical: <descricao>.
- Escreva teste PRIMEIRO (deve falhar)
- Implemente minimo para passar
- Rode testes (./mvnw test)
- Commit atomico
```

#### 4) Review antes de merge
```text
@code-reviewer
Revise esta mudanca e priorize findings por severidade.
Liste Critical, Important e Suggestion com arquivo/linha e recomendacao objetiva.
```

#### 5) Security check
```text
@security-auditor
Audite esta mudanca: <caminho/endpoint>.
Foque OWASP Top 10, validacao entrada, authz, segredos, injecao SQL.
```

---

### Atalhos por Cenario

#### A) Prove-It para bug
```text
@test-engineer
Temos este bug: <descreva o bug>.
Aplique Prove-It: escreva primeiro um teste que falha, explique por que falha,
e depois proponha o menor ajuste para passar.
```

#### B) Revisao geral antes de merge
```text
@code-reviewer
Revise esta mudanca e priorize findings por severidade.
Liste Critical, Important e Suggestion com arquivo/linha e recomendacao objetiva.
```

#### C) Revisao de seguranca
```text
@security-auditor
Audite estes arquivos/endpoints: <lista>.
Foque OWASP Top 10, validacao de entrada, authz, segredos e dependencias.
```

#### D) Mudanca backend (Spring)
```text
@test-engineer
Para esta mudanca no backend, proponha suite minima: unit + integration.
Depois me diga a ordem ideal para implementar em TDD.
```

#### E) Mudanca frontend (Next.js)
```text
@code-reviewer
Revise esta mudanca de UI considerando acessibilidade, estado, performance e legibilidade.
Aponte regressao de comportamento e risco de re-render desnecessario.
```

## Comandos de verificacao do projeto

Backend (rodar em `backend/`):
```powershell
./mvnw test
```

Frontend (rodar em `frontend/`):
```powershell
npm test
```

Se nao houver testes configurados no frontend:
```powershell
npm run lint
npm run build
```

## Boas praticas para obter respostas melhores

- Sempre inclua contexto: arquivos, endpoint, regra de negocio e criterio de aceite
- Peca formato de saida claro (ex.: lista por severidade)
- Em bugs, sempre exija teste que falha antes do fix
- Em PR grande, divida em partes e revise por etapa
- Em revisao, peca recomendacao concreta (nao so opiniao)

## Quando usar cada agent

- Use `@test-engineer` no inicio da implementacao
- Use `@code-reviewer` antes de fechar PR ou merge
- Use `@security-auditor` em qualquer caminho sensivel de seguranca

## Nota

Os agentes funcionam por projeto (repositorio). Se abrir outro repo sem estes arquivos em `.github/`, o comportamento pode mudar.

