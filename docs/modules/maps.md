# STAYS — Maps & Location Module

> **Document Status:** Active  
> **Version:** 1.0  
> **Document Type:** Module Specification  
> **Parent Document:** [Project Bible](../PROJECT-BIBLE.md)  
> **Stay Module:** [Stays](./stays.md)  
> **System Architecture:** [System Architecture](../architecture/system-architecture.md)  
> **Database Design:** [Database Design](../database/database-design.md)  
> **API Reference:** [API Reference](../api/api-reference.md)

---

# 1. Purpose

The Maps & Location module provides geographic context for stays listed on
the STAYS platform.

Its primary responsibility is to display the location of an individual stay
on an interactive map and associate that location with the stay's displayed
price and basic identifying information.

The module is intentionally lightweight.

It is not intended to become a general-purpose navigation, routing, or travel
planning system.

---

# 2. Module Scope

The initial release includes:

- stay latitude;
- stay longitude;
- interactive map;
- stay marker;
- price displayed on/near the marker;
- stay title/location context;
- map centering;
- map zoom;
- navigation between stay details and map context.

The initial release does not include:

- turn-by-turn navigation;
- route planning;
- distance calculation;
- nearby-place discovery;
- geocoding;
- reverse geocoding;
- map-based stay search;
- polygon-based search;
- marker clustering;
- traffic information;
- travel-time estimation.

These capabilities may be introduced in future versions.

---

# 3. Role in the Product

The map exists primarily to answer:

> **"Where is this stay located?"**

The user journey is:

```text
Stay Catalogue
      │
      ▼
Stay Details
      │
      ├───────────────┐
      │               │
      ▼               ▼
Stay Information     Map
      │               │
      └───────┬───────┘
              │
              ▼
        Book This Stay