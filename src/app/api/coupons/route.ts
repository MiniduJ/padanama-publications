import { NextRequest, NextResponse } from "next/server";
import { evaluateCoupon, publicCoupons } from "@/server/catalog/coupons";

// GET /api/coupons → coupons shown in the cart; GET /api/coupons?code=X&subtotal=N → check one code.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ coupons: await publicCoupons() });
  const subtotal = Math.max(0, Number(req.nextUrl.searchParams.get("subtotal")) || 0);
  const r = await evaluateCoupon(code, subtotal);
  return NextResponse.json(r, { status: r.ok ? 200 : 400 });
}
