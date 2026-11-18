import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { CUSTOMER_COOKIE, customerCookieOptions, signCustomerSession, verifyCustomerSession } from "@/server/auth/admin-session";

/** Normalise Sri Lankan mobile numbers to +947XXXXXXXX; null if invalid. */
export function normalizePhone(raw: unknown): string | null {
  const d = String(raw || "").replace(/[^\d+]/g, "");
  const m = d.match(/^(?:\+94|0094|94|0)?(7\d{8})$/);
  return m ? `+94${m[1]}` : null;
}

export async function currentCustomer(req: NextRequest) {
  const s = await verifyCustomerSession(req.cookies.get(CUSTOMER_COOKIE)?.value);
  if (!s) return null;
  const user = await db.user.findUnique({ where: { id: s.uid } });
  return user && user.isActive && !user.isDeleted ? user : null;
}

export async function signedIn(user: { id: string; name: string | null; email: string | null; phoneNumber: string | null }) {
  const res = NextResponse.json({ success: true, user: publicUser(user) });
  res.cookies.set(CUSTOMER_COOKIE, await signCustomerSession(user.id, user.name || ""), customerCookieOptions);
  return res;
}

export const publicUser = (u: { id: string; name: string | null; email: string | null; phoneNumber: string | null; createdAt?: Date }) =>
  ({ id: u.id, name: u.name, email: u.email, phone: u.phoneNumber, memberSince: u.createdAt });
