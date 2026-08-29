# STAYS — System Architecture

> **Document Status:** Active  
> **Version:** 1.0  
> **Document Type:** System Architecture Specification  
> **Parent Document:** [Project Bible](../PROJECT-BIBLE.md)

---

# 1. Purpose

This document defines the technical architecture of the STAYS platform.

It establishes:

- system boundaries;
- application layers;
- frontend and backend responsibilities;
- core backend modules;
- external service boundaries;
- data ownership;
- request and response flow;
- authentication flow;
- stay discovery flow;
- map integration;
- booking architecture;
- availability validation;
- pricing architecture;
- payment architecture;
- security boundaries;
- testing boundaries;
- deployment direction; and
- architectural constraints.

This document defines **how STAYS is structured technically**.

Detailed implementation specifications belong to the corresponding API,
database, module, development, and deployment documentation.

---

# 2. Architectural Goals

The architecture is designed around the following goals:

1. Keep the first release small and understandable.
2. Maintain clear separation between frontend and backend.
3. Keep business-critical logic server-authoritative.
4. Protect authentication and payment boundaries.
5. Maintain relational data integrity.
6. Make critical business logic independently testable.
7. Allow future expansion without requiring a complete rewrite.
8. Avoid unnecessary architectural complexity.
9. Keep development practical for a three-member team.
10. Follow production-oriented engineering practices without introducing
   production-scale infrastructure prematurely.

---

# 3. High-Level Architecture

STAYS follows a modular full-stack architecture consisting of a Next.js
frontend, a NestJS backend, PostgreSQL persistence, and controlled external
service integrations.

```text
                         ┌─────────────────────┐
                         │       Browser       │
                         │                     │
                         │      STAYS UI       │
                         └──────────┬──────────┘
                                    │
                              HTTPS / JSON
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Next.js App     │
                         │      Frontend       │
                         │                     │
                         │ Pages / Components  │
                         │ Client State        │
                         │ API Client          │
                         └──────────┬──────────┘
                                    │
                              HTTP / JSON
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     NestJS API      │
                         │      Backend        │
                         │                     │
                         │ Authentication      │
                         │ Users               │
                         │ Stays               │
                         │ Bookings            │
                         │ Payments            │
                         └──────┬───────┬──────┘
                                │       │
                         Prisma │       │ HTTPS / API
                                │       │
                                ▼       ▼
                     ┌──────────────┐ ┌──────────────┐
                     │  PostgreSQL  │ │   Razorpay   │
                     │              │ │              │
                     │ System of    │ │ Payment      │
                     │ Record       │ │ Provider     │
                     └──────────────┘ └──────────────┘

                                    │
                                    ▼
                              Map Provider