# PHASE 5 PLAN: Cart, Checkout, Payments & Order Engine

**Project:** Padanama Publications — Web Platform, E-Commerce, Digital Library & Unified Admin  
**Document:** `docs/phases/PHASE-5-plan.md`  
**Phase:** Phase 5 (Cart, Checkout, Payments & Orders)  
**Status:** In Progress  
**Date:** November 2026  

---

## 1. Phase Objectives

The objective of Phase 5 is to deliver a seamless, high-converting e-commerce transaction engine:
1. **Interactive Cart Experience (`/[locale]/cart`):**
   - Persistent client cart with guest local storage
   - Quantity adjustments and real-time stock validation
   - Free delivery milestone progress bar (*"Add Rs. 650 more for Free Delivery"*)
   - Coupon discount application
2. **Mobile-First 3-Step Checkout (`/[locale]/checkout`):**
   - *Step 1 (Contact & Address):* 25-district selector, city, street, landmark, guest or logged-in mode.
   - *Step 2 (Delivery Method):* Standard islandwide courier (Domex/Koombiyo), Colombo express, store pickup.
   - *Step 3 (Payment):*
     - PayHere (Visa, MasterCard, Amex, eZ Cash, Genie, FriMi)
     - Bank Transfer with direct slip upload
     - Koko BNPL (3 interest-free installments)
     - Cash on Delivery (COD) with configurable fee & SMS OTP
3. **Order State Machine & Cryptographic Webhooks:**
   - Order creation with human-readable numbers (`PDN-2026-000123`)
   - Webhook handler `/api/webhooks/payhere` with strict MD5 signature validation and amount checks
   - Automatic digital `Entitlement` grant on payment for e-book items
   - Bank deposit slip ingestion and order state transition to `PENDING_SLIP_VERIFICATION`
4. **Order Confirmation & Invoicing (`/[locale]/checkout/success`):**
   - Visual order confirmation summary, bank details for transfer, and slip uploader

---

## 2. Acceptance Criteria
- [x] Full shopping cart page with dynamic milestone progress bar.
- [x] 3-Step checkout flow with district-based freight computation.
- [x] PayHere checkout initiation form generator.
- [x] PayHere webhook callback handler (`/api/webhooks/payhere`) passing cryptographic validation tests.
- [x] Bank transfer order flow with slip upload.
- [x] Zero TypeScript errors, passing unit tests, and successful production build.
