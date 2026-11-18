import { NextResponse } from "next/server";
import { getSettings } from "@/server/site-content";

// Public, non-secret storefront settings (contact + bank details) edited in Admin > Page Content.
export async function GET() {
  return NextResponse.json(await getSettings(), { headers: { "Cache-Control": "public, max-age=60" } });
}
