import { NextResponse } from "next/server";
import { getSettings } from "@/server/site-content";
import { PayHereProvider } from "@/server/payments/payhere";
import { KokoProvider } from "@/server/payments/koko";

// Public, non-secret storefront settings (contact + bank details) edited in Admin > Page Content.
export async function GET() {
  return NextResponse.json({ ...(await getSettings()), "payments.payhere": PayHereProvider.isConfigured(), "payments.koko": KokoProvider.isConfigured() }, { headers: { "Cache-Control": "public, max-age=60" } });
}
