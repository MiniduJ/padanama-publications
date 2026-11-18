# BUSINESS BRIEF: Padanama Publications (පදනම ප්‍රකාශන)

**Document:** `docs/research/business-brief.md`  
**Phase:** Phase 0 (Discovery & Research)  
**Status:** Complete  
**Date:** November 2026  

---

## 1. Executive Summary

**Padanama Publications (පදනම ප්‍රකාශන)** is an established Sri Lankan publishing house located in the Colombo District (Kolonnawa/Gothatuwa). Padanama has built a strong reputation as an educational and literary publisher specializing in curriculum-aligned workbooks, term test assessment papers, subject-wise revision notes, model examination papers, and supplementary reading for students from preschool through G.C.E. Advanced Level (A/L). In addition to educational literature, Padanama publishes original Sinhala novels, translations of world classics, children's illustrated books, and academic guides.

Historically, Padanama has operated primarily through traditional brick-and-mortar bookstore distribution (Sarasavi, Godage, regional bookshops), school exhibitions, and direct-to-consumer (D2C) ordering via phone calls, WhatsApp messages, and social media channels. 

While a basic e-commerce website was introduced at `padanamapublication.lk`, it lacks modern digital publishing capabilities, trilingual support, automated courier tracking, rich mobile UX, and digital content protection. The goal of this initiative is to engineer a flagship web platform that combines a high-conversion e-commerce storefront, an innovative **Digital Library with a free-sample in-browser reader**, and a **fully unified, role-guarded Admin Panel** operating within the same Next.js application.

---

## 2. Business Profile & Organizational Information

| Attribute | Details / Value |
|---|---|
| **Business Name** | Padanama Publication / Padanama Publications (පදනම ප්‍රකාශන) |
| **Legal Registration** | Registered Business Enterprise under Sri Lankan Commercial Law (`[SAMPLE]` Reg: PV-00289145) |
| **Physical Address** | No 912/A, Bogaha Junction Road, Gothatuwa, Kolonnawa, Sri Lanka |
| **Primary Contact Numbers** | +94 71 800 8533 / +94 77 088 2228 |
| **Official Email Addresses** | `info@padanamapublication.lk` / `hello@padanamapublication.lk` |
| **Existing Domain** | `padanamapublication.lk` (Target Domain: `padanama.lk` / `padanamapublications.com`) |
| **Active Channels** | WhatsApp Business (+94 71 800 8533), Facebook Page, Instagram, Colombo International Book Fair (BMICH) stall |
| **Primary Operational Currency** | Sri Lankan Rupee (LKR / රු.) with multi-currency presentation (USD, GBP, AUD, EUR, CAD, AED) for the overseas Sri Lankan diaspora |

---

## 3. Product Portfolio & Publishing Verticals

Padanama's publishing catalog spans several distinct categories, characterized by seasonal demand cycles and distinct customer buying behaviors:

### 3.1. Primary & Early Childhood (පෙර පාසල් සහ ප්‍රාථමික අංශය)
- **Pre-School & Kindergarten:** Letter tracing, alphabet coloring, motor skills development, early counting.
- **Grades 1–2:** Activity workbooks (*ක්‍රියාකාරකම් පොත්*), environmental studies (*පරිසරය*), basic Sinhala reading.
- **Grades 3–5 (Scholarship / ශිෂ්‍යත්වය):** Intensive Grade 5 Scholarship preparation workbooks, IQ/general ability model papers (*බුද්ධි පරීක්ෂණ*), essay writing, and Sinhala language skills. *High seasonal peak: May to October.*

### 3.2. Junior Secondary & Ordinary Level (කනිෂ්ඨ සහ අ.පො.ස. සාමාන්‍ය පෙළ)
- **Grades 6–9:** Core subject workbooks for Mathematics, Science, History, Sinhala Language & Literature, Geography, Civics, and English.
- **Grades 10–11 (G.C.E. O/L):** Past examination papers with model answers, provincial term evaluation test papers (Western, Southern, Central, North-Western provinces), subject summary short notes (*කෙටි සටහන්*), revision guides. *High seasonal peak: November to May.*

### 3.3. Advanced Level (අ.පො.ස. උසස් පෙළ)
- **Science Stream:** Biology, Chemistry, Combined Mathematics, Physics structured question banks, practical manuals.
- **Commerce Stream:** Accounting, Business Studies, Economics past paper analyses.
- **Arts Stream:** Sinhala, Political Science, Buddhist Civilization, History model essays.
- **Technology Stream:** Engineering Technology (ET), Science for Technology (SFT), Biosystems Technology (BST).

### 3.4. General Literature & Fiction (සාහිත්‍ය හා නවකතා)
- Original Sinhala fiction, historical novels, award-nominated literary works (Swarna Pusthaka contenders).
- Translated world literature (*පරිවර්තන සාහිත්‍ය*), classic mystery, adventure, and drama.
- Poetry (*පද්‍ය*), anthologies, and biographical essays.

### 3.5. School Stationery & Educational Supplies (පාසල් ලිපිද්‍රව්‍ය)
- Exercise books, graph books, drawing books, mathematical instrument boxes, past paper filing binders.

---

## 4. Current Customer Workflows & Operational Pain Points

Based on customer inquiry analysis across Sri Lankan publishing operations, customers currently interact with Padanama through a fragmented journey:

```
[Customer discovers book on Facebook / TikTok] 
       │
       ▼
[Sends WhatsApp message / Phone Call to +94 71 800 8533]
       │
       ▼
[Staff manually checks warehouse inventory and quotes price + courier fee]
       │
       ▼
[Customer visits bank ATM / CDM or online banking to transfer funds]
       │
       ▼
[Customer snaps photo of deposit slip and sends via WhatsApp]
       │
       ▼
[Staff manually checks bank statement to match transaction, writes address on paper slip]
       │
       ▼
[Parcel booked with Domex/Koombiyo; customer repeatedly messages asking "Where is my parcel?"]
```

### Operational Bottlenecks:
1. **High Staff Overhead:** Manual order capture, manual bank reconciliation, and individual courier dispatch waste hundreds of administrative hours per month.
2. **Abandoned Inquiries:** Inability to preview books or check instant delivery fees leads to high drop-off on WhatsApp.
3. **No Direct E-Book Monetization:** Reluctance to distribute PDFs because unencrypted PDFs get forwarded on Telegram and WhatsApp groups, destroying author royalties and sales.
4. **Lack of Centralized Inventory:** Risk of overselling out-of-print titles during seasonal spikes (exam months and the September Colombo Book Fair).
5. **No Self-Service Tracking:** Support phone lines get clogged with delivery inquiries ("අද එයිද?", "Tracking number එක එවන්න").

---

## 5. Strategic Objectives for the New Platform

1. **Establish a High-Converting, Trilingual E-Commerce Storefront:**
   - Full trilingual UI (Sinhala as primary, English and Tamil fully supported).
   - High-speed mobile-first design (LCP < 2.5s on 4G) catering to the 75%+ mobile user base in Sri Lanka.
   - Singlish search engine ("hasthipala" $\to$ "හස්තිපාල", "ganithaya 10" $\to$ "ගණිතය 10") resolving phonetic queries instantly.
2. **Launch a Proprietary Digital Library with Free-Sample In-Browser Reader:**
   - Allow any visitor to read a curated sample (e.g., first 20 pages or 2 chapters) in an elegant, distraction-free web reader.
   - When the preview limit is reached, trigger an elegant paywall converting the reader to purchase the physical book, e-book, or bundle.
   - Enforce robust content protection (server-side sample generation, dynamic user watermarking, private asset buckets, no raw PDF downloads).
3. **Automate Sri Lankan Payment & Delivery Channels:**
   - Instant digital payments via PayHere (Visa/Mastercard, eZ Cash, mCash, Genie, FriMi, Internet Banking).
   - Frictionless Buy-Now-Pay-Later (BNPL) through Koko and Mintpay (3 interest-free installments).
   - Automated Bank Transfer with photo slip upload and instant one-click staff verification workflow.
   - Cash on Delivery (COD) with automated district-based surcharge and SMS OTP verification.
   - Integrated delivery calculation across all 25 districts with automated SMS tracking links.
4. **Provide a Unified, Role-Guarded Admin Console:**
   - Embedded directly in the same application under `/admin`, lazy-loaded and code-split so zero admin code leaks to public shoppers.
   - Granular Role-Based Access Control (RBAC) with mandatory Two-Factor Authentication (2FA) for administrators.
   - Comprehensive modules for Catalog, Orders, Bank Slip Verification, Library & Sample Rules, Inventory, Author Royalties, and Marketing Promotions.
5. **Campaign-Ready "Book Fair Mode":**
   - Built-in promotional engine for the Colombo International Book Fair (CIBF) in September, offering automated site-wide discounts, live stock alerts, and high-concurrency caching.
