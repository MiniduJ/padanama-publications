import { describe, it, expect } from "vitest";
import { SmsLenzProvider } from "@/server/sms/smslenz";

describe("SmsLenzProvider", () => {
  const provider = new SmsLenzProvider({
    apiKey: "sample-test-key",
    senderId: "Padanama",
  });

  it("normalizes local phone numbers to 94XXXXXXXXX international format", () => {
    expect(provider.normalizePhoneNumber("0718008533")).toBe("94718008533");
    expect(provider.normalizePhoneNumber("+94 71 800 8533")).toBe("94718008533");
    expect(provider.normalizePhoneNumber("718008533")).toBe("94718008533");
    expect(provider.normalizePhoneNumber("94770882228")).toBe("94770882228");
  });

  it("sends mock OTP in test environment without network errors", async () => {
    const result = await provider.sendOtp("0718008533", "8492");
    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  });
});
