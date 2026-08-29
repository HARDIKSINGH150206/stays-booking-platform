# STAYS — Stay Catalogue & Stay Details Module

> **Document Status:** Active  
> **Version:** 1.0  
> **Document Type:** Module Specification  
> **Parent Document:** [Project Bible](../PROJECT-BIBLE.md)  
> **System Architecture:** [System Architecture](../architecture/system-architecture.md)  
> **Database Design:** [Database Design](../database/database-design.md)  
> **API Reference:** [API Reference](../api/api-reference.md)

---

# 1. Purpose

The Stay Catalogue & Stay Details module is responsible for allowing users
to discover available stays and inspect an individual stay before beginning
the booking process.

The module provides the bridge between:

```text
Landing Page
     │
     ▼
Stay Discovery
     │
     ▼
Stay Details
     │
     ▼
Booking Engine