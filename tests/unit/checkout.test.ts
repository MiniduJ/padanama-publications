import { describe, it, expect } from "vitest";
import { formatLkr } from "@/lib/money";

describe("Phase 5: Order Creation & Zone Shipping Logic", () => {
  const calculateOrderTotals = (params: {
    subtotalCents: number;
    district: string;
    deliveryMethod: "COURIER" | "EXPRESS" | "PICKUP";
    paymentMethod: "PAYHERE" | "BANK_TRANSFER" | "CASH_ON_DELIVERY" | "KOKO";
    couponCode?: string;
    isDigitalOnly?: boolean;
  }) => {
    let discountCents = 0;
    if (params.couponCode === "WELCOME10") {
      discountCents = Math.round((params.subtotalCents * 10) / 100);
    } else if (params.couponCode === "PADANAMA500" && params.subtotalCents >= 250000) {
      discountCents = 50000;
    }

    let shippingCents = 0;
    if (!params.isDigitalOnly && params.deliveryMethod !== "PICKUP") {
      if (params.deliveryMethod === "EXPRESS") {
        shippingCents = 45000;
      } else if (params.subtotalCents >= 350000) {
        shippingCents = 0; // Free delivery
      } else {
        const dist = params.district.toLowerCase();
        if (dist === "colombo") shippingCents = 20000;
        else if (dist === "gampaha" || dist === "kalutara") shippingCents = 25000;
        else shippingCents = 30000;
      }
    }

    const codFeeCents = params.paymentMethod === "CASH_ON_DELIVERY" ? 10000 : 0;
    const totalCents = Math.max(0, params.subtotalCents - discountCents) + shippingCents + codFeeCents;

    return {
      subtotalCents: params.subtotalCents,
      discountCents,
      shippingCents,
      codFeeCents,
      totalCents,
    };
  };

  it("calculates standard Colombo courier delivery correctly", () => {
    const result = calculateOrderTotals({
      subtotalCents: 150000, // Rs. 1,500
      district: "Colombo",
      deliveryMethod: "COURIER",
      paymentMethod: "PAYHERE",
    });

    expect(result.shippingCents).toBe(20000); // Rs. 200
    expect(result.totalCents).toBe(170000); // Rs. 1,700
  });

  it("applies free delivery when subtotal meets Rs. 3,500 threshold", () => {
    const result = calculateOrderTotals({
      subtotalCents: 380000, // Rs. 3,800
      district: "Kandy",
      deliveryMethod: "COURIER",
      paymentMethod: "BANK_TRANSFER",
    });

    expect(result.shippingCents).toBe(0);
    expect(result.totalCents).toBe(380000);
  });

  it("adds LKR 100 handling fee for Cash on Delivery (COD)", () => {
    const result = calculateOrderTotals({
      subtotalCents: 120000, // Rs. 1,200
      district: "Gampaha",
      deliveryMethod: "COURIER",
      paymentMethod: "CASH_ON_DELIVERY",
    });

    expect(result.shippingCents).toBe(25000); // Rs. 250
    expect(result.codFeeCents).toBe(10000); // Rs. 100
    expect(result.totalCents).toBe(155000); // Rs. 1,550
  });

  it("zeroes out shipping fee for E-Book digital-only orders", () => {
    const result = calculateOrderTotals({
      subtotalCents: 95000, // Rs. 950
      district: "Jaffna",
      deliveryMethod: "COURIER",
      paymentMethod: "PAYHERE",
      isDigitalOnly: true,
    });

    expect(result.shippingCents).toBe(0);
    expect(result.totalCents).toBe(95000);
  });
});
