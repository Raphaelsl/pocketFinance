# Card Asana — E1: Spring AI Setup + First Call

## Task Name

```text
[SPEC-009] E1 — Configure Spring AI and make the first LLM call
```

---

## Description

```text
## Objective

Add Spring AI to the backend and make the first real call to OpenAI (GPT-4o mini).
No structured output yet — the goal is to configure the dependency, understand what
comes back as free text, and feel the problem that structured output will solve in E2.

## Acceptance Criteria

- [ ] Add spring-ai-openai-spring-boot-starter dependency
- [ ] Configure ChatClient as a @Bean in a dedicated AiConfig class
- [ ] Load OPENAI_API_KEY from environment variable only — never from committed config
- [ ] Add OPENAI_API_KEY to .gitignore and docker-compose.yml via env_file
- [ ] Set temperature: 0.1 and model: gpt-4o-mini in application.yml
- [ ] Create a throwaway spike endpoint POST /api/spike/parse that receives {"input": "..."} and returns the raw LLM text response
- [ ] Call the endpoint manually with "Gastei R$ 150 no mercado ontem" and record the raw output
- [ ] Log the response in the terminal so tokens and latency are visible
- [ ] The spike endpoint is clearly marked as temporary (to be replaced in E2/E3)

## Pedagogical Spike

After this card the TL should ask:
"The LLM responded. But it returned free text. How do you extract the `amount` from this?
What if it writes 'one hundred and fifty' instead of 150? What if the format changes
between calls?"

This discomfort is intentional. E2 solves it with Structured Output.

## Full Spec

tools/specs/SPEC-009-epic-e-ai-engineering.md
```

---

## Subtasks

```text
1. Add Spring AI dependency and verify build passes
2. Create AiConfig with ChatClient @Bean
3. Configure application.yml (model, temperature)
4. Set up OPENAI_API_KEY as environment variable
5. Create spike endpoint POST /api/spike/parse
6. Test manually with a sample sentence and record the raw output
7. Document the raw response in a comment or spike notes
```

---

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | E — AI Engineering |
| Priority | High |
| Estimate | 3h |
| Tags | `backend`, `spring-ai`, `openai`, `setup`, `spike` |
| Spec ID | SPEC-009 |
| Depends on | D6 |
| Blocks | E2 |
