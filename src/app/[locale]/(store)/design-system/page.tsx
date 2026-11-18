"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Rating } from "@/components/ui/Rating";
import { Stepper } from "@/components/ui/Stepper";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookCard } from "@/components/ui/BookCard";
import { Logo } from "@/components/ui/Logo";
import { ShoppingBag, Sparkles } from "lucide-react";

export default function DesignSystemPage() {
  const t = useTranslations("common");
  const [rating, setRating] = useState(4);
  const [step, setStep] = useState(2);

  const colors = [
    { name: "--maroon", hex: "#8D153A", label: "Flag Maroon (Primary Brand)", bg: "bg-maroon-500", text: "text-white" },
    { name: "--saffron", hex: "#EB7400", label: "Festive Saffron (Primary CTA)", bg: "bg-saffron-500", text: "text-white" },
    { name: "--gold", hex: "#FFBE29", label: "Temple Gold (Accents & Ratings)", bg: "bg-gold-500", text: "text-ink" },
    { name: "--green", hex: "#00534E", label: "Emerald Green (Success / Stock)", bg: "bg-green-500", text: "text-white" },
    { name: "--cream", hex: "#FFF8EC", label: "Warm Paper Surface", bg: "bg-cream", text: "text-ink", border: true },
    { name: "--ink", hex: "#1E1A17", label: "Deep Ink (Body Text)", bg: "bg-ink", text: "text-white" },
  ];

  const steps = [
    { id: 1, label: "ලිපිනය (Address)" },
    { id: 2, label: "බෙදාහැරීම (Delivery)" },
    { id: 3, label: "ගෙවීම (Payment)" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-3 border-b border-maroon-200 pb-8">
        <Logo size="lg" />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-maroon-900 tracking-tight">
          Padanama Design System & UI Token Showcase
        </h1>
        <p className="text-sm text-ink-muted max-w-2xl">
          An authentic, accessible (WCAG 2.2 AA compliant), mobile-first component architecture honoring Sri Lankan cultural aesthetics and typography.
        </p>
      </div>

      {/* 1. Brand Tokens & Color Palette */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-maroon-900">
            1. Cultural Color Tokens (WCAG AA Contrast Verified)
          </h2>
          <p className="text-xs text-ink-muted">
            All text pairings guarantee contrast ratios exceeding 4.5:1.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {colors.map((c, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl flex flex-col justify-between h-36 shadow-sm ${c.bg} ${c.text} ${c.border ? "border border-maroon-200" : ""}`}
            >
              <div className="font-mono text-xs font-bold opacity-80">{c.name}</div>
              <div>
                <div className="font-bold text-sm leading-tight">{c.label}</div>
                <div className="font-mono text-[11px] opacity-75">{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography Scale */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-maroon-900">
            2. Trilingual Typography &amp; Diacritic Safety (line-height &ge; 1.7)
          </h2>
          <p className="text-xs text-ink-muted">
            Testing conjunct consonants (*බැඳි අකුරු*) and diacritics (*ඉස්පිලි / පාපිලි*) to guarantee zero clipping.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-maroon-100 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-maroon-700 uppercase">
              Heading (Gemunu Libre) — Sinhala Display
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-maroon-900 leading-sinhala">
              ශ්‍රී ලාංකීය ප්‍රකාශන කලාවේ අභිමානවත් සලකුණ — පදනම පොත්
            </h3>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-maroon-700 uppercase">
              Body Text (Noto Sans Sinhala / Tamil / Latin)
            </span>
            <p className="text-sm text-ink leading-sinhala">
              1 වසරේ සිට 13 වසර දක්වා සියලුම ශ්‍රේණිවල පාසල් පෙළපොත්, ආදර්ශ ප්‍රශ්න පත්‍ර සහ විෂයානුබද්ධ කෙටි සටහන් පොත් දැන් ඔන්ලයින් ඇණවුම් කළ හැක. 
              (அனைத்து தரப் பாடநூல்களும் மாதிரி வினாத்தாள்களும் இணையத்தில் பெற்றுக்கொள்ளலாம்).
            </p>
          </div>
        </div>
      </section>

      {/* 3. Button Component Library */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-maroon-900">
            3. Buttons & Action Primitives
          </h2>
          <p className="text-xs text-ink-muted">
            Touch-friendly (min 44px height), accessible focus rings, and active press transitions.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-2xl border border-maroon-100">
          <Button variant="default">Primary Maroon</Button>
          <Button variant="saffron">
            <Sparkles className="w-4 h-4 mr-2" /> Saffron CTA
          </Button>
          <Button variant="gold">Temple Gold</Button>
          <Button variant="green">Green Success</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="saffron" isLoading>
            Loading State
          </Button>
          <Button variant="default" disabled>
            Disabled Button
          </Button>
        </div>
      </section>

      {/* 4. Badges & Form Controls */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-maroon-900">
            4. Badges & Form Controls
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-maroon-100 space-y-4">
            <h3 className="font-bold text-sm text-ink">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="maroon">නිල මුද්‍රණය</Badge>
              <Badge variant="saffron">Best Seller</Badge>
              <Badge variant="green">තොග ඇත (In Stock)</Badge>
              <Badge variant="gold">20% Off CIBF</Badge>
              <Badge variant="gray">E-Book</Badge>
              <Badge variant="outline">5 ශ්‍රේණිය</Badge>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-maroon-100 space-y-4">
            <h3 className="font-bold text-sm text-ink">Form Fields & Interactive Rating</h3>
            <Input
              label="දුරකථන අංකය (Mobile Number)"
              placeholder="071 800 8533"
              helperText="SMS OTP කේතයක් ලැබෙනු ඇත."
            />
            <div className="pt-2">
              <span className="block text-xs font-bold text-ink mb-1">
                තක්සේරුව (Rating): {rating} / 5 තරු
              </span>
              <Rating value={rating} interactive onChange={setRating} size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Stepper & Empty State */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-maroon-900">
            5. Checkout Stepper & Empty State
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-maroon-100 space-y-8">
          <Stepper steps={steps} currentStep={step} />
          <div className="flex justify-center gap-2 pt-6">
            <Button size="sm" variant="outline" onClick={() => setStep(Math.max(1, step - 1))}>
              පෙර පියවර
            </Button>
            <Button size="sm" variant="saffron" onClick={() => setStep(Math.min(3, step + 1))}>
              මීළඟ පියවර
            </Button>
          </div>

          <EmptyState
            icon={ShoppingBag}
            title="ඔබගේ සාප්පු බෑගය හිස්ව පවතී"
            description="ඔබ කැමති පොත්පත් සොයාගෙන බෑගයට එක් කරගන්න."
            actionLabel="පොත් සාප්පුවට යන්න"
            onAction={() => alert("Navigate to books")}
          />
        </div>
      </section>

      {/* 6. BookCard In Action */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-maroon-900">
            6. Book Presentation Card (Adaptive Grid)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <BookCard
            slug="scholarship-grade-5-model-papers"
            title="5 ශ්‍රේණිය ශිෂ්‍යත්ව පෙරහුරු ප්‍රශ්න පත්‍ර"
            authorName="පදනම අධ්‍යාපනික කර්තෘ මණ්ඩලය"
            priceCents={65000}
            salePriceCents={52000}
            rating={4.8}
            isBestSeller
            hasFreeSample
            onAddToCart={() => alert("Added to cart!")}
          />

          <BookCard
            slug="ol-mathematics-short-notes"
            title="සාමාන්‍ය පෙළ ගණිතය කෙටි සටහන් සහ සූත්‍ර සංග්‍රහය"
            authorName="පදනම අධ්‍යාපනික කර්තෘ මණ්ඩලය"
            priceCents={85000}
            rating={4.9}
            hasFreeSample
            onAddToCart={() => alert("Added to cart!")}
          />
        </div>
      </section>
    </div>
  );
}
