
---

# `docs/development/testing-strategy.md`

```md
# STAYS — Testing Strategy

> **Document Status:** Active  
> **Version:** 1.0  
> **Document Type:** Quality & Testing Specification  
> **Parent Document:** [Project Bible](../PROJECT-BIBLE.md)  
> **Environment Setup:** [Environment Setup](./environment-setup.md)  
> **Git Workflow:** [Git Workflow](./git-workflow.md)  
> **Booking Engine:** [Booking Engine](../modules/booking-engine.md)  
> **Payments:** [Payments](../modules/payments.md)  
> **API Reference:** [API Reference](../api/api-reference.md)

---

# 1. Purpose

This document defines the testing strategy for STAYS.

The objective is to ensure that:

- business-critical functionality behaves correctly;
- users cannot bypass authorization;
- booking availability remains reliable;
- payment verification is secure;
- frontend flows remain usable;
- regressions are detected before integration or release.

---

# 2. Testing Philosophy

STAYS follows a layered testing strategy.

```text
                 ┌─────────────────────┐
                 │   End-to-End Tests  │
                 └──────────┬──────────┘
                            │
                 ┌──────────▼──────────┐
                 │ Integration Tests   │
                 └──────────┬──────────┘
                            │
                 ┌──────────▼──────────┐
                 │    Unit Tests       │
                 └──────────┬──────────┘
                            │
                 ┌──────────▼──────────┐
                 │ Static Verification │
                 │ Typecheck / Lint    │
                 └─────────────────────┘