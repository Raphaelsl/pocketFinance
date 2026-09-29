# SPEC-012 — Épico H: WhatsApp Financial Assistant

## Metadata

| Campo | Valor |
|-------|-------|
| **ID** | SPEC-012 |
| **Épico** | H — WhatsApp Financial Assistant |
| **Status** | Draft |
| **Tipo** | Feature |
| **Prioridade** | High |
| **Estimativa** | A definir na spec técnica |
| **Depende de** | SPEC-008 / D6, SPEC-009 / E6, SPEC-010 / F5 e SPEC-011 / G6 concluídos |
| **Bloqueia** | Próximos canais e automações financeiras |

---

## 1. Overview

Permitir que o usuário registre, consulte e corrija suas finanças por uma conversa
de texto no WhatsApp. O dashboard web continua como painel para revisar o histórico
e visualizar os dados de forma consolidada.

O assistente usa o LLM para interpretar linguagem natural, mas operações financeiras
seguem regras do backend. O usuário confirma cada novo lançamento ou alteração antes
de persistir.

## 2. Problem Statement

O PocketFinance exige que o usuário abra o app e preencha formulários. O Épico E
reduz o preenchimento manual, mas ainda começa em uma página web e não mantém uma
conversa. A visão do produto é reduzir esse atrito usando o canal que o usuário já
usa no dia a dia, mantendo clareza e controle sobre os dados.

## 3. Goals

- Receber mensagens de texto de um telefone associado a um usuário.
- Interpretar pedidos de registro de receita e despesa usando a capacidade do E.
- Perguntar pelo dado essencial que estiver ausente ou ambíguo.
- Mostrar um resumo editável e pedir confirmação antes de salvar.
- Consultar totais e categorias usando resultados determinísticos do backend.
- Permitir localizar, corrigir ou cancelar um lançamento com confirmação explícita.
- Informar claramente falhas de interpretação, integração ou disponibilidade.
- Manter o dashboard web como visão de conferência e histórico.

## 4. Non-Goals

- Não criar conta de pagamento, saldo bancário real, Pix, boleto ou crédito.
- Não integrar Open Finance nem importar dados bancários automaticamente.
- Não incluir áudio, leitura de recibos ou imagem nesta primeira versão.
- Não enviar lembretes proativos nem fazer recomendações de investimento.
- Não criar agentes autônomos com permissão para movimentar ou alterar dados sem
  confirmação.
- Não duplicar parsing, validação de transação ou cálculo financeiro existentes.

## 5. User Stories

### US-H1 — Registrar uma transação por mensagem

Como usuário, quero descrever uma receita ou despesa em texto para registrar sem
preencher um formulário campo por campo.

### US-H2 — Corrigir antes de salvar

Como usuário, quero revisar o valor, tipo, data e descrição sugeridos para impedir
que uma interpretação incorreta vire dado financeiro.

### US-H3 — Tirar uma dúvida sobre meus gastos

Como usuário, quero perguntar quanto gastei em um período ou categoria e receber
um valor calculado a partir das minhas transações.

### US-H4 — Corrigir ou cancelar um lançamento

Como usuário, quero localizar um lançamento recente, alterar seus dados ou
descartá-lo com confirmação.

### US-H5 — Saber quando o assistente não entendeu

Como usuário, quero uma pergunta de esclarecimento ou uma mensagem de erro clara
quando o pedido estiver incompleto ou o canal estiver indisponível.

## 6. Business Rules

### 6.1 Identidade e acesso

- Cada mensagem deve ser associada a um telefone verificado e a um titular.
- Mensagens de telefones não associados não recebem dados financeiros.
- Toda busca, cálculo e mutação usa o titular derivado da identidade verificada;
  o modelo não pode escolher ou alterar esse titular.
- A associação pode ser revogada pelo fluxo definido em SPEC-010.

### 6.2 Registro

- O fluxo é sempre: mensagem → interpretação → esclarecimento se necessário →
  resumo → confirmação explícita → gravação.
- Nenhum lançamento é persistido ao receber uma mensagem ambígua ou apenas uma
  intenção de registrar.
- Valor, tipo e data devem ser exibidos de forma clara no resumo para confirmação.
- Se um dado obrigatório não for confiável, o assistente pergunta em vez de
  completar por conta própria.
- O backend aplica as regras de domínio e o validador de SPEC-009.

### 6.3 Consultas

- Totais, períodos e distribuições vêm de serviços de agregação do backend, nunca
  de aritmética feita pelo LLM.
- Respostas devem dizer o período e a moeda considerados.
- Consultas fora dos dados disponíveis ou com período ambíguo geram uma pergunta
  de esclarecimento.

### 6.4 Alterações e cancelamentos

- Antes de alterar ou cancelar, o assistente identifica a transação com detalhes
  suficientes para evitar selecionar um item errado.
- Alteração e cancelamento exigem confirmação explícita.
- Se houver mais de uma transação compatível, o assistente pede que o usuário
  escolha uma delas.

### 6.5 Confiabilidade e privacidade

- Eventos repetidos do provedor não podem criar transações duplicadas.
- Mensagens e respostas de uma conversa são associadas a um usuário e a um estado
  de fluxo; mensagens de outra identidade não podem continuar esse estado.
- Conteúdo financeiro não deve ser registrado em logs comuns.
- Falha de entrega ou indisponibilidade não pode ser apresentada como sucesso.

## 7. UX States

- **Unlinked:** orientar a associação segura do número sem revelar dados.
- **Ready:** explicar, de forma curta, exemplos de registro e consulta.
- **Interpreting:** informar que o pedido está sendo processado.
- **Clarification:** perguntar apenas pelo dado necessário para prosseguir.
- **Review:** mostrar os campos interpretados e opções confirmar, corrigir ou
  cancelar.
- **Saved:** confirmar que o lançamento foi registrado e apresentar resumo.
- **Query result:** apresentar valor, período e moeda; oferecer abrir o dashboard.
- **Select transaction:** listar poucas opções claras para correção ou remoção.
- **Unavailable / failed:** informar que nada foi salvo e orientar nova tentativa
  ou uso do dashboard.
- **Help / opt-out:** disponibilizar ajuda e interromper mensagens quando o usuário
  revogar a associação ou optar por não receber respostas.

## 8. Technical Design — Diretrizes para a spec técnica

- Criar um adaptador de canal que normalize eventos de entrada e envio de resposta.
- Validar a origem dos webhooks e impedir reprocessamento de eventos duplicados.
- Manter a orquestração de conversa separada dos controllers de transação e do
  provedor de mensagens.
- Reutilizar `TransactionSuggestService` e `TransactionSuggestionValidator` para
  interpretação e validação.
- Reutilizar as agregações do dashboard para consultas financeiras; não pedir ao
  LLM que calcule valores.
- Representar rascunhos e confirmações como estado temporário de conversa, sem
  confundi-los com transações persistidas.
- Manter a escolha do provedor de mensagens e a política de expiração do estado
  para a spec técnica.

## 9. Security Notes

- Validar assinatura ou mecanismo equivalente do provedor antes de aceitar webhook.
- Não confiar em número, titular, intenção ou valor de confirmação fornecidos por
  um payload sem validação de origem e contexto.
- Aplicar autorização por titular em todas as consultas e mutações.
- Limitar tamanho e frequência das mensagens para controlar abuso e custo do LLM.
- Não registrar conteúdo completo de mensagens financeiras em logs de produção.
- Mensagens de resposta devem evitar incluir informação de outra transação ou
  titular, inclusive em erros.

## 10. Testing Strategy

### Backend

- Testar normalização e validação de eventos, incluindo assinatura inválida e
  evento repetido.
- Testar telefone não associado, fluxo de associação e isolamento entre titulares.
- Testar registro com sucesso, ambiguidade, confirmação, cancelamento e retry.
- Testar consulta com dados existentes, sem dados, período inválido e moedas
  diferentes.
- Testar edição e cancelamento com uma ou várias transações candidatas.
- Usar mocks do canal e do LLM; testes não devem depender de serviços externos reais.

### Frontend / experiência

- Validar o fluxo de associação no dashboard web se esse fluxo fizer parte do MVP.
- Fazer smoke test manual ponta a ponta no sandbox do provedor escolhido.
- Confirmar no banco e no dashboard que apenas uma confirmação persiste o dado.

## 11. Task Plan

| Card | Nome | Módulo | Depende de |
|------|------|--------|------------|
| H1 | Receber e validar webhooks de mensagens | Integration | F5, G6 |
| H2 | Associar telefone e iniciar conversa | Identity + Conversation | H1 |
| H3 | Registrar transação com rascunho e confirmação | AI Product | H2, E6 |
| H4 | Responder consultas financeiras determinísticas | Product + Dashboard | H2, D6 |
| H5 | Corrigir ou cancelar transação na conversa | Conversation + Transactions | H3 |
| H6 | WhatsApp Assistant Quality Gate | Quality | H1–H5 |

## 12. Epic Acceptance Criteria

- [ ] Mensagens de telefone não associado não revelam dados e não criam transações.
- [ ] Um texto claro de receita ou despesa gera um resumo revisável.
- [ ] Ambiguidade em dado obrigatório gera pergunta de esclarecimento.
- [ ] Somente a confirmação explícita salva o lançamento.
- [ ] Retries do webhook não criam transações duplicadas.
- [ ] Consultas usam agregações do backend e mostram período e moeda.
- [ ] O assistente identifica uma transação antes de alterar ou cancelar.
- [ ] Alterações e cancelamentos também exigem confirmação explícita.
- [ ] Indisponibilidade é comunicada sem afirmar que houve sucesso.
- [ ] O usuário consegue continuar usando o dashboard web para conferir dados.
- [ ] Testes automatizados não chamam provedor de WhatsApp ou LLM reais.
- [ ] O fluxo é validado manualmente no ambiente sandbox antes do fechamento.

## 13. Estratégia Pedagógica

- **H1:** receber um evento simples e entender o ciclo webhook, validação e retry.
- **H2:** separar identidade de telefone e estado de conversa.
- **H3:** reutilizar o parser do E e observar por que interpretação não equivale a
  persistência.
- **H4:** separar linguagem natural de cálculo financeiro determinístico.
- **H5:** lidar com ambiguidade na seleção de dados e confirmação de mutações.
- **H6:** provar segurança, confiabilidade, custo e UX em um fluxo real de ponta a
  ponta.

## 14. Decisões em aberto

- Público do piloto: um número autorizado ou múltiplos usuários com cadastro.
- Acesso ao dashboard web no mesmo piloto e respectivo fluxo de autenticação.
- Provedor oficial de mensagens e requisitos comerciais associados.
- Política de retenção e expiração do estado temporário da conversa.
- Limites iniciais de mensagens e consultas por usuário.
