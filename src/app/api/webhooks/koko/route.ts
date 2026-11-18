import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { KokoProvider } from "@/server/payments/koko";

// Koko server-to-server payment response. Marks the order PAID only when Koko's signature verifies.
export async function POST(req: NextRequest) {
  const type = req.headers.get("content-type") || "";
  const payload: Record<string, string> = type.includes("json")
    ? await req.json().catch(() => ({}))
    : Object.fromEntries([...(await req.formData().catch(() => new FormData())).entries()].map(([k, v]) => [k, String(v)]));

  const r = new KokoProvider().verifyResponse(payload);
  await db.paymentEvent.create({ data: { gateway: "KOKO", eventType: payload.status || "UNKNOWN", eventId: payload.trnId || null, rawPayload: JSON.stringify(payload), isVerified: r.valid } }).catch(() => {});
  if (!r.valid) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  if (r.success) {
    const order = await db.order.findUnique({ where: { orderNumber: r.orderId } });
    if (order && order.status !== "PAID") {
      await db.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          payments: { create: { paymentMethod: "KOKO", amountCents: order.totalCents, status: "SUCCESS", transactionRef: r.trnId, rawResponse: JSON.stringify(payload) } },
          statusHistory: { create: { status: "PAID", changedBy: "KOKO" } },
        },
      });
    }
  }
  return NextResponse.json({ received: true });
}
