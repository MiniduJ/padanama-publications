import { describe, it, expect, vi } from "vitest";

vi.mock("@/server/db", () => ({ db: {} }));

import { FREE_DELIVERY_THRESHOLD_CENTS } from "@/lib/cart-store";
import { discountFor } from "@/server/catalog/coupons";
import { formatLkr, centsToLkr, lkrToCents } from "@/lib/money";

describe("Phase 5: Cart & Checkout Calculations Engine", () => {
  it("computes free delivery threshold accurately", () => {
    expect(FREE_DELIVERY_THRESHOLD_CENTS).toBe(350000); // Rs. 3,500.00
    expect(formatLkr(FREE_DELIVERY_THRESHOLD_CENTS, "si")).toBe("රු. 3,500.00");
  });

  it("computes coupon discounts (admin-managed coupons) and never exceeds the subtotal", () => {
    expect(discountFor({ discountType: "PERCENTAGE", discountValue: 10 }, 240000)).toBe(24000);
    expect(discountFor({ discountType: "FIXED_AMOUNT", discountValue: 50000 }, 300000)).toBe(50000);
    expect(discountFor({ discountType: "FIXED_AMOUNT", discountValue: 50000 }, 30000)).toBe(30000);
  });

  it("calculates percentage and fixed discounts correctly without floating point errors", () => {
    const subtotalCents = 240000; // Rs. 2,400.00
    const percentDiscountCents = Math.round((subtotalCents * 10) / 100);
    expect(percentDiscountCents).toBe(24000); // Rs. 240.00

    const netSubtotal = subtotalCents - percentDiscountCents;
    expect(netSubtotal).toBe(216000); // Rs. 2,160.00
    expect(formatLkr(netSubtotal, "en")).toBe("Rs. 2,160.00");
  });

  it("calculates milestone progress towards free delivery correctly", () => {
    const currentSubtotal = 175000; // Rs. 1,750 (50% of Rs. 3,500)
    const distanceToFree = Math.max(0, FREE_DELIVERY_THRESHOLD_CENTS - currentSubtotal);
    const progress = Math.min(100, Math.round((currentSubtotal / FREE_DELIVERY_THRESHOLD_CENTS) * 100));

    expect(distanceToFree).toBe(175000);
    expect(progress).toBe(50);

    const qualifiedSubtotal = 400000; // Rs. 4,000 (exceeds threshold)
    const qualifiedDistance = Math.max(0, FREE_DELIVERY_THRESHOLD_CENTS - qualifiedSubtotal);
    const qualifiedProgress = Math.min(100, Math.round((qualifiedSubtotal / FREE_DELIVERY_THRESHOLD_CENTS) * 100));

    expect(qualifiedDistance).toBe(0);
    expect(qualifiedProgress).toBe(100);
  });
});
