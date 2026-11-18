import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

const clip = (v: unknown, n: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null);

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const name = clip(b.name, 120), message = clip(b.message, 3000);
  if (!name || !message) return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
  try {
    await db.contactMessage.create({ data: { name, message, phone: clip(b.phone, 30), email: clip(b.email, 200), subject: clip(b.subject, 200) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not save message" }, { status: 503 });
  }
}
