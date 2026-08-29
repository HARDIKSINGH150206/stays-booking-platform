
---

# `docs/development/git-workflow.md`

```md
# STAYS — Git Workflow

> **Document Status:** Active  
> **Version:** 1.0  
> **Document Type:** Development Workflow  
> **Parent Document:** [Project Bible](../PROJECT-BIBLE.md)  
> **Development Setup:** [Environment Setup](./environment-setup.md)  
> **Testing Strategy:** [Testing Strategy](./testing-strategy.md)

---

# 1. Purpose

This document defines the Git workflow for the STAYS project.

The objective is to maintain:

- clean commit history;
- isolated feature development;
- safe integration;
- traceable changes;
- predictable releases;
- minimal accidental regressions.

---

# 2. Branching Model

STAYS uses a feature-oriented branching workflow.

Recommended structure:

```text
main
 │
 └── development
       │
       ├── feature/authentication
       ├── feature/stays
       ├── feature/maps
       ├── feature/booking-engine
       ├── feature/payments
       └── feature/dashboard