# STAYS — Payments Module

> **Document Status:** Active  
> **Version:** 1.0  
> **Document Type:** Module Specification  
> **Parent Document:** [Project Bible](../PROJECT-BIBLE.md)  
> **Booking Engine:** [Booking Engine](./booking-engine.md)  
> **Authentication:** [Authentication](../api/authentication.md)  
> **Database Design:** [Database Design](../database/database-design.md)  
> **API Reference:** [API Reference](../api/api-reference.md)  
> **System Architecture:** [System Architecture](../architecture/system-architecture.md)

---

# 1. Purpose

The Payments Module is responsible for securely processing and verifying
payments associated with STAYS bookings.

The module provides the boundary between the internal STAYS booking system
and the external payment provider, Razorpay.

Its primary responsibilities are:

- creating payment orders;
- initiating the Razorpay payment flow;
- passing the authoritative booking amount to Razorpay;
- receiving payment information;
- verifying payment authenticity;
- updating internal payment state;
- confirming the associated booking after successful verification;
- handling payment failures;
- preventing duplicate payment processing;
- maintaining payment/booking consistency.

The Payments Module must never become the source of truth for stay
availability or booking eligibility.

---

# 2. Core Principle

> **The backend determines how much the user must pay. Razorpay processes the
> payment. The backend verifies the result before confirming the booking.**

The frontend must never be trusted to determine:

- payment amount;
- booking ownership;
- payment success;
- booking confirmation.

The authoritative flow is:

```text
Frontend
   │
   ▼
Booking Engine
   │
   │ validated booking + final amount
   ▼
Payments Module
   │
   ▼
Razorpay
   │
   │ payment result
   ▼
Payments Module
   │
   ▼
Server-side verification
   │
   ▼
Booking Confirmation