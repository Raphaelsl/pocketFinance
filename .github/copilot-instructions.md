# PocketFinance Coding Standards

## Testing
- Write a failing test before implementing behavior changes when practical (TDD + Prove-It).
- Backend changes: run `./mvnw test` from `backend/`.
- Frontend changes: run `npm test` (or `npm run lint` + `npm run build` if tests are not configured) from `frontend/`.
- Prefer unit tests first, then integration tests, then e2e when necessary.

## Code Quality
- Review code for correctness, readability, architecture, security, and performance.
- Keep changes small and verifiable.
- Ensure lint, type checks, tests, and build pass for impacted modules.
- Never commit secrets or credentials.

## Implementation Workflow
- Implement in small increments: design -> code -> test -> verify.
- Avoid mixing formatting-only changes with behavior changes.
- For bug fixes, add a test that reproduces the issue before fixing it.

## Boundaries
- Ask before introducing new dependencies or changing database schema.
- Validate all external input and handle errors explicitly.
- Do not remove tests to make CI pass.

## Copilot Agents and Skills
- Use `test-driven-development` whenever changing behavior or fixing bugs.
- Use `code-review-and-quality` before finalizing meaningful changes.
- Use `@code-reviewer` for multi-axis review.
- Use `@test-engineer` for test strategy, missing coverage, and Prove-It tests.
- Use `@security-auditor` for security-sensitive code paths.

## Project Memory
- Follow usage patterns in `.github/copilot-usage.md`.
- For bug fixes, apply Prove-It: failing test first, then fix.
- Backend verification default: run tests from `backend/` with `./mvnw test`.
- Frontend verification default: run tests from `frontend/` with `npm test` (or `npm run lint` and `npm run build` when tests are unavailable).

