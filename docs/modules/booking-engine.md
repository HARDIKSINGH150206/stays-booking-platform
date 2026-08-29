# STAYS — Booking Engine Module

> **Document Status:** Active  
> **Version:** 1.0  
> **Document Type:** Module Specification  
> **Parent Document:** [Project Bible](../PROJECT-BIBLE.md)  
> **Stay Module:** [Stays](./stays.md)  
> **Maps Module:** [Maps](./maps.md)  
> **Payments Module:** [Payments](./payments.md)  
> **Authentication:** [Authentication](../api/authentication.md)  
> **System Architecture:** [System Architecture](../architecture/system-architecture.md)  
> **Database Design:** [Database Design](../database/database-design.md)  
> **API Reference:** [API Reference](../api/api-reference.md)

---

# 1. Purpose

The Booking Engine is the core transactional module of STAYS.

Its responsibility is to convert a user's selected stay, dates, and guest
count into a validated booking request.

The Booking Engine is responsible for:

- validating booking input;
- validating the authenticated user;
- validating stay eligibility;
- validating guest capacity;
- checking date availability;
- calculating the booking price;
- preventing invalid or conflicting bookings;
- creating the booking;
- creating the payment-ready state;
- handing payment processing to the Payments module;
- updating the booking after payment verification.

The Booking Engine is the **authoritative source for booking rules and final
booking calculations**.

---

# 2. Core Principle

> **The frontend requests a booking; the backend decides whether the booking
> is valid.**

The frontend must never be treated as the authority for:

- availability;
- final price;
- guest capacity;
- booking status;
- payment status.

Conceptually:

```text
Frontend
   │
   │ booking request
   ▼
Backend Booking Engine
   │
   ├── Validate User
   ├── Validate Stay
   ├── Validate Dates
   ├── Validate Guests
   ├── Check Availability
   ├── Calculate Price
   └── Create Booking
          │
          ▼
      Payment Flow