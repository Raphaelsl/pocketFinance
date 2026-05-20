# Spike Pedagógico — Frontend Architecture & Structure

## 📚 Objetivo

Antes de começar SPEC-003 (C2), o Dev deve entender **como o projeto está organizado** e **por que cada pasta existe**. Esta spike é a fundação para que o Dev código com propósito, não na marra.

**Duração:** 45min ao vivo no IDE

---

## 0️⃣ Conceitos Fundamentais (Referência Rápida para TL)

### O que é React?
**React = Biblioteca JavaScript para criar interfaces de usuário com componentes.**

- Componente = função que retorna HTML (JSX)
- Reutilizável: você cria uma vez, usa 100 vezes
- Reativo: quando dados mudam, interface atualiza automático
- Exemplo: `<Header />` é um componente que renderiza o header

```typescript
function Header() {
  return <h1>PocketFinance</h1>  // JSX = HTML em JavaScript
}
```

---

### O que é Next.js?
**Next.js = Framework React que adiciona roteamento, otimizações e estrutura ao projeto.**

- **App Router**: Pastas = rotas automático
  - `app/transactions/page.tsx` → URL `/transactions`
  - `app/transactions/new/page.tsx` → URL `/transactions/new`
- **Layouts**: componentes compartilhados entre rotas
  - `app/layout.tsx` = layout global (sempre visível)
- **TypeScript pronto**: suporte nativo

---

### O que é TypeScript?
**TypeScript = JavaScript com tipos. Você diz o que cada variável é antes de usar.**

```typescript
// ❌ JavaScript puro (sem tipos)
const transaction = { amount: 150.50, description: "Compra" }
transaction.amout  // Typo! Editor não avisa (vai quebrar em runtime)

// ✅ TypeScript (com tipos)
interface Transaction {
  amount: number
  description: string
}
const transaction: Transaction = { amount: 150.50, description: "Compra" }
transaction.amout  // ❌ Editor avisa ANTES de rodar!
```

**Benefício:** Editor avisa erros antes de você rodar o código.

---

### O que é JSX?
**JSX = HTML dentro de JavaScript. Sintaxe que parece HTML mas é JS.**

```typescript
// JSX (parece HTML)
const ui = <div className="header"><h1>PocketFinance</h1></div>

// Traduzido para JS (por trás dos panos)
const ui = React.createElement('div', { className: 'header' },
  React.createElement('h1', null, 'PocketFinance')
)
```

**Regra:** Dentro de `< >` é HTML-like. Fora é JavaScript puro.

---

### O que é um Componente React?
**Componente = Função que retorna JSX (HTML).**

```typescript
// Componente = função
export function Header() {
  return (
    <header>
      <h1>PocketFinance</h1>
    </header>
  )
}

// Usar componente = chamar função com <NomeComPascalCase />
export function Page() {
  return (
    <>
      <Header />
      <main>Conteúdo...</main>
    </>
  )
}
```

**Props = argumentos passados para componente:**

```typescript
interface TransactionItemProps {
  transaction: Transaction
}

// Recebe props
function TransactionItem({ transaction }: TransactionItemProps) {
  return <li>{transaction.description} - {transaction.amount}</li>
}

// Usa componente com props
<TransactionItem transaction={{ amount: 150, description: "Compra" }} />
```

---

### O que é um Hook?
**Hook = Função especial do React que começa com `use*`. Adiciona funcionalidade ao componente.**

```typescript
// useState = adiciona estado (memória) ao componente
const [data, setData] = useState(null)
// data = valor atual
// setData = função para mudar valor
// useState(null) = valor inicial é null

// useEffect = roda código quando componente monta ou dependências mudam
useEffect(() => {
  console.log("Componente montou!")
  return () => console.log("Componente desmontou!")
}, [])  // [] = roda só uma vez

// useEffect com dependências
useEffect(() => {
  console.log("page mudou!")
}, [page])  // roda toda vez que 'page' muda
```

---

### O que é Estado (State)?
**Estado = Dados que o componente "lembra". Quando muda, componente re-renderiza.**

```typescript
// Sem estado: sempre mostra "Carregando..."
function ListWithoutState() {
  return <p>Carregando...</p>  // sempre igual
}

// Com estado: pode mudar
function ListWithState() {
  const [data, setData] = useState(null)  // estado inicial: null
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(d => {
        setData(d)            // atualiza estado
        setLoading(false)      // atualiza estado
      })
  }, [])

  if (loading) return <p>Carregando...</p>      // renderiza enquanto loading=true
  return <p>Dados: {JSON.stringify(data)}</p>   // renderiza dados quando loading=false
}
```

**Regra de ouro:** Quando você faz `setState(novoValor)`, React re-renderiza o componente.

---

### O que é async/await?
**async/await = Forma elegante de lidar com Promises (operações que demoram).**

```typescript
// Sem async/await (com .then())
function loadData() {
  fetch('/api/transactions')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))
}

// Com async/await (mais legível)
async function loadData() {
  try {
    const res = await fetch('/api/transactions')
    const data = await res.json()
    console.log(data)
  } catch (err) {
    console.error(err)
  }
}
```

**Regra:** `await` = "espera esta Promise terminar antes de continuar"

---

### O que é Tailwind CSS?
**Tailwind = Framework CSS que usa classes utilitárias (não escreve CSS custom).**

```typescript
// Sem Tailwind (escreve CSS custom)
const styles = `
  .header {
    background-color: #2563eb;
    color: white;
    padding: 16px;
  }
`

// Com Tailwind (usa classes prontas)
<header className="bg-blue-600 text-white p-4">
  <h1>PocketFinance</h1>
</header>

// Tailwind classes:
// bg-blue-600 = background blue
// text-white = color white
// p-4 = padding 16px
// w-full = width 100%
// border = border 1px
```

**Benefício:** Rápido, sem escrever CSS, responsivo automático.

---

## 1️⃣ Estrutura de Pastas — Tour Guiado

### `src/app/` — Rotas (Next.js App Router)

```
src/app/
├── layout.tsx        ← Layout global (Header) + <Providers>
├── page.tsx          ← Homepage (redireciona para /transactions)
├── globals.css       ← CSS global
└── transactions/
    ├── page.tsx      ← Página da lista (C2)
    ├── new/
    │   └── page.tsx  ← Página de criação (C3)
    └── [id]/
        └── edit/
            └── page.tsx  ← Página de edição (C4)
```

**Regra do Next.js:** Estrutura de pastas = rotas da aplicação.

**Explicação ao Dev:**
> "Em Next.js, cada `page.tsx` que você cria vira uma rota automaticamente.
> Você cria `/transactions/page.tsx`? Automático: rota `/transactions`.
> Cria `/transactions/new/page.tsx`? Automático: rota `/transactions/new`.
> Sem precisa configurar router manualmente."

---

### `src/components/` — Componentes Reutilizáveis

```
src/components/
└── layout/
    └── Header.tsx       ← Componente do header (importado no layout global)
```

**Explicação ao Dev:**
> "Componentes são funções React que retornam JSX.
> Você separa em pastas por contexto (layout, forms, modals, etc).
> Cada arquivo = 1 componente ou grupo relacionado.
> Quando precisa reutilizar em múltiplos lugares: coloca aqui."

**Será adicionado em SPEC-003:**
```
src/components/
└── layout/
    └── Header.tsx
└── transactions/           ← Nova pasta
    └── TransactionItem.tsx ← Componente do item da lista
```

---

### `src/services/` — Chamadas à API

```
src/services/
└── transactionService.ts   ← Todas as chamadas HTTP de Transaction
```

**Explicação ao Dev:**
> "APIs são chamadas via fetch/axios. Você NÃO coloca fetch direto no componente.
> Por quê? Reutilização + teste + manutenção.
> Exemplo: se GET /api/transactions muda de URL, você muda em UM lugar."

**Estrutura do serviço:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL

export const transactionService = {
  list: async (page, size) => { /* fetch */ },
  create: async (data) => { /* fetch */ },
  getById: async (id) => { /* fetch */ },
  update: async (id, data) => { /* fetch */ },
  delete: async (id) => { /* fetch */ },
}
```

**Regra:** `transactionService` = objeto com métodos assíncronos.

---

### `src/types/` — Tipos TypeScript

```
src/types/
└── transaction.ts    ← Interfaces TypeScript (reutilizadas em todo projeto)
```

**Explicação ao Dev:**
> "TypeScript sem tipos = nem tá usando TypeScript.
> Você define `interface Transaction` uma vez aqui.
> Depois reutiliza em: components, services, pages.
> Benefício: editor avisa se você usar campo errado."

**Estrutura:**
```typescript
export interface Transaction {
  id: string
  amount: number
  description: string
  // ... mais campos
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  // ... mais campos
}
```

---

## 2️⃣ Fluxo de Dados — C2 LIST como Exemplo

### Visualizar o Fluxo:

```
1. Dev acessa /transactions
   ↓
2. Next.js carrega src/app/transactions/page.tsx
   ↓
3. TransactionsPage roda:
   - useState() para data/loading/error/page
   - useEffect() para carregar dados
   ↓
4. TransactionsPage chama:
   transactionService.list(page=0, size=10)
   ↓
5. transactionService.list():
   - Faz fetch("http://localhost:8080/api/transactions?page=0&size=10")
   - Retorna Promise<PagedResponse<Transaction>>
   ↓
6. TransactionsPage recebe dados:
   - Atualiza setState com resultado
   - Re-renderiza component
   ↓
7. JSX do TransactionsPage renderiza:
   - Itera data.content com .map()
   - Para cada item, renderiza <TransactionItem>
   ↓
8. TransactionItem exibe:
   - description, amount, date
   - botões Editar / Deletar
   ↓
9. Usuario vê tabela com transações no navegador
```

### Desenhando no Papel/IDE:

```
┌─────────────────────────────────────────────────────────┐
│ Navegador: GET /transactions                             │
│ ↓                                                         │
│ page.tsx (TransactionsPage)                              │
│   ├─ useState(data, loading, error, page)                │
│   ├─ useEffect(() => transactionService.list(page))     │
│   └─ return (                                             │
│       {data && data.content.map(t =>                     │
│         <TransactionItem transaction={t} />              │
│       )}                                                  │
│     )                                                     │
│ ↓                                                         │
│ transactionService.list(page, size)                      │
│   ├─ fetch("/api/transactions?page=0&size=10")           │
│   └─ return json                                          │
│ ↓                                                         │
│ Backend: GET /api/transactions?page=0&size=10            │
│   ├─ Query DB: SELECT * FROM transactions LIMIT 10       │
│   └─ return PagedResponse<Transaction>                   │
│ ↓                                                         │
│ Navegador renderiza tabela com 10 transações             │
└─────────────────────────────────────────────────────────┘
```

---

## 3️⃣ Convenções & Patterns

### Naming

| O quê | Convenção | Exemplo |
|------|-----------|---------|
| **Pasta** | kebab-case | `src/components/layout/` |
| **Arquivo component** | PascalCase | `Header.tsx` |
| **Arquivo service** | camelCase | `transactionService.ts` |
| **Arquivo type** | camelCase ou plural | `transaction.ts` ou `transactions.ts` |
| **Interface** | PascalCase | `Transaction`, `PagedResponse` |
| **Função component** | PascalCase | `export function Header() {}` |
| **Função service** | camelCase | `list()`, `create()` |

### Imports

**Sempre use alias `@/`:**
```typescript
// ✅ Bom
import { Header } from '@/components/layout/Header'
import { transactionService } from '@/services/transactionService'
import { Transaction } from '@/types/transaction'

// ❌ Ruim
import { Header } from '../../../components/layout/Header'
```

**Por quê:** Não quebra imports quando você move pastas.

---

## 4️⃣ Exercício Prático (ao vivo)

### Atividade: "Rastrear uma requisição"

**Dev segue em tempo real:**

1. **Abrir Browser DevTools → Network tab**
2. **Fazer requisição**: `npm run dev` → abrir /transactions
3. **Ver na Network:**
   ```
   GET /api/transactions?page=0&size=10 → 200 OK
   Response: { content: [...], page: 0, ... }
   ```
4. **No IDE, rastrear:**
   - Que arquivo faz a requisição? `transactionService.list()`
   - Que arquivo chama o service? `app/transactions/page.tsx`
   - Que arquivo renderiza items? `components/TransactionItem.tsx`
   - Que arquivo define tipos? `types/transaction.ts`

**Pergunta ao Dev:**
> "Agora aponta exatamente qual arquivo você mudaria se a API retornasse mais um campo?"

**Resposta esperada:** `types/transaction.ts` (adiciona campo na interface)

---

## 5️⃣ Use Case Prático: Implementar C2

### "Imagina você precisa listar transações. Por onde começa?"

**Resposta estruturada:**

1. **Tipos primeiro** (`types/transaction.ts`)
   - Define `Transaction` interface
   - Define `PagedResponse<T>` genérico

2. **Service** (`services/transactionService.ts`)
   - Implementa `list(page, size)` com fetch

3. **Componente** (`components/TransactionItem.tsx`)
   - Recebe `transaction: Transaction` como prop
   - Renderiza description, amount, date

4. **Page** (`app/transactions/page.tsx`)
   - `useState(data, loading, error, page)`
   - `useEffect` → chama `transactionService.list(page)`
   - Renderiza `<TransactionItem>` para cada item

5. **Testa:** Browser → /transactions → vê dados

---

## 🎯 Resumo para o Dev

| Componente | Responsabilidade |
|---|---|
| **`types/`** | Define "formas" dos dados (TypeScript) |
| **`services/`** | Fala com a API (fetch) |
| **`components/`** | Exibe dados no tela (JSX) |
| **`app/`** | Organiza rotas + conecta tudo |

---

## ✅ Checklist Após a Spike

O Dev deve conseguir responder:

- [ ] "Por que não colocar fetch direto no componente?"
- [ ] "O que é `transactionService`? Pra que serve?"
- [ ] "Se mudar a URL da API, onde mudo?"
- [ ] "Onde defino tipos TypeScript?"
- [ ] "Como Next.js sabe que `page.tsx` é rota `/transactions`?"
- [ ] "Se `Transaction` tiver novo campo, onde adiciono?"

Se responder todas → Dev está pronto para C2!

---

## 🔗 Depois da Spike

**Referência rápida ao Dev durante C2:**
> "Lembra da spike? Tipos → Service → Component → Page.
> Sempre nessa ordem. Começa por baixo, sobe até o topo."
