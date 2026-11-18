"use client";

import { useCallback, useEffect, useState } from "react";

export interface AccountData {
  user: { id: string; name: string | null; email: string | null; phone: string | null; memberSince: string };
  orders: { orderNumber: string; status: string; createdAt: string; totalCents: number; paymentMethod: string; deliveryCourier: string | null; trackingNumber: string | null; items: { title: string; quantity: number; unitPriceCents: number }[] }[];
  addresses: { id: string; recipientName: string; phoneNumber: string; addressLine1: string; addressLine2: string | null; landmark: string | null; city: string; district: string; isDefault: boolean }[];
  library: { slug: string; titleSi: string; coverUrl: string | null }[];
}

/** Header-only display cache (not used for auth). */
export function cacheUserName(name: string | null) {
  try {
    if (name) localStorage.setItem("padanama_user", JSON.stringify({ name }));
    else localStorage.removeItem("padanama_user");
    window.dispatchEvent(new Event("padanama-user"));
  } catch { /* storage blocked */ }
}

export async function signOut() {
  await fetch("/api/account/login", { method: "DELETE" }).catch(() => {});
  cacheUserName(null);
}

/** Loads the signed-in customer; sends visitors who aren't signed in to /login. */
export function useAccount() {
  const [data, setData] = useState<AccountData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const r = await fetch("/api/account/me", { cache: "no-store" }).catch(() => null);
    if (r?.status === 401) {
      cacheUserName(null);
      const locale = window.location.pathname.split("/")[1] || "si";
      window.location.href = `/${locale}/login?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (!r?.ok) return setError("ගිණුම් තොරතුරු ලබාගත නොහැක. (Could not load your account.)");
    const d = (await r.json()) as AccountData;
    setData(d);
    cacheUserName(d.user.name);
  }, []);

  useEffect(() => { reload(); }, [reload]);
  return { data, error, reload };
}

export const ORDER_STATUS_SI: Record<string, string> = {
  PENDING_PAYMENT: "ගෙවීම බලාපොරොත්තුවෙන් (Awaiting payment)",
  PENDING_SLIP_VERIFICATION: "ලදුපත පරීක්ෂාවේ (Slip verification)",
  PAID: "ගෙවීම් තහවුරුයි (Paid)",
  COD_CONFIRMED: "තහවුරු කරන ලදී (COD confirmed)",
  PROCESSING: "සකසමින් (Processing)",
  PACKED: "ඇසුරුම් කළා (Packed)",
  SHIPPED: "පිටත් කළා (Shipped)",
  OUT_FOR_DELIVERY: "බෙදාහැරීමට (Out for delivery)",
  DELIVERED: "භාරදෙන ලදී (Delivered)",
  CANCELLED: "අවලංගුයි (Cancelled)",
  RETURN_REQUESTED: "ආපසු ඉල්ලීම (Return requested)",
  RETURNED: "ආපසු ලැබුණා (Returned)",
  REFUNDED: "මුදල් ආපසු (Refunded)",
  FAILED: "අසාර්ථකයි (Failed)",
};
