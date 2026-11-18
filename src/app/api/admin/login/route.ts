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

  // 2. Bootstrap super admin from environment (no hardcoded fallback)
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
