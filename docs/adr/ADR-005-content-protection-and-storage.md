# ADR-005: Content Protection (DRM-Lite) & Cloud Storage Architecture

**Status:** Accepted  
**Date:** November 2026  
**Deciders:** Security Lead, Solution Architect  

---

## 1. Context & Problem Statement
The digital library allows anyone to read free preview samples before purchasing the complete e-book. In Sri Lanka, distributing raw unencrypted PDF or EPUB files leads to widespread unauthorized sharing on Telegram and WhatsApp groups. However, heavy proprietary DRM (like Adobe Content Server) creates massive friction, requiring third-party reader apps that alienate average mobile users.

## 2. Decision
We adopt a robust **DRM-Lite, in-browser streaming protection architecture**:
1. **Server-Side Sample Slicing:** Unentitled users are **never** sent the full book file. During catalog upload, the server extracts only the allowed sample pages/chapters into an isolated preview artifact (`sampleFileUrl`).
2. **Private Storage Buckets:** Full e-book master files reside in private Cloudflare R2 / S3 buckets with public access completely disabled (`isPrivate: true`).
3. **Short-Lived Signed URLs / Streaming Endpoint:** Entitled users access content exclusively through authenticated streaming API routes (`/api/reader/[slug]/page`) that verify active `Entitlement` records on every request.
4. **Dynamic Steganographic & Visible Watermarking:** When an entitled user views a purchased e-book, the server stamps the purchaser's name, email, order ID, and date as a discreet watermark on page margins to deter redistribution.
5. **Deterrence Controls:** The in-browser reader disables browser text selection, right-click context menus, and direct file printing.

## 3. Consequences
- **Positive:** Zero friction for customers (reads directly inside Chrome/Safari mobile browsers); prevents raw PDF downloads; strong legal deterrent against digital piracy.
- **Negative:** Dedicated screen-capture tools can still record visible screens.
- **Assessment:** Acceptable trade-off aligning with global publishing best practices.
