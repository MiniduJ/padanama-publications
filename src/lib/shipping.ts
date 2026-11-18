// Single source of truth for delivery fees (used by checkout UI and order API).
export type DeliveryMethod = "COURIER" | "EXPRESS" | "PICKUP";
export type Courier = "KOOMBIYO" | "DOMEX";
export const COURIER_OPTIONS: { id: Courier; name: string; days: string }[] = [
  { id: "KOOMBIYO", name: "Koombiyo Delivery", days: "2–4" },
  { id: "DOMEX", name: "Domex Courier", days: "1–3" },
];
export const FREE_DELIVERY_CENTS = 350000;
export const COD_FEE_CENTS = 10000;
export const EXPRESS_CENTS = 45000;

export function shippingCents(opts: { district: string; method: DeliveryMethod; subtotalCents: number; digitalOnly: boolean }) {
  if (opts.digitalOnly || opts.method === "PICKUP") return 0;
  if (opts.method === "EXPRESS") return EXPRESS_CENTS;
  if (opts.subtotalCents >= FREE_DELIVERY_CENTS) return 0;
  const d = opts.district.trim().toLowerCase();
  if (d === "colombo") return 20000;
  if (d === "gampaha" || d === "kalutara") return 25000;
  return 30000;
}
