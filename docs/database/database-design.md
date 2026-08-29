# STAYS — Database Design

> **Document Status:** Active  
> **Version:** 1.0  
> **Document Type:** Database Design Specification  
> **Parent Document:** [Project Bible](../PROJECT-BIBLE.md)  
> **System Architecture:** [System Architecture](../architecture/system-architecture.md)  
> **API Reference:** [API Reference](../api/api-reference.md)

---

# 1. Purpose

This document defines the database architecture and data model for the STAYS
platform.

It describes:

- database technology;
- database responsibilities;
- entities;
- attributes;
- relationships;
- primary keys;
- foreign keys;
- constraints;
- indexes;
- booking data;
- payment data;
- stay location data;
- user data;
- data ownership;
- lifecycle rules;
- transaction requirements;
- consistency requirements;
- indexing strategy;
- data integrity rules;
- development and production database practices.

This document is the authoritative human-readable specification for the STAYS
database model.

---

# 2. Database Technology

STAYS uses:

```text
Database: PostgreSQL
ORM: Prisma
Application: NestJS
Language: TypeScript