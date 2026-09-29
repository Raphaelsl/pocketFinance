# Card Asana — G2: Web Shell and Visual System

## Task Name

```text
[SPEC-011] G2 — Build a consistent responsive app shell and visual system
```

## Description

```text
## Objective

Create shared navigation, layout and design tokens so the PocketFinance web app
feels like one product across dashboard and transaction flows.

## Acceptance Criteria

- [ ] The root route opens the approved useful landing page
- [ ] Shared navigation links Visão geral, Transações and Nova transação
- [ ] Active route and primary action are easy to identify
- [ ] Shared tokens cover color, type, spacing, borders, focus and elevation
- [ ] Shared buttons, form controls, banners and cards use the same visual language
- [ ] Header and navigation adapt to mobile without horizontal overflow
- [ ] Existing authenticated identity behavior follows F1/F2 decisions
- [ ] Keyboard focus is visible and navigation can be used without a mouse

## Full Spec

tools/specs/SPEC-011-epic-g-web-product-experience.md
```

## Subtasks

```text
1. Add design tokens and reusable layout primitives
2. Build responsive header/navigation with active states
3. Connect the root route to the approved landing destination
4. Normalize button, card, banner and field styles
5. Verify desktop, mobile and keyboard navigation
```

## Card Fields

| Field | Value |
|-------|-------|
| Project | PocketFinance |
| Epic | G — Web Product Experience |
| Priority | High |
| Estimate | A estimar |
| Tags | `frontend`, `nextjs`, `design-system`, `responsive` |
| Spec ID | SPEC-011 |
| Depends on | G1, F1 |
| Blocks | G3, G4, G5 |
