"use client";

import React, { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Phone, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/account");
    }, 600);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
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
          ගිණුමට පිවිසෙන්න (Sign In)
        </h1>
        <p className="text-xs text-ink-muted">
          ඔබගේ පොත් ඇණවුම් සහ ඩිජිටල් පුස්තකාලය පරිහරණය සඳහා පිවිසෙන්න.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-maroon-100 shadow-sm space-y-6">
        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-maroon-50 rounded-xl text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setAuthMethod("phone")}
            className={`py-2 rounded-lg transition-all ${
              authMethod === "phone" ? "bg-white text-maroon-900 shadow-sm" : "text-ink-muted"
            }`}
          >
            දුරකථන අංකය (SMS OTP)
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod("email")}
            className={`py-2 rounded-lg transition-all ${
              authMethod === "email" ? "bg-white text-maroon-900 shadow-sm" : "text-ink-muted"
            }`}
          >
            විද්‍යුත් තැපෑල (Email)
          </button>
        </div>

        {authMethod === "phone" ? (
          !otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label="ජංගම දුරකථන අංකය (Mobile Number)"
                placeholder="071 800 8533"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                helperText="ශ්‍රී ලාංකීය ඕනෑම ජංගම දුරකථන ජාලයකට SMS OTP කේතයක් එවනු ලැබේ."
                required
              />

              <Button variant="saffron" className="w-full" isLoading={loading}>
                <Phone className="w-4 h-4 mr-2" />
                <span>OTP කේතය ලබාගන්න</span>
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-700 shrink-0" />
                <span>{phoneNumber} වෙත SMS OTP කේතය එවන ලදී.</span>
              </div>

              <Input
                label="4-ඉලක්කම් OTP කේතය (Enter 4-Digit Code)"
                placeholder="1234"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={4}
                required
              />

              <Button variant="saffron" className="w-full" isLoading={loading}>
                <span>තහවුරු කර පිවිසෙන්න</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              label="විද්‍යුත් තැපෑල (Email Address)"
              type="email"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="මුරපදය (Password)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button variant="saffron" className="w-full" isLoading={loading}>
              <Lock className="w-4 h-4 mr-2" />
              <span>පිවිසෙන්න (Sign In)</span>
            </Button>
          </form>
        )}

        <div className="pt-4 border-t border-gray-100 text-center text-xs text-ink-muted">
          <span>නව ගිණුමක් ආරම්භ කරන්න? </span>
          <Link href="/register" className="font-bold text-maroon-700 hover:underline">
            ලියාපදිංචි වන්න
          </Link>
        </div>
      </div>
    </div>
  );
}
