import { describe, it, expect } from "vitest";
import { formatLkr, centsToLkr, lkrToCents } from "@/lib/money";

describe("Money Utilities (LKR)", () => {
  it("formats integer cents into Sinhala, English, and Tamil rupee representations", () => {
    const cents = 125000; // Rs. 1,250.00
    expect(formatLkr(cents, "si")).toBe("රු. 1,250.00");
    expect(formatLkr(cents, "en")).toBe("Rs. 1,250.00");
    expect(formatLkr(cents, "ta")).toBe("ரூ. 1,250.00");
  });

  it("handles zero and large numbers accurately", () => {
    expect(formatLkr(0, "si")).toBe("රු. 0.00");
    expect(formatLkr(25000000, "en")).toBe("Rs. 250,000.00");
  });

  it("converts between cents and rupees without floating point imprecision", () => {
    expect(centsToLkr(65000)).toBe(650);
    expect(lkrToCents(650)).toBe(65000);
    expect(lkrToCents(99.99)).toBe(9999);
  });
});
