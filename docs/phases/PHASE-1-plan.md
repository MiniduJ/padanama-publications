# PHASE 1 PLAN: Architecture, Foundation & DevOps

**Project:** Padanama Publications — Web Platform, E-Commerce, Digital Library & Unified Admin  
**Document:** `docs/phases/PHASE-1-plan.md`  
**Phase:** Phase 1 (Architecture, Foundation & DevOps)  
**Status:** In Progress  
**Date:** November 2026  

---

## 1. Phase Objectives

The purpose of Phase 1 is to construct a rock-solid, production-grade architectural chassis for the Padanama platform:
1. **Next.js Foundation:** Scaffold a modern Next.js (App Router) + TypeScript (strict mode) application with Tailwind CSS and atomic directory segregation.
2. **Comprehensive Prisma Data Model:** Implement all 35+ domain models covering the entire catalog, multi-variants, orders, payments, digital library entitlements, reading progress, reviews, dynamic tax, 25-district shipping, marketing, and immutable audit logs.
3. **Pluggable Payment & SMS Architecture:** Formalize clean interfaces for PayHere (cryptographic MD5 verification), WebXPay, Koko, Bank Transfer, and SMS Lenz (+94 OTP and order dispatch).
4. **Trilingual Localization Engine (`next-intl`):** Configure locale routing for Sinhala (`/si` as default), English (`/en`), and Tamil (`/ta`) with full dictionary support, `hreflang` canonical headers, and cookie persistence.
5. **Database Seeding:** Populate PostgreSQL with realistic `[SAMPLE]` curriculum workbooks, Sinhala novels, translations, authors, nested categories, and 25-district shipping zones.
6. **Containerization & Health Check:** Deliver a clean `docker-compose.yml` for local PostgreSQL and Redis, accompanied by a structured `/api/health` diagnostic endpoint.
7. **Automated CI/CD Pipeline:** Configure GitHub Actions for linting, typechecking, unit testing (Vitest), Prisma schema verification, and build validation.
8. **DevOps Documentation & ADRs:** Author formal Architecture Decision Records (ADRs), Mermaid Architecture & ERD diagrams, `.env.example`, and an operational `README.md`.

---

## 2. Research Findings & Tech Stack Selection

| Component | Selected Technology | Version / Specification | Justification & Research Basis |
|---|---|---|---|
| **Framework** | Next.js (App Router) | Latest Stable (v15+) | React Server Components minimize bundle weight on mobile 4G; nested layouts enable route-group separation (`(store)`, `(account)`, `(reader)`, `admin`). |
| **Language** | TypeScript | Strict Mode (`5.x`) | Enforces compile-time type safety across database entities, API contracts, and trilingual translation keys. |
| **Styling** | Tailwind CSS + CSS Variables | Tailwind v3/v4 | Custom tokens for Sri Lankan cultural palette (`--maroon`, `--saffron`, `--gold`, `--green`), native dark mode, zero runtime CSS overhead. |
| **Database & ORM** | PostgreSQL + Prisma ORM | PostgreSQL 16 + Prisma | Industry standard relational data modeling with automated migrations, type-safe queries, connection pooling, and full-text search capability. |
| **Localization** | `next-intl` | Latest | High-performance server-side message rendering, automatic locale detection, prefix routing (`/si`, `/en`, `/ta`), and strict key typing. |
| **Validation** | Zod | `3.x` | Shared client/server boundary validation schemas for checkout, authentication, API routes, and CSV bulk uploads. |
| **Testing** | Vitest | Latest | Lightning-fast ESM unit testing compatible with Next.js and TypeScript. |
| **Payment Adapter** | PayHere + WebXPay + Koko | Custom Modular Adapters | Implements PayHere's official MD5 hash checkout and `notify_url` signature validation with full raw webhook logging. |
| **SMS Gateway** | SMS Lenz (`smslenz.lk`) | Custom Adapter | High-reliability Sri Lankan SMS delivery across Dialog, Mobitel, Hutch, and Airtel networks for +94 OTP and order tracking. |

---

## 3. User Stories & Acceptance Criteria

### User Stories
- **US-1.1 (Developer Experience):** As a developer, I can run `docker compose up -d` and `npm run dev` to have a fully operational local environment with database migrations applied and seed data populated.
- **US-1.2 (Trilingual Navigation):** As a visitor, I can navigate between `/si`, `/en`, and `/ta` with Sinhala served seamlessly as the default language.
- **US-1.3 (System Observability):** As an SRE, I can query `/api/health` to verify database connectivity, uptime, and system status in $< 50\text{ms}$.
- **US-1.4 (Data Integrity):** As an accountant and publisher, monetary values are recorded in integer cents (e.g., LKR 1,250.00 stored as `125000`) to completely eliminate floating-point rounding errors.

### Acceptance Criteria
- [x] Next.js App Router codebase initialized with strict TypeScript.
- [x] Monorepo directory structure established: `(store)`, `(account)`, `(reader)`, `admin`, `api`, `server`, `lib`, `components`, `prisma`, `tests`.
- [x] Complete Prisma schema containing all 35+ domain models compiling cleanly without warnings.
- [x] Seed script populates realistic Sri Lankan books, authors, categories, and 25-district shipping rates.
- [x] `next-intl` routing active for `si`, `en`, and `ta`.
- [x] Unit tests passing with Vitest (`npm run test`).
- [x] `npm run build` succeeds with zero TypeScript and lint errors.
- [x] `/api/health` endpoint responds with HTTP 200 and structured JSON diagnostics.
- [x] Comprehensive documentation delivered: ADRs, Architecture Diagram, Mermaid ERD, `.env.example`, `README.md`.

---

## 4. Task Breakdown

- [x] Task 1.1: Scaffold Next.js project with TypeScript, Tailwind CSS, and path aliases.
- [x] Task 1.2: Configure `next-intl` trilingual middleware and translation messages (`si.json`, `en.json`, `ta.json`).
- [x] Task 1.3: Author complete `prisma/schema.prisma` covering all required business domains.
- [x] Task 1.4: Implement database seed script (`prisma/seed.ts`) with authentic Sri Lankan books and districts.
- [x] Task 1.5: Build server architecture (`src/server/`): PaymentProvider interface (PayHere, WebXPay, Koko, Bank, COD) and SmsProvider interface (SMS Lenz).
- [x] Task 1.6: Implement `/api/health` route handler.
- [x] Task 1.7: Configure `docker-compose.yml` for PostgreSQL and Redis.
- [x] Task 1.8: Set up Vitest test suite with unit tests for currency, transliteration, and PayHere signature verification.
- [x] Task 1.9: Configure GitHub Actions CI workflow (`.github/workflows/ci.yml`).
- [x] Task 1.10: Author ADRs (`ADR-001` through `ADR-005`), ERD diagram, Architecture diagram, `.env.example`, and `README.md`.
- [x] Task 1.11: Validate build (`npm run build`) and tests (`npm run test`).
- [x] Task 1.12: Commit deliverables to branch `phase-1/architecture-and-foundation` and write Phase 1 Report.
