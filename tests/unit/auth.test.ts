import { describe, it, expect } from "vitest";
import { requestPhoneOtp, verifyPhoneOtp, hashPassword, verifyPassword } from "@/server/auth/auth";

describe("Phase 4: Authentication & Security Engine", () => {
  it("requests and validates 4-digit SMS OTP successfully", async () => {
    const phone = "0718008533";
    const otpRes = await requestPhoneOtp(phone);
    expect(otpRes.success).toBe(true);

    // In mock/test environment, invalid code is rejected
    const isBadCodeValid = verifyPhoneOtp(phone, "0000");
    expect(isBadCodeValid).toBe(false);
  });

  it("hashes and verifies customer passwords with PBKDF2 salt", () => {
    const rawPass = "PadanamaSecure2026!";
    const storedHash = hashPassword(rawPass);

    expect(storedHash).toBeDefined();
    expect(storedHash.includes(":")).toBe(true);

    const isMatch = verifyPassword(rawPass, storedHash);
    expect(isMatch).toBe(true);

    const isWrongMatch = verifyPassword("WrongPassword123", storedHash);
    expect(isWrongMatch).toBe(false);
  });
});
