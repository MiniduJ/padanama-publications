import React from "react";
import { Link } from "@/i18n/routing";
import { formatLkr } from "@/lib/money";
import { ShoppingBag, BookOpen, Clock, ChevronRight } from "lucide-react";

export default function AccountOverviewPage() {
  const recentOrders = [
    {
      orderNumber: "PDN-2026-000412",
      date: "2026-11-16",
      status: "SHIPPED",
      statusLabel: "මඟදෝ (Dispatched via Domex)",
      totalCents: 345000,
      itemCount: 3,
      trackingNumber: "DMX-9812401",
    },
    {
      orderNumber: "PDN-2026-000388",
      date: "2026-10-24",
      status: "DELIVERED",
      statusLabel: "භාරදෙන ලදී (Delivered)",
      totalCents: 165000,
      itemCount: 2,
    },
  ];

  return (
    <div className="space-y-8 text-left">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-maroon-100 shadow-sm space-y-2">
        <h1 className="font-display font-extrabold text-2xl text-maroon-900">
          ආයුබෝවන්, දිල්රුක්ෂි! (Welcome Back)
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          ඔබගේ ඇණවුම්, කියවීමේ ප්‍රගතිය සහ ලිපින මෙතැනින් කළමනාකරණය කරන්න.
        </p>
      </div>

      {/* Reading Progress Shelf */}
      <div className="bg-white p-6 rounded-3xl border border-maroon-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="font-bold text-sm text-maroon-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-saffron-500" />
            <span>නැවත කියවීම අරඹන්න (Continue Reading)</span>
          </h2>
          <Link href="/account/my-library" className="text-xs text-saffron-600 font-bold hover:underline">
            සියලු ඊ-පොත් →
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-cream/70 border border-gold-300/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-bold text-sm text-maroon-900 block">
              හන්තාන කඳු පාමුල (Hanthana Kadu Pamula)
            </span>
            <span className="text-xs text-ink-muted block">
              අවසන් වරට කියවූයේ: 2 වන පරිච්ඡේදය (පිටුව 48 / 280)
            </span>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-saffron-500 rounded-full" style={{ width: "17%" }} />
            </div>
          </div>

          <Link
            href="/read/hanthana-kadu-pamula"
            className="px-4 py-2 bg-maroon-900 hover:bg-maroon-950 text-cream text-xs font-bold rounded-xl shadow transition-colors"
          >
            කියවීම අරඹන්න
          </Link>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white p-6 rounded-3xl border border-maroon-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="font-bold text-sm text-maroon-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-saffron-500" />
            <span>මෑත ඇණවුම් (Recent Orders)</span>
          </h2>
          <Link href="/account/orders" className="text-xs text-saffron-600 font-bold hover:underline">
            සියලු ඇණවුම් →
          </Link>
        </div>

        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.orderNumber}
              className="p-4 rounded-xl border border-gray-100 hover:border-maroon-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-ink">{order.orderNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    order.status === "DELIVERED" ? "bg-green-100 text-green-800" : "bg-saffron-100 text-saffron-800"
                  }`}>
                    {order.statusLabel}
                  </span>
                </div>
                <div className="text-xs text-ink-muted">
                  දිනය: {order.date} • භාණ්ඩ {order.itemCount}ක් • එකතුව: <strong>{formatLkr(order.totalCents, "si")}</strong>
                </div>
              </div>

              <Link
                href={`/account/orders?id=${order.orderNumber}`}
                className="text-xs font-bold text-maroon-700 hover:text-maroon-900 flex items-center gap-1 self-end sm:self-center"
              >
                <span>විස්තර බලන්න</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
