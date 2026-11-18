import { NextRequest, NextResponse } from "next/server";
import { PayHereProvider } from "@/server/payments/payhere";
import { SmsLenzProvider } from "@/server/sms/smslenz";
import { db } from "@/server/db";
import { formatLkr } from "@/lib/money";
import { ordersRepository } from "@/server/orders/orders-repository";

// In-memory order fallback registry for high resilience
const orderRegistry = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contact,
      shippingAddress,
      deliveryMethod = "COURIER",
      paymentMethod = "PAYHERE",
      items,
      couponCode,
      bankSlipUrl,
      customerNote,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!contact?.firstName || !contact?.phone) {
      return NextResponse.json({ error: "First name and phone number are required" }, { status: 400 });
    }

    // Generate Human-Readable Order Number
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `PDN-${year}-${randomSeq}`;

    // Subtotal Calculation
    const subtotalCents = items.reduce(
      (sum: number, it: any) => sum + (Number(it.priceCents) || 0) * (Number(it.quantity) || 1),
      0
    );

    // Coupon Calculation
    let discountCents = 0;
    if (couponCode === "WELCOME10") {
      discountCents = Math.round((subtotalCents * 10) / 100);
    } else if (couponCode === "PADANAMA500" && subtotalCents >= 250000) {
      discountCents = 50000;
    } else if (couponCode === "CIBF2026") {
      discountCents = Math.round((subtotalCents * 20) / 100);
    }

    // Shipping Fee Calculation
    const isDigitalOnly = items.every((i: any) => i.format === "EBOOK");
    let shippingCents = 0;

    if (!isDigitalOnly && deliveryMethod !== "PICKUP") {
      if (subtotalCents >= 350000) {
        shippingCents = 0; // Free delivery threshold
      } else {
        const district = (shippingAddress?.district || "colombo").toLowerCase();
        if (district === "colombo") shippingCents = 20000;
        else if (district === "gampaha" || district === "kalutara") shippingCents = 25000;
        else shippingCents = 30000;
      }
    }

    // COD Surcharge
    const codSurchargeCents = paymentMethod === "CASH_ON_DELIVERY" ? 10000 : 0; // Rs. 100 handling fee

    const totalCents = Math.max(0, subtotalCents - discountCents) + shippingCents + codSurchargeCents;

    // Status Assignment
    let initialStatus = "PENDING_PAYMENT";
    if (paymentMethod === "CASH_ON_DELIVERY") {
      initialStatus = "COD_CONFIRMED";
    } else if (paymentMethod === "BANK_TRANSFER") {
      initialStatus = bankSlipUrl ? "PENDING_SLIP_VERIFICATION" : "PENDING_PAYMENT";
    }

    const orderRecord = {
      orderNumber,
      contact,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      items,
      subtotalCents,
      discountCents,
      shippingCents,
      codSurchargeCents,
      totalCents,
      status: initialStatus,
      bankSlipUrl: bankSlipUrl || null,
      customerNote: customerNote || null,
      createdAt: new Date().toISOString(),
    };

    // Store in-memory registry
    orderRegistry.set(orderNumber, orderRecord);

    // Register into Admin Orders Repository
    ordersRepository.addOrder({
      id: `ord-${Date.now()}`,
      orderNumber,
      date: new Date().toLocaleDateString("en-CA") + " " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      customerName: `${contact.firstName} ${contact.lastName || ""}`.trim(),
      phone: contact.phone,
      city: shippingAddress?.city || "Colombo",
      district: shippingAddress?.district || "Colombo",
      paymentMethod: paymentMethod as any,
      status: initialStatus as any,
      totalCents,
      itemsCount: items.reduce((s: number, i: any) => s + (Number(i.quantity) || 1), 0),
      itemsList: items.map((i: any) => `${i.title} (${i.format}) × ${i.quantity || 1}`),
      bankSlipUrl: bankSlipUrl || null,
      customerNote: customerNote || null,
    });

    // Attempt persistent Prisma DB insert
    try {
      await db.order.create({
        data: {
          orderNumber,
          guestEmail: contact.email || null,
          guestPhone: contact.phone,
          status: initialStatus as any,
          subtotalCents,
          discountCents,
          shippingCents,
          totalCents,
          paymentMethod: paymentMethod as any,
          customerNote: customerNote || null,
        },
      });
    } catch (dbErr) {
      // Graceful fallback to memory registry if DB isn't migrated
      console.warn("Prisma DB order create fallback to in-memory:", (dbErr as any)?.message);
    }

    // Notification Dispatch via SMS Lenz
    const sms = new SmsLenzProvider();
    if (contact.phone) {
      if (paymentMethod === "CASH_ON_DELIVERY") {
        await sms.sendSms({
          recipient: contact.phone,
          message: `Padanama Publications: Order ${orderNumber} is confirmed (COD). Total: ${formatLkr(totalCents, "en")}. Delivery via Domex Courier to ${shippingAddress?.city || "your address"}.`,
        });
      } else if (paymentMethod === "BANK_TRANSFER") {
        await sms.sendSms({
          recipient: contact.phone,
          message: `Padanama Publications: Order ${orderNumber} placed. Total: ${formatLkr(totalCents, "en")}. Please transfer to BOC A/C 0001234567 and upload your slip on the website.`,
        });
      }
    }

    // Handle PayHere Form Generation
    let payherePayload = null;
    if (paymentMethod === "PAYHERE") {
      const origin = request.headers.get("origin") || "http://localhost:3000";
      const payhere = new PayHereProvider();
      const checkoutSession = await payhere.createCheckout({
        orderId: orderNumber,
        orderNumber,
        amountCents: totalCents,
        currency: "LKR",
        customerFirstName: contact.firstName,
        customerLastName: contact.lastName || "",
        customerEmail: contact.email || "orders@padanamapublication.lk",
        customerPhone: contact.phone,
        address: shippingAddress?.street1 || "Colombo",
        city: shippingAddress?.city || "Colombo",
        itemsDescription: items.map((i: any) => `${i.title} (${i.format})`).join(", "),
        returnUrl: `${origin}/checkout/success?order=${orderNumber}&payment=payhere`,
        cancelUrl: `${origin}/checkout?canceled=true&order=${orderNumber}`,
      });

      payherePayload = checkoutSession;
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      status: initialStatus,
      totalCents,
      paymentMethod,
      payhere: payherePayload,
      redirectUrl: `/checkout/success?order=${orderNumber}`,
    });
  } catch (err: any) {
    console.error("Order creation failed:", err);
    return NextResponse.json({ error: "Failed to place order", details: err?.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber");

  if (!orderNumber) {
    return NextResponse.json({ error: "Missing orderNumber" }, { status: 400 });
  }

  // Check in-memory registry
  if (orderRegistry.has(orderNumber)) {
    return NextResponse.json(orderRegistry.get(orderNumber));
  }

  // Check Prisma DB
  try {
    const dbOrder = await db.order.findUnique({
      where: { orderNumber },
      include: { items: true, payments: true },
    });
    if (dbOrder) {
      return NextResponse.json(dbOrder);
    }
  } catch (e) {
    // ignore
  }

  return NextResponse.json({ error: "Order not found" }, { status: 404 });
}
