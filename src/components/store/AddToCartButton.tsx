"use client";

import { useState } from "react";
import { ShoppingBag, Check, Plus, Minus, CreditCard } from "lucide-react";
import { useRouter } from "@/i18n/routing";
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

    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
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
          className={`flex-1 py-3.5 px-6 rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            added
              ? "bg-green-700 text-white"
              : "bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white shadow-saffron-500/20"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>
                {locale === "ta"
                  ? "கார்ட்டில் சேர்க்கப்பட்டது! (Added)"
                  : locale === "en"
                  ? "Added to Cart!"
                  : "බෑගයට එක් කරන ලදී! (Added)"}
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
    </div>
  );
}
