# ADR-003: Pluggable Payment Provider Interface & PayHere Cryptographic Signature Verification

**Status:** Accepted  
**Date:** November 2026  
**Deciders:** Security Lead, Solution Architect  

---

## 1. Context & Problem Statement
Payment integration in Sri Lanka requires multiple domestic channels: credit/debit cards, mobile wallets (eZ Cash, mCash, Genie), Buy-Now-Pay-Later (Koko, Mintpay), manual bank transfer with slip uploads, and Cash on Delivery (COD). Because Stripe does not settle to Sri Lankan bank accounts, PayHere is the primary gateway. However, relying on client-side redirects for payment confirmation exposes the platform to serious payment spoofing and fraud.

## 2. Decision
1. **Abstract PaymentProvider Interface:** We define an abstract interface in `src/server/payments/types.ts` (`createCheckout`, `verifyWebhook`, `refund`), decoupling application business logic from specific gateway implementations.
2. **Server-Side Cryptographic MD5 Verification:** PayHere checkout and webhooks implement strict hashing:
   - **Checkout Form Hash:**
     $$\text{hash} = \text{strtoupper}\left(\text{md5}\left(\text{merchant\_id} + \text{order\_id} + \text{amount\_formatted} + \text{currency} + \text{strtoupper}(\text{md5}(\text{merchant\_secret}))\right)\right)$$
   - **Webhook Callback Verification (`notify_url`):**
     $$\text{md5sig} = \text{strtoupper}\left(\text{md5}\left(\text{merchant\_id} + \text{order\_id} + \text{payhere\_amount} + \text{payhere\_currency} + \text{status\_code} + \text{strtoupper}(\text{md5}(\text{merchant\_secret}))\right)\right)$$
3. **Idempotent Webhook Logging:** All raw incoming webhook payloads are inserted into `PaymentEvent` before processing. Duplicate notifications or replay attempts are safely detected and ignored.
4. **Zero Trust for Browser Redirects:** The user-facing return URL (`/checkout/success`) displays an order receipt but **never** marks an order as paid or grants digital entitlements. Only verified server-to-server callbacks or manual admin slip approvals can change payment status.

## 3. Consequences
- **Positive:** Complete protection against payment tampering; SAQ-A PCI compliance (no card data enters Padanama servers); easy plug-and-play addition of WebXPay or Koko.
- **Negative:** Requires public HTTPS webhook URL during production and staging.
- **Mitigation:** Built sandbox mode and automated mock verification for unit tests.
