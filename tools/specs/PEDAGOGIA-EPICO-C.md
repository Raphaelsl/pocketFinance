# Estratégia Pedagógica — Épico C (Frontend)

## 📖 Princípio Core

**"Aprender fazendo"** — O Dev **sente o problema ANTES** de aprender a solução.

Cada card resolve um problema que o card anterior deixa em evidência. Isso cria momentos pedagógicos naturais onde as ferramentas (React Query, React Hook Form) aparecem como **respostas elegantes** a dificuldades reais, não como imposições teóricas.

---

## 🗺️ Mapa de Conceitos por Card

### C1 (SPEC-002) — Setup Next.js

**O que o Dev aprende:**
- Estrutura de projeto Next.js (app router)
- Pastas: `components/`, `services/`, `types/`, `app/`
- Variáveis de ambiente (`.env.local`)
- Tailwind CSS (utility-first)
- Layout global e Header

**Problema introduzido:** Nenhum ainda. Apenas fundação.

**Saída esperada:** Projeto rodando, estrutura limpa, entende "onde coisa vive".

---

### C2 (SPEC-003) — List Transactions (fetch + useState)

**O que o Dev aprende:**
- `fetch()` API e Promises
- `useEffect()` para side effects
- `useState()` para data, loading, error, page
- Padrão: 3+ estados para rastrear 1 operação assíncrona
- `try/catch` em async/await
- Paginação manual

**Problema sentido:**
> "Espera... preciso de `useState(data)`, `useState(loading)`, `useState(error)`, `useState(page)`?
> E um `useEffect` que chama `transactionService.list()`, depois `.then()`, `.catch()`, `.finally()`?
> Isso é muito código repetitivo..."

**Spike Pedagógico (TL):**
> "Sim. Percebeu? Para TODA operação assíncrona você vai escrever essa padrão.
> Quando você editar transação, vai fazer de novo. Quando deletar, de novo.
> Imagine 10 endpoints assim. Há libs que resolvem isso... veremos em C4."

---

### C3 (SPEC-004) — Create Transaction (useState manual)

**O que o Dev aprende:**
- Forms em React (inputs, onChange, onSubmit)
- Validação manual por campo
- Controlled components (value + onChange)
- Estado por campo: `[amount, setAmount]`, `[currency, setCurrency]`, etc.
- POST + redirect
- Error handling por campo

**Problema sentido:**
> "Quanto `useState` eu criei aqui? 1 por campo... 4 campos = 4 useState.
> Mais: `[errors, setErrors]`, `[submitting, setSubmitting]`, `[apiError, setApiError]`.
> Total: 7 useState em 1 componente.
> O que happens quando esse form tem 20 campos? Vou morrer?"

**Spike Pedagógico (TL):**
> "Isso é called 'form boilerplate'. Existem libs que eliminam isso com `register()`.
> Em C4, o mesmo form vai ser 50% do código. Veremos."

---

### C4 (SPEC-005) — Edit Transaction (React Query + React Hook Form)

**O que o Dev aprende:**
- `useQuery()` para fetch automático, cache, loading, error (1 hook = antes eram 4 useState)
- `useForm()` + `register()` para gerenciar estado do form (1 hook = antes eram 7 useState)
- `useMutation()` para operações que modificam estado
- `queryClient.invalidateQueries()` para sincronizar cache
- Padrão: Sempre mesmos hooks, muda só a queryKey/mutationFn

**Insight:**
> "Olha só o que aconteceu:
> - C2: 4 useState + useEffect pra carregar lista
> - C4: 1 useQuery() faz tudo isso
>
> - C3: 7 useState pra form
> - C4: 1 useForm() faz tudo isso
>
> Essas libs existem porque todo dev estava escrevendo a mesma coisa repetida."

**Spike Pedagógico (TL):**
> "Note que o **padrão é sempre o mesmo**. Muda só a `queryKey` e a `queryFn`.
> Isso é por design. Você aprende 1 padrão e aplica 100 vezes."

---

### C5 (SPEC-006) — Delete Transaction (useMutation + Modal)

**O que o Dev aprende:**
- `useMutation()` para operações destrutivas
- Confirmação UX (modal antes de deletar)
- Error handling em mutations
- Cache invalidation após sucesso
- Reutilização do padrão visto em C4

**Insight:**
> "O `useMutation` é idêntico ao de C4.
> O padrão persiste: setenta vezes você vai usar `useMutation`,
> sempre com `mutationFn`, `onSuccess`, `onError`."

---

## 🎓 Spikes Pedagógicos (Sessões com TL)

Cada spike é **ao vivo no código**, focando em "ver funcionando" antes de teoria.

### Spike 1 — React Basics (Duração: 30min)
**Quando:** Antes de SPEC-002
**Pré-requisito:** Nenhum

**O que fazer:**
1. Abrir IDE, criar componente vazio
2. Mostrar: função que retorna JSX = componente
3. Criar componente com botão que muda cor
4. Explicar: `useState()` = "memória do componente"
5. Mostrar: props = argumentos passados de pai para filho

**Resultado:** Dev pode criar componente React simples e entender state/props.

---

### Spike 2 — Fetch + Promises (Duração: 30min)
**Quando:** Antes de SPEC-003

**O que fazer:**
1. Abrir console do browser
2. Fazer `fetch("https://jsonplaceholder.typicode.com/todos/1")` e ver Promise
3. Mostrar: `.then()` recebe resposta, `.catch()` recebe erro
4. Explicar: `async/await` é syntax sugar sobre `.then()`
5. Fazer um GET simples, exibir JSON na página

**Resultado:** Dev entende que fetch retorna Promise e pode "esperar" resposta.

---

### Spike 3 — Forms em React (Duração: 30min)
**Quando:** Antes de SPEC-004

**O que fazer:**
1. Criar `<input>` com `value` + `onChange`
2. Mostrar: sem `onChange`, input fica "congelado"
3. Criar função `validate()` que checa se email é válido
4. Fazer form que só submite se validar
5. Explicar: `e.preventDefault()` evita reload da página

**Resultado:** Dev entende controlled components e validação básica.

---

### Spike 4 — Async State Management (Duração: 30min)
**Quando:** Após SPEC-003

**O que fazer:**
1. Mostrar código de C2: 4 useState, 1 useEffect, try/catch
2. Perguntar: "Quantas vezes você vai repetir isso em C3, C4, C5?"
3. Mostrar como outras libs (React Query) resolvem
4. NÃO implementar ainda, só mostrar pseudocódigo
5. Criar "expectativa": "Em C4 você vai aprender a ferramenta pra isso"

**Resultado:** Dev entende que C2/C3 são propositalmente verbosos para criar "dor".

---

### Spike 5 — Next.js App Router (Duração: 30min)
**Quando:** Durante SPEC-002

**O que fazer:**
1. Mostrar: `app/` pasta = rotas (magic!)
2. Criar `app/about/page.tsx`, acessar `/about`
3. Explicar: `layout.tsx` = template compartilhado
4. Criar layout com header, aplicado a todas rotas
5. Mostrar: `useRouter()` para navegação programática

**Resultado:** Dev entende estrutura de rotas do Next.js.

---

### Spike 6 — React Query Fundamentals (Duração: 45min)
**Quando:** Antes de SPEC-005

**O que fazer:**
1. Mostrar: o que é "cache"? (dados já buscados não refetch)
2. Criar `useQuery()` simples: carregar dados
3. Mostrar: `isLoading`, `error` vêm automático
4. Explicar: "Você não escreve `useState(loading)`... a lib faz"
5. Mostrar: `invalidateQueries()` para "descartar cache"
6. Comparar lado a lado: C2 (manual) vs C4 (com lib)

**Resultado:** Dev vê React Query como "resposta" aos problemas de C2/C3.

---

### Spike 7 — React Hook Form (Duração: 30min)
**Quando:** Antes de SPEC-005

**O que fazer:**
1. Mostrar: código de C3 com 7 useState
2. Mostrar: `useForm()` + `register()`
3. Explicar: `register()` = "atach input ao form automático"
4. Mostrar: `formState.errors` vem automático
5. Converter form de C3 para RHF em tempo real

**Resultado:** Dev vê RHF como "resposta" ao boilerplate de C3.

---

## 📋 Estrutura de Documentação

Cada SPEC tem:
- **Conceitos Ensinados**: O que o Dev aprende
- **Problema Sentido**: Dor/dificuldade que emerge
- **Spike Pedagógico**: O que o TL explica após implementação

Essa estrutura deixa claro que a progressão é **intencional**, não "atrasada".

---

## 🎯 Resultado Final

Ao final do Épico C, o Dev:

1. ✅ Entende React (components, state, effects, forms)
2. ✅ Entende Next.js (routing, layouts, API integration)
3. ✅ Entende fetch e Promises
4. ✅ Entende **por quê** React Query existe (sentiu dor em C2)
5. ✅ Entende **por quê** React Hook Form existe (sentiu dor em C3)
6. ✅ Pode aplicar padrões em novos contextos (vai sempre usar `useQuery` + `useMutation`)
7. ✅ Construiu um produto real, funcionando

Não é "começar com best practices". É "aprender por quê as best practices existem".

---

## 🔗 Referências

- PROJECT-CONTEXT.md — Visão geral do projeto
- SPEC-002 a 006 — Cards individuais
- Cada spike é sessão ao vivo, sem slides (aprender vendo código)