# PHASE 4 PLAN: Customer Accounts & Authentication

**Project:** Padanama Publications — Web Platform, E-Commerce, Digital Library & Unified Admin  
**Document:** `docs/phases/PHASE-4-plan.md`  
**Phase:** Phase 4 (Accounts & Customer Area)  
**Status:** In Progress  
**Date:** November 2026  

---

## 1. Phase Objectives

The objective of Phase 4 is to build the customer account portal, authentication, security safeguards, and personal digital bookshelf:
1. **Hybrid Authentication:**
   - Email & password authentication
   - Mobile Phone Number + SMS OTP (+94 Sri Lankan format validation via SMS Lenz)
   - Guest checkout compatibility (orders linkable post-purchase)
2. **Customer Portal (`/[locale]/(account)/`):**
   - Overview Dashboard (`/account`)
   - Order History (`/account/orders`) with status timeline and courier tracking links
   - Bank Slip Upload (`/account/orders/[id]/slip`) for pending bank transfers
   - Saved Address Book (`/account/addresses`) with 25-district selector & landmark field
   - **My Library (`/account/my-library`):** Purchased digital books with "Resume Reading" progress sync
   - Wishlist (`/account/wishlist`)
   - PDPA Privacy Center (`/account/privacy`) with machine-readable JSON data export and account erasure requests
3. **Security Engineering:**
   - Password hashing and session management with httpOnly cookies
   - Rate limiting on OTP dispatch and login attempts
   - Admin mandatory 2FA TOTP enforcement

---

## 2. Acceptance Criteria
- [x] Login and registration pages implemented (`/login`, `/register`).
- [x] Phone OTP verification flow implemented.
- [x] Customer dashboard, orders, addresses, and My Library shelves active.
- [x] PDPA data export and deletion endpoints active.
- [x] Zero TypeScript errors, clean test suite, passing production build.
