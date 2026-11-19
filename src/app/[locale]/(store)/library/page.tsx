import React from "react";
import { Link } from "@/i18n/routing";
import { getBooks } from "@/server/catalog/books";
import { formatLkr } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import {
  BookMarked,
  Sparkles,
  Eye,
  CheckCircle2,
  Lock,
  ArrowRight,
  Bookmark,
  Sun,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

interface LibraryPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function DigitalLibraryPage({ params, searchParams }: LibraryPageProps) {
  const { locale } = await params;
  const { category } = await searchParams;
  const result = await getBooks({ category, type: "BOOK", limit: 20 });
  const books = result.books;

  const categories = [
    { id: "", label: "සියලු පොත් (All)" },
    { id: "primary", label: "ප්‍රාථමික (Primary)" },
    { id: "grade-6-7", label: "6-7 ශ්‍රේණි" },
    { id: "grade-8-9", label: "8-9 ශ්‍රේණි" },
    { id: "gce-ol", label: "සාමාන්‍ය පෙළ (O/L)" },
    { id: "gce-al-science", label: "උසස් පෙළ (A/L)" },
    { id: "gov-exam-past-papers", label: "පසුගිය ප්‍රශ්න පත්‍ර" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-maroon-900 via-maroon-850 to-maroon-950 p-6 sm:p-12 text-cream relative overflow-hidden shadow-xl border border-gold-500/30">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 backdrop-blur px-3.5 py-1.5 rounded-full border border-gold-500/40 text-xs font-bold text-gold-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>නොමිලේ ඩිජිටල් පෙරදසුන (Instant Free Sample Reader)</span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl leading-tight">
            පදනම ඩිජිටල් පුස්තකාලය
          </h1>

          <p className="text-xs sm:text-sm text-cream/80 leading-relaxed">
            මිලදී ගැනීමට පෙර ඕනෑම පොතක පළමු පරිච්ඡේද සහ ආදර්ශ පිටු ඔබගේ Browser එකෙන්ම දැන්ම නොමිලේ කියවන්න. බාගත කිරීම් හෝ ගිණුම් අවශ්‍ය නැත.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-cream/90">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-gold-400" />
              <span>පළමු පිටු 20 ක් නොමිලේ</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-gold-400" />
              <span>ඇසට හිතකර Night & Sepia Modes</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-gold-400" />
              <span>Mobile-First කියවීමේ අත්දැකීම</span>
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => {
          const isActive = (category || "") === c.id;
          return (
            <Link
              key={c.id}
              href={c.id ? `/library?category=${c.id}` : "/library"}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-maroon-900 text-cream shadow-md"
                  : "bg-white border border-maroon-100 text-ink hover:border-maroon-300"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book: any) => {
          const primaryEdition = book.editions?.[0] || {};
          const authorName = book.authors?.[0]?.author?.nameSi || "පදනම කර්තෘ මණ්ඩලය";
          const maxPages = book.sampleConfig?.maxPages || 20;

          return (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-maroon-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group text-left"
            >
              {/* Top Banner / Cover */}
              <div className="relative aspect-[1/1.2] bg-gradient-to-tr from-maroon-50 via-cream to-white flex items-center justify-center p-4 border-b border-gray-100">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.titleSi} loading="lazy" className="h-full w-auto max-w-full object-contain rounded-lg shadow-md group-hover:scale-105 transition-transform" />
                ) : (
                <div className="w-28 h-36 bg-maroon-800 text-cream rounded-lg shadow-md p-3 flex flex-col justify-between border border-gold-500/40 group-hover:scale-105 transition-transform">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gold-400">
                    පදනම
                  </span>
                  <span className="font-display font-bold text-xs line-clamp-3 leading-snug">
                    {book.titleSi}
                  </span>
                  <span className="text-[9px] text-cream/70 line-clamp-1">{authorName}</span>
                </div>
                )}

                <div className="absolute top-3 left-3">
                  <Badge variant="gold">පිටු {maxPages}ක් නොමිලේ</Badge>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <Link
                    href={`/books/${book.slug}`}
                    className="font-display font-bold text-sm sm:text-base text-maroon-900 hover:text-saffron-700 transition-colors line-clamp-2 block"
                  >
                    {book.titleSi}
                  </Link>
                  <p className="text-xs text-ink-muted">{authorName}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-bold text-saffron-700">
                    {formatLkr(primaryEdition.salePriceCents || primaryEdition.priceCents || 65000, locale as any)}
                  </span>
                  <Rating value={book.averageRating || 4.9} size="sm" />
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <Link
                    href={`/read/${book.slug}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <BookMarked className="w-3.5 h-3.5" />
                    <span>නොමිලේ කියවන්න (Read Sample)</span>
                  </Link>

                  <Link
                    href={`/books/${book.slug}`}
                    className="w-full py-2 px-3 rounded-xl border border-maroon-200 hover:bg-cream text-maroon-900 font-semibold text-xs text-center block transition-colors"
                  >
                    විස්තර බලන්න (View Details)
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
