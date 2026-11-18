import { NextRequest, NextResponse } from "next/server";

const DISTRICT_ZONES: Record<string, { zone: string; baseRateCents: number; days: string }> = {
  // Zone 1
  colombo: { zone: "Zone 1 — Colombo Metro", baseRateCents: 20000, days: "1–2 working days" },
  // Zone 2
  gampaha: { zone: "Zone 2 — Greater Western", baseRateCents: 25000, days: "2–3 working days" },
  kalutara: { zone: "Zone 2 — Greater Western", baseRateCents: 25000, days: "2–3 working days" },
  // Zone 3
  kandy: { zone: "Zone 3 — Major Provincial Hub", baseRateCents: 30000, days: "2–4 working days" },
  galle: { zone: "Zone 3 — Major Provincial Hub", baseRateCents: 30000, days: "2–4 working days" },
  matara: { zone: "Zone 3 — Major Provincial Hub", baseRateCents: 30000, days: "2–4 working days" },
  kurunegala: { zone: "Zone 3 — Major Provincial Hub", baseRateCents: 30000, days: "2–4 working days" },
  ratnapura: { zone: "Zone 3 — Major Provincial Hub", baseRateCents: 30000, days: "2–4 working days" },
  kegalle: { zone: "Zone 3 — Major Provincial Hub", baseRateCents: 30000, days: "2–4 working days" },
};

const DEFAULT_OUTSTATION = {
  zone: "Zone 4 — Outstation Districts",
  baseRateCents: 35000,
  days: "3–5 working days",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const district = (body.district || "").toLowerCase().trim();
    const weightGrams = Number(body.weightGrams) || 300;
    const subtotalCents = Number(body.subtotalCents) || 0;

    const zoneInfo = DISTRICT_ZONES[district] || DEFAULT_OUTSTATION;

    // Weight multiplier (> 1kg adds LKR 100 per additional kg)
    const extraKg = Math.max(0, Math.ceil((weightGrams - 1000) / 1000));
    const extraRateCents = extraKg * 10000;
    const calculatedRateCents = zoneInfo.baseRateCents + extraRateCents;

    // Free delivery threshold: Rs. 3,500.00 (350,000 cents)
    const isFree = subtotalCents >= 350000;

    return NextResponse.json({
      district: body.district || "Default",
      zoneName: zoneInfo.zone,
      deliveryDays: zoneInfo.days,
      rateCents: isFree ? 0 : calculatedRateCents,
      originalRateCents: calculatedRateCents,
      isFreeDelivery: isFree,
      courierPartner: "Domex / Koombiyo",
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Invalid delivery calculation request" }, { status: 400 });
  }
}
