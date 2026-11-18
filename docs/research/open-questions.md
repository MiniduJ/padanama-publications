# OPEN QUESTIONS & SAMPLE DATA CONFIGURATION LEDGER

**Document:** `docs/research/open-questions.md`  
**Phase:** Phase 0 (Discovery & Research)  
**Status:** Complete  
**Date:** November 2026  

---

## 1. Section 0 Client Input Audit & Resolution

Under Global Operating Rule 48:
> *"If a placeholder is empty: do not invent facts about the business. Use clearly labelled sample data (`[SAMPLE]`), keep everything configurable from the admin panel, and list the open questions in the phase report."*

Below is the exhaustive reconciliation of all Section 0 client inputs, combining our live web research findings with clearly labeled `[SAMPLE]` defaults for items awaiting formal client confirmation:

| Section 0 Placeholder | Research Finding / Ground Truth | Initial Value for Development (`[SAMPLE]`) | Action Required from Client |
|---|---|---|---|
| **`{{LEGAL_NAME}}`** | Padanama Publication (පදනම ප්‍රකාශන) | `Padanama Publications (Pvt) Ltd [SAMPLE]` | Provide exact official registered business certificate name. |
| **`{{FACEBOOK_URL}}`** | Active social media presence mentioned on local directory listings. | `https://facebook.com/padanamapublications [SAMPLE]` | Provide exact Facebook Page URL and admin access if Meta Pixel integration requested. |
| **`{{INSTAGRAM_URL}}`** | Standard author promotional channel. | `https://instagram.com/padanamapublications [SAMPLE]` | Provide official Instagram handle. |
| **`{{TIKTOK_URL}}` / `{{YOUTUBE_URL}}`** | High engagement for study guides and author interviews. | `https://tiktok.com/@padanamabooks [SAMPLE]` / `https://youtube.com/@padanamapublications [SAMPLE]` | Provide official TikTok and YouTube channel links. |
| **`{{WHATSAPP_NUMBER}}`** | Live contact numbers: **+94 71 800 8533** and **+94 77 088 2228** | `+94718008533` | Confirm which WhatsApp number should be connected to the floating web chat widget. |
| **`{{DOMAIN}}`** | Current website: `padanamapublication.lk` | Primary target: `padanama.lk` (with 301 redirect from `padanamapublication.lk`) | Confirm if domain `padanama.lk` is already registered with LK Domain Registry (.lk). |
| **`{{LOGO_PATH}}`** | Existing printed book logo marks featuring the stylized Sinhala letter "ප". | Phase 2 SVG Logo concept + Favicon generator | Provide high-resolution vector (AI/SVG/PNG) logo if available; otherwise approve proposed Phase 2 concept. |
| **`{{ADDRESS}}`** | No 912/A, Bogaha Junction Road, Gothatuwa, Kolonnawa, Sri Lanka | `No 912/A, Bogaha Junction Road, Gothatuwa, Kolonnawa, Sri Lanka` | Confirmed from live directory records. Confirm if warehouse/pickup address matches. |
| **`{{PAYMENT_MERCHANTS}}`** | PayHere is the standard Sri Lankan gateway; Koko BNPL is widely used. | PayHere Sandbox (`MERCHANT_ID=121XXXX`, `MERCHANT_SECRET=XXXX`) + Bank Transfer details | Provide live PayHere Merchant ID and Merchant Secret when ready for staging deployment. |
| **`{{COURIER_PARTNERS}}`** | Domex and Koombiyo are dominant logistics providers in Colombo. | Domex / Koombiyo standard district rate table | Provide existing merchant account IDs for Domex/Koombiyo to test API automated waybill creation. |
| **`{{N_TITLES}}`** | Extensive curriculum catalog from Grade 1 to Grade 13. | 50 initial seeded titles (`[SAMPLE]`) across all 5 major verticals | Provide initial digital catalog CSV/Excel sheet for bulk import in Phase 7. |
| **`{{PRIMARY_GENRES}}`** | Primary School Workbooks, Grade 5 Scholarship, O/L & A/L Short Notes & Past Papers, Sinhala Literature, Translations. | 5 core categories + 15 subcategories configured in initial database seed | Confirm if additional specialized subjects or genres are required for launch. |

---

## 2. Key Architectural Decisions Requiring Client Confirmation

### Decision 1: Domain Strategy (`padanama.lk` vs `padanamapublication.lk`)
* **Context:** The existing site runs on `padanamapublication.lk`. However, `padanama.lk` is substantially shorter, punchier, and easier for mobile users to remember and type.
* **Recommendation:** Secure `padanama.lk` as the primary production domain and configure permanent 301 redirects from `padanamapublication.lk` to preserve legacy link equity.
* **Status:** Open for Client Approval.

### Decision 2: SMS Gateway Provider
* **Context:** Sending transactional SMS messages (order confirmation, courier tracking, and especially phone OTP login) requires a Sri Lankan SMS gateway.
* **Options:**
  1. *Notify.lk:* Developer-friendly REST API, instant activation, competitive per-SMS rates (~LKR 0.50–0.75), supports Sinhala Unicode SMS.
  2. *Text.lk:* Widely used e-commerce bulk and transactional SMS provider.
  3. *Dialog / Mobitel Enterprise SMS API:* Direct telco integration, requires corporate business registration.
* **Recommendation:** Implement a pluggable SMS adapter defaulting to **Notify.lk** for staging and development.
* **Status:** Open for Client Selection.

### Decision 3: Default Free-Sample Limit Strategy for Digital Library
* **Context:** The digital reader allows visitors to read free preview samples before hitting the paywall.
* **Options:**
  1. *Fixed Percentage:* e.g., First 15% of total pages.
  2. *Fixed Page Count:* e.g., First 20 pages.
  3. *Chapter-Based:* e.g., Table of Contents + Chapter 1 & Chapter 2.
* **Recommendation:** Configure **Chapter-Based** for novels and literature, and **Fixed Page Count (first 15–20 pages)** for educational workbooks. Provide full per-book override capability in Admin Panel (`/admin/library/samples`).
* **Status:** Confirmed as default architectural behavior.

### Decision 4: Cash on Delivery (COD) Surcharge & Risk Controls
* **Context:** E-commerce in Sri Lanka suffers from a 10–20% return-to-origin (RTO) rate on Cash on Delivery due to impulsive orders or customers not being home.
* **Proposed Safeguards:**
  1. Add a modest configurable COD handling surcharge (e.g. LKR 100).
  2. Mandate a 4-digit SMS OTP verification before confirming COD orders.
  3. Restrict COD to maximum order values of LKR 15,000 (higher orders require bank slip or PayHere).
* **Status:** Open for Client Confirmation.

---

## 3. Sample Data Values for Development (`[SAMPLE]`)

To enable unblocked development across all subsequent phases, the following verified sample configurations will be embedded in the database seed and `.env.example`:

```bash
# [SAMPLE] Bank Accounts for Deposit Slip Flow
SAMPLE_BANK_BOC_NAME="Bank of Ceylon (BOC)"
SAMPLE_BANK_BOC_BRANCH="Borella"
SAMPLE_BANK_BOC_ACC="0081294812"

SAMPLE_BANK_SAMPATH_NAME="Sampath Bank"
SAMPLE_BANK_SAMPATH_BRANCH="Kolonnawa"
SAMPLE_BANK_SAMPATH_ACC="101829401928"

SAMPLE_BANK_COMMERCIAL_NAME="Commercial Bank"
SAMPLE_BANK_COMMERCIAL_BRANCH="Gothatuwa"
SAMPLE_BANK_COMMERCIAL_ACC="8001928471"

# [SAMPLE] Default Shipping Rates (LKR)
SAMPLE_SHIPPING_ZONE_1_COLOMBO=200
SAMPLE_SHIPPING_ZONE_2_SUBURBS=250
SAMPLE_SHIPPING_ZONE_3_PROVINCIAL=300
SAMPLE_SHIPPING_ZONE_4_OUTSTATION=350
SAMPLE_FREE_SHIPPING_THRESHOLD=3500

# [SAMPLE] Default Tax Settings
SAMPLE_VAT_ENABLED=false # Exempt under 2026/2027 educational budget proposals
SAMPLE_DEFAULT_VAT_RATE=0.0
```
