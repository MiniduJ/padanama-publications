"use client";

import React, { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Lock, Mail, ShieldAlert, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      const from = new URLSearchParams(window.location.search).get("from");
      window.location.href = from?.startsWith("/admin") ? from : "/admin";
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const field = "w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brandNavy";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brandNavy to-maroon-950 flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 space-y-5">
        <div className="text-center space-y-2">
          <div className="flex justify-center"><Logo size="lg" /></div>
          <h1 className="font-black text-2xl text-brandNavy">Admin sign in</h1>
          <p className="text-xs text-gray-500">Padanama Publications management console</p>
        </div>

        {error && (
          <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <label className="block">
          <span className="block text-xs font-bold text-brandNavy mb-1.5">Email</span>
          <span className="relative block">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
            <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
          </span>
        </label>

        <label className="block">
          <span className="block text-xs font-bold text-brandNavy mb-1.5">Password</span>
          <span className="relative block">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
            <input type={show ? "text" : "password"} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </span>
        </label>

        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-brandNavy hover:bg-brandNavy/90 text-white font-extrabold text-sm disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
