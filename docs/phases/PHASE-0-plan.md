# PHASE 0 PLAN: Discovery, Market Research & Requirements Specification

**Project:** Padanama Publications — Web Platform, E-Commerce, Digital Library & Unified Admin  
**Document:** `docs/phases/PHASE-0-plan.md`  
**Phase:** Phase 0 (Discovery & Research)  
**Status:** In Progress / Pending Client Sign-Off  
**Date:** November 2026  

---

## 1. Phase Objectives

The objective of Phase 0 is to establish an unshakeable architectural, business, and user-experience foundation for the Padanama Publications platform before a single line of production code is written.

Specific goals:
1. **Business Discovery:** Formulate a comprehensive profile of Padanama Publications (පදනම ප්‍රකාශන), synthesizing its historical publishing footprint, target reader demographics, product catalog, sales channels, and operational workflows.
2. **Competitor & Market Benchmarking:** Systematically evaluate the strengths, failures, and technical gaps of major Sri Lankan bookstores (Sarasavi, Grantha, Godage, M.D. Gunasena, Vijitha Yapa, Jumpbooks, Booxworm) and international reader benchmarks (Kindle, Google Play Books).
3. **Local Context Research:** Detail the operational realities of Sri Lankan e-commerce: PayHere/WebXPay payment gateways, KOKO/Mintpay BNPL, bank-slip manual verification, islandwide courier networks (Domex, Koombiyo, Pronto, SL Post) across all 25 districts, current VAT taxation rules, PDPA (Personal Data Protection Act No. 9 of 2022) legal compliance, and Sinhala/Tamil web typography with Singlish transliteration search.
4. **Stakeholder Modeling:** Create representative personas and end-to-end journey maps for readers, parents, students, diaspora, school librarians, resellers, and internal administrative staff.
5. **Requirements Engineering:** Produce an exhaustive functional and non-functional requirements specification prioritized under the MoSCoW framework.
6. **Information Architecture:** Construct a full sitemap with trilingual routing specifications (`/si`, `/en`, `/ta`) and admin route separation.
7. **Open Decisions & Risk Register:** Highlight all unconfirmed client inputs with clearly labeled `[SAMPLE]` defaults and architectural mitigations.

---

## 2. Research Findings & Source Citations

| Area | Key Findings | Primary Sources / Evidence |
|---|---|---|
| **Padanama Business Profile** | Padanama Publication (පදනම ප්‍රකාශන) operates from No 912/A, Bogaha Junction Road, Gothatuwa/Kolonnawa, Colombo. Focuses heavily on curriculum-aligned educational titles (Grades 1–13, term papers, short notes, O/L, A/L), children's workbooks, alongside general literature. Primary sales channels include WhatsApp direct orders (+94 71 800 8533), retail partnerships, and basic web cart. | [Padanama Publication Official Site](https://www.padanamapublication.lk), [LOL.lk Business Directory](https://lol.lk) |
| **Competitor Digital Library Gap** | None of the established Sri Lankan bookstores (Sarasavi, Grantha, Godage) offer an in-browser digital reader with free preview sample limits and seamless paywall conversion. Grantha provides "My Library" purely as a reading tracker. This represents Padanama's highest-leverage competitive differentiator. | [Grantha.lk](https://grantha.lk), [Sarasavi.lk](https://sarasavi.lk), [Godage.com](https://godage.com) |
| **Payment Ecosystem** | Credit/debit card processing via PayHere requires strict server-to-server webhook verification using an MD5 signature hash `strtoupper(md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + strtoupper(md5(merchant_secret))))`. Webhooks must be verified idempotently. Bank transfer with manual slip upload remains high-volume (>30% of online Sri Lankan transactions). BNPL (Koko/Mintpay) is essential for higher basket sizes. | [PayHere Developer Docs](https://support.payhere.lk), Central Bank of Sri Lanka Payments Bulletin |
| **Logistics & Courier Delivery** | Islandwide delivery spans 9 provinces and 25 districts. Domex and Koombiyo are the dominant e-commerce logistics providers. Colombo/suburb delivery typically costs LKR 150–250 (1–2 days); outstation/remote districts cost LKR 250–400 (3–5 days). Cash on Delivery (COD) carries a 2–3% handling surcharge and requires fraud verification mechanisms (e.g., SMS OTP or WhatsApp confirmation). | [Domex Logistics](https://domex.lk), [Koombiyo Delivery](https://koombiyodelivery.lk) |
| **Taxation & VAT Shifts** | Under the VAT (Amendment) Act No. 32 of 2023, printed books faced an 18% VAT starting Jan 1, 2024. However, nationwide educational pushback led to late 2026 budget policy reversals restoring VAT exemptions for printed and educational books. *Architecture Requirement:* Tax calculation must remain 100% dynamic and configurable via Admin Settings. | [Inland Revenue Department Sri Lanka](http://www.ird.gov.lk), [Lanka Business Online](https://www.lankabusinessonline.com) |
| **PDPA Privacy Law** | Personal Data Protection Act No. 9 of 2022 mandates lawful processing, explicit consent collection, strict purpose limitation, privacy notices in Sinhala, Tamil, and English, data subject rights (access, correction, erasure/forgetting), and security standards. | [DPA Sri Lanka](https://www.dpa.gov.lk), Sri Lanka Parliament Acts |
| **Typography & Search** | Sinhala text requires line-height $\ge 1.7$ to prevent diacritic glyph clipping (e.g., ispilla, papilla). Singlish transliteration (phonetic Latin $\to$ Sinhala Unicode) is vital for usability because over 70% of mobile users type in Latin characters (e.g. "madol duwa" for "මඩොල් දූව"). | Google Fonts (Noto Sans/Serif Sinhala, Abhaya Libre, Yaldevi), Unicode Consortium 15.0 |

---

## 3. User Stories

### Reader & Shopper Stories
- **US-01 (Catalog Browsing):** As a student or parent, I want to filter books by grade, exam level, subject, and medium so that I can immediately find the exact model papers or textbooks needed.
- **US-02 (Singlish Search):** As a mobile user who cannot easily type Sinhala Unicode characters, I want to type "ganithaya 10" in the search box and receive results for "ගණිතය 10 ශ්‍රේණිය".
- **US-03 (Digital Sample Reading):** As a reader evaluating a novel, I want to read the first 20 pages or 2 chapters in a distraction-free web reader without downloading an unencrypted PDF so that I can decide if I want to buy it.
- **US-04 (Paywall Conversion):** As a reader reaching the sample limit in the reader, I want to see a clear paywall offering one-click purchase of the printed book or e-book, returning me seamlessly to my reading spot upon checkout.
- **US-05 (Flexible Payment):** As a Sri Lankan customer, I want to pay via PayHere (card/eZ Cash/Genie), Koko 3-month installments, bank slip upload, or Cash on Delivery (COD) depending on my financial situation.
- **US-06 (Order Tracking):** As a customer, I want to receive real-time SMS updates with a courier tracking link when my parcel is packed and handed over to Domex/Koombiyo.

### Administrative & Operations Stories
- **US-07 (Unified Admin):** As a store administrator, I want to access the admin panel directly at `/admin` within the same web application, guarded by strict role-based access control, without loading heavy administrative code into public customer bundles.
- **US-08 (Sample Rule Configuration):** As a digital librarian/editor, I want to upload a book's PDF/EPUB and configure exact sample limits (page range, percentage, or specific chapters) with a live preview of where the paywall triggers.
- **US-09 (Bank Slip Verification):** As an accountant, I want to view uploaded bank deposit slips in a dedicated verification queue, approve or reject them with a note, and have the system automatically advance the order status and notify the customer.
- **US-10 (Author Royalties):** As a publisher, I want to generate monthly and annual royalty statements calculating total units sold multiplied by agreed author royalty percentages, exportable to PDF and CSV.

---

## 4. Phase 0 Acceptance Criteria

- [x] Comprehensive **Business Brief** completed detailing Padanama Publications' history, catalog, channels, and brand positioning.
- [x] In-depth **Competitor Analysis** delivered covering 7 local players and international reader benchmarks with an actionable feature gap analysis.
- [x] Complete **Personas & User Journeys** documented for 6 external reader personas and 5 internal/external stakeholders.
- [x] Exhaustive **Local Context Guide** compiled covering Sri Lankan payments, logistics across all 25 districts, tax laws, PDPA compliance, and typography/transliteration algorithms.
- [x] Full **Requirements Specification** documented with clear functional, non-functional, and MoSCoW prioritization criteria.
- [x] Complete **Sitemap & Information Architecture** defined with trilingual routing conventions and route-group security boundaries.
- [x] Structured **Open Questions & Sample Data Ledger** assembled with fallback configurations.
- [x] Formal **Phase 0 Sign-Off Report** prepared with executive summary and top 10 strategic recommendations.

---

## 5. Task Breakdown

- [x] Task 0.1: Initialize git repository, configure `.gitignore` and `.agents/` sync inbox.
- [x] Task 0.2: Web research on Padanama Publications, competitors, and Sri Lankan e-commerce logistics/payments.
- [x] Task 0.3: Author `docs/phases/PHASE-0-plan.md`.
- [x] Task 0.4: Author `docs/research/business-brief.md`.
- [x] Task 0.5: Author `docs/research/competitor-analysis.md`.
- [x] Task 0.6: Author `docs/research/personas-and-journeys.md`.
- [x] Task 0.7: Author `docs/research/local-context.md`.
- [x] Task 0.8: Author `docs/research/requirements.md`.
- [x] Task 0.9: Author `docs/research/sitemap.md`.
- [x] Task 0.10: Author `docs/research/open-questions.md`.
- [x] Task 0.11: Author `docs/phases/PHASE-0-report.md`.
- [x] Task 0.12: Commit Phase 0 documentation to git branch `phase-0/discovery-and-research`.

---

## 6. Project Risk Assessment & Mitigations

| Risk | Impact | Likelihood | Mitigation Strategy |
|---|---|---|---|
| **E-Book Piracy / Content Leakage** | High | High | Never transmit full PDF/EPUB to client for sample reading. Slice sample pages/chapters server-side into an isolated preview artifact or stream signed rasterized chunks. Store full files in private R2/S3 buckets served only via short-lived signed URLs with dynamic user watermarking. |
| **Payment Gateway Webhook Spoofing** | High | Medium | Implement rigorous server-side verification using PayHere's official MD5 hash formula. Store raw webhook payloads in an idempotent `PaymentEvent` table; reject duplicate or tampered callbacks. Never mark an order as paid from client redirects. |
| **COD Refusal & High RTO Rates** | High | High | High Cash on Delivery rejection rates erode margins. Enforce phone number SMS OTP verification at checkout, add a small configurable COD convenience surcharge, restrict COD to verified orders, and automate WhatsApp order re-confirmation. |
| **Slow Mobile Performance on Low-End Devices** | High | Medium | Mobile traffic in Sri Lanka exceeds 75% on 3G/4G connections. Use Next.js App Router Server Components to ship minimal client JavaScript. Employ `next/image` with WebP/AVIF compression. Keep admin bundle code-split in an isolated route group. |
| **Sinhala Typography Rendering Issues** | Medium | Medium | Load self-hosted WOFF2 fonts for Noto Sans Sinhala and Gemunu Libre with `font-display: swap`. Set explicit `line-height >= 1.7` across all typography rules to avoid cutting off complex diacritic vowel signs (*ispili / papili*). |
| **Tax Regulatory Volatility** | Medium | High | VAT on books in Sri Lanka has shifted between exemptions and 18% standard rate. Decouple tax calculation from core checkout code: build a dynamic tax settings module in Admin allowing 0% or variable VAT rates per category. |
