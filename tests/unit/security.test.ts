import { describe, it, expect } from "vitest";
import {
  phoneSchema,
  otpSchema,
  integerCentsSchema,
  orderPlacementSchema,
  sriLankanPhoneRegex,
} from "@/lib/validations";

describe("Phase 9: Security Hardening & Input Boundary Validation", () => {
  it("validates legitimate Sri Lankan mobile numbers across standard formats", () => {
    expect(sriLankanPhoneRegex.test("0718008533")).toBe(true);
    expect(sriLankanPhoneRegex.test("94718008533")).toBe(true);
    expect(sriLankanPhoneRegex.test("+94718008533")).toBe(true);
    expect(sriLankanPhoneRegex.test("0771234567")).toBe(true);
    expect(sriLankanPhoneRegex.test("0701234567")).toBe(true);
    expect(sriLankanPhoneRegex.test("0759876543")).toBe(true);

    // Schema parsing
    expect(phoneSchema.safeParse("0718008533").success).toBe(true);
    expect(phoneSchema.safeParse("+94718008533").success).toBe(true);
  });

  it("strictly rejects invalid, spoofed, or landline phone numbers", () => {
    expect(sriLankanPhoneRegex.test("0112345678")).toBe(false); // Colombo landline (not mobile)
    expect(sriLankanPhoneRegex.test("12345")).toBe(false);       // too short
    expect(sriLankanPhoneRegex.test("0718008533123")).toBe(false); // too long
    expect(sriLankanPhoneRegex.test("invalid-phone")).toBe(false);

    expect(phoneSchema.safeParse("0112345678").success).toBe(false);
  });

  it("strictly enforces 4-digit numeric OTP authentication bounds", () => {
    expect(otpSchema.safeParse("4892").success).toBe(true);
    expect(otpSchema.safeParse("0000").success).toBe(true);
    expect(otpSchema.safeParse("9999").success).toBe(true);

    // Rejections
    expect(otpSchema.safeParse("123").success).toBe(false);    // 3 digits
    expect(otpSchema.safeParse("12345").success).toBe(false);  // 5 digits
    expect(otpSchema.safeParse("abcd").success).toBe(false);   // non-numeric
    expect(otpSchema.safeParse("12a4").success).toBe(false);   // alphanumeric
  });

  it("guarantees monetary fields are strictly non-negative integer cents", () => {
    expect(integerCentsSchema.safeParse(65000).success).toBe(true); // Rs. 650.00
    expect(integerCentsSchema.safeParse(0).success).toBe(true);     // Free (Rs. 0)

    // Rejections
    expect(integerCentsSchema.safeParse(-500).success).toBe(false);  // negative
    expect(integerCentsSchema.safeParse(12.5).success).toBe(false);  // floating-point
  });

  it("validates full order placement payload and rejects empty cart", () => {
    const validOrder = {
      contact: {
        firstName: "Sunil",
        lastName: "Perera",
        phone: "0718008533",
        email: "sunil@example.com",
      },
      shippingAddress: {
        street1: "No 45, Galle Road",
        city: "Colombo",
        district: "Colombo",
      },
      deliveryMethod: "COURIER",
      paymentMethod: "PAYHERE",
      items: [
        {
          bookId: "b-1",
          slug: "scholarship-grade-5",
          title: "Grade 5 Scholarship",
          format: "PAPERBACK",
          priceCents: 65000,
          quantity: 1,
          isDigital: false,
        },
      ],
    };

    expect(orderPlacementSchema.safeParse(validOrder).success).toBe(true);

    // Empty cart rejection
    const invalidOrder = { ...validOrder, items: [] };
    expect(orderPlacementSchema.safeParse(invalidOrder).success).toBe(false);
  });
});
