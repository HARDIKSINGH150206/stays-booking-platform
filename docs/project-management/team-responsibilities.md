# STAYS — Team Responsibilities

> **Document Status:** Active  
> **Version:** 1.0  
> **Document Type:** Project Management & Ownership Specification  
> **Parent Document:** [Project Bible](../PROJECT-BIBLE.md)  
> **System Architecture:** [System Architecture](../architecture/system-architecture.md)  
> **Development Guide:** [Development Guide](../development/environment-setup.md)  
> **Git Workflow:** [Git Workflow](../development/git-workflow.md)  
> **Testing Strategy:** [Testing Strategy](../development/testing-strategy.md)  
> **Implementation Roadmap:** [Implementation Roadmap](./implementation-roadmap.md)

---

# 1. Purpose

This document defines the responsibilities and ownership structure for the
three-member STAYS development team.

The objective is to ensure:

- clear ownership;
- minimal responsibility overlap;
- predictable collaboration;
- accountable delivery;
- clean module boundaries;
- effective code review;
- smooth integration between frontend and backend;
- consistent engineering standards.

The team is intentionally small, so each member may contribute outside their
primary ownership area when required.

---

# 2. Team Structure

STAYS is developed by a three-member team.

The recommended ownership model is:

```text
                    STAYS PROJECT
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
       MEMBER 1       MEMBER 2       MEMBER 3
       Frontend       Backend/API     Integration
       & UX           & Database      & Payments/QA