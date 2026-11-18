import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { verifyPassword } from "@/server/auth/auth";
import { ADMIN_COOKIE, adminCookieOptions, signAdminSession, type AdminRole } from "@/server/auth/admin-session";
import { timingSafeEqual } from "crypto";

// ponytail: per-instance in-memory throttle; move to Redis/Firestore if running many instances.
const attempts = new Map<string, { n: number; until: number }>();

function safeEq(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const a = attempts.get(ip);
  if (a && a.n >= 5 && a.until > Date.now()) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  const { email, password } = await req.json().catch(() => ({}));
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const pwd = String(password || "");

  let session: { uid: string; email: string; role: AdminRole } | null = null;

  // 1. Staff accounts stored in DB (managed from Admin → Staff)
  try {
    const user = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (user && user.isActive && !user.isDeleted && user.role !== "CUSTOMER" && user.passwordHash && verifyPassword(pwd, user.passwordHash)) {
      session = { uid: user.id, email: normalizedEmail, role: user.role as AdminRole };
    }
  } catch {
    // DB unreachable: fall through to bootstrap account
  }

  // 2. Supabase Auth: password checked by Supabase, but only allow-listed emails get admin access
  //    (ADMIN_EMAIL / ADMIN_EMAILS env, or a non-customer staff user). Customers in Supabase never become admins.
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!session && sbUrl && sbKey && normalizedEmail && pwd) {
    const allowed = [process.env.ADMIN_EMAIL, ...(process.env.ADMIN_EMAILS || "").split(",")].map((e) => e?.trim().toLowerCase()).filter(Boolean);
    const staff = await db.user.findUnique({ where: { email: normalizedEmail } }).catch(() => null);
    const staffRole = staff && staff.isActive && !staff.isDeleted && staff.role !== "CUSTOMER" ? (staff.role as AdminRole) : null;
    if (allowed.includes(normalizedEmail) || staffRole) {
      const r = await fetch(`${sbUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { apikey: sbKey, "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password: pwd }),
      }).catch(() => null);
      if (r?.ok) session = { uid: staff?.id || `env-sb-${normalizedEmail}`, email: normalizedEmail, role: staffRole || "SUPER_ADMIN" };
    }
  }

  // 3. Bootstrap super admin from environment (no hardcoded fallback)
  const envEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const envPwd = process.env.ADMIN_PASSWORD;
  if (!session && envEmail && envPwd && normalizedEmail === envEmail && safeEq(pwd, envPwd)) {
    session = { uid: "env-super-admin", email: envEmail, role: "SUPER_ADMIN" };
  }

  if (!session) {
    attempts.set(ip, { n: (a?.n || 0) + 1, until: Date.now() + 15 * 60 * 1000 });
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  attempts.delete(ip);
  const res = NextResponse.json({ success: true, redirect: "/admin", user: { email: session.email, role: session.role } });
  res.cookies.set(ADMIN_COOKIE, await signAdminSession(session), adminCookieOptions);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
