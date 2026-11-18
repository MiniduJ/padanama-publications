"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cacheUserName } from "@/lib/use-account";

/** Shared sign-in / register form backed by /api/account/*. */
export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isReg = mode === "register";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch(`/api/account/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    if (!r?.ok) {
      setError(d?.error || "Network error");
      setLoading(false);
      return;
    }
    cacheUserName(d.user.name);
    const next = new URLSearchParams(window.location.search).get("next");
    const locale = window.location.pathname.split("/")[1] || "si";
    window.location.href = next?.startsWith("/") && !next.startsWith("//") ? next : `/${locale}/account`;
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <Logo size="md" />
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-maroon-900 tracking-tight pt-2">
          {isReg ? "නව ගිණුමක් සාදන්න (Register)" : "ගිණුමට පිවිසෙන්න (Sign in)"}
        </h1>
        <p className="text-xs text-ink-muted">
          {isReg ? "ඇණවුම් ලුහුබැඳීමට, ලිපින සුරැකීමට සහ ඊ-පොත් කියවීමට ලියාපදිංචි වන්න." : "ඔබගේ ජංගම අංකය හෝ ඊමේල් සහ මුරපදය ඇතුළත් කරන්න."}
        </p>
      </div>
      <form onSubmit={submit} className="bg-white p-6 sm:p-8 rounded-3xl border border-maroon-100 shadow-sm space-y-4">
        {error && <p role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">{error}</p>}
        {isReg ? (
          <>
            <Input name="name" label="සම්පූර්ණ නම (Full name)" required autoComplete="name" />
            <Input name="phone" label="ජංගම අංකය (Mobile)" placeholder="0771234567" required inputMode="tel" autoComplete="tel" />
            <Input name="email" type="email" label="ඊමේල් (Email – optional)" autoComplete="email" />
          </>
        ) : (
          <Input name="identifier" label="ජංගම අංකය හෝ ඊමේල් (Mobile or email)" required autoComplete="username" />
        )}
        <Input name="password" type="password" label="මුරපදය (Password)" required minLength={8} autoComplete={isReg ? "new-password" : "current-password"} />
        <Button type="submit" variant="saffron" className="w-full" disabled={loading}>
          {loading ? "රැඳී සිටින්න…" : isReg ? "ලියාපදිංචි වන්න (Create account)" : "පිවිසෙන්න (Sign in)"}
        </Button>
        <p className="text-center text-xs text-ink-muted">
          {isReg ? <>දැනටමත් ගිණුමක් තිබේද? <Link href="/login" className="font-bold text-maroon-700 hover:underline">පිවිසෙන්න</Link></>
            : <>ගිණුමක් නැද්ද? <Link href="/register" className="font-bold text-maroon-700 hover:underline">ලියාපදිංචි වන්න</Link></>}
        </p>
      </form>
    </div>
  );
}
