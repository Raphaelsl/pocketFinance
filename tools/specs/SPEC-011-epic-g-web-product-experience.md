# SPEC-011 — Épico G: Web Product Experience

## Metadata

| Campo | Valor |
|-------|-------|
| **ID** | SPEC-011 |
| **Épico** | G — Web Product Experience |
| **Status** | Draft |
| **Tipo** | Feature |
| **Prioridade** | High |
| **Estimativa** | A definir após dividir os cards |
| **Depende de** | SPEC-008 / D6 e SPEC-009 / E6; decisão de identidade da SPEC-010 / F1 |
| **Bloqueia** | SPEC-012 / H — WhatsApp Financial Assistant |

---

## 1. Overview

Evoluir a aplicação web de telas funcionais para uma experiência financeira
coerente, moderna e fácil de entender. O dashboard será a visão de conferência do
usuário; transações e cadastro serão caminhos claros para registrar e corrigir
informações.

O conceito visual de referência está em
`explainers/pocketfinance-whatsapp-assistant-vision.html`. Ele orienta a direção de
produto e linguagem, mas não substitui esta spec nem define componentes finais.

## 2. Problem Statement

As telas atuais foram construídas como entregas técnicas isoladas. A home não oferece
conteúdo ou próximo passo, a navegação apresenta apenas Dashboard e Transações, e o
dashboard e os formulários usam hierarquias visuais diferentes. Alguns textos de
interface expõem valores internos como `EXPENSE` e `INCOME`.

O usuário precisa entender rapidamente sua situação financeira, registrar uma
transação sem fricção e confiar que consegue revisar ou corrigir o histórico. A
experiência atual ainda não comunica essa proposta como um produto único.

## 3. Goals

- Definir uma arquitetura de informação simples para dashboard e transações.
- Estabelecer linguagem visual consistente para navegação, tipografia, cores,
  formulários, feedback e componentes reutilizados.
- Fazer do dashboard o ponto de entrada útil, com período, moeda, resumo e próximos
  passos claros.
- Tornar registro por linguagem natural o caminho rápido, mantendo o formulário
  manual como alternativa visível e acessível.
- Melhorar busca, leitura, edição e exclusão de transações.
- Cobrir estados vazios, loading, erro, sucesso e atualização em andamento.
- Adaptar os fluxos principais a telas pequenas e navegação por teclado.
- Escrever toda a interface em linguagem humana em português, sem expor enums ou
  detalhes de implementação.

## 4. Non-Goals

- Não alterar regras de domínio ou contratos de API sem spec própria.
- Não integrar WhatsApp neste épico; isso pertence ao Épico H.
- Não adicionar uma biblioteca de gráficos sem justificar a necessidade.
- Não adicionar valores fictícios ou conteúdo de demonstração ao produto real.
- Não substituir o fluxo manual por IA nem salvar sugestões automaticamente.
- Não implementar cadastro público; identidade e autenticação pertencem ao Épico F.

## 5. User Stories

### US-G1 — Entender minha situação

Como usuário, quero abrir uma visão geral legível para entender receitas, despesas,
saldo e período sem procurar os números em várias telas.

### US-G2 — Registrar com pouco esforço

Como usuário, quero descrever uma receita ou despesa em linguagem natural, revisar
os campos sugeridos e salvar quando estiver correto.

### US-G3 — Usar o cadastro manual

Como usuário, quero preencher um formulário claro quando prefiro informar cada
campo diretamente ou quando a sugestão não atende ao meu caso.

### US-G4 — Encontrar e corrigir dados

Como usuário, quero localizar, editar e excluir uma transação com feedback claro
para manter meu histórico correto.

### US-G5 — Usar em diferentes telas

Como usuário, quero completar os fluxos principais no celular, tablet ou desktop,
com teclado e leitor de tela quando necessário.

## 6. Product Rules

### 6.1 Navegação e hierarquia

- A aplicação deve oferecer entrada para Visão geral, Transações e Nova transação.
- A página inicial deve levar a uma tela útil, preferencialmente o dashboard.
- A ação principal de registrar deve ser fácil de encontrar em todas as telas
  financeiras.
- Navegação deve indicar a seção atual e manter o usuário orientado após salvar,
  editar, excluir ou filtrar.

### 6.2 Conteúdo financeiro

- Exibir `INCOME` como **Receita** e `EXPENSE` como **Despesa**.
- Formatar valores em pt-BR e apresentar moeda junto aos valores quando necessário.
- Exibir o período usado nos totais e preservar filtros durante navegação coerente.
- Mostrar estado vazio com contexto e ação seguinte, sem confundir ausência de dados
  com erro.
- Valores e categorias devem vir da API; a interface não inventa exemplos em produção.

### 6.3 IA e confirmações

- A sugestão deve ser identificada como sugestão e seus campos precisam ser
  editáveis antes do envio.
- A UI nunca salva uma transação apenas por analisar texto.
- Erro de interpretação mantém o caminho manual disponível.
- O nível de confiança deve ser comunicado de forma útil, sem sugerir certeza maior
  que a fornecida pelo backend.

### 6.4 Feedback e prevenção de erro

- Ações destrutivas exibem qual transação será removida e pedem confirmação.
- Ações em andamento desabilitam somente controles que poderiam duplicar a ação.
- Erros devem explicar o próximo passo sem apresentar detalhes internos.
- Formulários indicam rótulos, campos obrigatórios, formato esperado e erro junto ao
  campo correspondente.

## 7. UX States

Cada tela principal deve cobrir, quando aplicável:

- **Loading:** estrutura estável e feedback de carregamento sem saltos grandes.
- **Success:** conteúdo, confirmação da ação e estado atualizado.
- **Empty:** explicação contextual e próxima ação possível.
- **Error:** mensagem compreensível e recuperação, como tentar novamente.
- **Refreshing:** manter contexto visível enquanto os dados atualizam.
- **Validation:** erro ligado ao campo e preservação dos valores digitados.
- **Small screen:** navegação, filtros, gráficos e ações sem overflow horizontal.

## 8. UX Design — Diretrizes para a spec técnica

- Criar um shell de produto compartilhado com navegação responsiva e estados ativos.
- Usar tokens visuais para cor, tipografia, espaçamento, borda, foco e elevação.
- Consolidar componentes para botões, campos, banners, cards, empty states e
  confirmações.
- Priorizar leitura rápida e hierarquia dos dados; limitar painéis concorrentes.
- Usar cor com texto ou ícone como redundância, sem codificar significado apenas
  pela cor.
- Definir breakpoint e comportamento do dashboard e da navegação para mobile.
- Usar o protótipo HTML como referência de direção visual e validar os fluxos com
  dados reais da API.

## 9. Accessibility Notes

- Fluxos principais operáveis por teclado, com foco visível e ordem lógica.
- Contraste adequado para texto, estados e controles.
- Labels associados a inputs e erros anunciados por tecnologias assistivas.
- Gráficos devem ter resumo textual ou tabela equivalente.
- Alvos de toque e mensagens responsivas adequados para telas pequenas.
- Respeitar preferência de movimento reduzido onde houver animação.

## 10. Testing Strategy

### Frontend

- Cobrir navegação, formulários, estados de loading/erro/vazio e confirmações.
- Testar que labels amigáveis aparecem em vez de enums internos.
- Validar a ação principal de cada página e a recuperação após erro.
- Verificar visualmente os fluxos em viewport mobile e desktop.
- Fazer walkthrough manual com tarefas: entender o mês, criar, encontrar, editar e
  excluir um lançamento.

### UX e acessibilidade

- Fazer avaliação por teclado nas rotas principais.
- Conferir contraste, foco, labels, mensagens de erro e alternativa textual para
  gráficos.
- Registrar problemas bloqueadores e resolvê-los antes do quality gate.

## 11. Task Plan

| Card | Nome | Módulo | Depende de |
|------|------|--------|------------|
| G1 | Auditoria UX e arquitetura de informação | Product + UX | — (pode começar agora) |
| G2 | Shell, navegação e sistema visual | Frontend | G1, decisão F1 |
| G3 | Dashboard: hierarquia, filtros e estados | Dashboard UX | G2 |
| G4 | Histórico: leitura, busca e ações | Transactions UX | G2 |
| G5 | Cadastro manual e sugestão por linguagem natural | AI Product UX | G2, E6 |
| G6 | Responsividade, acessibilidade e quality gate web | Quality | G3, G4, G5 |

## 12. Epic Acceptance Criteria

- [ ] A rota inicial abre uma tela útil e apresenta a ação financeira principal.
- [ ] Navegação consistente liga Visão geral, Transações e Nova transação.
- [ ] Dashboard explica valores, moeda e período selecionado.
- [ ] Lista permite entender e encontrar transações sem expor nomes técnicos.
- [ ] Registro por linguagem natural e manual coexistem com hierarquia clara.
- [ ] Sugestões permanecem editáveis e exigem envio explícito para salvar.
- [ ] Estados vazio, loading, erro, sucesso e refresh estão definidos nas telas
      principais.
- [ ] Fluxos principais funcionam em mobile e desktop sem overflow horizontal.
- [ ] Teclado, foco, labels, contraste e alternativas textuais dos gráficos são
      verificados.
- [ ] Nenhum dado de demonstração aparece como dado real do usuário.
- [ ] Build, lint, testes e walkthrough manual passam no quality gate do épico.

## 13. Estratégia Pedagógica

- **G1:** observar as telas como jornadas completas e priorizar fricções com
  evidência.
- **G2:** aprender como tokens e componentes compartilhados reduzem inconsistência.
- **G3:** comunicar dados financeiros com hierarquia e contexto.
- **G4:** tratar busca, ações e estados de histórico como uma tarefa contínua.
- **G5:** integrar IA à interface mantendo revisão e controle do usuário.
- **G6:** validar responsividade e acessibilidade como parte da qualidade do
  produto, não como acabamento opcional.

## 14. Decisões em aberto

- Aprovar a direção visual do protótipo HTML ou ajustar personalidade, cores e
  densidade visual.
- Confirmar se o dashboard é também a home pós-login.
- Prioridade mobile-first versus desktop-first para o painel web.
- Fluxo de autenticação que será implementado em F e refletido nas telas G.
- Definir tarefas e critérios de walkthrough com o usuário antes de estimar cards.
