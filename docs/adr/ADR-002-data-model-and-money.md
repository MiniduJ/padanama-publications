# ADR-002: Relational Data Modeling, Integer Cent Money Representation & Soft Deletes

**Status:** Accepted  
**Date:** November 2026  
**Deciders:** Database Architect, Lead Accountant  

---

## 1. Context & Problem Statement
E-commerce and publishing systems involve intricate entity relationships (multi-format books, authors, translators, series, physical inventory, digital entitlements, and orders). Additionally, storing monetary values as floating-point numbers (`FLOAT` or `DOUBLE`) causes catastrophic rounding discrepancies during multi-item tax, discount, and settlement calculations.

## 2. Decision
1. **Integer Cents Representation:** All monetary values across products, orders, coupons, refunds, shipping, and taxes are stored strictly as **integer cents** (e.g. `priceCents: Int`). One Sri Lankan Rupee (LKR) equals 100 cents. Rs. 1,250.00 is stored as `125000`.
2. **Two-Tier Product Hierarchy:** We decouple logical intellectual works (`Book`) from commercial physical/digital artifacts (`BookEdition`). A single work can have Paperback, Hardcover, E-Book, and Bundle editions with their own ISBNs, SKUs, prices, and stock counts.
3. **Soft Deletes on Admin Entities:** Critical catalog and order records use soft deletion (`isDeleted Boolean @default(false)` and `deletedAt DateTime?`), ensuring referential integrity and historical reporting accuracy.
4. **Immutable Audit Logging:** Every administrative write operation creates an `AuditLog` entry capturing the user, timestamp, IP address, and JSON diffs (`beforeData`, `afterData`).

## 3. Consequences
- **Positive:** Floating-point rounding errors are 100% eliminated; order totals and PayHere checksums match to the exact cent; auditability and compliance with Sri Lankan accounting standards are guaranteed.
- **Negative:** Display layers must always divide by 100 before rendering.
- **Mitigation:** Built centralized type-safe helper functions `formatLkr()`, `centsToLkr()`, and `lkrToCents()` in `src/lib/money.ts`.
