"use client";

import { useState } from "react";
import { ShoppingBag, Check, Plus, Minus, CreditCard, ArrowRight } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { cartActions } from "@/lib/cart-store";
import { formatLkr } from "@/lib/money";

interface AddToCartButtonProps {
  book: {
    id: string;
    slug: string;
    titleSi: string;
    titleEn?: string;
    authorName: string;
    coverImage?: string;
    editions: Array<{
      id: string;
      format: "PAPERBACK" | "HARDCOVER" | "EBOOK";
      priceCents: number;
      salePriceCents?: number | null;
      weightGrams?: number;
    }>;
  };
  defaultFormat?: "PAPERBACK" | "HARDCOVER" | "EBOOK";
  locale?: "si" | "en" | "ta";
  showBuyNow?: boolean;
}

export function AddToCartButton({
  book,
  defaultFormat = "PAPERBACK",
  locale = "si",
  showBuyNow = true,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [selectedFormat, setSelectedFormat] = useState<"PAPERBACK" | "HARDCOVER" | "EBOOK">(defaultFormat);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [inCartCount, setInCartCount] = useState(0);

  const edition = book.editions.find((e) => e.format === selectedFormat) || book.editions[0];
  const unitPriceCents = edition?.salePriceCents || edition?.priceCents || 0;
  const originalPriceCents = edition?.salePriceCents ? edition.priceCents : undefined;

  const handleAddToCart = () => {
    if (!edition) return;

    cartActions.addItem(
      {
        id: `${book.id}_${edition.format}`,
        bookId: book.id,
        slug: book.slug,
        title: book.titleSi,
        titleSi: book.titleSi,
        titleEn: book.titleEn,
        authorName: book.authorName,
        format: edition.format,
        priceCents: unitPriceCents,
        originalPriceCents,
        coverImage: book.coverImage || "/images/books/placeholder.jpg",
        weightGrams: edition.weightGrams || 350,
      },
      quantity
    );

    setInCartCount((c) => c + quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  const handleBuyNow = () => {
    if (!edition) return;
    cartActions.addItem(
      {
        id: `${book.id}_${edition.format}`,
        bookId: book.id,
        slug: book.slug,
        title: book.titleSi,
        titleSi: book.titleSi,
        titleEn: book.titleEn,
        authorName: book.authorName,
        format: edition.format,
        priceCents: unitPriceCents,
        originalPriceCents,
        coverImage: book.coverImage || "/images/books/placeholder.jpg",
        weightGrams: edition.weightGrams || 350,
      },
      quantity
    );
    router.push("/checkout");
  };

  return (
    <div className="space-y-4">
      {/* Format Selector if multiple editions */}
      {book.editions.length > 1 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-ink uppercase tracking-wider block">
            {locale === "ta"
              ? "பதிப்பு வகையைத் தேர்ந்தெடுக்கவும் (Format):"
              : locale === "en"
              ? "Select Book Format:"
              : "පොතෙහි මුද්‍රණ වර්ගය (Select Format):"}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {book.editions.map((ed) => {
              const isSelected = ed.format === selectedFormat;
              const price = ed.salePriceCents || ed.priceCents;
              return (
                <button
                  key={ed.id}
                  type="button"
                  onClick={() => setSelectedFormat(ed.format)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? "border-brandNavy bg-brandNavy/5 shadow-sm"
                      : "border-gray-200 bg-white hover:border-maroon-300"
                  }`}
                >
                  <span className={`text-xs font-bold block ${isSelected ? "text-brandNavy" : "text-ink"}`}>
                    {ed.format === "PAPERBACK"
                      ? locale === "ta" ? "சாதாரண பதிப்பு" : locale === "en" ? "Paperback" : "සාමාන්‍ය මුද්‍රණය"
                      : ed.format === "HARDCOVER"
                      ? locale === "ta" ? "கடின அட்டை" : locale === "en" ? "Hardcover" : "දෘඩ කවරය"
                      : locale === "ta" ? "மின்நூல்" : locale === "en" ? "E-Book (Digital)" : "ඊ-පොත (ඩිජිටල්)"}
                  </span>
                  <span className="text-xs text-saffron-700 font-bold block">
                    {formatLkr(price, locale)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart Controls */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {selectedFormat !== "EBOOK" && (
          <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl px-3 py-2 bg-white sm:w-36">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1 text-gray-500 hover:text-maroon-900 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm text-ink px-2">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1 text-gray-500 hover:text-maroon-900 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex-1 py-3.5 px-6 rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 ${
            added
              ? "bg-green-700 text-white"
              : inCartCount > 0
              ? "bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white"
              : "bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white shadow-saffron-500/20"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>
                {locale === "ta"
                  ? `+${quantity} சேர்க்கப்பட்டது! (கார்ட்டில்: ${inCartCount})`
                  : locale === "en"
                  ? `+${quantity} Added! (${inCartCount} in Cart)`
                  : `+${quantity}ක් එක්විය! (බෑගයේ: ${inCartCount})`}
              </span>
            </>
          ) : inCartCount > 0 ? (
            <>
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>
                {locale === "ta"
                  ? `மேலும் சேர்க்கவும் (+${quantity} More)`
                  : locale === "en"
                  ? `Add More (+${quantity})`
                  : `තවත් එක් කරන්න (+${quantity} More)`}
              </span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>
                {locale === "ta"
                  ? "கார்ட்டில் சேர்க்கவும் (Add to Cart)"
                  : locale === "en"
                  ? "Add to Cart"
                  : "බෑගයට එක් කරන්න (Add to Cart)"}
              </span>
            </>
          )}
        </button>
      </div>

      {/* In-Cart Status & Direct Cart Link */}
      {inCartCount > 0 && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200 text-xs">
          <span className="font-bold text-green-900 flex items-center gap-1.5">
            <Check className="w-4 h-4 text-green-700 stroke-[3]" />
            <span>
              {locale === "ta"
                ? `இந்த நூல் ${inCartCount} பிரதிகள் கார்ட்டில் உள்ளன.`
                : locale === "en"
                ? `${inCartCount} copies of this book in your cart.`
                : `මෙම පොතෙන් පිටපත් ${inCartCount}ක් ඔබගේ බෑගයේ ඇත.`}
            </span>
          </span>
          <Link
            href="/cart"
            className="font-extrabold text-brandRed hover:underline flex items-center gap-1"
          >
            <span>{locale === "ta" ? "கார்ட்டைப் பார்" : locale === "en" ? "View Cart" : "බෑගය බලන්න"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Buy Now Instant Checkout Button */}
      {showBuyNow && (
        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full py-3.5 px-6 rounded-xl bg-brandNavy hover:bg-brandNavy-950 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 active:scale-98"
        >
          <CreditCard className="w-4 h-4 text-brandYellow" />
          <span>
            {locale === "ta"
              ? "இப்போதே வாங்கவும் (Buy Now)"
              : locale === "en"
              ? "Buy Now"
              : "දැන්ම මිලදී ගන්න (Buy Now)"}
          </span>
        </button>
      )}

      {/* Mobile Sticky Bottom Purchase Bar (Always accessible when scrolling on phones) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-maroon-100 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0 pr-1">
          <span className="text-[10px] text-ink-muted truncate max-w-[120px] xs:max-w-[160px] font-medium">
            {book.titleSi}
          </span>
          <span className="font-extrabold text-base text-brandNavy leading-tight">
            {formatLkr(unitPriceCents, locale)}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-3 py-2.5 rounded-xl font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              added
                ? "bg-green-600 text-white"
                : "bg-brandYellow hover:bg-amber-400 text-brandNavy"
            }`}
            aria-label="Add to cart"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>+1</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-brandNavy" />
                <span>{inCartCount > 0 ? `බෑගයේ (${inCartCount})` : "බෑගයට"}</span>
              </>
            )}
          </button>
          {showBuyNow && (
            <button
              type="button"
              onClick={handleBuyNow}
              className="px-4 py-2.5 rounded-xl bg-brandRed hover:bg-brandRed-600 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <span>{locale === "ta" ? "வாங்க" : locale === "en" ? "Buy" : "මිලදී ගන්න"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
