# Code References — PocketFinance Frontend

## 📚 O que é isto?

Exemplos de código "solução" para cada SPEC. Serve como **referência durante o pair programming**, não como "copiar/colar".

---

## 🎯 Como usar com o Dev:

### Cenário 1: Dev está preso

```
Dev: "Eu não entendo como fazer o fetch..."
TL: "Olha este arquivo: SPEC-003-transactionService.list.ts
    Vê como faz? Agora você implementa."
```

### Cenário 2: Dev terminou e quer comparar

```
Dev: "Eu fiz a página de listagem. Tá certo?"
TL: "Vamos comparar com a referência.
     Qual a estrutura que você usou?
     Qual é a diferença?"
```

### Cenário 3: TL quer guiar passo-a-passo

```
TL: "Vamos implementar juntos. Primeiro:
     - Criar tipos em types/transaction.ts (já tem exemplo aqui)
     - Depois service (olha o exemplo)
     - Depois componente (olha o exemplo)"
```

---

## 📂 Estrutura

```
tools/code-references/
├── SPEC-002-types-transaction.ts
├── SPEC-002-transactionService-stub.ts
├── SPEC-002-Header.tsx
├── SPEC-002-layout.tsx
│
├── SPEC-003-transactionService.list.ts
├── SPEC-003-TransactionsPage.tsx
├── SPEC-003-TransactionItem.tsx
│
├── SPEC-004-transactionService.create.ts
├── SPEC-004-CreateTransactionPage.tsx
│
├── (SPEC-005 e SPEC-006: em desenvolvimento)
└── README.md (este arquivo)
```

---

## 💡 Filosofia

**Estes arquivos NÃO são:**
- ❌ Para copiar/colar direto
- ❌ A única forma de fazer
- ❌ Código perfeito (há sempre outras formas)

**Estes arquivos SÃO:**
- ✅ Referência de estrutura e padrões
- ✅ Exemplos de boas práticas
- ✅ Guias com comentários explicando o quê e por quê
- ✅ Ferramenta pedagógica para o Dev aprender

---

## 🧠 Aproveite os Comentários

Cada arquivo tem comentários explicando:
- **O que faz cada parte**
- **Por que foi feito assim**
- **Armadilhas comuns a evitar**
- **O que o Dev vai aprender**

Exemplo:
```typescript
// ❌ Ruim: esquecer JSON.stringify()
// body: data  // JS object, não é JSON string!

// ✅ Bom: serializar para JSON
// body: JSON.stringify(data)
```

---

## 🎓 Fluxo Sugerido com o Dev

### SPEC-002 (C1 Setup)

1. Dev cria estrutura de pastas
2. Você compara com referência
3. Pronto! (simples, só infraestrutura)

### SPEC-003 (C2 List)

1. Ler SPEC-003-transactionService.list.ts
2. Dev implementa o service
3. Você compara: "Igual? Diferente? Por quê?"
4. Ler SPEC-003-TransactionsPage.tsx
5. Dev implementa page com useState/useEffect
6. Você compara
7. Ler SPEC-003-TransactionItem.tsx
8. Dev implementa componente
9. Teste final: dados aparecem na tela

### SPEC-004 (C3 Create)

1. Similar ao SPEC-003
2. Foco especial em: useState por campo (vai sentir dor aqui)
3. Validação manual
4. Spike pedagógico: "Viu quantos useState?"

### SPEC-005 (C4 Edit)

1. React Query setup (novo)
2. React Hook Form (novo)
3. Comparar com C3: "Lembra dos 7 useState? Agora é só useForm()"

### SPEC-006 (C5 Delete)

1. useMutation (aprendido em C4, reutiliza)
2. Modal confirmação
3. Consolidação de padrões

---

## ⚡ Dica Rápida

**Quando Dev fizer algo diferente:**

Não diga: "Tá errado, tem que ser assim"

Diga: "Funcionou? Ótimo! Mas vê só este jeito aqui... qual é a diferença?"

Dev aprende mais questionando do que copiando.

---

## 🔗 Ver também

- `tools/specs/SPEC-00X-*.md` — Requisitos detalhados
- `tools/specs/SPIKE-STRUCTURE-FRONTEND.md` — Conceitos fundamentais
- `tools/specs/PEDAGOGIA-EPICO-C.md` — Estratégia de spikes
