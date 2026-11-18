# PHASE 6 PLAN: Digital Library & Free-Sample Reader Engine

**Project:** Padanama Publications — Web Platform, E-Commerce, Digital Library & Unified Admin  
**Document:** `docs/phases/PHASE-6-plan.md`  
**Phase:** Phase 6 (Digital Library & Free-Sample Reader)  
**Status:** In Progress  
**Date:** November 2026  

---

## 1. Phase Objectives

1. **Digital Library Hub (`/[locale]/library`):**
   - Visual shelf of books offering digital editions and free sample previews
   - Filter by O/L & A/L grades, subject categories, and sample availability
   - Direct launch action into in-browser distraction-free reader
2. **In-Browser Free-Sample Reader (`/[locale]/read/[slug]`):**
   - Distraction-free full-screen reading experience with Sinhala typography safety
   - Reading themes (Paper Cream `#FFF8EC`, Sepia `#F4ECD8`, Night `#181614`, Clean White `#FFFFFF`)
   - Font scale controls (14px – 22px) and line height $\ge 1.75$
   - Page flip & continuous scroll modes
   - Table of contents drawer, bookmarking, and local reading progress persistence
3. **Sample Boundary & Paywall Conversion Engine:**
   - Dynamic sample limit cutoff (e.g. Page 20 or first 2 chapters)
   - High-converting paywall card with dual options: Buy E-Book (Instant) vs. Order Print Copy (Islandwide Courier)
   - One-click checkout integration preserving book slug and format
4. **DRM-Lite & Anti-Scrape Protection:**
   - Secure API preview endpoint (`/api/reader/[slug]/preview`)
   - Diagonal dynamic user watermark overlay
   - Context menu & print scraping deterrence
5. **Testing & Verification:**
   - Unit tests covering sample boundary rules, entitlement verification, and reader state

---

## 2. Acceptance Criteria
- [x] Complete digital library browsing page with grade and genre filtering.
- [x] In-browser reader with themes, font scale controls, and reading progress.
- [x] Paywall conversion card triggered at sample boundary.
- [x] DRM-lite watermark and copy protection.
- [x] Passing unit tests, zero TypeScript errors, green production build.
