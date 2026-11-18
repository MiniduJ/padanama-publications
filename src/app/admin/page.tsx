"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, FileCheck, BookOpen, AlertTriangle, Inbox, Wallet } from "lucide-react";

const rs = (c = 0) => `Rs. ${(c / 100).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
const human = (s: string) => s.replace(/_/g, " ").toLowerCase();

export default function AdminDashboard() {
  const [s, setS] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/admin/stats").then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error); setS(d); }).catch((e) => setErr(e.message));
  }, []);

  const tiles = [
    { label: "Revenue · 30 days", value: s && rs(s.revenue30dCents), href: "/admin/finance", icon: Wallet },
    { label: "Orders · 30 days", value: s?.orders30d, href: "/admin/orders", icon: ShoppingBag },
    { label: "Slips to verify", value: s?.slips, href: "/admin/slips", icon: FileCheck, alert: s?.slips > 0 },
    { label: "Low stock editions", value: s?.lowStock, href: "/admin/catalog", icon: AlertTriangle, alert: s?.lowStock > 0 },
    { label: "Books in catalogue", value: s?.books, href: "/admin/catalog", icon: BookOpen },
    { label: "Unread messages", value: s?.messages, href: "/admin/messages", icon: Inbox, alert: s?.messages > 0 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-brandNavy">Dashboard</h1>
      {err && <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{err}</div>}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className={`bg-white rounded-2xl border p-5 hover:shadow-md transition ${t.alert ? "border-amber-400" : ""}`}>
            <t.icon className={`w-5 h-5 ${t.alert ? "text-amber-600" : "text-brandNavy"}`} />
            <p className="text-2xl font-black text-brandNavy mt-2">{t.value ?? "…"}</p>
            <p className="text-xs font-bold text-gray-500">{t.label}</p>
          </Link>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border p-5">
          <h2 className="font-black text-brandNavy mb-3">Recent orders</h2>
          <ul className="divide-y text-sm">
            {s?.recent?.map((o: any) => (
              <li key={o.id} className="py-2 flex justify-between gap-2">
                <span><b>{o.orderNumber}</b> · {o.customerName || "Guest"}</span>
                <span className="text-right">{rs(o.totalCents)} <span className="text-xs text-gray-500 block">{human(o.status)}</span></span>
              </li>
            ))}
            {s && !s.recent?.length && <li className="py-4 text-gray-500">No orders yet.</li>}
          </ul>
        </section>
        <section className="bg-white rounded-2xl border p-5">
          <h2 className="font-black text-brandNavy mb-3">Most-read samples</h2>
          <ul className="divide-y text-sm">
            {s?.topRead?.map((b: any) => (
              <li key={b.id} className="py-2 flex justify-between"><span>{b.titleSi}</span><b>{b.readCount}</b></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
