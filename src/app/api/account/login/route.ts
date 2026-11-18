import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { verifyPassword } from "@/server/auth/auth";
import { CUSTOMER_COOKIE } from "@/server/auth/admin-session";
import { normalizePhone, signedIn } from "@/server/account/customer";

// ponytail: per-instance throttle; move to shared store if scaled out.
const attempts = new Map<string, { n: number; until: number }>();

export async function POST(req: NextRequest) {
  const { identifier, password } = await req.json().catch(() => ({}));
  const id = String(identifier || "").trim().toLowerCase();
  const key = id || "anon";
  const a = attempts.get(key);
  if (a && a.n >= 8 && a.until > Date.now()) return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });

  const phone = normalizePhone(id);
  const user = await db.user
    .findFirst({ where: phone ? { phoneNumber: phone } : { email: id }, })
    .catch(() => undefined);
  if (user === undefined) return NextResponse.json({ error: "Sign-in unavailable right now" }, { status: 503 });

  if (!user || user.isDeleted || !user.isActive || !user.passwordHash || !verifyPassword(String(password || ""), user.passwordHash)) {
    attempts.set(key, { n: (a?.n || 0) + 1, until: Date.now() + 15 * 60 * 1000 });
    return NextResponse.json({ error: "දුරකථන/ඊමේල් හෝ මුරපදය වැරදියි (Wrong phone/email or password)" }, { status: 401 });
  }
  attempts.delete(key);
  return signedIn(user);
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(CUSTOMER_COOKIE);
  return res;
}
