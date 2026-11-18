import crypto from "crypto";

/**
 * Koko BNPL (paykoko.com) redirect checkout: browser POSTs a signed form to Koko, Koko calls our
 * response URL, then returns the customer to returnUrl.
 * Field names / signing order follow Koko's merchant plugin spec — re-check against the merchant
 * docs that come with your API keys before going live.
 *
 * Env: KOKO_MERCHANT_ID, KOKO_API_KEY, KOKO_PRIVATE_KEY (merchant RSA private key, PEM),
 *      KOKO_PUBLIC_KEY (Koko's RSA public key, PEM), KOKO_MODE=sandbox|live
 */
const pem = (v?: string) => v?.replace(/\\n/g, "\n");

export class KokoProvider {
  static isConfigured() {
    return Boolean(process.env.KOKO_MERCHANT_ID && process.env.KOKO_API_KEY && process.env.KOKO_PRIVATE_KEY && process.env.KOKO_PUBLIC_KEY);
  }

  createCheckout(o: { orderNumber: string; amountCents: number; firstName: string; lastName: string; email: string; description: string; returnUrl: string; cancelUrl: string; responseUrl: string }) {
    const mId = process.env.KOKO_MERCHANT_ID!, apiKey = process.env.KOKO_API_KEY!;
    const f = {
      _mId: mId,
      api_key: apiKey,
      _returnUrl: o.returnUrl,
      _cancelUrl: o.cancelUrl,
      _responseUrl: o.responseUrl,
      _amount: (o.amountCents / 100).toFixed(2),
      _currency: "LKR",
      _reference: o.orderNumber,
      _orderId: o.orderNumber,
      _pluginName: "padanama",
      _pluginVersion: "1.0",
      _description: o.description.slice(0, 200),
      _firstName: o.firstName,
      _lastName: o.lastName || "-",
      _email: o.email,
    };
    const dataString = f._mId + f._amount + f._currency + f._pluginName + f._pluginVersion + f._returnUrl + f._cancelUrl +
      f._orderId + f._reference + f._firstName + f._lastName + f._email + f._description + apiKey + f._responseUrl;
    const signature = crypto.createSign("RSA-SHA256").update(dataString).sign(pem(process.env.KOKO_PRIVATE_KEY)!, "base64");
    const actionUrl = process.env.KOKO_MODE === "live"
      ? "https://prodapi.paykoko.com/api/merchants/orderCreate"
      : "https://qaapi.paykoko.com/api/merchants/orderCreate";
    return { actionUrl, fields: { ...f, dataString, signature } as Record<string, string> };
  }

  /** Verifies Koko's server-to-server response (orderId + trnId + status signed with Koko's key). */
  verifyResponse(p: Record<string, string>) {
    const { orderId, trnId, status, signature } = p;
    if (!KokoProvider.isConfigured() || !orderId || !trnId || !status || !signature) return { valid: false as const };
    const valid = crypto.createVerify("RSA-SHA256").update(orderId + trnId + status).verify(pem(process.env.KOKO_PUBLIC_KEY)!, signature, "base64");
    return { valid, orderId, trnId, success: valid && status === "SUCCESS" };
  }
}
