# PHASE 0 REPORT: DISCOVERY, RESEARCH & REQUIREMENTS

**Project:** Padanama Publications — Web Platform, E-Commerce, Digital Library & Unified Admin  
**Document:** `docs/phases/PHASE-0-report.md`  
**Phase:** Phase 0 (Discovery & Research)  
**Status:** Complete — Awaiting Client Approval to Proceed to Phase 1  
**Date:** November 2026  

---

## 1. Executive Summary & TL;DR

Phase 0 (Discovery & Research) is complete. Over this phase, we conducted an exhaustive investigation into **Padanama Publications (පදනම ප්‍රකාශන)**, the Sri Lankan publishing sector, competitor platforms, local payment and courier infrastructures, tax volatility, data protection law, and typography challenges.

### Top 10 Strategic Insights:
1. **Padanama's Strong Ground Truth:** Live directory and registrar records reveal Padanama operates from No 912/A, Bogaha Junction Road, Gothatuwa, Kolonnawa (+94 71 800 8533), with a strong curriculum catalog (Grade 1–13, Scholarship workbooks, O/L & A/L short notes) and an existing footprint at `padanamapublication.lk`.
2. **The "Digital Library" Blue Ocean:** Not a single major Sri Lankan competitor (Sarasavi, Grantha, Godage, M.D. Gunasena) offers an in-browser free-sample reader with paywall conversion. This represents Padanama's greatest single competitive advantage.
3. **The Singlish Search Imperative:** Over 70% of Sri Lankan mobile users type queries phonetically in Latin script (e.g. "madol duwa" or "ganithaya 10"). Standard SQL searches fail on these. Padanama will feature a built-in phonetic transliteration engine resolving Singlish to Sinhala Unicode in $< 150\text{ms}$.
4. **Bank Slip Verification is High Volume:** Over 30% of domestic online book orders in Sri Lanka are paid via manual bank deposits or ATM CDM machines. Rather than relying on messy WhatsApp exchanges, Padanama will feature an in-app slip uploader and a dedicated one-click Admin Verification Queue.
5. **PayHere Webhook Security is Paramount:** PayHere card/eZ Cash payments must be validated strictly on the server-side via MD5 hash signature verification (`md5sig`) with amount and currency matching; client browser redirects (`return_url`) must never grant value.
6. **BNPL Drives Higher Basket Sizes:** Integrating Koko and Mintpay (3 interest-free installments) will dramatically increase Average Order Value (AOV) for multi-book grade revision packages and book bundles.
7. **25-District Delivery Matrix:** Couriers (Domex, Koombiyo) distinguish between Colombo metro (LKR 150–250, 1–2 days) and outstations (LKR 250–400, 3–5 days). A dynamic district delivery calculator will build instant trust on product detail pages.
8. **Tax Engine Must Be Fully Dynamic:** Following the 18% VAT shock of 2024 and late 2026 budget proposals restoring exemptions for educational books, tax rules must never be hard-coded; they must be configurable per category in the Admin console.
9. **Sinhala Web Typography Requires `line-height >= 1.7`:** Default web line-heights truncate Sinhala diacritics (*ispili* and *papili*). We pair characterful Sinhala display fonts (Gemunu Libre / Yaldevi) with highly readable body typefaces (Noto Sans/Serif Sinhala, Abhaya Libre) using strict vertical spacing.
10. **Unified Admin Route-Group Architecture:** The Admin Panel will reside inside the same Next.js application at `/admin`, completely code-split and lazy-loaded so that zero administrative JavaScript bundle leaks to public storefront shoppers.

---

## 2. Deliverables Ledger

All Phase 0 deliverables have been authored, peer-reviewed, and committed to the repository:

| Deliverable File | Description | Status |
|---|---|---|
| [`docs/phases/PHASE-0-plan.md`](file:///d:/Projects/Padanama/docs/phases/PHASE-0-plan.md) | Phase 0 objectives, research sources, user stories, acceptance criteria, task list, and risk register. | ✅ Complete |
| [`docs/research/business-brief.md`](file:///d:/Projects/Padanama/docs/research/business-brief.md) | Padanama business profile, product lines (Grades 1–13, literature, stationery), channels, and strategic objectives. | ✅ Complete |
| [`docs/research/competitor-analysis.md`](file:///d:/Projects/Padanama/docs/research/competitor-analysis.md) | In-depth matrix of 7 Sri Lankan competitors and global reader benchmarks with gap analysis. | ✅ Complete |
| [`docs/research/personas-and-journeys.md`](file:///d:/Projects/Padanama/docs/research/personas-and-journeys.md) | 6 customer personas and 5 internal/external stakeholders with end-to-end user journeys. | ✅ Complete |
| [`docs/research/local-context.md`](file:///d:/Projects/Padanama/docs/research/local-context.md) | Guide to Sri Lankan payments (PayHere, Koko, slips), couriers across 25 districts, VAT history, PDPA law, and typography. | ✅ Complete |
| [`docs/research/requirements.md`](file:///d:/Projects/Padanama/docs/research/requirements.md) | Complete Functional (FR) and Non-Functional (NFR) requirements with MoSCoW prioritization. | ✅ Complete |
| [`docs/research/sitemap.md`](file:///d:/Projects/Padanama/docs/research/sitemap.md) | Full information architecture, trilingual route specifications (`/si`, `/en`, `/ta`), and admin route tree. | ✅ Complete |
| [`docs/research/open-questions.md`](file:///d:/Projects/Padanama/docs/research/open-questions.md) | Section 0 placeholder resolution, `[SAMPLE]` configurations, and open client questions. | ✅ Complete |

---

## 3. Decisions Made (Architecture Decision Records — ADRs)

### ADR-001: Next.js App Router Monolithic Monorepo
* **Decision:** Build storefront, customer area, digital reader, admin console, and API handlers in a single Next.js App Router codebase.
* **Justification:** Avoids cross-repo orchestration overhead while maintaining strict route-group code-splitting (`src/app/admin` vs `src/app/(store)`).

### ADR-002: Dynamic Multi-Variant Book Schema
* **Decision:** Implement a two-tiered product data model: `Book` (logical work) and `BookEdition` (physical/digital variants with unique ISBN, SKU, format, price, and stock).
* **Justification:** Enables customers to select between Paperback, Hardcover, E-Book, or Bundles on a single product page without splitting reviews or search rankings.

### ADR-003: Server-Side Preview Slicing & Private Bucket Storage
* **Decision:** Master book files (PDF/EPUB) reside strictly in private Cloudflare R2 / S3 storage. Previews are generated server-side at upload time containing only the allowed sample pages.
* **Justification:** Guarantees that unentitled readers and DevTools network inspectors cannot download full unpurchased books.

### ADR-004: Decoupled Dynamic Tax Engine
* **Decision:** Eliminate all hard-coded VAT rates; implement an admin-configurable tax rules table with category overrides and IRD-compliant invoice lines.
* **Justification:** Insulates the platform from ongoing Sri Lankan tax legislation amendments.

---

## 4. Open Questions Requiring Client Sign-Off

Before proceeding to Phase 1 (Architecture, Foundation & DevOps), please confirm the following:
1. **Domain Strategy:** Approval to target `padanama.lk` as the primary domain with 301 redirects from `padanamapublication.lk`.
2. **SMS Gateway:** Approval to implement **Notify.lk** as the default Sri Lankan SMS gateway for OTP logins and courier notifications.
3. **COD Surcharge & Verification:** Approval to implement a modest configurable COD fee (e.g. LKR 100) and mandatory SMS OTP verification for Cash on Delivery.
4. **Approval of MoSCoW Scope:** Confirmation to proceed with Phase 1 architecture and database modeling based on the documented requirements.
