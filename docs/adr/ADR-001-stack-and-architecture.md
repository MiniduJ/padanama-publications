# ADR-001: Next.js App Router Architecture, Monolith Repository & Trilingual Strategy

**Status:** Accepted  
**Date:** November 2026  
**Deciders:** Solution Architect, Full-Stack Lead  

---

## 1. Context & Problem Statement
Padanama Publications requires a production-ready, trilingual e-commerce platform with a digital sample reader and a staff administrative console. Traditional approaches often separate the storefront and administrative panel into distinct repositories or deployments, which creates maintenance friction, duplication of data models, and high operational overhead.

## 2. Decision
We have decided to build the platform as a **single Next.js (App Router) monolithic repository** with strict route-group isolation:
1. `src/app/[locale]/(store)`: Public storefront routes utilizing `next-intl` localization with Sinhala (`/si`) as default, English (`/en`), and Tamil (`/ta`).
2. `src/app/[locale]/(account)`: Authenticated customer portal for order history, bank slip uploads, and purchased e-books.
3. `src/app/[locale]/(reader)`: Dedicated distraction-free digital sample reader with configurable paywall boundaries.
4. `src/app/admin`: Role-guarded administrative console that is **dynamically code-split and lazy-loaded** so no administrative code or dependencies leak into public customer bundles.
5. `src/app/api`: Edge and Node.js route handlers for cryptographic payment webhooks and system health diagnostics.

## 3. Consequences
- **Positive:** Single deployment pipeline, shared TypeScript types across client and server boundaries, atomic database migrations, and zero CORS complexities.
- **Negative:** Middleware must carefully separate localized routes (`/[locale]/...`) from administrative (`/admin/...`) and API endpoints (`/api/...`).
- **Mitigation:** Implemented explicit routing matcher and custom route discrimination in `src/middleware.ts`.
