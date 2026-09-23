# SPEC-007 — Pos-C: Architecture & Code Quality

## Metadata

| Campo | Valor |
|-------|-------|
| **ID** | SPEC-007 |
| **Fase** | Pos-C — Architecture & Code Quality |
| **Status** | Draft |
| **Tipo** | Quality / Refactor |
| **Prioridade** | High |
| **Estimativa** | 5h |
| **Depende de** | Epico C completo: C1, C2, C3, C3.1, C4, C5 |
| **Bloqueia** | Epico D — Dashboard & Aggregations |

---

## 1. Overview

Depois do Epico C, o frontend ja possui o CRUD principal de transacoes funcionando:
listar, criar, editar e excluir. A fase Pos-C existe para consolidar arquitetura,
testes e acessibilidade antes de entrar no dashboard.

Esta fase nao deve introduzir produto novo. O objetivo e transformar a repeticao
que ficou visivel durante C2-C5 em padroes locais claros, mantendo o valor
pedagogico: o Dev deve entender o que esta sendo extraido e por que.

---

## 2. Goals

- Consolidar boundaries entre page, hook, service e component.
- Extrair hooks de dominio onde a repeticao ja ficou evidente.
- Normalizar payloads de create/edit de forma consistente.
- Melhorar acessibilidade do modal de exclusao e dos fluxos de formulario.
- Reduzir testes acoplados a classes CSS e reforcar testes de comportamento.
- Remover comentarios obsoletos e codigo didatico que ja cumpriu seu papel.

---

## 3. Non-Goals

- Nao criar dashboard ainda.
- Nao trocar o backend.
- Nao adicionar autenticacao.
- Nao adicionar novas bibliotecas sem necessidade clara.
- Nao esconder toda a logica em abstracoes genericas antes de o Dev entender o padrao.

---

## 4. Current Code Signals

Arquivos que motivam esta fase:

| Area | Arquivos | Sinal |
|------|----------|-------|
| Hooks | `frontend/src/hooks/useTransactions.ts` | Ja existe hook de listagem; falta avaliar create/update/delete |
| Pages | `frontend/src/app/transactions/page.tsx` | Page ainda orquestra delete mutation e modal |
| Forms | `frontend/src/app/transactions/new/page.tsx`, `frontend/src/app/transactions/[id]/edit/page.tsx` | Create e edit normalizam payload de formas diferentes |
| Service | `frontend/src/services/transactionService.ts` | Metodos funcionam, mas comentarios e contratos de erro podem ser limpos |
| Modal | `frontend/src/components/ConfirmDeleteModal.tsx` | Funcional, mas precisa papel de dialog, labels e fluxo de teclado |
| Tests | `frontend/src/components/test/*.test.tsx` | Testes existem; agora devem focar comportamento e acessibilidade |

---

## 5. Task Plan

| Card | Nome | Estimativa | Depende de |
|------|------|------------|------------|
| PC1 | Architecture Baseline Review | 45min | Epico C completo |
| PC2 | Domain Hooks & Query Boundaries | 1h30 | PC1 |
| PC3 | Payload Normalization & Service Contract | 1h | PC1 |
| PC4 | Accessibility Pass for Modal and Forms | 1h | PC1 |
| PC5 | Test Cleanup & Quality Gate | 45min | PC2, PC3, PC4 |

---

## 6. Security Notes

- Continuar renderizando textos de usuario como texto React normal; nao usar `dangerouslySetInnerHTML`.
- Nao expor detalhes internos da API em mensagens de erro para usuario.
- Nao colocar segredo em `NEXT_PUBLIC_*`; variaveis publicas do Next sao visiveis no browser.
- Mutacoes continuam usando `POST`, `PUT` e `DELETE`; `GET` nao deve alterar estado.
- Validade de negocio continua no backend; validacao frontend e apenas UX.

---

## 7. Acceptance Criteria

- [ ] Cards PC1-PC5 criados e executaveis em ordem.
- [ ] Nenhum comportamento de CRUD existente regrediu.
- [ ] Pages ficam mais finas sem criar abstracoes genericas demais.
- [ ] Create e edit usam a mesma normalizacao de payload.
- [ ] Modal de delete possui semantica minima de dialog acessivel.
- [ ] Testes cobrem comportamentos principais, nao detalhes visuais frageis.
- [ ] `npm run lint` e `npm test` passam ou registram problemas pre-existentes.

---

## 8. Pedagogical Spike

Ao abrir esta fase, o TL deve revisar com o Dev:

> "Agora que voce repetiu `useQuery`, `useMutation`, forms e normalizacao de payload,
> quais detalhes a page precisa mesmo saber? O que pode virar hook ou helper sem
> esconder o aprendizado?"

