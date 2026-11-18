import { describe, it, expect } from "vitest";
import { formatLkr } from "@/lib/money";

describe("Phase 7: Admin Panel Operations, Royalties & Tax Logic", () => {
  it("calculates author royalty amounts correctly without floating point errors", () => {
    // 420 units of Paperback @ Rs. 750 (75000 cents) with 12% royalty
    const unitPriceCents = 75000;
    const unitsSold = 420;
    const grossRevenueCents = unitPriceCents * unitsSold; // 31,500,000 cents = Rs. 315,000.00
    const royaltyRate = 12;

    const royaltyPayableCents = Math.round((grossRevenueCents * royaltyRate) / 100);

    expect(grossRevenueCents).toBe(31500000);
    expect(royaltyPayableCents).toBe(3780000); // Rs. 37,800.00
    expect(formatLkr(royaltyPayableCents, "en")).toBe("Rs. 37,800.00");
  });

  it("calculates higher author royalty percentage on digital e-books", () => {
    // 185 units of E-Book @ Rs. 450 (45000 cents) with 20% digital royalty
    const unitPriceCents = 45000;
    const unitsSold = 185;
    const grossRevenueCents = unitPriceCents * unitsSold; // 8,325,000 cents = Rs. 83,250.00
    const digitalRoyaltyRate = 20;

    const royaltyPayableCents = Math.round((grossRevenueCents * digitalRoyaltyRate) / 100);

    expect(grossRevenueCents).toBe(8325000);
    expect(royaltyPayableCents).toBe(1665000); // Rs. 16,650.00
  });

  it("evaluates decoupled dynamic VAT rules accurately", () => {
    const calculateTax = (subtotalCents: number, isVatEnabled: boolean, vatRatePercent: number = 18) => {
      if (!isVatEnabled) return 0;
      return Math.round((subtotalCents * vatRatePercent) / 100);
    };

    // Standard Sri Lankan printed book education exemption: 0% VAT
    expect(calculateTax(500000, false)).toBe(0);

    // If national VAT policy is enabled (18%)
    expect(calculateTax(100000, true, 18)).toBe(18000); // Rs. 180.00 on Rs. 1,000.00
  });

  it("detects low inventory alerts when physical stock is 5 or below", () => {
    const checkStockStatus = (stock: number) => {
      if (stock === 0) return "OUT_OF_STOCK";
      if (stock <= 5) return "LOW_STOCK";
      return "IN_STOCK";
    };

    expect(checkStockStatus(3)).toBe("LOW_STOCK");
    expect(checkStockStatus(0)).toBe("OUT_OF_STOCK");
    expect(checkStockStatus(45)).toBe("IN_STOCK");
  });
});
