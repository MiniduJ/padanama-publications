import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { currentCustomer, normalizePhone } from "@/server/account/customer";

const s = (v: unknown, n = 200) => (typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null);

export async function POST(req: NextRequest) {
  const user = await currentCustomer(req).catch(() => null);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const phone = normalizePhone(b.phoneNumber);
  const recipientName = s(b.recipientName), addressLine1 = s(b.addressLine1), city = s(b.city, 80), district = s(b.district, 40);
  if (!recipientName || !phone || !addressLine1 || !city || !district) return NextResponse.json({ error: "Name, mobile, address, city and district are required" }, { status: 400 });
  const isDefault = !(await db.address.count({ where: { userId: user.id } }));
  const a = await db.address.create({
    data: { userId: user.id, recipientName, phoneNumber: phone, addressLine1, addressLine2: s(b.addressLine2), landmark: s(b.landmark), city, district, province: s(b.province, 40) || "", postalCode: s(b.postalCode, 10), isDefault },
  });
  return NextResponse.json(a);
}

export async function DELETE(req: NextRequest) {
  const user = await currentCustomer(req).catch(() => null);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") || "";
  await db.address.deleteMany({ where: { id, userId: user.id } });
  return NextResponse.json({ success: true });
}
