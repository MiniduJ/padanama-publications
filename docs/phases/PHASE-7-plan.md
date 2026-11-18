# PHASE 7 PLAN: Unified Administrative Console

**Project:** Padanama Publications — Web Platform, E-Commerce, Digital Library & Unified Admin  
**Document:** `docs/phases/PHASE-7-plan.md`  
**Phase:** Phase 7 (Unified Admin Panel)  
**Status:** In Progress  
**Date:** November 2026  

---

## 1. Phase Objectives

1. **Secure Admin Dashboard Layout (`/admin`):**
   - Code-split admin shell with sidebar navigation and role guards (`SUPER_ADMIN`, `ADMIN`, `ORDER_MANAGER`, `ACCOUNTANT`, `LIBRARIAN`).
2. **Sales KPIs & Inventory Overview (`/admin`):**
   - Real-time revenue metrics, pending orders, and low-stock alerts.
3. **Catalog Management (`/admin/books`):**
   - Complete inventory management, multi-format edition pricing (LKR integer cents), and stock adjustments.
4. **Order Fulfillment & Shipping Labels (`/admin/orders`):**
   - Order tracking, courier tracking number assignment, and Domex shipping label generator.
5. **Bank Slip Verification Tray (`/admin/slips`):**
   - Visual inspection tray for bank transfer deposit slips with 1-click Approve/Reject actions and SMS notification triggers.
6. **Author Royalty Statements (`/admin/royalties`):**
   - Royalty calculation engine ($Units \times Price \times Royalty\%$) with CSV export.
7. **System & Tax Engine Settings (`/admin/settings`):**
   - Decoupled VAT toggle (0% tax-exempt vs 18%), 25-district delivery pricing, and SMS/payment gateway settings.

---

## 2. Acceptance Criteria
- [x] Admin console navigation and dashboard KPI overview.
- [x] Catalog CRUD and stock adjustment engine.
- [x] Order management and status transition workflow.
- [x] Bank deposit slip verification queue.
- [x] Author royalty calculation report with CSV export.
- [x] Dynamic VAT and courier shipping fees configuration.
- [x] Zero TypeScript errors, green tests, and production build pass.
