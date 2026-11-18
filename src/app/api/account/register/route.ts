import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { hashPassword } from "@/server/auth/auth";
import { normalizePhone, signedIn } from "@/server/account/customer";

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.name || "").trim().slice(0, 120);
  const email = b.email ? String(b.email).trim().toLowerCase() : null;
  const phone = normalizePhone(b.phone);
  const password = String(b.password || "");
  if (!name) return NextResponse.json({ error: "කරුණාකර නම ඇතුළත් කරන්න (Name is required)" }, { status: 400 });
  if (!phone) return NextResponse.json({ error: "වලංගු ජංගම අංකයක් ඇතුළත් කරන්න (Valid mobile number required, e.g. 0771234567)" }, { status: 400 });
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "මුරපදය අවම අකුරු 8ක් විය යුතුය (Password: min 8 characters)" }, { status: 400 });

  try {
    const exists = await db.user.findFirst({ where: { OR: [{ phoneNumber: phone }, ...(email ? [{ email }] : [])] } });
    if (exists) return NextResponse.json({ error: "මෙම දුරකථන අංකය/ඊමේල් දැනටමත් ලියාපදිංචියි. පිවිසෙන්න. (Already registered — please sign in)" }, { status: 409 });
    const user = await db.user.create({ data: { name, email, phoneNumber: phone, passwordHash: hashPassword(password), role: "CUSTOMER" } });
    return signedIn(user);
  } catch (e) {
    console.error("register", e);
    return NextResponse.json({ error: "Could not create account right now" }, { status: 503 });
  }
}
