# SPEC-008 — Épico D: Dashboard & Aggregations

## Metadata

| Campo | Valor |
|-------|-------|
| **ID** | SPEC-008 |
| **Épico** | D — Product Engineering |
| **Status** | Draft |
| **Tipo** | Feature |
| **Prioridade** | High |
| **Estimativa** | 15h |
| **Depende de** | SPEC-007 / PC5 concluído |
| **Bloqueia** | Épico E — AI Engineering |

---

## 1. Overview

Criar o primeiro dashboard financeiro do PocketFinance. O usuário deve conseguir
entender rapidamente quanto entrou, quanto saiu, qual foi o saldo, onde concentrou
as despesas e como o resultado evoluiu ao longo do período selecionado.

O dashboard será uma projeção somente de leitura sobre as transações existentes.
Ele não cria uma nova fonte de verdade, não persiste totais calculados e não faz
conversão cambial.

---

## 2. Problem Statement

Hoje o usuário consegue operar o CRUD, mas precisa percorrer a lista e calcular
mentalmente sua situação financeira. A paginação também impede que o frontend
calcule totais confiáveis a partir da página visível.

O backend deve calcular agregados sobre todo o período filtrado e entregar um
contrato próprio para o dashboard.

---

## 3. Goals

- Exibir total de receitas, total de despesas, saldo e quantidade de transações.
- Filtrar o dashboard por período e moeda.
- Mostrar distribuição das despesas por categoria.
- Mostrar evolução mensal de receitas, despesas e saldo.
- Tratar loading, erro e período sem dados de forma explícita.
- Ensinar agregações SQL/JPA, DTOs de projeção e composição de dados para produto.

## 4. Non-Goals

- Não converter valores entre moedas.
- Não integrar cotação cambial.
- Não adicionar autenticação ou multiusuário neste épico.
- Não criar ou gerenciar categorias.
- Não persistir snapshots ou tabelas de agregados.
- Não adicionar cache antes de existir medição que justifique.
- Não adicionar biblioteca de gráficos no primeiro dashboard.
- Não implementar previsões, orçamento ou recomendações por IA.

---

## 5. User Stories

### US-D1 — Visão financeira do período

Como usuário, quero ver receitas, despesas e saldo do período para entender minha
situação financeira sem calcular manualmente.

### US-D2 — Filtro de período e moeda

Como usuário, quero escolher um período e uma moeda para comparar valores que
possam ser somados corretamente.

### US-D3 — Distribuição de despesas

Como usuário, quero ver quais categorias concentram minhas despesas para entender
onde estou gastando mais.

### US-D4 — Evolução mensal

Como usuário, quero comparar receitas e despesas por mês para perceber tendências.

---

## 6. Business Rules

### 6.1 Sinal financeiro

- `amount` permanece sempre positivo.
- `INCOME` compõe `totalIncome`.
- `EXPENSE` compõe `totalExpense`.
- `balance = totalIncome - totalExpense`.
- `transactionCount` conta receitas e despesas no período.

### 6.2 Moeda

- Cada resposta representa exatamente uma moeda.
- `currency` é obrigatória, normalizada para uppercase e validada como três letras.
- O frontend usa `BRL` como seleção inicial.
- Valores de moedas diferentes nunca são somados.
- Uma moeda válida sem transações retorna totais zero, breakdown vazio e a série
  mensal preenchida com meses de valor zero.

### 6.3 Período

- `start` é inclusivo e `end` é exclusivo: `[start, end)`.
- Ambos usam ISO-8601 em UTC.
- `start` deve ser anterior a `end`.
- O intervalo máximo é de 12 meses.
- A seleção inicial do frontend cobre os últimos seis meses, incluindo o atual.
- A evolução mensal inclui meses sem movimento com valores zero para não quebrar
  a continuidade visual.

### 6.4 Categorias

- A distribuição por categoria considera somente transações `EXPENSE`.
- Transações sem categoria são agrupadas como `Sem categoria` com `categoryId: null`.
- A ordenação é decrescente por total gasto.
- Nomes de categoria são tratados como texto, nunca como HTML.

### 6.5 Exemplo de cálculo

Para o mesmo período e moeda:

| Tipo | Categoria | Valor |
|------|-----------|-------|
| INCOME | Salário | 5.000,00 |
| INCOME | Outros | 500,00 |
| EXPENSE | Mercado | 1.200,00 |
| EXPENSE | Sem categoria | 300,00 |

Resultado esperado:

- `totalIncome = 5500.00`
- `totalExpense = 1500.00`
- `balance = 4000.00`
- `transactionCount = 4`
- breakdown de despesas: Mercado `1200.00`, Sem categoria `300.00`

---

## 7. API Contract

### 7.1 Endpoint

```http
GET /api/dashboard?start=2026-01-01T00:00:00Z&end=2026-07-01T00:00:00Z&currency=BRL
```

O endpoint é somente leitura e não altera estado.

### 7.2 Success response

```json
{
  "period": {
    "start": "2026-01-01T00:00:00Z",
    "end": "2026-07-01T00:00:00Z"
  },
  "currency": "BRL",
  "summary": {
    "totalIncome": 5500.00,
    "totalExpense": 1500.00,
    "balance": 4000.00,
    "transactionCount": 4
  },
  "categoryBreakdown": [
    {
      "categoryId": "550e8400-e29b-41d4-a716-446655440000",
      "categoryName": "Mercado",
      "totalExpense": 1200.00
    },
    {
      "categoryId": null,
      "categoryName": "Sem categoria",
      "totalExpense": 300.00
    }
  ],
  "monthlyEvolution": [
    {
      "month": "2026-01",
      "income": 5000.00,
      "expense": 1200.00,
      "balance": 3800.00
    },
    {
      "month": "2026-02",
      "income": 500.00,
      "expense": 300.00,
      "balance": 200.00
    }
  ]
}
```

### 7.3 Validation errors

- `400 Bad Request` para data inválida, `start >= end`, período maior que 12 meses
  ou moeda fora do formato aceito.
- `500 Internal Server Error` com mensagem genérica para falhas inesperadas.
- A resposta não expõe SQL, stack trace, nomes de classes ou detalhes internos.

---

## 8. Technical Design

### 8.1 Backend

Criar uma feature de dashboard separada do CRUD:

```text
DashboardController
        |
        v
DashboardService
        |
        v
TransactionRepository projections
        |
        v
PostgreSQL transactions/categories
```

Responsabilidades:

- `DashboardController`: validar `start`, `end` e `currency` e devolver o contrato HTTP.
- `DashboardService`: aplicar fórmulas, preencher meses ausentes e montar a resposta.
- `TransactionRepository`: executar agregações parametrizadas no banco.
- DTOs de dashboard: impedir exposição de entidades JPA.

As agregações não devem carregar todas as transações em memória. Usar JPQL/JPA com
parâmetros vinculados; se uma query nativa PostgreSQL for realmente necessária para
agrupar por mês, ela deve permanecer estática e parametrizada.

Não há migration ou nova tabela neste épico.

### 8.2 Frontend

Criar `/dashboard` como experiência principal de análise:

- `dashboardService.getDashboard(filters)` para o contrato HTTP.
- `useDashboard(filters)` para query key e estado assíncrono.
- Componentes pequenos para KPIs, filtros, breakdown e evolução mensal.
- Filtros refletidos na URL para permitir reload sem perder a seleção.
- Valores formatados com `Intl.NumberFormat` e a moeda da resposta.
- Visualizações com HTML/CSS e alternativa textual acessível, sem dependência nova.

Fluxo de dados:

```text
Dashboard filters -> useDashboard -> dashboardService -> GET /api/dashboard
                                               |
                                               v
                         KPIs + categories + monthly evolution
```

### 8.3 Design decisions

#### DD-1 — Agregar no backend

**Escolhido:** o backend calcula sobre todo o conjunto filtrado.

**Alternativas consideradas:** calcular no frontend usando a página atual; buscar
todas as páginas antes de calcular.

**Trade-off aceito:** o backend ganha queries específicas, mas mantém resultados
corretos, evita tráfego desnecessário e centraliza regras financeiras.

#### DD-2 — Um endpoint composto

**Escolhido:** uma chamada devolve KPIs, categorias e evolução mensal.

**Alternativas consideradas:** três endpoints independentes; reutilizar o endpoint
paginado de transações.

**Trade-off aceito:** o contrato é maior, porém todos os blocos usam exatamente o
mesmo período e moeda e a tela evita estados parciais inconsistentes.

#### DD-3 — Sem conversão cambial

**Escolhido:** uma moeda por consulta.

**Alternativas consideradas:** somar moedas diretamente; integrar uma cotação externa.

**Trade-off aceito:** o usuário troca a moeda manualmente, mas os totais continuam
financeiramente corretos e o épico não ganha uma dependência externa.

#### DD-4 — Sem biblioteca de gráficos

**Escolhido:** barras simples e acessíveis com HTML/CSS.

**Alternativas consideradas:** adicionar uma biblioteca de visualização já no primeiro card.

**Trade-off aceito:** menos tipos de gráfico, em troca de menor complexidade e nenhum
novo risco de dependência antes de validar a experiência.

---

## 9. UX States

- **Loading:** skeletons estáveis para KPIs e visualizações.
- **Error:** mensagem genérica, ação de tentar novamente e filtros preservados.
- **Empty:** totais zero e orientação para criar a primeira transação no período.
- **Success:** KPIs primeiro, depois categorias e evolução mensal.
- **Responsive:** uma coluna em telas pequenas; composição mais densa no desktop.
- **Accessibility:** filtros com labels, foco visível, headings coerentes e dados dos
  gráficos disponíveis como texto/lista para leitores de tela.

---

## 10. Security Notes

- Validar todos os query params no controller com allowlist e limites de domínio.
- Limitar o período a 12 meses para evitar consultas de agregação sem limite.
- Nunca concatenar `start`, `end` ou `currency` em SQL/JPQL.
- Não retornar detalhes internos em erros; usar o `ControllerAdvice` existente.
- Não registrar payload financeiro, totais ou filtros completos em logs de erro.
- Renderizar nomes de categoria como texto React; não usar `dangerouslySetInnerHTML`.
- Não colocar segredos em `NEXT_PUBLIC_*`; a URL pública da API não é segredo.
- O projeto ainda não possui autenticação. O endpoint seguirá essa limitação atual e
  não deve ser apresentado como seguro para dados de múltiplos usuários.

---

## 11. Testing Strategy

### Backend

- Testar receitas, despesas, saldo e contagem com valores conhecidos.
- Testar isolamento por moeda.
- Testar limite inclusivo de `start` e exclusivo de `end`.
- Testar categoria nula como `Sem categoria`.
- Testar meses sem transação preenchidos com zero.
- Testar validações do período e moeda com resposta `400`.
- Testar período sem dados com resposta `200` e zeros.

### Frontend

- Testar loading, erro, empty e success.
- Testar formatação monetária com a moeda da resposta.
- Testar alteração de período/moeda e nova consulta.
- Testar navegação e preservação dos filtros na URL.
- Consultar elementos por role, label e texto, sem acoplar testes a classes CSS.

---

## 12. Task Plan

| Card | Nome | Estimativa | Depende de |
|------|------|------------|------------|
| D1 | Dashboard Aggregation API | 5h | PC5 |
| D2 | Dashboard Shell & KPI Summary | 2h30 | D1 |
| D3 | Period & Currency Filters | 2h | D2 |
| D4 | Expense Category Breakdown | 1h30 | D3 |
| D5 | Monthly Financial Evolution | 2h | D3 |
| D6 | Dashboard Quality Gate | 2h | D4, D5 |

---

## 13. Epic Acceptance Criteria

- [ ] `GET /api/dashboard` retorna agregados do período e moeda selecionados.
- [ ] Receitas e despesas são calculadas por `TransactionType`.
- [ ] Moedas diferentes nunca são somadas.
- [ ] O dashboard exibe KPIs, distribuição por categoria e evolução mensal.
- [ ] Filtros suportam até 12 meses e sobrevivem ao reload da página.
- [ ] Período sem dados possui estado útil e não é tratado como erro.
- [ ] Queries de agregação são parametrizadas e executadas no banco.
- [ ] Testes backend e frontend cobrem regras e estados principais.
- [ ] Backend e frontend passam nos comandos de build, lint e test acordados.

---

## 14. Pedagogical Spike

Antes de iniciar D1, o TL deve comparar duas abordagens:

> "Se a lista mostra apenas 10 transações por página, por que somar no frontend
> produz um resultado incorreto? Qual camada consegue enxergar o período inteiro
> e garantir que moedas diferentes não sejam misturadas?"
