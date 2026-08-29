# STAYS — API Reference

> **Document Status:** Active  
> **Version:** 1.0  
> **Document Type:** API Reference & Contract Specification  
> **Parent Document:** [Project Bible](../PROJECT-BIBLE.md)  
> **Architecture:** [System Architecture](../architecture/system-architecture.md)

---

# 1. Purpose

This document defines the HTTP API contract for the STAYS platform.

It specifies:

- API conventions;
- request and response formats;
- authentication requirements;
- resource boundaries;
- endpoint structure;
- validation expectations;
- error handling;
- booking workflow;
- payment workflow;
- HTTP status conventions.

This document acts as the primary communication contract between the
frontend and backend teams.

The API is designed around a REST-style HTTP/JSON interface.

---

# 2. API Design Principles

The STAYS API follows these principles:

1. The backend is the source of truth for business operations.
2. All business-critical operations are validated server-side.
3. Authentication is enforced by the backend.
4. Authorization is enforced server-side.
5. Client-provided prices are never trusted.
6. Client-provided availability is never trusted.
7. Payment confirmation requires server-side verification.
8. API responses use predictable JSON structures.
9. Errors use appropriate HTTP status codes.
10. Database implementation details should not unnecessarily leak through the
   API.

---

# 3. Base URL

The API is exposed under a versioned API namespace.

```text
/api/v1