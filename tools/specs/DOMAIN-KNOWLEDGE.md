# PocketFinance — Domain Knowledge

## Objetivo

Este documento registra o conhecimento de domínio do PocketFinance.

Ele deve servir como memória estável para:

- revisar PRs com consistência;
- criar specs futuras;
- alimentar outra IA com contexto do produto;
- evitar rediscutir decisões de domínio já tomadas.

---

## Contexto do Sistema

PocketFinance é um sistema de controle financeiro pessoal.

O foco atual é registrar e gerenciar transações financeiras. Futuramente, o
sistema deve evoluir para dashboard, analytics e entrada por linguagem natural.

O produto também é educacional: cada decisão deve equilibrar simplicidade,
domínio correto e valor pedagógico para o Dev.

---

## Core Domain

### Transaction

`Transaction` é a entidade central do sistema.

Ela representa um evento financeiro ocorrido em determinado momento.

Exemplos:

- salário recebido;
- compra no mercado;
- pagamento de serviço;
- gasto com transporte.

---

## Modelo Conceitual

```text
Transaction
 ├── id
 ├── amount
 ├── type
 ├── currency
 ├── description
 ├── occurredAt
 ├── category
 ├── metadata
 ├── createdAt
 └── updatedAt

Category
 ├── id
 └── name
```

---

## Transaction

### Campos

| Campo | Significado | Regra |
|-------|-------------|-------|
| `id` | Identificador da transação | Gerado pelo backend |
| `amount` | Valor monetário | Sempre positivo |
| `type` | Direção financeira | `INCOME` ou `EXPENSE` |
| `currency` | Moeda | Código de 3 letras, padrão atual `BRL` |
| `description` | Descrição humana da transação | Obrigatória nos fluxos atuais |
| `occurredAt` | Quando a transação aconteceu | Obrigatório |
| `category` | Classificação da transação | Suporte ao domínio, não core no momento |
| `metadata` | Dados adicionais flexíveis | Opcional |
| `createdAt` | Quando foi registrada | Gerado pelo backend |
| `updatedAt` | Última atualização | Gerado pelo backend |

---

## Regras Fundamentais

### Amount

- Deve ser maior que zero.
- O sistema não usa valor negativo para representar despesa.
- O sinal financeiro é definido por `type`.

Motivo:

- evita ambiguidade;
- facilita dashboard;
- facilita parsing futuro por IA;
- deixa o domínio explícito para o Dev.

### TransactionType

Valores válidos:

- `INCOME`: entrada de dinheiro;
- `EXPENSE`: saída de dinheiro.

Regras:

- obrigatório;
- não deve ser inferido automaticamente nos fluxos atuais;
- deve ser enviado no create e no update;
- usado futuramente para cálculo de saldo.

### Currency

Regra atual:

- deve ser um código de 3 letras;
- deve ser normalizado para uppercase antes de enviar ao backend;
- exemplo padrão: `BRL`.

Exemplos válidos:

- `BRL`
- `USD`
- `EUR`

Exemplo a evitar:

```json
{
  "currency": "usd"
}
```

### Description

- Representa a descrição humana da transação.
- Deve ser enviada sem espaços extras no início/fim.
- Futuramente pode ser derivada de uma frase em linguagem natural.

### OccurredAt

- Representa quando a transação aconteceu.
- Não é a mesma coisa que `createdAt`.
- Deve ser enviada em formato compatível com ISO-8601.

### Category

`Category` organiza transações, mas ainda não dirige comportamento central.

Exemplos:

- Mercado
- Transporte
- Salário
- Lazer

Regras atuais:

- é entidade de suporte;
- pode ser nula nos fluxos atuais;
- não há CRUD completo de categoria no Épico C;
- pode ser expandida em Product Engineering ou AI Engineering.

### Metadata

Campo flexível para informações adicionais.

Uso futuro possível:

```json
{
  "source": "LLM",
  "confidence": 0.87
}
```

Não deve ser usado como substituto para campos core como `amount`, `type`,
`currency`, `description` ou `occurredAt`.

---

## Use Cases Atuais

### Criar Transação

Entrada mínima esperada:

```json
{
  "amount": 120.5,
  "type": "EXPENSE",
  "currency": "BRL",
  "description": "Mercado",
  "occurredAt": "2026-07-08T10:00:00Z"
}
```

Regras:

- `amount > 0`;
- `type` obrigatório;
- `currency` normalizada;
- `description` sem espaços extras;
- `occurredAt` obrigatório.

### Listar Transações

Suporte atual:

- paginação;
- conteúdo ordenado conforme backend atual.

Possíveis evoluções:

- filtro por texto;
- filtro por período;
- filtro por tipo;
- filtro por categoria.

### Atualizar Transação

Regra esperada para o frontend:

- manter consistência com create;
- normalizar payload antes do `PUT`;
- enviar `amount` como número;
- enviar `currency` em uppercase;
- enviar `description` trimada;
- preservar `type`.

Observação:

- Se o backend exigir payload completo via `PUT`, a UI deve enviar todos os campos necessários.
- Se evoluir para update parcial, documentar explicitamente como `PATCH` ou como semântica própria.

### Deletar Transação

Regra atual:

- remoção por `id`;
- exige confirmação no frontend;
- não há soft delete;
- após sucesso, a lista deve ser sincronizada.

---

## Decisões de Domínio

### `amount` positivo + `type`

Decisão:

- `amount` sempre positivo;
- `type` define entrada/saída.

Motivo:

- remove ambiguidade;
- evita misturar regra de negócio com sinal numérico;
- melhora cálculo de dashboard;
- facilita interpretação futura por IA.

### Transaction antes de Category

Decisão:

- `Transaction` é core;
- `Category` é suporte.

Motivo:

- permite entregar valor antes de modelar toda taxonomia;
- evita overengineering no início;
- deixa espaço para categorização manual ou por IA depois.

### DTOs e Service Layer

Decisão:

- API não deve expor entidade diretamente;
- regras devem passar por service layer.

Motivo:

- desacoplamento;
- controle de contrato;
- segurança;
- clareza pedagógica.

---

## Evoluções Planejadas

### Dashboard

Deve usar `type` para calcular:

- total de entradas;
- total de saídas;
- saldo;
- distribuição por categoria;
- evolução por período.

Regras definidas em `SPEC-008`:

- agregar uma moeda por consulta;
- nunca somar valores de moedas diferentes sem conversão explícita;
- calcular `saldo = entradas - saídas`;
- considerar somente `EXPENSE` na distribuição por categoria;
- agrupar transações sem categoria como `Sem categoria`;
- usar intervalo temporal `[start, end)` com limite de 12 meses.

### AI / LLM

Fase futura.

Objetivo:

- transformar linguagem natural em uma sugestão de transação;
- permitir confirmação humana antes de persistir;
- armazenar metadados de origem/confiança quando fizer sentido.

Exemplo:

```text
Gastei R$ 70 em farmácia ontem.
```

Possível interpretação:

```json
{
  "amount": 70,
  "type": "EXPENSE",
  "category": "Farmácia",
  "description": "Farmácia",
  "occurredAt": "data inferida"
}
```

Regra importante:

- a IA deve sugerir;
- o usuário confirma antes de gravar;
- dados incertos devem ser visíveis.

---

## Constraints Atuais

- Sem autenticação.
- Sem multiusuário.
- Sem soft delete.
- Sem dashboard implementado.
- Sem LLM implementado.
- Categoria ainda não é foco principal do frontend.

---

## Resumo para IA

- PocketFinance gerencia transações financeiras pessoais.
- `Transaction` é a entidade central.
- `amount` é sempre positivo.
- `type` define se é `INCOME` ou `EXPENSE`.
- `currency` deve ser normalizada para uppercase.
- `description` deve ser trimada antes de persistir.
- `occurredAt` representa quando o evento financeiro aconteceu.
- `Category` organiza, mas ainda não é core.
- `metadata` é extensível e deve ser usado com cuidado.
- Dashboard e LLM são evoluções futuras.
