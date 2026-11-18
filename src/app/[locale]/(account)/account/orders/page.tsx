import React from "react";
import { formatLkr } from "@/lib/money";
import { Link } from "@/i18n/routing";
import { ShoppingBag, Truck, CheckCircle2, Clock, Upload, ArrowUpRight } from "lucide-react";

export default function AccountOrdersPage() {
  const orders = [
    {
      orderNumber: "PDN-2026-000412",
      date: "2026-11-16",
      status: "SHIPPED",
      statusLabel: "මඟදෝ (Dispatched)",
      courier: "Domex Courier",
      trackingNumber: "DMX-9812401",
      paymentMethod: "CASH_ON_DELIVERY",
      paymentMethodLabel: "Cash on Delivery (භාණ්ඩ ලැබුණු පසු මුදල්)",
      totalCents: 345000,
      items: [
        { title: "5 ශ්‍රේණිය ශිෂ්‍යත්ව පෙරහුරු ප්‍රශ්න පත්‍ර", qty: 2, priceCents: 104000 },
        { title: "සාමාන්‍ය පෙළ ගණිතය කෙටි සටහන්", qty: 1, priceCents: 85000 },
      ],
    },
    {
      orderNumber: "PDN-2026-000405",
      date: "2026-11-10",
      status: "PENDING_SLIP_VERIFICATION",
      statusLabel: "ස්ලිප් පත පරීක්ෂා වෙමින් පවතී",
      paymentMethod: "BANK_TRANSFER",
      paymentMethodLabel: "බැංකු තැන්පතු (Bank Transfer)",
      totalCents: 95000,
      slipUploaded: true,
      items: [{ title: "හන්තාන කඳු පාමුල (නවකතාව)", qty: 1, priceCents: 95000 }],
    },
    {
      orderNumber: "PDN-2026-000388",
      date: "2026-10-24",
      status: "DELIVERED",
      statusLabel: "භාරදෙන ලදී (Delivered)",
      courier: "Koombiyo Delivery",
      trackingNumber: "KMB-441029",
      paymentMethod: "PAYHERE",
      paymentMethodLabel: "කාඩ්පත් (PayHere)",
      totalCents: 165000,
      items: [{ title: "පෙර පාසල් ක්‍රියාකාරකම් පොත", qty: 3, priceCents: 165000 }],
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-maroon-100 pb-4">
        <h1 className="font-display font-bold text-2xl text-maroon-900">
          මගේ ඇණවුම් (Order History &amp; Tracking)
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          ඔබ විසින් සිදුකළ සියලුම ඇණවුම්වල තත්ත්වය සහ කුරියර් Tracking විස්තර මෙතැනින් පරීක්ෂා කරන්න.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.orderNumber}
            className="p-6 bg-white rounded-2xl border border-maroon-100 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-ink">{order.orderNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-800"
                      : order.status === "SHIPPED"
                      ? "bg-saffron-100 text-saffron-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {order.statusLabel}
                  </span>
                </div>
                <div className="text-xs text-ink-muted">දිනය: {order.date} • {order.paymentMethodLabel}</div>
              </div>

              <div className="text-right">
                <div className="font-display font-bold text-base text-maroon-900">
                  {formatLkr(order.totalCents, "si")}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-ink">
                  <span>{item.title} × {item.qty}</span>
                  <span className="font-semibold text-ink-muted">{formatLkr(item.priceCents, "si")}</span>
                </div>
              ))}
            </div>

            {/* Courier Tracking Section */}
            {order.trackingNumber && (
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs border border-gray-200">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-maroon-700" />
                  <span><strong>{order.courier}:</strong> {order.trackingNumber}</span>
                </div>
                <a
                  href={`https://domex.lk/tracking?tracking_no=${order.trackingNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-saffron-600 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>සජීවීව බලන්න</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
