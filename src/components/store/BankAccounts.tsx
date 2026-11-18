"use client";

import { useEffect, useState } from "react";

/** Bank details from Admin > Page Content (key "bank.accounts", one account per line). */
export function BankAccounts({ className }: { className?: string }) {
  const [lines, setLines] = useState<string[] | null>(null);
  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((s) => setLines((s["bank.accounts"] || "").split("\n").filter(Boolean)))
      .catch(() => setLines([]));
  }, []);
  if (!lines) return null;
  return (
    <div className={className}>
      {lines.length ? lines.map((l) => <p key={l}>• {l}</p>) : <p>බැංකු ගිණුම් විස්තර සඳහා WhatsApp +94 71 800 8533 අමතන්න. (Contact us on WhatsApp for bank details.)</p>}
    </div>
  );
}
