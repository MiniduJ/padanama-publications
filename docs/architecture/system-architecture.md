# SYSTEM ARCHITECTURE: Padanama Publications

**Document:** `docs/architecture/system-architecture.md`  
**Phase:** Phase 1 (Architecture & Foundation)  
**Status:** Complete  
**Date:** November 2026  

---

## 1. High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Devices & Browsers"]
        MobileShopper["Mobile Shopper (Android / iOS)"]
        DesktopUser["Desktop / Tablet Reader"]
        AdminStaff["Store Staff & Admins"]
    end

    subgraph EdgeLayer ["Edge CDN & Security (Cloudflare / Vercel Edge)"]
        CDN["Edge Caching & SSL Termination"]
        Turnstile["Cloudflare Turnstile Bot Defense"]
        I18nRouting["next-intl Locale Router (/si, /en, /ta)"]
    end

    subgraph AppLayer ["Next.js App Router (Single Monolithic App)"]
        StoreRoutes["/(store) Public Storefront & Catalog"]
        ReaderRoutes["/(reader) In-Browser Reader (PDF.js / EPUB)"]
        AccountRoutes["/(account) Customer Portal & Library"]
        AdminRoutes["/admin Role-Guarded Lazy-Loaded Console"]
        ApiRoutes["/api Webhooks, Health & Streaming Reader APIs"]
    end

    subgraph BusinessLogic ["Server Domain Services & Adapters"]
        TransliterationEngine["Singlish Transliteration Engine"]
        PayHereAdapter["PayHere Payment Adapter (MD5 Verification)"]
        SmsLenzAdapter["SMS Lenz Adapter (+94 OTP & Dispatch)"]
        EntitlementService["Digital Entitlement & DRM-Lite Engine"]
        ShippingEngine["25-District Delivery Calculator"]
        TaxEngine["Dynamic VAT Engine"]
    end

    subgraph DataStorage ["Data & Storage Tier"]
        PostgresDB[("PostgreSQL 16 (Relational DB)
        Users, Catalog, Orders,
        Entitlements, AuditLogs")]
        PrivateR2[("Private Cloudflare R2
        Encrypted Master PDF / EPUB")]
        PublicR2[("Public CDN Bucket
        Cover Art, Gallery, Slips")]
        RedisCache[("Redis 7
        Cart Sessions & Rate Limiting")]
    end

    ClientLayer --> EdgeLayer
    EdgeLayer --> I18nRouting
    I18nRouting --> AppLayer
    AppLayer --> BusinessLogic
    BusinessLogic --> DataStorage
```

---

## 2. Security Boundaries & Route Segregation

```mermaid
flowchart LR
    Request["Incoming HTTP Request"] --> Middleware{"src/middleware.ts"}
    
    Middleware -->|"/admin/*"| AdminCheck{"Check admin session cookie"}
    AdminCheck -->|"Valid Token"| AdminHandler["/admin (Lazy Loaded Bundle)"]
    AdminCheck -->|"No Token"| AdminLoginRedirect["Redirect to /admin/login"]
    
    Middleware -->|"/api/webhooks/*"| WebhookHandler["Verify Cryptographic Signatures (PayHere / Koko)"]
    
    Middleware -->|"/[locale]/*"| StoreHandler["next-intl Localized Storefront (si / en / ta)"]
```
