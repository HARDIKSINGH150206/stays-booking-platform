# STAYS — Environment Setup Guide

> **Document Status:** Active  
> **Version:** 1.0  
> **Document Type:** Development Guide  
> **Parent Document:** [Project Bible](../PROJECT-BIBLE.md)  
> **System Architecture:** [System Architecture](../architecture/system-architecture.md)  
> **API Reference:** [API Reference](../api/api-reference.md)  
> **Testing Strategy:** [Testing Strategy](./testing-strategy.md)  
> **Git Workflow:** [Git Workflow](./git-workflow.md)

---

# 1. Purpose

This document defines the standard local development environment for the
STAYS project.

The goal is to ensure that all contributors can:

- install the project consistently;
- configure required environment variables;
- run the frontend and backend;
- initialize the database;
- execute tests;
- perform local development without modifying production configuration.

---

# 2. Development Philosophy

STAYS follows a production-oriented development approach even though the
initial project is a focused demo platform.

The local environment should therefore resemble the production architecture
where practical.

The development environment must support:

```text
Frontend
Backend API
Database
Payment Integration
Authentication
Testing