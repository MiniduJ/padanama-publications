"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { formatLkr } from "@/lib/money";
import { Rating } from "./Rating";
import { BookOpen, ShoppingBag, Sparkles } from "lucide-react";
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
  onAddToCart?: () => void;
}

export function BookCard({
  slug,
  title,
  authorName,
  coverUrl,
  priceCents,
  salePriceCents,
  rating = 5.0,
  format = "Paperback",
  hasFreeSample = true,
  isBestSeller = false,
  onAddToCart,
}: BookCardProps) {
  const currentPrice = salePriceCents ?? priceCents;
  const isDiscounted = salePriceCents && salePriceCents < priceCents;

  const handleCartClick = () => {
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
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-maroon-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden text-left">
      {/* Book Cover Area */}
      <div className="relative aspect-[1/1.35] bg-gradient-to-tr from-maroon-100 via-cream to-white flex items-center justify-center p-4 overflow-hidden border-b border-gray-100">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-28 h-36 bg-maroon-700 text-cream rounded-md shadow-md p-3 flex flex-col justify-between border-2 border-gold-500/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-500">
              පදනම
            </span>
            <span className="font-display font-bold text-xs line-clamp-3 leading-snug">
              {title}
            </span>
            <span className="text-[9px] text-cream/70 line-clamp-1">{authorName}</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {isBestSeller && (
            <Badge variant="saffron" className="shadow-sm">
              <Sparkles className="w-3 h-3 mr-1" /> Best Seller
            </Badge>
          )}
          {isDiscounted && (
            <Badge variant="maroon" className="shadow-sm">
              Sale
            </Badge>
          )}
        </div>

        {hasFreeSample && (
          <Link
            href={`/read/${slug}`}
            className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-cream/95 hover:bg-cream border border-maroon-200 text-maroon-900 rounded-lg text-xs font-bold shadow flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity"
            title="Read free sample"
          >
            <BookOpen className="w-3.5 h-3.5 text-saffron-600" />
            <span>සාම්පලය</span>
          </Link>
        )}
      </div>

      {/* Book Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-ink-muted">
            <span className="font-medium">{format}</span>
            <Rating value={rating} size="sm" />
          </div>

          <Link href={`/books/${slug}`}>
            <h3 className="font-bold text-sm text-ink group-hover:text-maroon-700 transition-colors line-clamp-2 leading-snug">
              {title}
            </h3>
          </Link>
          <p className="text-xs text-ink-muted line-clamp-1">{authorName}</p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="font-bold text-base text-maroon-900 block leading-none">
              {formatLkr(currentPrice, "si")}
            </span>
            {isDiscounted && (
              <span className="text-xs text-gray-400 line-through">
                {formatLkr(priceCents, "si")}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCartClick}
            className="p-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-700 text-white shadow-sm hover:shadow transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
