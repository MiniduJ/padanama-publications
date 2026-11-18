import { NextRequest, NextResponse } from "next/server";
import { PayHereProvider } from "@/server/payments/payhere";
import { SmsLenzProvider } from "@/server/sms/smslenz";
import { db } from "@/server/db";
import { formatLkr } from "@/lib/money";
import { COD_FEE_CENTS, COURIER_OPTIONS, shippingCents, type Courier, type DeliveryMethod } from "@/lib/shipping";
import { bookCourier } from "@/server/delivery/couriers";
import { randomInt } from "crypto";
import { currentCustomer } from "@/server/account/customer";

const PAYMENT_METHODS = ["PAYHERE", "BANK_TRANSFER", "CASH_ON_DELIVERY", "KOKO"];
const DELIVERY_METHODS: DeliveryMethod[] = ["COURIER", "EXPRESS", "PICKUP"];
const MAX_SLIP_CHARS = 4_000_000; // about 3 MB base64
const SAVE_FAILED = "We could not save your order right now. Please try again or order on WhatsApp +94 71 800 8533.";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { contact, shippingAddress = {}, items, couponCode, bankSlipUrl, customerNote } = body;
  const deliveryMethod: DeliveryMethod = DELIVERY_METHODS.includes(body.deliveryMethod) ? body.deliveryMethod : "COURIER";
  const paymentMethod = PAYMENT_METHODS.includes(body.paymentMethod) ? body.paymentMethod : "PAYHERE";
  const courier: Courier | null = deliveryMethod === "COURIER" && COURIER_OPTIONS.some((c) => c.id === body.courier) ? body.courier : null;

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  if (!contact?.firstName || !/^(\+94|0)?7\d{8}$/.test(String(contact.phone || "").replace(/[\s-]/g, ""))) {
    return NextResponse.json({ error: "Name and a valid Sri Lankan mobile number are required" }, { status: 400 });
  }
  if (deliveryMethod === "COURIER" && !courier) return NextResponse.json({ error: "Please choose Koombiyo or Domex" }, { status: 400 });
  if (bankSlipUrl && (typeof bankSlipUrl !== "string" || bankSlipUrl.length > MAX_SLIP_CHARS)) {
    return NextResponse.json({ error: "Bank slip image too large (max 3 MB)" }, { status: 413 });
  }

  // Prices come from the database, never from the client.
  let lines: { editionId: string; title: string; format: any; unitPriceCents: number; quantity: number; isDigital: boolean }[];
  try {
    lines = await Promise.all(items.map(async (i: any) => {
      const quantity = Math.min(99, Math.max(1, Math.floor(Number(i.quantity) || 1)));
      const ed = await db.bookEdition.findFirst({
        where: { bookId: String(i.bookId), format: i.format === "EBOOK" ? "EBOOK" : { not: "EBOOK" }, isDeleted: false, isActive: true },
        include: { book: true },
      });
      if (!ed || ed.book.isDeleted) throw Object.assign(new Error(`Item no longer available: ${i.title || i.bookId}`), { gone: true });
      return { editionId: ed.id, title: ed.book.titleSi, format: ed.format, unitPriceCents: ed.salePriceCents ?? ed.priceCents, quantity, isDigital: ed.isDigital };
    }));
  } catch (e: any) {
    return e?.gone ? NextResponse.json({ error: e.message }, { status: 409 }) : NextResponse.json({ error: SAVE_FAILED }, { status: 503 });
  }

  const subtotalCents = lines.reduce((s, l) => s + l.unitPriceCents * l.quantity, 0);
  let discountCents = 0;
  if (couponCode === "WELCOME10") discountCents = Math.round(subtotalCents / 10);
  else if (couponCode === "PADANAMA500" && subtotalCents >= 250000) discountCents = 50000;
  else if (couponCode === "CIBF2026") discountCents = Math.round(subtotalCents / 5);

  const digitalOnly = lines.every((l) => l.isDigital);
  const ship = shippingCents({ district: shippingAddress.district || "", method: deliveryMethod, subtotalCents, digitalOnly });
  const codFee = paymentMethod === "CASH_ON_DELIVERY" ? COD_FEE_CENTS : 0;
  const totalCents = Math.max(0, subtotalCents - discountCents) + ship + codFee;
  const status = paymentMethod === "CASH_ON_DELIVERY" ? "COD_CONFIRMED" : paymentMethod === "BANK_TRANSFER" && bankSlipUrl ? "PENDING_SLIP_VERIFICATION" : "PENDING_PAYMENT";
  const orderNumber = `PDN-${new Date().getFullYear()}-${randomInt(10000000, 99999999)}`;
  const customerName = `${contact.firstName} ${contact.lastName || ""}`.trim();
  const customer = await currentCustomer(request).catch(() => null); // link order to signed-in account

  try {
    await db.order.create({
      data: {
        orderNumber, userId: customer?.id ?? null, status: status as any, paymentMethod: paymentMethod as any, deliveryMethod, deliveryCourier: courier,
        customerName, guestEmail: contact.email || null, guestPhone: String(contact.phone),
        shippingLine: [shippingAddress.street1, shippingAddress.street2, shippingAddress.landmark].filter(Boolean).join(", ") || null,
        shippingCity: shippingAddress.city || null, shippingDistrict: shippingAddress.district || null,
        subtotalCents, discountCents, shippingCents: ship, taxCents: 0, totalCents,
        bankSlipUrl: bankSlipUrl || null, customerNote: customerNote ? String(customerNote).slice(0, 1000) : null,
        isDigitalOnly: digitalOnly,
        items: { create: lines.map((l) => ({ ...l, totalCents: l.unitPriceCents * l.quantity })) },
        statusHistory: { create: { status: status as any, changedBy: "CUSTOMER" } },
      },
    });
  } catch (e) {
    console.error("order create failed", e);
    return NextResponse.json({ error: SAVE_FAILED }, { status: 503 });
  }

  if (courier && status === "COD_CONFIRMED") {
    const booked = await bookCourier(courier, { orderNumber, name: customerName, phone: contact.phone, address: shippingAddress.street1 || "", city: shippingAddress.city || "", district: shippingAddress.district || "", codCents: totalCents }).catch(() => null);
    if (booked) await db.order.update({ where: { orderNumber }, data: { trackingNumber: booked.trackingNumber } });
  }

  const courierName = COURIER_OPTIONS.find((c) => c.id === courier)?.name || "courier";
  const sms = new SmsLenzProvider();
  if (paymentMethod === "CASH_ON_DELIVERY") {
    await sms.sendSms({ recipient: contact.phone, message: `Padanama: Order ${orderNumber} confirmed (COD ${formatLkr(totalCents, "en")}). Delivery via ${courierName}.` }).catch(() => {});
  } else if (paymentMethod === "BANK_TRANSFER") {
    await sms.sendSms({ recipient: contact.phone, message: `Padanama: Order ${orderNumber} placed. Total ${formatLkr(totalCents, "en")}. We will confirm once your bank slip is verified.` }).catch(() => {});
  }

  let payhere = null;
  if (paymentMethod === "PAYHERE") {
    const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    payhere = await new PayHereProvider().createCheckout({
      orderId: orderNumber, orderNumber, amountCents: totalCents, currency: "LKR",
      customerFirstName: contact.firstName, customerLastName: contact.lastName || "",
      customerEmail: contact.email || "orders@padanamapublication.lk", customerPhone: contact.phone,
      address: shippingAddress.street1 || "Colombo", city: shippingAddress.city || "Colombo",
      itemsDescription: lines.map((l) => l.title).join(", ").slice(0, 250),
      returnUrl: `${origin}/checkout/success?order=${orderNumber}&payment=payhere`,
      cancelUrl: `${origin}/checkout?canceled=true&order=${orderNumber}`,
    });
  }

  return NextResponse.json({ success: true, orderNumber, status, totalCents, paymentMethod, payhere, redirectUrl: `/checkout/success?order=${orderNumber}` });
}

// Public order lookup: status only, no personal data.
export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get("orderNumber");
  if (!orderNumber) return NextResponse.json({ error: "Missing orderNumber" }, { status: 400 });
  const o = await db.order.findUnique({
    where: { orderNumber },
    select: { orderNumber: true, status: true, totalCents: true, paymentMethod: true, deliveryCourier: true, trackingNumber: true, createdAt: true },
  }).catch(() => null);
  return o ? NextResponse.json(o) : NextResponse.json({ error: "Order not found" }, { status: 404 });
}
