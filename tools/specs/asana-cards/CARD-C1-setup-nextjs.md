# Card Asana — C1: Setup Next.js

## Nome da tarefa
```
[SPEC-002] C1 — Setup Next.js: estrutura, Tailwind e service layer base
```

---

## Descrição

```
## 🎯 Objetivo

Criar o projeto frontend em Next.js com estrutura de pastas profissional,
Tailwind configurado, service layer base e layout global renderizando.

Esta é a fundação para todos os cards C2–C5.

## ✅ Critérios de aceite

- [ ] Projeto Next.js criado com TypeScript
- [ ] Tailwind CSS configurado e funcionando
- [ ] Variável de ambiente NEXT_PUBLIC_API_URL apontando para o backend
- [ ] Estrutura de pastas criada: src/app, src/services, src/types, src/components
- [ ] transactionService.ts base criado (estrutura vazia, tipada)
- [ ] Layout global com Header simples renderizando em http://localhost:3000
- [ ] docker-compose.yml atualizado com serviço frontend

## 🔗 Spec completo
tools/specs/SPEC-002-frontend-setup-nextjs.md
```

---

## Subtasks

```
1. Criar projeto com create-next-app (TypeScript + Tailwind + App Router)
2. Criar estrutura de pastas (services/, types/, components/layout/)
3. Criar types/transaction.ts com todos os tipos TypeScript
4. Criar services/transactionService.ts base (funções vazias)
5. Criar components/layout/Header.tsx
6. Criar app/layout.tsx global com Header
7. Configurar .env.local com NEXT_PUBLIC_API_URL
8. Atualizar docker-compose.yml com serviço frontend
```

---

## Campos do card

| Campo | Valor |
|-------|-------|
| Projeto | PocketFinance |
| Épico | C — Frontend |
| Prioridade | High |
| Estimativa | 2h |
| Tags | `setup`, `frontend`, `nextjs` |
| Spec ID | SPEC-002 |
