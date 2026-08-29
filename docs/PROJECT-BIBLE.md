# STAYS — Project Bible

> **Document Status:** Active  
> **Version:** 1.0  
> **Document Type:** Master Project Specification  
> **Purpose:** Product, technical and implementation source of truth

---

# 1. Document Purpose

This document is the authoritative specification for the **STAYS** project.

It defines the product vision, scope, functional requirements, technical
direction, architecture principles, core modules, user journeys, engineering
standards, team responsibilities, and implementation boundaries for the
first release.

All major implementation decisions should remain consistent with this
document.

If a requirement changes, this document should be updated before or alongside
the corresponding implementation.

---

# 2. Project Overview

## 2.1 Project Name

**STAYS**

## 2.2 Project Type

Full-stack hospitality stay discovery and booking platform.

## 2.3 Project Objective

STAYS is a focused demonstration project designed to implement a complete,
production-oriented stay-booking journey without the complexity of a
large-scale hospitality marketplace.

The platform allows a user to:

1. Discover available stays.
2. View detailed information about a stay.
3. Locate the stay on an interactive map.
4. Select booking dates and guest count.
5. Validate availability.
6. Calculate the booking price on the server.
7. Create a booking.
8. Pay through Razorpay.
9. Verify the payment on the backend.
10. Receive booking confirmation.
11. View their bookings from the dashboard.

The project is intentionally limited in scope so that the team can focus on
building a complete, reliable and well-engineered transaction flow.

---

# 3. Product Vision

The vision of STAYS is:

> **Build a small but production-oriented hospitality booking platform that
> demonstrates the complete journey from stay discovery to verified booking
> and payment.**

The project is not intended to compete with large hospitality platforms.

Instead, it demonstrates the team's ability to:

- design a complete full-stack system;
- separate frontend and backend responsibilities;
- model real-world booking data;
- implement server-authoritative business logic;
- integrate third-party services;
- secure payment workflows;
- test important business rules;
- document technical decisions; and
- collaborate using professional engineering practices.

---

# 4. Project Goals

## 4.1 Primary Goals

The first release must provide:

- A professional landing page.
- User registration.
- User login.
- Authenticated dashboard.
- Mock/seeded stay catalogue.
- Stay discovery.
- Individual stay details.
- Interactive map visualization.
- Stay pricing information.
- Date selection.
- Guest selection.
- Availability validation.
- Server-side price calculation.
- Booking creation.
- Razorpay payment integration.
- Server-side payment verification.
- Booking confirmation.
- Booking history.
- Automated testing for critical business logic.

## 4.2 Engineering Goals

The project should demonstrate:

- Modular architecture.
- Clear frontend/backend separation.
- Type-safe development.
- Relational database modelling.
- Secure authentication.
- Server-side authorization.
- Server-side business validation.
- Idempotent payment handling.
- Reliable booking state transitions.
- Automated testing.
- Environment-based configuration.
- Clean Git workflow.
- Maintainable documentation.

---

# 5. Project Scope

## 5.1 In Scope

The first release contains the following functional areas:

### Public Experience

- Landing page.
- Basic product presentation.
- Stay discovery entry point.
- Registration.
- Login.

### User Dashboard

- Authenticated user dashboard.
- User profile/basic account information.
- Booking history.
- Booking status.
- Booking details.

### Stay Catalogue

- List of available stays.
- Mock/seeded stay data.
- Stay cards.
- Stay images.
- Stay name.
- Location.
- Price information.
- Basic stay attributes.

### Stay Details

A user can open a specific stay and view:

- Stay name.
- Description.
- Images.
- Location.
- Map.
- Rate.
- Guest capacity.
- Relevant stay information.
- Booking controls.

### Maps

The selected stay must be represented on an interactive map.

The map should:

- display the stay location;
- display a map marker;
- associate the marker with the selected stay;
- expose relevant stay information when appropriate.

The final map provider will be selected during implementation and documented
in the architecture documentation.

### Booking Engine

The booking engine must support:

- Date selection.
- Guest selection.
- Availability validation.
- Price calculation.
- Booking summary.
- Booking creation.
- Booking status management.

### Payments

Razorpay will be used for payment processing.

The payment flow must include:

- Server-side order creation.
- Razorpay checkout.
- Payment response handling.
- Server-side payment verification.
- Booking confirmation only after successful verification.

### Testing

Critical backend/business logic must have automated test coverage.

---

# 6. Explicitly Out of Scope

The following features are **not part of the first release**:

- Host dashboard.
- Host onboarding.
- Host payouts.
- Admin dashboard.
- Admin CMS.
- AI trip planner.
- AI assistant.
- Experiences marketplace.
- Membership system.
- Referral system.
- Advanced messaging.
- Guest assistance system.
- SOS system.
- Investment management.
- Advanced loyalty programs.
- Multi-property host management.
- Complex pricing automation.
- Production-scale recommendation engine.
- Advanced analytics.
- Multi-region infrastructure.
- Microservice architecture.

These may be considered future extensions but must not be partially implemented
during the first release unless the project scope is formally changed.

---

# 7. Target Users

## 7.1 Guest / Customer

The primary user of the platform.

The guest should be able to:

- register;
- log in;
- browse stays;
- inspect a stay;
- view its map location;
- select dates;
- select guests;
- view final pricing;
- book;
- pay;
- receive confirmation;
- review previous bookings.

## 7.2 Project Team

The development team uses the platform as a demonstration of production-style
full-stack engineering.

---

# 8. Core User Journey

The primary user journey is:

```text
Landing Page
      │
      ▼
Register / Login
      │
      ▼
User Dashboard
      │
      ▼
Browse Stays
      │
      ▼
Select Stay
      │
      ▼
Stay Details
      │
      ├──────────────► Interactive Map
      │
      ▼
Select Dates + Guests
      │
      ▼
Availability Validation
      │
      ▼
Server-side Price Calculation
      │
      ▼
Booking Summary
      │
      ▼
Create Booking / Payment Order
      │
      ▼
Razorpay Checkout
      │
      ▼
Server-side Payment Verification
      │
      ▼
Booking Confirmation
      │
      ▼
My Bookings