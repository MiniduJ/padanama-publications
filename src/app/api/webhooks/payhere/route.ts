import { NextRequest, NextResponse } from "next/server";
import { PayHereProvider } from "@/server/payments/payhere";
import { db } from "@/server/db";
import { SmsLenzProvider } from "@/server/sms/smslenz";
import { ordersRepository } from "@/server/orders/orders-repository";

export async function POST(request: NextRequest) {
  try {
    let payload: Record<string, any> = {};

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        payload[key] = value.toString();
      });
    } else {
      payload = await request.json().catch(() => ({}));
    }

    const payhere = new PayHereProvider();
    const verification = await payhere.verifyWebhook(payload);

    if (!verification.isValid) {
      console.error("[PAYHERE_WEBHOOK_ERROR] Signature validation failed:", verification.errorMessage);
      return NextResponse.json({ error: verification.errorMessage }, { status: 400 });
    }

    const { orderId, amountCents, statusCode, paymentId, isSuccess } = verification;
    console.log(`[PAYHERE_WEBHOOK_SUCCESS] Order: ${orderId}, Status: ${statusCode}, Amount: ${amountCents}`);

    if (isSuccess) {
      // Synchronize in-memory admin orders repository
      ordersRepository.updateOrderStatus(orderId, "PAID");

      try {
        // Find existing order
        const order = await db.order.findUnique({
          where: { orderNumber: orderId },
          include: { items: true, user: true },
        });

        if (order) {
          // Idempotent order update
          await db.order.update({
            where: { id: order.id },
            data: {
              status: "PAID",
              payments: {
                create: {
                  paymentMethod: "PAYHERE",
                  amountCents,
                  currency: verification.currency,
                  status: "SUCCESS",
                  transactionRef: paymentId,
                  rawResponse: JSON.stringify(payload),
                },
              },
            },
          });

          // Log payment event
          await db.paymentEvent.create({
            data: {
              gateway: "PAYHERE",
              eventType: "PAYMENT_SUCCESS",
              orderId: order.id,
              rawPayload: JSON.stringify(payload),
              isVerified: true,
            },
          });

          // Grant digital entitlements for any e-book items
          for (const item of order.items) {
            if (item.isDigital && order.userId) {
              await db.entitlement.upsert({
                where: {
                  userId_bookId: {
                    userId: order.userId,
                    bookId: item.editionId, // Or bookId relation
                  },
                },
                update: { isActive: true },
                create: {
                  userId: order.userId,
                  bookId: item.editionId,
                  orderId: order.id,
                  isActive: true,
                  grantedBy: "SYSTEM_PAYHERE_WEBHOOK",
                },
              });
            }
          }

          // Send confirmation SMS if phone exists
          const customerPhone = order.guestPhone || order.user?.phoneNumber;
          if (customerPhone) {
            const sms = new SmsLenzProvider();
            await sms.sendSms({
              recipient: customerPhone,
              message: `Padanama Publications: Payment received for Order ${order.orderNumber}. We are preparing your books for dispatch via Domex Courier. Thank you!`,
            });
          }
        }
      } catch (dbErr) {
        console.warn("[PAYHERE_WEBHOOK_DB_WARNING]:", (dbErr as any)?.message);
      }
    }

    return NextResponse.json({ received: true, orderId, verified: true });
  } catch (err: any) {
    console.error("[PAYHERE_WEBHOOK_FATAL]:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
