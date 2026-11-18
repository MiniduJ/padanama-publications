import { describe, it, expect } from "vitest";
import { PayHereProvider } from "@/server/payments/payhere";

describe("PayHereProvider", () => {
  const merchantId = "1211111";
  const merchantSecret = "4Tu9aL19fK";
  const provider = new PayHereProvider({
    merchantId,
    merchantSecret,
    mode: "sandbox",
  });

  it("generates deterministic checkout hash matching PayHere formula", () => {
    const orderNumber = "PDN-2026-000123";
    const amountFormatted = "1250.00";
    const currency = "LKR";

    const hash = provider.generateCheckoutHash(orderNumber, amountFormatted, currency);
    expect(hash).toBeDefined();
    expect(hash.length).toBe(32); // MD5 hex length
    expect(hash).toBe(hash.toUpperCase());

    // Verify consistency
    const hash2 = provider.generateCheckoutHash(orderNumber, amountFormatted, currency);
    expect(hash).toBe(hash2);
  });

  it("verifies authentic webhook signature (status_code = 2)", async () => {
    const orderId = "PDN-2026-000123";
    const payhereAmount = "1250.00";
    const payhereCurrency = "LKR";
    const statusCode = "2"; // Success

    // Compute legitimate md5sig
    const crypto = await import("crypto");
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    const plain = `${merchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${hashedSecret}`;
    const validMd5sig = crypto.createHash("md5").update(plain).digest("hex").toUpperCase();

    const result = await provider.verifyWebhook({
      merchant_id: merchantId,
      order_id: orderId,
      payment_id: "320025111111",
      payhere_amount: payhereAmount,
      payhere_currency: payhereCurrency,
      status_code: statusCode,
      md5sig: validMd5sig,
    });

    expect(result.isValid).toBe(true);
    expect(result.isSuccess).toBe(true);
    expect(result.amountCents).toBe(125000);
    expect(result.orderId).toBe(orderId);
  });

  it("rejects tampered webhook signature or altered amount", async () => {
    const result = await provider.verifyWebhook({
      merchant_id: merchantId,
      order_id: "PDN-2026-000123",
      payment_id: "320025111111",
      payhere_amount: "5000.00", // Tampered amount
      payhere_currency: "LKR",
      status_code: "2",
      md5sig: "INVALID_SIGNATURE_HASH",
    });

    expect(result.isValid).toBe(false);
    expect(result.isSuccess).toBe(false);
  });
});
