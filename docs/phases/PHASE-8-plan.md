# PHASE 8 PLAN: Notifications, Marketing, SEO & Social Integration

**Project:** Padanama Publications — Web Platform, E-Commerce, Digital Library & Unified Admin  
**Document:** `docs/phases/PHASE-8-plan.md`  
**Phase:** Phase 8 (Notifications, Marketing & SEO)  
**Status:** In Progress  
**Date:** November 2026  

---

## 1. Phase Objectives

1. **Unified Transactional Notification Engine (`src/server/notifications/notifications.ts`):**
   - Orchestrate automated customer notifications via SMS Lenz and transactional email for order creation, slip approval, and courier dispatch tracking.
2. **CIBF "Book Fair Mode" (පොත් ප්‍රදර්ශන සමය):**
   - Colombo International Book Fair (BMICH) campaign page (`/[locale]/book-fair`), stall locator, countdown timer, and automated promo rules (`CIBF2026`).
3. **Social & Search Product Feeds:**
   - Meta Commerce / Facebook & Instagram Shops product feed (`/api/feeds/facebook`)
   - Google Merchant Center product XML feed (`/api/feeds/google`)
4. **Dynamic Multilingual SEO & Metadata:**
   - Dynamic `sitemap.xml` (`src/app/sitemap.ts`) covering all trilingual paths (`/si`, `/en`, `/ta`) with `hreflang`.
   - Secure `robots.txt` (`src/app/robots.ts`).
   - OpenGraph and Twitter card metadata generation.
5. **Testing & Verification:**
   - Unit tests covering feeds, notification triggers, and marketing rules.

---

## 2. Acceptance Criteria
- [x] Transactional notifications engine covering all order lifecycle states.
- [x] Interactive Book Fair mode and BMICH campaign page.
- [x] Validated XML product feeds for Meta and Google Merchant Center.
- [x] Dynamic trilingual `sitemap.xml` and `robots.txt`.
- [x] Zero TypeScript errors, green tests, and production build pass.
