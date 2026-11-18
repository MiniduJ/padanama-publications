"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@padanamapublication.lk");
  const [password, setPassword] = useState("Padanama@Admin2026#Secure");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brandNavy via-brandNavy/95 to-maroon-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-maroon-100 p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-brandNavy">
              පරිපාලක පැනලය (Admin Portal)
            </h1>
            <p className="text-xs text-ink-muted mt-1">
              පදනම ප්‍රකාශන කළමනාකරණ පද්ධතියට ආරක්ෂිතව පිවිසෙන්න
            </p>
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
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-maroon-200 text-sm focus:outline-none focus:ring-2 focus:ring-brandRed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brandRed hover:bg-brandRed-600 text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>සත්‍යාපනය වෙමින් පවතී...</span>
            ) : (
              <>
                <span>පරිපාලක පැනලයට පිවිසෙන්න (Sign In)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center">
          <p className="text-[11px] text-ink-muted">
            පදනම ප්‍රකාශන (Padanama Publications) • Admin Security Suite 2026
          </p>
        </div>
      </div>
    </div>
  );
}
