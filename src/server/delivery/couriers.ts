import type { Courier } from "@/lib/shipping";

// Courier booking hook. Koombiyo / Domex APIs plug in here once credentials arrive:
// set KOOMBIYO_API_KEY / DOMEX_API_KEY and implement the request for that courier.
// Until then orders are saved with the chosen courier and staff enter the waybill in Admin > Orders.
export async function bookCourier(
  courier: Courier,
  _order: { orderNumber: string; name: string; phone: string; address: string; city: string; district: string; codCents: number }
): Promise<{ trackingNumber: string } | null> {
  if (!process.env[`${courier}_API_KEY`]) return null;
  // ponytail: no live API yet; return null so the admin assigns tracking manually.
  return null;
}
