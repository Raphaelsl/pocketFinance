# Contributing to PocketFinance

Thank you for contributing to this project!  
Please follow the guidelines below to ensure consistent and high-quality development.

---

## 📌 Development Workflow

1. Create a branch from `main`:
```bash
git checkout -b feature/your-feature-name
```

2. Make small and focused commits.
3. Open a Pull Request to `main`.
4. Request review.
5. Merge using **Squash & Merge** after approval.

---

## 🗂 Backend Folder Structure
controller/   → REST API endpoints
service/      → Business logic
repository/   → Spring Data repositories
model/        → JPA entities
dto/          → Request & Response objects
config/       → Config classes
exception/    → Global error handling

---

## 🧪 Testing Guidelines
- Prefer integration tests with Testcontainers.
- Each main endpoint should have at least one test.
- Avoid mocks when real integration is more valuable.

---

## 🧹 Code Style
- Use meaningful names (English only).
- Keep methods small and focused.
- Avoid duplication — extract helpers when needed.
- Prioritize readability over cleverness.

---

## 🔥 Commit Message Examples

Use English and follow a consistent pattern:

- `feat: add create transaction endpoint`
- `fix: correct flyway migration issue`
- `refactor: extract dto mapper`
- `test: add integration test for GET /transactions`
- `docs: update README`