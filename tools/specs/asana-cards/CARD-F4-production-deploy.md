# Card Asana — F4: Production Deployment and Operations

## Task Name

```text
[SPEC-010] F4 — Publish PocketFinance with secure runtime configuration
```

## Description

```text
## Objective

Deploy the backend and persistent database to an environment that can serve the web
app and receive external webhooks over HTTPS. Keep provider and hosting choices
aligned with the approved technical spec.

## Acceptance Criteria

- [ ] Backend is reachable through HTTPS in the selected environment
- [ ] Database is persistent and is not publicly exposed
- [ ] Secrets and environment-specific settings are injected outside source control
- [ ] Health checks report application and database readiness
- [ ] Logs are structured and exclude financial message content and credentials
- [ ] Backup and recovery steps are documented and exercised for the pilot
- [ ] Smoke checks validate API, database and frontend-to-backend connectivity
- [ ] Environment setup is documented for another developer

## Full Spec

tools/specs/SPEC-010-epic-f-platform-engineering.md
```

## Subtasks

```text
1. Compare hosting options and record the selected trade-offs
2. Configure production-like environment variables and secrets
3. Deploy backend and database with HTTPS and restricted database access
4. Configure health checks, basic logs and backup/restore instructions
5. Run smoke checks and document the deployment procedure
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | F — Platform Engineering |
| Priority | High |
| Estimate | A estimar |
| Tags | `platform`, `deployment`, `security`, `operations` |
| Spec ID | SPEC-010 |
| Depends on | F2, F3 |
| Blocks | F5, H1 |
