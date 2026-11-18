"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { formatLkr } from "@/lib/money";
import { Rating } from "./Rating";
import { BookOpen, ShoppingBag, Sparkles, Check, Tag } from "lucide-react";
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
        coverImage: coverUrl,
        weightGrams: 300,
      });
    }

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-maroon-100/80 hover:border-brandRed-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden text-left hover:-translate-y-1">
      {/* Book Cover Area */}
      <div className="relative aspect-[1/1.38] bg-gradient-to-tr from-maroon-50 via-cream to-white flex items-center justify-center p-3.5 overflow-hidden border-b border-gray-100">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-28 h-40 bg-gradient-to-br from-brandNavy to-maroon-900 text-cream rounded-md shadow-md p-3 flex flex-col justify-between border-2 border-brandYellow/60">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brandYellow">
              පදනම
            </span>
            <span className="font-display font-bold text-xs line-clamp-3 leading-snug">
              {title}
            </span>
            <span className="text-[9px] text-cream/70 line-clamp-1">{authorName}</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {isDiscounted && discountPercent > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-brandRed text-white shadow-md border border-brandRed-700 animate-pulse">
              <Tag className="w-3 h-3 mr-1" /> -{discountPercent}%
            </span>
          )}
          {isBestSeller && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brandYellow text-brandNavy shadow-sm border border-brandYellow-600">
              <Sparkles className="w-3 h-3 mr-1 text-brandNavy" /> Best Seller
            </span>
          )}
        </div>

        {/* Free Sample Quick Read Button */}
        {hasFreeSample && (
          <Link
            href={`/read/${slug}`}
            className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-white/95 hover:bg-brandYellow hover:text-brandNavy text-brandNavy border border-brandYellow/80 rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-sm opacity-90 group-hover:opacity-100 transition-all"
            title="නොමිලේ පෙරදසුන කියවන්න"
          >
            <BookOpen className="w-3.5 h-3.5 text-brandRed" />
            <span>සාම්පලය</span>
          </Link>
        )}
      </div>

      {/* Book Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Metadata Row: Category & In-Stock */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="px-2 py-0.5 rounded bg-cream text-maroon-900 font-semibold truncate max-w-[150px]">
              {categoryName || format}
            </span>
            <div className="flex items-center gap-1 text-green-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px]">තොග ඇත</span>
            </div>
          </div>

          {/* Book Title */}
          <Link href={`/books/${slug}`}>
            <h3 className="font-bold text-sm text-ink group-hover:text-brandRed transition-colors line-clamp-2 leading-snug pt-0.5">
              {title}
            </h3>
          </Link>

          {/* Author & Rating */}
          <div className="flex items-center justify-between text-[11px] text-ink-muted pt-0.5">
            <span className="line-clamp-1 opacity-80">{authorName}</span>
            <div className="flex items-center gap-1 shrink-0">
              <Rating value={rating} size="sm" />
              <span className="font-bold text-ink text-[10px]">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Add to Cart Section */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base text-brandNavy leading-none">
                {formatLkr(currentPrice, "si")}
              </span>
              {isDiscounted && (
                <span className="text-xs text-ink-muted/70 line-through">
                  {formatLkr(priceCents, "si")}
                </span>
              )}
            </div>
            {isDiscounted && savingsCents > 0 && (
              <span className="text-[10px] text-green-700 font-bold mt-0.5">
                ඉතිරිය: {formatLkr(savingsCents, "si")}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleCartClick}
            disabled={justAdded}
            className={`p-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 ${
              justAdded
                ? "bg-green-600 text-white px-3 shadow-md scale-105"
                : "bg-brandRed hover:bg-brandRed-600 text-white hover:shadow-md hover:scale-105 active:scale-95"
            }`}
            aria-label="Add to cart"
            title="කරත්තයට එක් කරන්න"
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span className="text-[11px]">එක් කළා!</span>
              </>
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
