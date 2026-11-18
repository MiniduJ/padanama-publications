"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { formatLkr } from "@/lib/money";
import { Rating } from "./Rating";
import { BookMarked, ShoppingBag, Sparkles, Check, Tag } from "lucide-react";
import { Badge } from "./Badge";
import { cartActions } from "@/lib/cart-store";

export interface BookCardProps {
  slug: string;
  title: string;
  authorName: string;
  coverUrl?: string;
  priceCents: number;
  salePriceCents?: number | null;
  rating?: number;
  format?: string;
  hasFreeSample?: boolean;
  isBestSeller?: boolean;
  categoryName?: string;
  onAddToCart?: () => void;
}

export function BookCard({
  slug,
  title,
  authorName,
  coverUrl,
  priceCents,
  salePriceCents,
  rating = 4.9,
  format = "Paperback",
  hasFreeSample = true,
  isBestSeller = false,
  categoryName,
  onAddToCart,
}: BookCardProps) {
  const [justAdded, setJustAdded] = React.useState(false);
  const [cardCount, setCardCount] = React.useState(0);
  const locale = useLocale();
  const b = useTranslations("book");
  const c = useTranslations("common");

  const currentPrice = salePriceCents ?? priceCents;
  const isDiscounted = salePriceCents !== null && salePriceCents !== undefined && salePriceCents < priceCents;
  const discountPercent = isDiscounted ? Math.round(((priceCents - salePriceCents) / priceCents) * 100) : 0;
  const savingsCents = isDiscounted ? priceCents - salePriceCents : 0;

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart();
    } else {
      cartActions.addItem({
        id: `${slug}_PAPERBACK`,
        bookId: slug,
        slug,
        title,
        authorName,
        format: "PAPERBACK",
        priceCents: currentPrice,
        originalPriceCents: priceCents,
        coverImage: coverUrl || "/images/books/placeholder.svg",
        weightGrams: 300,
      });
    }

    setCardCount((prev) => prev + 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl border border-maroon-100/80 hover:border-brandRed-500/50 shadow-xs sm:shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden text-left hover:-translate-y-1 focus-within:ring-2 focus-within:ring-brandNavy focus-within:ring-offset-2">
      {/* Book Cover Area */}
      <div className="relative aspect-[1/1.38] bg-gradient-to-tr from-maroon-50 via-cream to-white flex items-center justify-center p-2 sm:p-3.5 overflow-hidden border-b border-gray-100">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-contain rounded-md sm:rounded-lg shadow-xs group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-24 sm:w-28 h-32 sm:h-40 bg-gradient-to-br from-brandNavy to-maroon-900 text-cream rounded-md shadow-md p-2 sm:p-3 flex flex-col justify-between border-2 border-brandYellow/60">
            <span className="text-[11px] sm:text-[11px] font-extrabold uppercase tracking-widest text-brandYellow">
              පදනම
            </span>
            <span className="font-display font-bold text-[11px] sm:text-xs line-clamp-3 leading-snug">
              {title}
            </span>
            <span className="text-[8px] sm:text-[11px] text-cream/70 line-clamp-1">{authorName}</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {isDiscounted && discountPercent > 0 && (
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[11px] sm:text-[11px] font-black bg-brandRed text-white shadow-md border border-brandRed-700 animate-pulse">
              <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" /> -{discountPercent}%
            </span>
          )}
          {isBestSeller && (
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[11px] font-bold bg-brandYellow text-brandNavy shadow-xs border border-brandYellow-600">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 text-brandNavy" />
              <span className="hidden xs:inline">{b("bestSeller")}</span>
            </span>
          )}
        </div>

        {/* Free Sample Quick Read Button */}
        {hasFreeSample && (
          <Link
            href={`/read/${slug}`}
            className="absolute bottom-2 right-2 p-2.5 sm:px-2.5 sm:py-1 bg-white/95 hover:bg-brandYellow hover:text-brandNavy text-brandNavy border border-brandYellow/80 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-bold shadow-md flex items-center gap-1 backdrop-blur-sm opacity-90 group-hover:opacity-100 transition-all"
            title={b("readFreeSample")}
          >
            <BookMarked className="w-3.5 h-3.5 text-brandRed" />
            <span className="hidden sm:inline">{b("readFreeSample")}</span>
          </Link>
        )}
      </div>

      {/* Book Information */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div className="space-y-1 sm:space-y-1.5">
          {/* Metadata Row: Category & In-Stock */}
          <div className="flex items-center justify-between text-[11px] sm:text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-cream text-maroon-900 font-semibold truncate max-w-[85px] sm:max-w-[150px]">
              {categoryName || format}
            </span>
            <div className="flex items-center gap-1 text-green-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] sm:text-[11px]">{b("inStock")}</span>
            </div>
          </div>

          {/* Book Title */}
          <Link href={`/books/${slug}`}>
            <h3 className="font-bold text-xs sm:text-sm text-ink group-hover:text-brandRed transition-colors line-clamp-2 leading-tight sm:leading-snug min-h-[2rem] sm:min-h-[2.5rem] pt-0.5">
              {title}
            </h3>
          </Link>

          {/* Author & Rating */}
          <div className="flex items-center justify-between text-[11px] sm:text-[11px] text-ink-muted pt-0.5">
            <span className="line-clamp-1 opacity-80 max-w-[90px] sm:max-w-[120px]">{authorName}</span>
            <div className="flex items-center gap-1 shrink-0">
              <Rating value={rating} size="sm" />
              <span className="font-bold text-ink text-[11px] sm:text-[11px]">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Add to Cart Section */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base text-brandNavy leading-none">
                {formatLkr(currentPrice, locale as any)}
              </span>
              {isDiscounted && (
                <span className="text-[11px] sm:text-xs text-ink-muted/70 line-through">
                  {formatLkr(priceCents, locale as any)}
                </span>
              )}
            </div>
            {isDiscounted && savingsCents > 0 && (
              <span className="text-[11px] sm:text-[11px] text-green-700 font-bold mt-0.5 truncate">
                {c("savings")}: {formatLkr(savingsCents, locale as any)}
              </span>
            )}
          </div>

          {/* Add to Cart Button - Multi-click enabled */}
          <button
            type="button"
            onClick={handleCartClick}
            className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1 active:scale-95 shrink-0 min-w-[34px] min-h-[34px] sm:min-w-[40px] sm:min-h-[40px] ${
              justAdded
                ? "bg-green-600 text-white px-2.5 sm:px-3 shadow-md scale-105"
                : cardCount > 0
                ? "bg-saffron-500 hover:bg-saffron-600 text-brandNavy px-2 sm:px-2.5 shadow-xs"
                : "bg-brandRed hover:bg-brandRed-600 text-white hover:shadow-md hover:scale-105"
            }`}
            aria-label={cardCount > 0 ? `${cardCount} in cart, click to add more` : b("addToCart")}
            title={cardCount > 0 ? `${cardCount} in cart — click to add more` : b("addToCart")}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                <span className="text-[11px] sm:text-[11px] font-black">+{cardCount}</span>
              </>
            ) : cardCount > 0 ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brandNavy" />
                <span className="text-[11px] sm:text-[11px] font-black">{cardCount}</span>
              </>
            ) : (
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
