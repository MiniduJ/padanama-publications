import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { CUSTOMER_COOKIE } from "@/server/auth/admin-session";
import { currentCustomer, publicUser } from "@/server/account/customer";

export async function GET(req: NextRequest) {
  const user = await currentCustomer(req).catch(() => null);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const [orders, addresses, entitlements] = await Promise.all([
    db.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { items: { select: { title: true, quantity: true, unitPriceCents: true } } },
      take: 50,
    }),
    db.address.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    db.entitlement.findMany({ where: { userId: user.id, isActive: true }, include: { book: { select: { slug: true, titleSi: true, coverUrl: true } } } }),
  ]);
  return NextResponse.json({
    user: publicUser(user),
    orders: orders.map((o) => ({
      orderNumber: o.orderNumber, status: o.status, createdAt: o.createdAt, totalCents: o.totalCents,
      paymentMethod: o.paymentMethod, deliveryCourier: o.deliveryCourier, trackingNumber: o.trackingNumber, items: o.items,
    })),
    addresses,
    library: entitlements.map((e) => e.book),
  });
}

/** Profile update (name / email). */
export async function PATCH(req: NextRequest) {
  const user = await currentCustomer(req).catch(() => null);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const data: { name?: string; email?: string | null } = {};
  if (typeof b.name === "string" && b.name.trim()) data.name = b.name.trim().slice(0, 120);
  if (typeof b.email === "string") data.email = b.email.trim().toLowerCase() || null;
  const u = await db.user.update({ where: { id: user.id }, data }).catch(() => null);
  return u ? NextResponse.json({ user: publicUser(u) }) : NextResponse.json({ error: "Email already used" }, { status: 409 });
}

/** PDPA right to erasure: anonymise account, keep order records for accounting. */
export async function DELETE(req: NextRequest) {
  const user = await currentCustomer(req).catch(() => null);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  await db.$transaction([
    db.address.deleteMany({ where: { userId: user.id } }),
    db.user.update({ where: { id: user.id }, data: { name: "Deleted user", email: null, phoneNumber: null, passwordHash: null, isActive: false, isDeleted: true, deletedAt: new Date() } }),
  ]);
  const res = NextResponse.json({ success: true });
  res.cookies.delete(CUSTOMER_COOKIE);
  return res;
}
