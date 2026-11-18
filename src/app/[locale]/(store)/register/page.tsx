"use client";

import React, { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/account");
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <Logo size="md" />
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-maroon-900 tracking-tight pt-2">
          නව ගිණුමක් සාදන්න (Register)
        </h1>
        <p className="text-xs text-ink-muted">
          පොත්පත් ඇණවුම් කිරීමට සහ ඔබගේ කියවීමේ දත්ත සුරැකීමට ලියාපදිංචි වන්න.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-maroon-100 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="සම්පූර්ණ නම (Full Name)"
            placeholder="දිල්රුක්ෂි ජයවර්ධන"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="ජංගම දුරකථන අංකය (Mobile Number)"
            placeholder="077 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            helperText="ශ්‍රී ලංකා අංක ආකෘතිය (+94)"
            required
          />

          <Input
            label="විද්‍යුත් තැපෑල (Email Address)"
            type="email"
            placeholder="dilrukshi@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="මුරපදය (Password)"
            type="password"
            placeholder="අවම වශයෙන් අක්ෂර 8ක්"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-start gap-2 pt-2 text-xs text-ink-muted">
            <input type="checkbox" id="terms" required className="mt-0.5 rounded text-saffron-500" />
            <label htmlFor="terms">
              මම පදනම ප්‍රකාශන <Link href="/terms" className="text-maroon-700 underline">සේවා කොන්දේසි</Link> සහ <Link href="/privacy" className="text-maroon-700 underline">පුද්ගලිකත්ව ප්‍රතිපත්තිය (PDPA)</Link> පිළිගනිමි.
            </label>
          </div>

          <Button variant="saffron" className="w-full" isLoading={loading}>
            <span>ලියාපදිංචි වන්න (Register)</span>
          </Button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center text-xs text-ink-muted">
          <span>දැනටමත් ගිණුමක් තිබේද? </span>
          <Link href="/login" className="font-bold text-maroon-700 hover:underline">
            පිවිසෙන්න
          </Link>
        </div>
      </div>
    </div>
  );
}
