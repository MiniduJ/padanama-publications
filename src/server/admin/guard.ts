import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, canAccess, verifyAdminSession, type AdminSession } from "@/server/auth/admin-session";
import { HttpError } from "./handlers";

/** Wrap an admin API handler: verifies the signed session + role, maps errors to JSON. */
export function adminRoute<C>(resourceOf: (ctx: C) => Promise<string | null> | string | null, fn: (req: NextRequest, s: AdminSession, ctx: C) => Promise<unknown>) {
  return async (req: NextRequest, ctx: C) => {
    const s = await verifyAdminSession(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!s) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const resource = await resourceOf(ctx);
    if (resource && !canAccess(s.role, resource)) return NextResponse.json({ error: "Your role cannot access this section" }, { status: 403 });
    // CSRF: mutations must come from our own origin
    if (req.method !== "GET") {
      const origin = req.headers.get("origin");
      if (origin && new URL(origin).host !== req.headers.get("host")) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
    }
    try {
      return NextResponse.json(await fn(req, s, ctx));
    } catch (e: any) {
      if (e instanceof HttpError) return NextResponse.json({ error: e.message }, { status: e.status });
      if (e?.code === "P2002") return NextResponse.json({ error: "A record with this value already exists" }, { status: 409 });
      if (e?.code === "P2025") return NextResponse.json({ error: "Record not found" }, { status: 404 });
      console.error("admin api", e);
      return NextResponse.json({ error: "Server error — is the database reachable?" }, { status: 500 });
    }
  };
}
