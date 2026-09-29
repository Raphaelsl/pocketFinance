# Asana Cards — Épicos F, G e H

**Status:** Drafts preparados para revisão das specs e criação no Asana. **Specs:** SPEC-010, SPEC-011 e SPEC-012.

## Épico F — Platform Engineering

| Card | Título | Depende de |
|------|--------|------------|
| F1 | Decide pilot identity, account and data ownership scope | None — can start now |
| F2 | Create PocketFinance user identity and verified phone association | F1, D6, E6 |
| F3 | Scope transactions and financial queries to their owner | F1, F2 |
| F4 | Publish PocketFinance with secure runtime configuration | F2, F3 |
| F5 | Verify platform identity, isolation and deployment readiness | F2, F3, F4 |

## Épico G — Web Product Experience

| Card | Título | Depende de |
|------|--------|------------|
| G1 | Audit web journeys and define product information architecture | None — can start now |
| G2 | Build a consistent responsive app shell and visual system | G1, F1 |
| G3 | Improve dashboard hierarchy, filters and data states | G2, D6, F3 |
| G4 | Improve transaction history, discovery and row actions | G2, F3 |
| G5 | Unify manual and natural-language transaction entry | G2, E6 |
| G6 | Verify the redesigned web experience | G3, G4, G5 |

## Épico H — WhatsApp Financial Assistant

| Card | Título | Depende de |
|------|--------|------------|
| H1 | Receive and validate WhatsApp messages through a channel adapter | F5, G6 |
| H2 | Resolve verified user identity and conversation state | H1, F2, F5 |
| H3 | Capture, review and confirm a transaction in WhatsApp | H2, E6, F3 |
| H4 | Answer WhatsApp finance questions from backend aggregates | H2, D6, F3 |
| H5 | Find and confirm a transaction correction or cancellation | H3, F3 |
| H6 | Verify the WhatsApp assistant end-to-end | H1, H2, H3, H4, H5 |

## Observações para criação no Asana

- Cada `CARD-*.md` tem nome, descrição, critérios de aceite, subtarefas, tags e
  dependências prontos para copiar.
- As estimativas estão como **A estimar** porque precisam ser confirmadas pelo Dev
  e pelo Tech Lead após a spec técnica.
- Nenhum card foi criado diretamente no Asana nesta sessão; não há conector Asana
  disponível. Os documentos seguem o padrão usado pelo repositório.
