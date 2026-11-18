import crypto from "crypto";
import { CheckoutSessionOptions, PaymentProvider, WebhookVerificationResult } from "./types";

export class PayHereProvider implements PaymentProvider {
  name = "PAYHERE";
  private merchantId: string;
  private merchantSecret: string;
  private mode: "sandbox" | "live";
  private notifyUrl: string;

  constructor(config?: {
    merchantId?: string;
    merchantSecret?: string;
    mode?: "sandbox" | "live";
    notifyUrl?: string;
  }) {
    // No fallback secret: a guessable default would let anyone forge "paid" webhooks.
    this.merchantId = config?.merchantId ?? process.env.PAYHERE_MERCHANT_ID ?? "";
    this.merchantSecret = config?.merchantSecret ?? process.env.PAYHERE_MERCHANT_SECRET ?? "";
    this.mode = (config?.mode ?? process.env.PAYHERE_MODE ?? "sandbox") as "sandbox" | "live";
    this.notifyUrl = config?.notifyUrl ?? process.env.PAYHERE_NOTIFY_URL ?? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/payhere`;
  }

  static isConfigured() {
    return Boolean(process.env.PAYHERE_MERCHANT_ID && process.env.PAYHERE_MERCHANT_SECRET);
  }

  /**
   * Generates MD5 hash for client-side checkout initiation
   * Formula: strtoupper(md5(merchant_id + order_id + amount + currency + strtoupper(md5(merchant_secret))))
   */
  public generateCheckoutHash(orderId: string, amountFormatted: string, currency: string): string {
    const hashedSecret = crypto
      .createHash("md5")
      .update(this.merchantSecret)
      .digest("hex")
      .toUpperCase();

    const plainString = `${this.merchantId}${orderId}${amountFormatted}${currency}${hashedSecret}`;
    return crypto.createHash("md5").update(plainString).digest("hex").toUpperCase();
  }

  /**
   * Verifies MD5 signature returned by PayHere notify_url callback
   * Formula: strtoupper(md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + strtoupper(md5(merchant_secret))))
   */
  public verifySignature(
    orderId: string,
    payhereAmount: string,
    payhereCurrency: string,
    statusCode: string,
    receivedMd5sig: string
  ): boolean {
    const hashedSecret = crypto
      .createHash("md5")
      .update(this.merchantSecret)
      .digest("hex")
      .toUpperCase();

    const plainString = `${this.merchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${hashedSecret}`;
    const calculatedMd5 = crypto.createHash("md5").update(plainString).digest("hex").toUpperCase();

    return calculatedMd5 === receivedMd5sig.toUpperCase();
  }

  async createCheckout(options: CheckoutSessionOptions) {
    const amountFormatted = (options.amountCents / 100).toFixed(2);
    const hash = this.generateCheckoutHash(options.orderNumber, amountFormatted, options.currency);
    const actionUrl =
      this.mode === "live"
        ? "https://www.payhere.lk/pay/checkout"
        : "https://sandbox.payhere.lk/pay/checkout";

    const fields: Record<string, string> = {
      merchant_id: this.merchantId,
      return_url: options.returnUrl,
      cancel_url: options.cancelUrl,
      notify_url: this.notifyUrl,
      order_id: options.orderNumber,
      items: options.itemsDescription,
      currency: options.currency,
      amount: amountFormatted,
      first_name: options.customerFirstName,
      last_name: options.customerLastName,
      email: options.customerEmail,
      phone: options.customerPhone,
      address: options.address,
      city: options.city,
      country: "Sri Lanka",
      hash,
    };

    return { actionUrl, fields };
  }

  async verifyWebhook(payload: Record<string, any>): Promise<WebhookVerificationResult> {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = payload;

    if (!this.merchantSecret || !merchant_id || !order_id || !payhere_amount || !payhere_currency || !status_code || !md5sig) {
      return {
        isValid: false,
        orderId: order_id || "unknown",
        amountCents: 0,
        currency: payhere_currency || "LKR",
        isSuccess: false,
        statusCode: Number(status_code) || -1,
        rawPayload: payload,
        errorMessage: "Missing mandatory PayHere webhook parameters",
      };
    }

    if (merchant_id !== this.merchantId) {
      return {
        isValid: false,
        orderId: order_id,
        amountCents: Math.round(parseFloat(payhere_amount) * 100),
        currency: payhere_currency,
        isSuccess: false,
        statusCode: Number(status_code),
        rawPayload: payload,
        errorMessage: "Merchant ID mismatch",
      };
    }

    const isValidSig = this.verifySignature(
      order_id,
      payhere_amount,
      payhere_currency,
      String(status_code),
      md5sig
    );

    const isSuccess = isValidSig && String(status_code) === "2";
    const amountCents = Math.round(parseFloat(payhere_amount) * 100);

    return {
      isValid: isValidSig,
      orderId: order_id,
      paymentId: payment_id,
      amountCents,
      currency: payhere_currency,
      isSuccess,
      statusCode: Number(status_code),
      rawPayload: payload,
      errorMessage: isValidSig ? undefined : "Cryptographic md5sig verification failed",
    };
  }
}
