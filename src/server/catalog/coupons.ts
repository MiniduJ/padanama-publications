import { db } from "@/server/db";

/** Shopper-facing shape (same one the cart stores). */
export interface PublicCoupon { code: string; type: "PERCENT" | "FIXED"; value: number; minSubtotalCents: number; description: string }

const toPublic = (c: any): PublicCoupon => ({
  code: c.code,
  type: c.discountType === "PERCENTAGE" ? "PERCENT" : "FIXED",
  value: c.discountValue,
  minSubtotalCents: c.minSpendCents,
  description: c.description || c.code,
});

const usable = (c: any) =>
  c && c.isActive && (!c.expiresAt || c.expiresAt > new Date()) && (c.maxUsageCount == null || c.usedCount < c.maxUsageCount);

export async function findCoupon(rawCode: string) {
  const code = String(rawCode || "").trim().toUpperCase();
  if (!code) return null;
  const c = await db.coupon.findUnique({ where: { code } }).catch(() => null);
  return usable(c) ? c : null;
}

export const discountFor = (c: { discountType: string; discountValue: number }, subtotalCents: number) =>
  Math.min(subtotalCents, c.discountType === "PERCENTAGE" ? Math.round((subtotalCents * c.discountValue) / 100) : c.discountValue);

/** Validates a code against a subtotal. Used by the cart and by order creation, so both agree. */
export async function evaluateCoupon(rawCode: string, subtotalCents: number) {
  const c = await findCoupon(rawCode);
  if (!c) return { ok: false as const, error: "Invalid or expired coupon code" };
  if (subtotalCents < c.minSpendCents) return { ok: false as const, error: `Minimum order Rs. ${(c.minSpendCents / 100).toLocaleString("en-LK")} for this coupon`, coupon: toPublic(c) };
  return { ok: true as const, id: c.id, discountCents: discountFor(c, subtotalCents), coupon: toPublic(c) };
}

export async function publicCoupons(): Promise<PublicCoupon[]> {
  const rows = await db.coupon.findMany({ where: { isPublic: true, isActive: true }, orderBy: { createdAt: "asc" } }).catch(() => []);
  return rows.filter(usable).map(toPublic);
}
