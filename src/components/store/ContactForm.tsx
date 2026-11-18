"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    }).catch(() => null);
    if (res?.ok) { setState("sent"); e.currentTarget?.reset(); } else setState("error");
  };

  if (state === "sent") {
    return <p role="status" className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-semibold">ස්තූතියි! ඔබගේ පණිවිඩය ලැබුණා. අපි ඉක්මනින් අමතන්නෙමු. (Thank you — we will call you back soon.)</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input name="name" label="ඔබගේ නම (Full Name)" placeholder="සුනිල් පෙරේරා" required />
        <Input name="phone" label="දුරකථන අංකය (Phone Number)" placeholder="071 800 8533" required inputMode="tel" />
      </div>
      <Input name="email" label="විද්‍යුත් තැපෑල (Email Address)" type="email" placeholder="sunil@example.com" />
      <div className="space-y-1.5 text-left">
        <label htmlFor="contact-message" className="block text-xs font-bold text-ink">පණිවිඩය (Message / Book Request)</label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          maxLength={3000}
          placeholder="දරුවාගේ ශ්‍රේණිය සහ අවශ්‍ය පොත් මෙහි සටහන් කරන්න..."
          className="w-full p-3.5 bg-white border border-maroon-200 rounded-xl text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-saffron-500"
          required
        />
      </div>
      {state === "error" && <p role="alert" className="text-sm text-red-700">පණිවිඩය යැවීමට නොහැකි විය. කරුණාකර WhatsApp +94 71 800 8533 හරහා අමතන්න.</p>}
      <Button variant="saffron" className="w-full sm:w-auto" disabled={state === "sending"}>
        <Send className="w-4 h-4 mr-2" />
        <span>{state === "sending" ? "යවමින්…" : "පණිවිඩය යවන්න"}</span>
      </Button>
    </form>
  );
}
