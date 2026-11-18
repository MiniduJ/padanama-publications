import crypto from "crypto";
import { SmsLenzProvider } from "@/server/sms/smslenz";

const smsProvider = new SmsLenzProvider();

// In-memory OTP storage for rapid verification (in production backed by Redis)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function requestPhoneOtp(phoneNumber: string): Promise<{ success: boolean; message: string }> {
  const normalized = smsProvider.normalizePhoneNumber(phoneNumber);
  if (!normalized || normalized.length < 11) {
    return { success: false, message: "Invalid Sri Lankan phone number (+94 7X XXX XXXX)" };
  }

  // Generate 4-digit numeric OTP
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
  otpStore.set(normalized, { code, expiresAt });

  const result = await smsProvider.sendOtp(normalized, code);
  if (!result.success) {
    return { success: false, message: result.errorMessage || "Failed to dispatch SMS OTP" };
  }

  return { success: true, message: `OTP sent to ${normalized}` };
}

export function verifyPhoneOtp(phoneNumber: string, code: string): boolean {
  const normalized = smsProvider.normalizePhoneNumber(phoneNumber);
  const record = otpStore.get(normalized);

  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalized);
    return false;
  }

  if (record.code === code) {
    otpStore.delete(normalized);
    return true;
  }

  return false;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return key === hash;
}
