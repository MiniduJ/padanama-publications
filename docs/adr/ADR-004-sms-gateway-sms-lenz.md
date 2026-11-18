# ADR-004: SMS Gateway Integration via SMS Lenz

**Status:** Accepted  
**Date:** November 2026  
**Deciders:** Lead Architect, Operations Lead  

---

## 1. Context & Problem Statement
Customer authentication via mobile phone number (+94 SMS OTP) and real-time delivery tracking alerts are essential for Sri Lankan e-commerce. The client explicitly directed the adoption of **SMS Lenz** (`smslenz.lk`) as the preferred gateway provider.

## 2. Decision
1. **SmsProvider Architecture:** Implement a pluggable `SmsProvider` interface (`src/server/sms/types.ts`) with methods `sendSms()` and `sendOtp()`.
2. **SmsLenzProvider Implementation:** Construct `SmsLenzProvider` in `src/server/sms/smslenz.ts` connecting to SMS Lenz's REST API endpoint.
3. **Automated Phone Normalization:** Local phone numbers (`0718008533` or `+94 71 800 8533`) are normalized automatically to the international format required by Sri Lankan telcos (`94718008533`).
4. **Development & CI Mocking:** When `SMSLENZ_API_KEY` is not present or contains `"sample"`, the provider logs the message to the console and generates a mock message ID, preventing test execution failures and avoiding unnecessary SMS charges during development.

## 3. Consequences
- **Positive:** Complies with client's operational infrastructure; zero cost during automated CI runs; clean separation allows switching gateways in future if needed.
- **Negative:** Requires active SMS Lenz credit balance in production.
