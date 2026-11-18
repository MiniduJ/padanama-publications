"use client";

import { useEffect, useState } from "react";
import { ResourceManager } from "@/components/admin/ResourceManager";

const rs = (c = 0) => `Rs. ${(c / 100).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;

export default function FinancePage() {
  const [s, setS] = useState<any>(null);
  useEffect(() => { fetch("/api/admin/stats").then((r) => r.json()).then(setS).catch(() => {}); }, []);
  const cards = [
    ["Revenue (30 days)", s?.revenue30dCents, "text-green-700"],
    ["Expenses (30 days)", s?.expenses30dCents, "text-red-700"],
    ["Net profit (30 days)", s?.profit30dCents, (s?.profit30dCents ?? 0) >= 0 ? "text-brandNavy" : "text-red-700"],
  ] as const;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(([label, v, color]) => (
          <div key={label} className="bg-white rounded-2xl border p-5">
            <p className="text-xs font-bold text-gray-500 uppercase">{label}</p>
            <p className={`text-2xl font-black mt-1 ${color}`}>{s ? rs(v) : "…"}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500">Revenue counts paid, COD-confirmed and shipped/delivered orders. Record printing, royalties, courier bills, salaries etc. below.</p>
      <ResourceManager resource="expenses" />
    </div>
  );
}
