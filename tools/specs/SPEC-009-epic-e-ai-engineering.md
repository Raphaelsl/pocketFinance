# SPEC-009 — Épico E: AI Engineering

## Metadata

| Campo | Valor |
|-------|-------|
| **ID** | SPEC-009 |
| **Épico** | E — AI Engineering |
| **Status** | Draft |
| **Tipo** | Feature |
| **Prioridade** | High |
| **Estimativa** | 16h |
| **Depende de** | SPEC-008 / D6 concluído |
| **Bloqueia** | Épico F — Platform Engineering |

---

## 1. Overview

Transformar o PocketFinance em uma aplicação com capacidade de interpretar linguagem
natural e sugerir transações estruturadas.

O usuário digita uma frase como `"Gastei R$ 150 no mercado ontem"` e o sistema
devolve uma sugestão de transação com todos os campos preenchidos. O usuário revisa,
ajusta se necessário e confirma antes de salvar.

Este épico não é sobre "chamar uma API de IA". É sobre aprender a projetar, integrar,
validar e operar software que depende de um modelo de linguagem como componente —
com tudo que isso implica: incerteza, custo, latência e necessidade de guardrails.

---

## 2. Problem Statement

Hoje o usuário preenche cada campo da transação manualmente. O formulário funciona,
mas exige esforço cognitivo: selecionar tipo, digitar valor, escolher categoria e
informar a data.

A IA pode eliminar esse atrito. Uma frase em linguagem natural contém todas as
informações necessárias. O sistema deve saber extraí-las, validá-las contra as regras
de domínio e apresentar uma sugestão editável para confirmação humana.

O backend deve fazer a chamada ao LLM — nunca o frontend — para manter controle
sobre custo, segurança de chaves e validação da resposta antes de expor ao usuário.

---

## 3. Goals

- Criar `POST /api/transactions/suggest` que recebe texto livre e retorna sugestão estruturada.
- Usar Spring AI com OpenAI (GPT-4o mini) e Structured Output nativo.
- Validar a sugestão do LLM contra as regras de domínio antes de devolver ao cliente.
- Implementar fallback explícito quando o LLM não consegue interpretar a entrada.
- Registrar metadados de origem (`source: LLM`) no campo `metadata` da transação salva.
- Adicionar input de linguagem natural no frontend que pré-preenche o formulário existente.
- Ensinar os fundamentos de AI Engineering: tokens, structured output, workflows,
  reliability e produto com IA.

## 4. Non-Goals

- Não substituir o formulário manual — o input por linguagem natural é complementar.
- Não salvar transação automaticamente sem confirmação humana.
- Não implementar categorização automática persistida (a sugestão de categoria é
  texto, não vinculada ao `Category` entity neste épico).
- Não implementar streaming de resposta do LLM.
- Não implementar histórico de prompts ou sessão de conversa com o modelo.
- Não adicionar autenticação ou rate limiting por usuário neste épico.
- Não implementar fine-tuning, embeddings ou RAG.
- Não construir agentes autônomos (planejado para Épico G).
- Não integrar múltiplos provedores de LLM.

---

## 5. User Stories

### US-E1 — Sugestão por linguagem natural

Como usuário, quero digitar uma frase descrevendo minha transação para que o sistema
preencha o formulário automaticamente e eu precise apenas confirmar.

### US-E2 — Revisão antes de salvar

Como usuário, quero ver os campos preenchidos pela IA antes de salvar para poder
corrigir qualquer dado que esteja errado ou impreciso.

### US-E3 — Feedback de confiança

Como usuário, quero saber quando a IA teve dificuldade em interpretar minha entrada
para decidir se reviso com mais atenção antes de confirmar.

### US-E4 — Fallback gracioso

Como usuário, quero que o sistema me informe claramente quando não conseguiu
interpretar minha frase, em vez de salvar uma transação com dados errados.

---

## 6. Business Rules

### 6.1 Contrato de sugestão

- A sugestão deve respeitar todas as regras de domínio da `Transaction`:
  - `amount` sempre positivo e maior que zero.
  - `type` deve ser `INCOME` ou `EXPENSE`.
  - `currency` normalizada para uppercase; padrão `BRL` quando não mencionada.
  - `description` trimada, sem HTML.
  - `occurredAt` em ISO-8601 UTC; datas relativas como "ontem" ou "semana passada"
    devem ser resolvidas com base na data atual do servidor.

- O backend deve validar a sugestão do LLM antes de retornar ao cliente.
  Um LLM pode devolver `amount: -50`, `type: "expense"` (lowercase) ou
  `occurredAt: null`. Esses casos devem ser tratados como falha de parsing,
  não como erro 500.

### 6.2 Confirmação humana obrigatória

- A sugestão nunca é salva automaticamente.
- O fluxo é sempre: sugestão → revisão → confirmação → `POST /api/transactions`.
- O endpoint de sugestão é somente leitura em relação ao estado do sistema.

### 6.3 Confiança

Três níveis de confiança são calculados pelo backend após validação:

| Nível | Critério |
|-------|----------|
| `HIGH` | Todos os campos obrigatórios extraídos sem ambiguidade |
| `MEDIUM` | Um ou mais campos inferidos (ex: data relativa resolvida, categoria sugerida) |
| `LOW` | Entrada ambígua ou campos obrigatórios com inferência forçada |

O nível de confiança é informativo e não bloqueia a confirmação.

### 6.4 Categoria sugerida

- O LLM pode sugerir um nome de categoria como texto livre (ex: `"Mercado"`).
- Esse valor é devolvido como `suggestedCategoryName` na resposta.
- Não é vinculado ao `Category` entity — é apenas orientação para o usuário.
- O frontend pode pré-preencher o campo de categoria com esse valor como texto.

### 6.5 Metadados de origem

Quando o usuário confirma uma sugestão gerada por IA, o campo `metadata` da
transação deve registrar:

```json
{
  "source": "LLM",
  "model": "gpt-4o-mini",
  "rawInput": "Gastei R$ 150 no mercado ontem.",
  "confidence": "HIGH"
}
```

Transações criadas pelo formulário manual não devem ter `source: LLM`.

### 6.6 Input do usuário

- O texto de entrada deve ter no máximo 500 caracteres.
- Entradas vazias ou compostas apenas de espaço devem ser rejeitadas com `400`
  antes de chegar ao LLM.
- O backend não deve logar o conteúdo completo da entrada em logs de nível INFO.

---

## 7. API Contract

### 7.1 Endpoint de sugestão

```http
POST /api/transactions/suggest
Content-Type: application/json
```

**Request body:**
```json
{
  "input": "Gastei R$ 150 no mercado ontem."
}
```

**Success response — 200 OK:**
```json
{
  "suggestion": {
    "amount": 150.00,
    "type": "EXPENSE",
    "currency": "BRL",
    "description": "Mercado",
    "occurredAt": "2026-08-04T00:00:00Z",
    "suggestedCategoryName": "Mercado"
  },
  "confidence": "HIGH",
  "rawInput": "Gastei R$ 150 no mercado ontem."
}
```

**Parsing failed — 422 Unprocessable Entity:**

Retornado quando o LLM respondeu mas a sugestão não passou na validação de domínio
e o fallback também falhou.

```json
{
  "error": "PARSING_FAILED",
  "message": "Não foi possível interpretar a entrada. Tente descrever o valor, o tipo (gasto ou receita) e a data.",
  "rawInput": "aaaa"
}
```

**Validation error — 400 Bad Request:**
```json
{
  "error": "INVALID_INPUT",
  "message": "O texto de entrada é obrigatório e deve ter no máximo 500 caracteres."
}
```

**LLM unavailable — 503 Service Unavailable:**
```json
{
  "error": "AI_SERVICE_UNAVAILABLE",
  "message": "O serviço de interpretação está temporariamente indisponível. Use o formulário manual."
}
```

### 7.2 Fluxo de confirmação

A confirmação usa o endpoint existente sem modificação:

```http
POST /api/transactions
Content-Type: application/json

{
  "amount": 150.00,
  "type": "EXPENSE",
  "currency": "BRL",
  "description": "Mercado",
  "occurredAt": "2026-08-04T00:00:00Z",
  "metadata": "{\"source\":\"LLM\",\"model\":\"gpt-4o-mini\",\"rawInput\":\"Gastei R$ 150 no mercado ontem.\",\"confidence\":\"HIGH\"}"
}
```

`metadata` é enviado como `String` (JSON stringificado) porque `TransactionCreateRequest`
aceita `String metadata` — o campo já existe no backend e no tipo frontend (`metadata?: string | null`).
O frontend serializa o objeto com `JSON.stringify()` antes de enviar.
```

---

## 8. Technical Design

### 8.1 Camadas do backend

```
TransactionSuggestController
        |
        v
TransactionSuggestService
        |
        ├── TransactionParserPort (interface)
        │        |
        │        v
        │   SpringAiTransactionParser (implementação)
        │        |
        │        v
        │   OpenAI API (GPT-4o mini)
        │        |
        │        v
        │   TransactionSuggestionResult (record)
        |
        └── TransactionSuggestionValidator
```

A interface `TransactionParserPort` isola o serviço de negócio do SDK de IA.
Isso permite testar `TransactionSuggestService` sem chamar a OpenAI.

### 8.2 Structured Output

Spring AI resolve o JSON e mapeia diretamente para um record Java.

```java
public record TransactionSuggestionResult(
    BigDecimal amount,
    String type,           // "INCOME" ou "EXPENSE" — validado depois
    String currency,
    String description,
    String occurredAt,     // ISO-8601 como String — parseado depois
    String suggestedCategoryName,
    String confidence      // "HIGH", "MEDIUM", "LOW"
) {}
```

O método de chamada:

```java
TransactionSuggestionResult result = chatClient.prompt()
    .system(buildSystemPrompt(LocalDate.now()))
    .user(input)
    .call()
    .entity(TransactionSuggestionResult.class);
```

### 8.3 System prompt

```
You are a financial transaction parser for PocketFinance, a Brazilian personal finance app.

Parse the user's natural language input into a structured transaction.

Rules:
- amount must be a positive number greater than zero (never negative)
- type must be exactly "INCOME" or "EXPENSE" (uppercase)
- currency defaults to "BRL" if not mentioned; always return uppercase 3-letter code
- occurredAt must be ISO-8601 UTC format; resolve relative expressions like
  "yesterday", "ontem", "last week", "semana passada" using today's date: {currentDate}
- description must be a concise, clean label (trim whitespace, no HTML)
- suggestedCategoryName is a short category guess in Portuguese (e.g. "Mercado",
  "Transporte", "Salário"); return null if unclear
- confidence: HIGH if all fields are unambiguous; MEDIUM if any field required
  inference; LOW if the input is unclear or ambiguous
```

### 8.4 Validação pós-LLM

`TransactionSuggestionValidator` aplica as regras de domínio sobre o resultado bruto
do LLM antes de construir a resposta HTTP:

- `amount` deve ser não-nulo e maior que zero.
- `type` deve ser exatamente `INCOME` ou `EXPENSE` após uppercase.
- `currency` deve ter exatamente 3 letras após uppercase.
- `occurredAt` deve ser parseável para `OffsetDateTime`.
- `description` não pode ser nula ou vazia após trim.

Se qualquer regra falhar, o serviço retorna `PARSING_FAILED` — não propaga a
sugestão inválida ao cliente.

### 8.5 Configuração Spring AI

```yaml
# application.yml
spring:
  ai:
    openai:
      api-key: ${OPENAI_API_KEY}
      chat:
        options:
          model: gpt-4o-mini
          temperature: 0.1
```

A variável `OPENAI_API_KEY` deve estar em `.env` local e nunca comitada.
Adicionar ao `.gitignore` e ao `docker-compose.yml` via `env_file`.

### 8.6 Observabilidade

`ChatResponse` do Spring AI expõe metadados de uso:

```java
ChatResponse response = chatClient.prompt()...call().chatResponse();
Usage usage = response.getMetadata().getUsage();
log.info("AI suggest | tokens_prompt={} tokens_completion={} model={}",
    usage.getPromptTokens(),
    usage.getGenerationTokens(),
    response.getMetadata().getModel());
```

Logar apenas em DEBUG ou INFO estruturado. Nunca logar o `rawInput` completo
em nível INFO — pode conter dados financeiros sensíveis do usuário.

### 8.7 Frontend

Nova seção na página `/transactions/new` acima do formulário existente:

```
┌─────────────────────────────────────────────────┐
│  Descreva sua transação em linguagem natural     │
│  ┌───────────────────────────────────────────┐  │
│  │ Gastei R$ 150 no mercado ontem.           │  │
│  └───────────────────────────────────────────┘  │
│  [ Analisar ]                                    │
└─────────────────────────────────────────────────┘
         ↓  (após sucesso)
┌─────────────────────────────────────────────────┐
│  ✓ Sugestão gerada — revise e confirme          │
│  Confiança: ALTA                                │
└─────────────────────────────────────────────────┘
         ↓
[ formulário existente pré-preenchido ]
```

- `suggestTransaction(input)` em `transactionService.ts` chama `POST /api/transactions/suggest`.
- O hook `useSuggestTransaction()` encapsula loading, error e resultado.
- Em sucesso, `reset(suggestion)` do React Hook Form pré-preenche os campos.
- O usuário edita livremente e submete com o botão "Salvar" existente.
- O campo `metadata` é adicionado ao payload de confirmação no service, invisível ao usuário.

### 8.8 Design Decisions

#### DD-1 — LLM no backend, nunca no frontend

**Escolhido:** o backend é a única camada que chama o LLM.

**Alternativas consideradas:** chamar a API da OpenAI diretamente do Next.js.

**Trade-off aceito:** adiciona uma chamada HTTP extra (frontend → backend → LLM),
mas garante que a chave de API nunca seja exposta, que toda validação de domínio
ocorra antes da resposta chegar ao cliente e que o custo seja rastreável em um ponto.

#### DD-2 — Structured Output em vez de prompt + parse manual

**Escolhido:** `.entity(TransactionSuggestionResult.class)` via Spring AI.

**Alternativas consideradas:** parsear JSON manualmente de uma resposta em texto livre.

**Trade-off aceito:** depende da capacidade do modelo de seguir um schema JSON, mas
elimina parsing frágil e deixa o código legível. GPT-4o mini suporta Structured
Outputs de forma confiável.

#### DD-3 — Interface `TransactionParserPort`

**Escolhido:** isolar o Spring AI atrás de uma interface de domínio.

**Alternativas consideradas:** injetar `ChatClient` diretamente no service.

**Trade-off aceito:** um nível de indireção a mais, mas permite testes unitários
do service sem chamar a OpenAI e facilita troca de provedor no futuro.

#### DD-4 — Confirmação separada do endpoint de sugestão

**Escolhido:** sugestão e criação são dois endpoints independentes.

**Alternativas consideradas:** endpoint único que sugere e salva em um step.

**Trade-off aceito:** requer duas chamadas HTTP, mas garante que nenhuma transação
seja criada sem ação explícita do usuário — regra de negócio fundamental.

---

## 9. UX States

### Input de linguagem natural

- **Idle:** campo vazio, placeholder com exemplo (`"Gastei R$ 50 no transporte hoje"`).
- **Typing:** sem interação, apenas input controlado.
- **Loading:** botão "Analisar" desabilitado, spinner, texto "Analisando...".
- **Success (HIGH/MEDIUM):** banner verde/amarelo com nível de confiança, formulário pré-preenchido.
- **Success (LOW):** banner amarelo com aviso "Verifique os campos com atenção", formulário pré-preenchido.
- **PARSING_FAILED:** banner vermelho com a mensagem de fallback do backend, formulário limpo.
- **503:** banner vermelho "Serviço indisponível. Use o formulário abaixo.", formulário limpo.

### Formulário após sugestão

- Campos pré-preenchidos pelo hook `reset(suggestion)` do React Hook Form.
- Totalmente editável — o usuário pode corrigir qualquer campo.
- Botão "Salvar" aciona o fluxo existente de criação de transação.
- Um link discreto "Limpar sugestão" reseta o formulário para o estado inicial.

---

## 10. Security Notes

- A variável `OPENAI_API_KEY` deve ser carregada via variável de ambiente.
  Nunca em `application.properties` comitado, nunca em variável `NEXT_PUBLIC_*`.
- O campo `input` deve ser validado com tamanho máximo (500 caracteres) no
  controller antes de qualquer chamada ao LLM — evita prompt inflation e custo
  por abuso.
- O backend não deve repassar o erro interno do Spring AI ou da OpenAI diretamente
  ao cliente. Usar `ControllerAdvice` para traduzir `OpenAiHttpException` em 503.
- O `rawInput` do usuário não deve ser logado em nível INFO — pode conter dados
  financeiros sensíveis. Usar DEBUG com flag de log sensível se necessário.
- A resposta do LLM não deve ser renderizada como HTML no frontend.
  Usar React sem `dangerouslySetInnerHTML` para todos os campos de sugestão.
- O endpoint `POST /api/transactions/suggest` é stateless e não persiste nada.
  Isso limita o impacto de abuso, mas não substitui rate limiting em produção
  (fora do escopo deste épico).
- Não incluir o system prompt ou prompt templates em logs de produção.

---

## 11. Testing Strategy

### Backend

- Testar `TransactionSuggestService` com mock de `TransactionParserPort`:
  - sugestão válida retorna `200` com campos corretos.
  - sugestão com `amount` negativo retorna `422 PARSING_FAILED`.
  - sugestão com `type` inválido retorna `422 PARSING_FAILED`.
  - `occurredAt` não parseável retorna `422 PARSING_FAILED`.
  - exception do parser retorna `503 AI_SERVICE_UNAVAILABLE`.
- Testar `TransactionSuggestionValidator` isolado para cada regra de domínio.
- Testar o controller: input vazio retorna `400`, input com 501 caracteres retorna `400`.
- Não fazer chamada real à OpenAI em testes unitários ou de integração.

### Frontend

- Testar estados do componente de input: idle, loading, success (HIGH/MEDIUM/LOW),
  PARSING_FAILED e 503.
- Testar que `reset(suggestion)` preenche os campos corretos do formulário.
- Testar que o botão "Salvar" após sugestão envia o payload com `metadata.source: LLM`.
- Testar que "Limpar sugestão" reseta o formulário para estado vazio.
- Consultar elementos por role e label, sem acoplar a classes CSS.

---

## 12. Task Plan

| Card | Nome | Módulo | Estimativa | Depende de |
|------|------|--------|------------|------------|
| E1 | Spring AI Setup + First Call | Integration | 3h | D6 |
| E2 | Structured Output: TransactionSuggestionResult | Integration | 2h | E1 |
| E3 | Suggest Workflow, Validation & API | Workflows + Reliability | 4h | E2 |
| E4 | Fallbacks, Observability & Guardrails | Reliability | 3h | E3 |
| E5 | Frontend: Natural Language Input UI | AI Product | 3h | E3 |
| E6 | AI Quality Gate | Reliability | 1h | E4, E5 |

**Total estimado:** 16h

---

## 13. Epic Acceptance Criteria

- [ ] `POST /api/transactions/suggest` retorna sugestão válida para entrada clara em português.
- [ ] A sugestão passa pela validação de domínio antes de chegar ao cliente.
- [ ] `amount` negativo ou `type` inválido vindos do LLM retornam `422`, não `200`.
- [ ] Input vazio ou acima de 500 caracteres retorna `400` sem chamar o LLM.
- [ ] Indisponibilidade do LLM retorna `503` com mensagem de fallback.
- [ ] A chave `OPENAI_API_KEY` nunca aparece em código comitado.
- [ ] Tokens utilizados são logados por chamada em nível DEBUG/INFO estruturado.
- [ ] O frontend pré-preenche o formulário com a sugestão recebida.
- [ ] O formulário permanece totalmente editável após pré-preenchimento.
- [ ] O usuário só salva após ação explícita — nenhuma transação é criada automaticamente.
- [ ] Transações confirmadas via sugestão têm `metadata.source: "LLM"`.
- [ ] Testes backend cobrem todas as regras de validação sem chamada real à OpenAI.
- [ ] Testes frontend cobrem todos os estados do componente de input.
- [ ] Backend e frontend passam em build, lint e test.

---

## 14. Estratégia Pedagógica

### Princípio

O mesmo do Épico C: **o Dev sente o problema antes de aprender a solução.**

No Épico E, a progressão é:

- **E1:** Dev chama o LLM e recebe texto livre. "Como extraio o `amount` disso?"
- **E2:** Structured Output resolve o parsing — mas o LLM devolve `amount: -50`. "Espera..."
- **E3:** Validação de domínio resolve os dados inválidos. O workflow de dois passos é desenhado.
- **E4:** "Quanto isso custou? Quanto tempo levou? O que acontece quando a OpenAI cai?"
- **E5:** O produto fecha o loop. O usuário digita e o formulário se preenche.

---

### Mapa de Conceitos por Card

#### E1 — Spring AI Setup + First Call

**O que o Dev aprende:**
- O que é Spring AI e por que existe (abstração sobre SDK da OpenAI).
- Como adicionar a dependência e configurar `ChatClient` como `@Bean`.
- Conceitos fundamentais: token, context window, temperatura.
- Como fazer a primeira chamada e receber uma resposta em texto.

**Problema sentido:**
> "Funcionou! Mas a resposta veio como texto. Como eu extraio o `amount` disso?
> E se o LLM escrever 'cento e cinquenta' em vez de `150`? Vou parsear com regex?"

**Spike do TL:**
> "Exatamente esse é o problema. Texto livre é imprevisível. Para software de produção,
> precisamos de respostas estruturadas e contratos. Em E2 resolvemos isso com Structured Output."

---

#### E2 — Structured Output: TransactionSuggestionResult

**O que o Dev aprende:**
- O que é Structured Output e por que é diferente de parsear texto.
- `.entity(Class.class)` do Spring AI — o modelo segue o schema do record Java.
- JSON Schema gerado automaticamente pela lib a partir do record.
- Por que temperatura baixa (0.1) é melhor para parsing determinístico.

**Problema sentido:**
> "Funcionou! Mas olha: para entrada 'me devia 200 reais', veio `amount: -200`.
> E para 'expense', veio `type: 'expense'` com e minúsculo.
> O LLM não seguiu as regras de domínio exatamente."

**Spike do TL:**
> "LLMs são probabilísticos, não determinísticos. Você não pode confiar cegamente
> na saída. É por isso que sempre validamos a resposta antes de usá-la.
> Isso não é bug — é a natureza do componente. Em E3 adicionamos o validador."

---

#### E3 — Suggest Workflow, Validation & API

**O que o Dev aprende:**
- Como isolar o LLM atrás de uma interface (`TransactionParserPort`).
- Validação pós-LLM com regras de domínio conhecidas.
- Por que o fluxo é sempre dois passos: sugestão → confirmação.
- Como o backend traduz falhas de parsing em respostas HTTP úteis (422 vs 500).

**Problema sentido:**
> "O endpoint funciona. Mas se a OpenAI estiver fora, o usuário vê um erro 500 genérico.
> E não tem como testar isso sem chamar a API real. E em produção, quanto isso vai custar?"

**Spike do TL:**
> "Três problemas reais de engenharia de software com IA:
> reliability, testabilidade e custo. Em E4 tratamos os três de forma explícita."

---

#### E4 — Fallbacks, Observability & Guardrails

**O que o Dev aprende:**
- Como capturar e traduzir exceções do LLM em respostas 503 úteis.
- Como logar tokens usados por chamada (custo operacional).
- Guardrails de input: validar antes de gastar tokens.
- Por que o mock da interface (`TransactionParserPort`) torna os testes unitários
  independentes da OpenAI.

**Insight do TL:**
> "Esse card não entrega feature nova visível. Ele torna o sistema confiável.
> Em software com IA, reliability não é um detalhe — é o que separa um demo de produção.
> Custo, fallback e observabilidade pertencem ao mesmo épico que a feature."

---

#### E5 — Frontend: Natural Language Input UI

**O que o Dev aprende:**
- Como criar um hook `useSuggestTransaction()` com `useMutation`.
- Como usar `reset(suggestion)` do React Hook Form para pré-preencher campos.
- Como esconder detalhes técnicos (metadata) do usuário sem perder informação.
- Como exibir confiança de IA de forma honesta na UI (sem false confidence).

**Insight:**
> "O mesmo `useMutation` de C4/C5, aplicado a um novo tipo de operação.
> Padrão não mudou. O que mudou foi o que retorna — uma sugestão, não uma confirmação."

---

### Spikes do TL

#### Spike AI-0 — AI Fundamentals (antes de E1)
**Duração:** 45min  
**Objetivo:** nivelar conceitos antes de escrever código.

O que fazer:
1. Abrir o Playground da OpenAI. Digitar uma frase e ver a resposta.
2. Mostrar o que são tokens. Usar o tokenizer para contar tokens de uma frase.
3. Mudar temperatura: 0 vs 1. Rodar a mesma prompt 3 vezes. Mostrar variação.
4. Mostrar context window: o modelo não tem memória entre chamadas.
5. Perguntar: "O que acontece se eu pedir pra ele devolver JSON mas não usar Structured Output?"

**Resultado:** Dev entende que o LLM é um componente probabilístico, não uma função determinística.

---

#### Spike AI-1 — Structured Output vs Parse Manual (entre E1 e E2)
**Duração:** 30min  
**Objetivo:** mostrar por que Structured Output é superior a regex ou parse manual.

O que fazer:
1. Pegar a resposta em texto livre de E1 e tentar extrair `amount` com regex.
2. Quebrar o regex mudando a frase ligeiramente.
3. Mostrar `.entity(Class.class)` do Spring AI e o schema gerado.
4. Comparar: um record Java vs. 10 linhas de regex frágil.

**Resultado:** Dev entende que Structured Output não é comodidade — é engenharia defensiva.

---

#### Spike AI-2 — Custo e Observabilidade (entre E3 e E4)
**Duração:** 30min  
**Objetivo:** tornar o custo de IA concreto.

O que fazer:
1. Mostrar a página de usage da OpenAI após as chamadas de E2/E3.
2. Calcular: "Se 1000 usuários usarem esse endpoint por dia, quanto custa?"
3. Mostrar `usage.getPromptTokens()` e `usage.getGenerationTokens()` no log.
4. Discutir: "Onde esse custo vai aparecer? Quem monitora? O que acontece se explodir?"

**Resultado:** Dev entende que IA tem custo operacional contínuo — não é só feature, é infraestrutura.

---

## 15. Mapa de Documentação do Épico E

| Documento | Propósito |
|-----------|-----------|
| `SPEC-009` (este) | Requisitos, contratos, design e pedagogia do Épico E |
| `asana-cards/CARD-E1-spring-ai-setup.md` | Card pronto para Asana |
| `asana-cards/CARD-E2-structured-output.md` | Card pronto para Asana |
| `asana-cards/CARD-E3-suggest-workflow.md` | Card pronto para Asana |
| `asana-cards/CARD-E4-reliability-observability.md` | Card pronto para Asana |
| `asana-cards/CARD-E5-frontend-natural-language.md` | Card pronto para Asana |
| `asana-cards/CARD-E6-ai-quality-gate.md` | Card pronto para Asana |

Os cards do Asana serão criados após aprovação deste spec.
