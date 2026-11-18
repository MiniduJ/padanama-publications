import { NextRequest, NextResponse } from "next/server";
import { ordersRepository } from "@/server/orders/orders-repository";

export async function GET() {
  try {
    const orders = ordersRepository.getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch orders", details: err?.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, status, courier, waybillNumber } = body;

    if (!orderNumber || !status) {
      return NextResponse.json({ error: "Missing orderNumber or status" }, { status: 400 });
    }

    const updated = ordersRepository.updateOrderStatus(orderNumber, status, {
      courier,
      waybillNumber,
    });

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update order", details: err?.message }, { status: 500 });
  }
}
