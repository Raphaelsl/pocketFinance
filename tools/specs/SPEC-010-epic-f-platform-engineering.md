# SPEC-010 — Épico F: Platform Engineering

## Metadata

| Campo | Valor |
|-------|-------|
| **ID** | SPEC-010 |
| **Épico** | F — Platform Engineering |
| **Status** | Draft |
| **Tipo** | Feature |
| **Prioridade** | High |
| **Estimativa** | A definir na spec técnica |
| **Depende de** | SPEC-008 / D6 e SPEC-009 / E6 concluídos |
| **Bloqueia** | SPEC-011 / G — Web Product Experience e SPEC-012 / H — WhatsApp Assistant |

---

## 1. Overview

Preparar o PocketFinance para operar com dados financeiros privados por usuário e
receber integrações externas com segurança. Este épico estabelece identidade,
propriedade dos dados, isolamento entre usuários e uma implantação acessível por
webhooks.

O objetivo é habilitar a evolução do produto sem expor as transações atuais. A
experiência web será refinada no Épico G e o canal conversacional será entregue no
Épico H.

## 2. Problem Statement

O PocketFinance foi construído como uma aplicação de controle financeiro sem login
ou proprietário associado a cada transação. Os endpoints atuais não recebem uma
identidade de usuário para limitar consultas e alterações. Um canal externo não
pode acessar esses dados com segurança enquanto essa fronteira não existir.

O backend também precisa estar implantado em um endereço HTTPS estável, com segredos
fora do código e operação suficiente para receber webhooks de forma confiável.

## 3. Goals

- Criar uma identidade interna para o titular dos dados financeiros.
- Associar transações existentes e novas a um titular.
- Restringir leitura, alteração e exclusão de dados ao respectivo titular.
- Permitir associar um telefone verificado a uma identidade PocketFinance.
- Preparar backend e banco para execução em ambiente publicado.
- Proteger configuração, dados e logs operacionais.
- Manter a evolução em PRs pequenos e com objetivos pedagógicos claros.

## 4. Non-Goals

- Não implementar o assistente ou a conversa pelo WhatsApp neste épico.
- Não oferecer conta de pagamento, saldo bancário, Pix, boletos ou crédito.
- Não integrar Open Finance.
- Não decidir aqui o provedor de WhatsApp ou o mecanismo final de autenticação.
- Não criar um fluxo público de cadastro e aquisição antes de aprovar o escopo de
  público do piloto.
- Não reescrever o domínio financeiro nem introduzir microserviços.

## 5. User Stories

### US-F1 — Privacidade dos meus dados

Como usuário, quero que minhas transações só possam ser consultadas e alteradas
por uma identidade autorizada para manter meus dados financeiros privados.

### US-F2 — Associar meu telefone

Como usuário, quero associar e verificar meu número para que mensagens enviadas
desse canal sejam vinculadas à minha conta correta.

### US-F3 — Usar o produto publicado

Como usuário, quero acessar o PocketFinance em um ambiente estável para que as
integrações externas possam entregar mensagens com segurança.

## 6. Business Rules

### 6.1 Propriedade dos dados

- Toda transação deve pertencer a exatamente um usuário.
- Toda consulta e mutação deve ser limitada ao usuário autenticado ou identificado
  pelo fluxo seguro de integração.
- Conhecer o UUID de uma transação não concede acesso a ela.
- Falha ou ausência de identidade não pode resultar em acesso global aos dados.

### 6.2 Dados existentes

- Uma migration deve atribuir as transações existentes ao titular inicial do
  ambiente, preservando valores, datas, categorias e metadata.
- A migration deve ser repetível apenas pelo mecanismo normal do Flyway e não pode
  apagar ou duplicar transações.
- A estratégia para categorias compartilhadas ou pertencentes ao usuário deve ser
  definida na spec técnica antes de implementação.

### 6.3 Associação de telefone

- Um telefone só pode ser associado após verificação explícita.
- Um telefone não pode identificar dois titulares ativos ao mesmo tempo.
- Deve existir uma forma de revogar a associação.
- A escolha entre piloto com número autorizado e cadastro de múltiplos usuários
  permanece aberta até a revisão deste draft.

### 6.4 Publicação e operação

- Segredos e credenciais vêm da configuração do ambiente, nunca do repositório.
- O backend publicado deve usar HTTPS e banco persistente.
- Logs não devem expor texto financeiro, tokens, credenciais ou números completos.
- Falhas de disponibilidade devem ser observáveis sem registrar conteúdo sensível.

## 7. UX States

### Identidade e associação

- **Unlinked:** instrução simples para iniciar a associação.
- **Verification pending:** código ou link aguardando confirmação, sem acesso a
  transações.
- **Linked:** identidade confirmada e operações disponíveis.
- **Revoked:** telefone desvinculado; novas mensagens não recebem dados pessoais.
- **Unavailable:** serviço indisponível; mensagem não deve sugerir que houve
  alteração de dados.

### Aplicação web

- Uma sessão sem identidade não pode mostrar dados financeiros.
- O mecanismo visual de login e recuperação será detalhado após decisão do escopo
  do piloto e da autenticação.

## 8. Technical Design — Diretrizes para a spec técnica

- Introduzir identidade de usuário sem colocar regras de autenticação nos
  controllers de domínio.
- Aplicar filtro por titular na camada de serviço e persistência para transações,
  agregações do dashboard, edição e exclusão.
- Isolar a associação de telefone atrás de um serviço de domínio próprio.
- Planejar backfill de dados existentes com Flyway e verificação manual da migração.
- Publicar backend e banco com configuração por ambiente, health checks, logs
  estruturados e rotina de backup/recuperação compatível com o estágio do produto.
- Selecionar provedor de autenticação e hosting somente na spec técnica, avaliando
  custo, simplicidade pedagógica e aderência à stack atual.

## 9. Security Notes

- Toda rota com dados financeiros precisa de identidade e autorização explícitas.
- A associação por telefone não deve confiar apenas em um valor enviado no corpo
  da requisição.
- Segredos, códigos de verificação e identificadores de sessão não podem aparecer
  em logs.
- Erros de autorização não devem confirmar se uma transação de outro usuário
  existe.
- A implantação deve impedir acesso público ao banco de dados.

## 10. Testing Strategy

### Backend

- Cobrir acesso autorizado e não autorizado em listagem, detalhe, criação, edição,
  exclusão e agregações.
- Verificar que UUIDs de outros titulares não permitem leitura ou mutação.
- Validar backfill das transações existentes e constraints de ownership.
- Testar associação, verificação, conflito e revogação de telefone.

### Plataforma

- Validar configuração de ambiente sem expor valores secretos.
- Executar smoke test no ambiente publicado para health check, API e banco.
- Verificar que o ambiente responde em HTTPS e que o banco não está publicamente
  acessível.

## 11. Task Plan

| Card | Nome | Módulo | Depende de |
|------|------|--------|------------|
| F1 | Definir identidade e escopo do piloto | Product + Domain | — (pode começar agora) |
| F2 | Criar usuário e associação verificada de telefone | Backend | F1, D6, E6 |
| F3 | Associar e isolar transações por titular | Backend + Database | F2 |
| F4 | Publicar backend e configurar operação segura | Platform | F2, F3 |
| F5 | Platform Quality Gate | Quality | F2, F3, F4 |

## 12. Epic Acceptance Criteria

- [ ] O escopo do piloto define se haverá um titular autorizado ou cadastro de
      vários usuários.
- [ ] Toda transação existente e nova possui um titular válido.
- [ ] Nenhuma rota financeira retorna ou altera dados de outro titular.
- [ ] A associação de telefone exige verificação e pode ser revogada.
- [ ] As agregações do dashboard respeitam o titular da sessão.
- [ ] A migração preserva os dados existentes e tem verificação documentada.
- [ ] O backend está publicado em HTTPS com banco persistente e segredos fora do
      repositório.
- [ ] Logs e mensagens de erro não expõem conteúdo financeiro nem credenciais.
- [ ] Build, testes e smoke test do ambiente passam antes do fechamento do épico.

## 13. Estratégia Pedagógica

A progressão mantém o princípio dos Épicos C e E: o Dev entende o risco antes de
introduzir abstrações maiores.

- **F1:** mapear onde a aplicação hoje trata todos os dados como globais.
- **F2:** modelar identidade e associação de telefone sem misturar canal e domínio.
- **F3:** aplicar ownership ponta a ponta e observar o efeito nas queries e
  migrations.
- **F4:** entender configuração, deploy, HTTPS, secrets e health checks.
- **F5:** provar isolamento e operação por critérios verificáveis.

## 14. Decisões em aberto

- Piloto com um único número autorizado ou suporte a cadastro de vários usuários.
- O dashboard web terá login no mesmo MVP ou será restrito ao ambiente de piloto.
- Provedor de autenticação e provedor de hosting.
- Categorias serão compartilhadas ou terão ownership por usuário.
