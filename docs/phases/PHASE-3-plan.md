# PHASE 3 PLAN: Storefront & Catalog (Public)

**Project:** Padanama Publications — Web Platform, E-Commerce, Digital Library & Unified Admin  
**Document:** `docs/phases/PHASE-3-plan.md`  
**Phase:** Phase 3 (Storefront & Catalog)  
**Status:** In Progress  
**Date:** November 2026  

---

## 1. Phase Objectives

The objective of Phase 3 is to construct the complete, public-facing storefront and browsing experience:
1. **Rich Homepage (`/[locale]`):** Hero banner, New Releases, Best Sellers, Grade-Wise Educational Shelf, Children's Corner, Free Sample Read Bar, Book Fair countdown banner, and Newsletter subscription.
2. **Catalog Page (`/[locale]/books`):** Grid/list view toggle, faceted filters (Category, Grade Level, Author, Format, Language, Price, In-Stock), Sinhala collation sorting, and clean pagination.
3. **Instant Search & Transliteration API (`/[locale]/search` & `/api/search/suggest`):** Real-time auto-complete endpoint handling Singlish-to-Sinhala phonetic queries, ISBN search, and author name lookups.
4. **Rich Book Detail Page (`/[locale]/books/[slug]`):** Multi-format edition switcher (Paperback, Hardcover, E-Book, Bundle), dynamic district delivery calculator, "Read Free Sample" prominent CTA, reviews, specs, and JSON-LD structured data.
5. **Author & Category Directory (`/[locale]/authors`, `/[locale]/authors/[slug]`, `/[locale]/category/[slug]`):** Rich biographical and thematic collection landing pages.
6. **Static & CMS Pages (`/[locale]/about`, `/contact`, `/faq`, `/shipping-delivery`, `/returns-refunds`, `/terms`, `/privacy`, `/wholesale`):** Complete trilingual legal and customer support pages.
7. **Global Navigation & Mobile Bottom Bar:** Sticky search header, category mega-menu, mobile 5-tab bottom navigation (Home, Books, Library, Cart, Account), and floating WhatsApp chat widget.

---

## 2. Acceptance Criteria
- [x] All public storefront routes accessible in Sinhala, English, and Tamil.
- [x] Dynamic district delivery estimator calculates shipping on book detail pages.
- [x] Singlish search matches phonetic terms (`"ganithaya"` $\to$ `"ගණිතය"`, `"madol duwa"` $\to$ `"මඩොල් දූව"`).
- [x] Valid JSON-LD structured schemas (`Book`, `Product`, `Offer`) emitted on detail pages.
- [x] Mobile bottom bar active for small viewports ($< 768\text{px}$).
- [x] Zero TypeScript errors, passing unit tests, and successful production build.
