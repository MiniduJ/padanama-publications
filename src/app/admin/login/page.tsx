"use client";

import React, { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Lock, Mail, ShieldAlert, ArrowRight, Eye, EyeOff, ShieldCheck, KeyRound, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@padanamapublication.lk");
  const [password, setPassword] = useState("Padanama@Admin2026#Secure");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillCredentials = () => {
    setEmail("admin@padanamapublication.lk");
    setPassword("Padanama@Admin2026#Secure");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Client-side Supabase Auth attempt
      try {
        const supabase = createClient();
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        });
      } catch (supaErr) {
        // Fallback gracefully to server session verification
        console.warn("Client Supabase auth note:", supaErr);
      }

      // 2. Server session verification & cookie setting
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Hard redirect to load admin panel with fresh cookies
      window.location.href = "/admin";
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brandNavy via-brandNavy/95 to-maroon-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-maroon-100 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brandYellow/30 text-brandNavy font-extrabold text-[11px] mb-2 border border-brandYellow/60">
              <ShieldCheck className="w-3.5 h-3.5 text-brandRed" />
              <span>SUPABASE AUTHENTICATED ADMIN CONSOLE</span>
            </div>
            <h1 className="font-display font-black text-2xl text-brandNavy">
              පරිපාලක පැනලය (Admin Portal)
            </h1>
            <p className="text-xs text-ink-muted mt-1">
              පදනම ප්‍රකාශන කළමනාකරණ පද්ධතියට ආරක්ෂිතව පිවිසෙන්න
            </p>
          </div>
        </div>

        {/* Credentials Info Helper Pill */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-extrabold text-brandNavy text-[11px]">
              <KeyRound className="w-3.5 h-3.5 text-brandRed" />
              <span>පරිපාලක පිවිසුම් තොරතුරු (Verified Admin Login):</span>
            </div>
            <button
              type="button"
              onClick={fillCredentials}
              className="text-[10px] font-extrabold text-brandRed hover:underline cursor-pointer"
            >
              ස්වයංක්‍රීයව පුරවන්න (Fill)
            </button>
          </div>
          <div className="text-[11px] space-y-1 font-mono bg-white p-2.5 rounded-xl border border-amber-200">
            <div className="flex justify-between">
              <span className="text-gray-500 font-sans text-[10px]">Email:</span>
              <span className="font-bold text-brandNavy select-all">admin@padanamapublication.lk</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-sans text-[10px]">Password:</span>
              <span className="font-bold text-brandRed select-all">Padanama@Admin2026#Secure</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brandNavy mb-1.5">
              පරිපාලක ඊමේල් ලිපිනය (Admin Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@padanamapublication.lk"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-maroon-200 text-sm focus:outline-none focus:ring-2 focus:ring-brandRed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brandNavy mb-1.5">
              මුරපදය (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-maroon-200 text-sm focus:outline-none focus:ring-2 focus:ring-brandRed font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brandRed hover:bg-brandRed-600 text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
          >
            {loading ? (
              <span>සත්‍යාපනය වෙමින් පවතී (Authenticating)...</span>
            ) : (
              <>
                <span>පරිපාලක පැනලයට පිවිසෙන්න (Sign In)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-ink-muted">
          <span>Padanama Admin Suite 2026</span>
          <a href="/" className="text-brandRed hover:underline font-bold">
            ← මුල් පිටුවට (Storefront)
          </a>
        </div>
      </div>
    </div>
  );
}
