"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { formatLkr } from "@/lib/money";
import { useAccount, signOut, ORDER_STATUS_SI, type AccountData } from "@/lib/use-account";
import { User, ShoppingBag, BookOpen, MapPin, ShieldCheck, LogOut, Trash2, Download, Truck } from "lucide-react";

const card = "bg-white p-6 rounded-3xl border border-maroon-100 shadow-sm";
const NAV = [
  { label: "ගිණුම් දළ විශ්ලේෂණය (Overview)", href: "/account", icon: User },
  { label: "මගේ ඇණවුම් (Order History)", href: "/account/orders", icon: ShoppingBag },
  { label: "මගේ පුස්තකාලය (My E-Books)", href: "/account/my-library", icon: BookOpen },
  { label: "ලිපින පොත (Saved Addresses)", href: "/account/addresses", icon: MapPin },
  { label: "පුද්ගලිකත්ව මධ්‍යස්ථානය (PDPA Privacy)", href: "/account/privacy", icon: ShieldCheck },
] as const;

const leave = async () => { await signOut(); window.location.href = `/${location.pathname.split("/")[1] || "si"}/login`; };

/** Wraps account pages: loads the signed-in customer once and renders sidebar + the chosen view. */
export function AccountShell({ view }: { view: "overview" | "orders" | "library" | "addresses" | "privacy" }) {
  const { data, error, reload } = useAccount();
  if (error) return <p role="alert" className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">{error}</p>;
  if (!data) return <p className="py-20 text-center text-sm text-ink-muted" aria-busy="true">පූරණය වෙමින්… (Loading)</p>;
  const u = data.user;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
      <aside className="bg-white p-6 rounded-2xl border border-maroon-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-maroon-700 text-cream font-bold text-lg flex items-center justify-center border-2 border-gold-500" aria-hidden>
            {(u.name || "?").trim().charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <span className="font-bold text-sm text-ink block truncate">{u.name}</span>
            <span className="text-xs text-ink-muted block truncate">{u.phone?.replace("+94", "0")}</span>
          </div>
        </div>
        <nav className="space-y-1 text-xs font-semibold">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-maroon-50 text-ink hover:text-maroon-900">
              <Icon className="w-4 h-4 text-saffron-500 shrink-0" /><span>{label}</span>
            </Link>
          ))}
          <button type="button" onClick={leave} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-red-50 text-red-600 border-t border-gray-100 mt-2">
            <LogOut className="w-4 h-4 shrink-0" /><span>පිටවීම (Sign Out)</span>
          </button>
        </nav>
      </aside>
      <div className="md:col-span-3 space-y-8 text-left">
        {view === "overview" && <Overview d={data} />}
        {view === "orders" && <Orders d={data} />}
        {view === "library" && <Library d={data} />}
        {view === "addresses" && <Addresses d={data} reload={reload} />}
        {view === "privacy" && <Privacy d={data} />}
      </div>
    </div>
  );
}

function OrderList({ orders, detailed }: { orders: AccountData["orders"]; detailed?: boolean }) {
  if (!orders.length) return <p className="text-sm text-ink-muted py-6 text-center">තවම ඇණවුම් නැත. <Link href="/books" className="font-bold text-maroon-700 underline">පොත් තෝරන්න</Link></p>;
  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.orderNumber} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold">{o.orderNumber}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${o.status === "DELIVERED" || o.status === "PAID" ? "bg-green-100 text-green-800" : "bg-saffron-100 text-saffron-800"}`}>{ORDER_STATUS_SI[o.status] || o.status}</span>
          </div>
          <p className="text-xs text-ink-muted">
            දිනය: {new Date(o.createdAt).toLocaleDateString("en-GB")} • භාණ්ඩ {o.items.reduce((n, i) => n + i.quantity, 0)} • එකතුව: <strong>{formatLkr(o.totalCents, "si")}</strong>
          </p>
          {(o.deliveryCourier || o.trackingNumber) && (
            <p className="text-xs flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" />{o.deliveryCourier === "DOMEX" ? "Domex" : o.deliveryCourier === "KOOMBIYO" ? "Koombiyo" : ""} {o.trackingNumber && <>• Tracking: <b>{o.trackingNumber}</b></>}</p>
          )}
          {detailed && <ul className="text-xs list-disc pl-5">{o.items.map((i, k) => <li key={k}>{i.title} × {i.quantity} — {formatLkr(i.unitPriceCents * i.quantity, "si")}</li>)}</ul>}
        </li>
      ))}
    </ul>
  );
}

function Overview({ d }: { d: AccountData }) {
  return (
    <>
      <div className={card}>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-800 text-xs font-bold border border-green-200"><ShieldCheck className="w-3.5 h-3.5" />ලියාපදිංචි සාමාජික (Member since {new Date(d.user.memberSince).toLocaleDateString("en-GB", { month: "short", year: "numeric" })})</div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-brandNavy pt-2">ආයුබෝවන්, {d.user.name}!</h1>
        <p className="text-xs sm:text-sm text-ink-muted">{d.user.phone?.replace("+94", "0")} {d.user.email && `• ${d.user.email}`}</p>
      </div>
      <section className={card}>
        <div className="flex justify-between pb-3 border-b border-gray-100 mb-3">
          <h2 className="font-bold text-sm text-maroon-900">මෑත ඇණවුම් (Recent Orders)</h2>
          <Link href="/account/orders" className="text-xs text-saffron-600 font-bold hover:underline">සියලු ඇණවුම් →</Link>
        </div>
        <OrderList orders={d.orders.slice(0, 3)} />
      </section>
    </>
  );
}

function Orders({ d }: { d: AccountData }) {
  return <section className={card}><h1 className="font-display font-bold text-2xl text-maroon-900 mb-4">මගේ ඇණවුම් (Order History)</h1><OrderList orders={d.orders} detailed /></section>;
}

function Library({ d }: { d: AccountData }) {
  return (
    <section className={card}>
      <h1 className="font-display font-bold text-2xl text-maroon-900 mb-4">මගේ පුස්තකාලය (My E-Books)</h1>
      {!d.library.length ? <p className="text-sm text-ink-muted">මිලදී ගත් ඊ-පොත් තවම නැත. නොමිලේ සාම්පල <Link href="/library" className="font-bold text-maroon-700 underline">මෙතැනින්</Link>.</p> : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {d.library.map((b) => (
            <li key={b.slug}><Link href={`/read/${b.slug}`} className="block space-y-2">
              {b.coverUrl && <img src={b.coverUrl} alt="" className="w-full aspect-[3/4] object-cover rounded-lg border" />}
              <span className="text-xs font-bold">{b.titleSi}</span>
            </Link></li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Addresses({ d, reload }: { d: AccountData; reload: () => void }) {
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState(!d.addresses.length);
  const add = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const r = await fetch("/api/account/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))) });
    if (!r.ok) return setErr((await r.json()).error);
    setErr(null); setOpen(false); reload();
  };
  const del = async (id: string) => { await fetch(`/api/account/addresses?id=${id}`, { method: "DELETE" }); reload(); };
  const f = "w-full px-3 py-2.5 rounded-xl border border-maroon-200 text-sm";
  return (
    <section className={`${card} space-y-4`}>
      <h1 className="font-display font-bold text-2xl text-maroon-900">ලිපින පොත (Saved Addresses)</h1>
      {d.addresses.map((a) => (
        <div key={a.id} className="p-4 rounded-xl border bg-gray-50/50 flex justify-between gap-3 text-sm">
          <div><b>{a.recipientName}</b> {a.isDefault && <span className="text-[10px] px-2 rounded bg-green-100 text-green-800 font-bold">Default</span>}<br />{a.addressLine1}{a.addressLine2 && `, ${a.addressLine2}`}<br />{a.city}, {a.district} • {a.phoneNumber.replace("+94", "0")}</div>
          <button onClick={() => del(a.id)} aria-label="Delete address" className="text-red-600 self-start"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
      {open ? (
        <form onSubmit={add} className="grid sm:grid-cols-2 gap-3">
          {err && <p role="alert" className="sm:col-span-2 text-xs text-red-700">{err}</p>}
          <input name="recipientName" required placeholder="ලබන්නාගේ නම (Name)" aria-label="Recipient name" defaultValue={d.user.name || ""} className={f} />
          <input name="phoneNumber" required placeholder="ජංගම අංකය (Mobile)" aria-label="Mobile" defaultValue={d.user.phone?.replace("+94", "0") || ""} className={f} />
          <input name="addressLine1" required placeholder="ලිපිනය (Address line 1)" aria-label="Address line 1" className={`${f} sm:col-span-2`} />
          <input name="addressLine2" placeholder="ලිපිනය 2 (optional)" aria-label="Address line 2" className={`${f} sm:col-span-2`} />
          <input name="city" required placeholder="නගරය (City)" aria-label="City" className={f} />
          <input name="district" required placeholder="දිස්ත්‍රික්කය (District)" aria-label="District" className={f} />
          <button className="sm:col-span-2 py-2.5 rounded-xl bg-maroon-900 text-cream text-sm font-bold">ලිපිනය සුරකින්න (Save address)</button>
        </form>
      ) : <button onClick={() => setOpen(true)} className="text-sm font-bold text-maroon-700 underline">+ නව ලිපිනයක් (Add address)</button>}
    </section>
  );
}

function Privacy({ d }: { d: AccountData }) {
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ ...d, exportedAt: new Date().toISOString(), law: "Sri Lanka PDPA No. 9 of 2022" }, null, 2)], { type: "application/json" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "padanama-my-data.json" });
    a.click(); URL.revokeObjectURL(a.href);
  };
  const erase = async () => {
    if (!confirm("ඔබගේ ගිණුම ස්ථිරවම මකා දැමීමට අවශ්‍යද? (Permanently delete your account? Orders stay for accounting, without your personal details.)")) return;
    await fetch("/api/account/me", { method: "DELETE" });
    await signOut();
    window.location.href = `/${location.pathname.split("/")[1] || "si"}`;
  };
  return (
    <section className={`${card} space-y-4`}>
      <h1 className="font-display font-bold text-2xl text-maroon-900">පුද්ගලිකත්ව මධ්‍යස්ථානය (PDPA Privacy)</h1>
      <p className="text-sm text-ink-muted">ඔබ ගැන අප තබාගන්නා සියලු දත්ත බාගන්න හෝ ගිණුම මකන්න.</p>
      <div className="flex flex-wrap gap-3">
        <button onClick={exportData} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold"><Download className="w-4 h-4" />මගේ දත්ත බාගන්න (Download my data)</button>
        <button onClick={erase} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold"><Trash2 className="w-4 h-4" />ගිණුම මකන්න (Delete account)</button>
      </div>
    </section>
  );
}
