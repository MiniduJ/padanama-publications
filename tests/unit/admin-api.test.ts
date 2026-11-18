import { describe, it, expect, beforeAll, vi } from "vitest";

vi.mock("@/server/db", () => ({ db: {} }));

import { signAdminSession, verifyAdminSession, canAccess } from "@/server/auth/admin-session";
import { shippingCents } from "@/lib/shipping";
import { coerce } from "@/server/admin/handlers";
import { RESOURCES } from "@/lib/admin-resources";
import { productTypeOf } from "@/data/publisher-books";

beforeAll(() => { process.env.AUTH_SECRET = "test-secret-that-is-at-least-32-characters"; });

describe("admin session", () => {
  it("accepts a signed token and rejects tampering", async () => {
    const t = await signAdminSession({ uid: "u1", email: "a@b.lk", role: "EDITOR" });
    expect((await verifyAdminSession(t))?.role).toBe("EDITOR");
    const [p, sig] = t.split(".");
    const forged = Buffer.from(JSON.stringify({ uid: "u1", email: "a@b.lk", role: "SUPER_ADMIN", exp: 9e9 })).toString("base64url");
    expect(await verifyAdminSession(`${forged}.${sig}`)).toBeNull();
    expect(await verifyAdminSession(`${p}.x${sig.slice(1)}`)).toBeNull();
    expect(await verifyAdminSession("anything")).toBeNull();
  });

  it("limits roles to their sections", () => {
    expect(canAccess("ACCOUNTANT", "expenses")).toBe(true);
    expect(canAccess("ACCOUNTANT", "staff")).toBe(false);
    expect(canAccess("ADMIN", "staff")).toBe(true);
  });
});

describe("shipping", () => {
  it("matches checkout rules", () => {
    expect(shippingCents({ district: "Colombo", method: "COURIER", subtotalCents: 1000, digitalOnly: false })).toBe(20000);
    expect(shippingCents({ district: "Jaffna", method: "COURIER", subtotalCents: 1000, digitalOnly: false })).toBe(30000);
    expect(shippingCents({ district: "Jaffna", method: "COURIER", subtotalCents: 350000, digitalOnly: false })).toBe(0);
    expect(shippingCents({ district: "Colombo", method: "EXPRESS", subtotalCents: 900000, digitalOnly: false })).toBe(45000);
    expect(shippingCents({ district: "Colombo", method: "PICKUP", subtotalCents: 1, digitalOnly: false })).toBe(0);
  });
});

describe("admin field whitelist", () => {
  it("drops unknown/readonly fields and validates selects", () => {
    const out = coerce(RESOURCES.orders, { status: "SHIPPED", totalCents: 1, isAdmin: true }, true);
    expect(out).toEqual({ status: "SHIPPED" });
    expect(() => coerce(RESOURCES.orders, { status: "HACKED" }, true)).toThrow();
    expect(() => coerce(RESOURCES.expenses, { description: "x" }, false)).toThrow();
  });
});

describe("catalogue product types", () => {
  const base = { id: "1", title: "x", author: "a", grade: null, medium: "Sinhala", isbn: null, category: "Pre School", categorySlug: "p", subject: null, inStock: true, stock: 1, priceCents: 100, salePriceCents: null, description: null, cover: null, gallery: [], previewUrl: null, materialsUrl: null };
  it("separates stationery and learning aids from books", () => {
    expect(productTypeOf({ ...base, bookType: "SCHOOL STATIONERY", subCategory: null })).toBe("STATIONERY");
    expect(productTypeOf({ ...base, bookType: "Chart List - පත්‍රිකා ලැයිස්තුව", subCategory: "Size 24*36 ප්‍රමාණය" })).toBe("LEARNING_AID");
    expect(productTypeOf({ ...base, title: "ENGLISH ALPHABET CIRCLE", bookType: "Reading Book", subCategory: "Activity Tools" })).toBe("LEARNING_AID");
    expect(productTypeOf({ ...base, title: "Nelson English Pupil Book 2", bookType: "Reading Book", subCategory: "Activity Tools" })).toBe("BOOK");
    expect(productTypeOf({ ...base, bookType: "Work Book (වැඩ පොත්)", subCategory: "Work Book" })).toBe("BOOK");
  });
});
