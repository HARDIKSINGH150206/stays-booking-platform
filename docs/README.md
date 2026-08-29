# STAYS — Project Documentation

Welcome to the documentation repository for **STAYS**, a production-oriented
demo hospitality booking platform.

STAYS is a focused full-stack project designed to demonstrate the complete
journey from stay discovery to a verified booking and payment.

The project intentionally keeps the first release compact while following
production-grade engineering practices such as modular architecture,
server-side business validation, relational data modelling, automated
testing, secure payment verification, and disciplined Git workflows.

---

## 1. Project Overview

STAYS provides a simplified stays-booking experience consisting of:

- Public landing page
- User registration and login
- Authenticated user dashboard
- Mock/seeded stay catalogue
- Individual stay details
- Interactive map-based stay location
- Date and guest selection
- Availability validation
- Server-side booking and price calculation
- Razorpay payment integration
- Payment verification
- Booking confirmation
- User booking history

The first version intentionally excludes advanced hospitality-platform
features such as host management, administration, AI trip planning,
experiences, memberships, advanced messaging, and payout management.

For the complete product definition, refer to:

**[Project Bible](./PROJECT-BIBLE.md)**

---

## 2. Documentation Structure

The documentation is organized by responsibility rather than by development
timeline.

```text
docs/
│
├── README.md
├── PROJECT-BIBLE.md
│
├── architecture/
│   ├── system-architecture.md
│   ├── backend-architecture.md
│   └── frontend-architecture.md
│
├── api/
│   ├── api-reference.md
│   └── authentication.md
│
├── database/
│   ├── database-design.md
│   └── er-diagram.md
│
├── modules/
│   ├── authentication.md
│   ├── stays.md
│   ├── maps.md
│   ├── booking-engine.md
│   ├── payments.md
│   └── dashboard.md
│
├── development/
│   ├── development-guide.md
│   ├── environment-setup.md
│   ├── git-workflow.md
│   └── testing-strategy.md
│
├── deployment/
│   ├── deployment-guide.md
│   └── environment-variables.md
│
├── project-management/
│   ├── team-responsibilities.md
│   ├── implementation-roadmap.md
│   └── definition-of-done.md
│
├── decisions/
│   └── architecture-decision-records.md
│
└── CHANGELOG.md