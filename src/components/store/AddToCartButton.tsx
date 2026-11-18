"use client";

import { useState } from "react";
import { ShoppingBag, Check, Plus, Minus } from "lucide-react";
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
}

export function AddToCartButton({ book, defaultFormat = "PAPERBACK", locale = "si" }: AddToCartButtonProps) {
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

  return (
    <div className="space-y-4">
      {/* Format Selector if multiple editions */}
      {book.editions.length > 1 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-ink uppercase tracking-wider block">
            පොතෙහි මුද්‍රණ වර්ගය (Select Format):
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
                      ? "border-maroon-700 bg-maroon-50/70 shadow-sm"
                      : "border-gray-200 bg-white hover:border-maroon-300"
                  }`}
                >
                  <span className={`text-xs font-bold block ${isSelected ? "text-maroon-900" : "text-ink"}`}>
                    {ed.format === "PAPERBACK"
                      ? "සාමාන්‍ය මුද්‍රණය"
                      : ed.format === "HARDCOVER"
                      ? "දෘඩ කවරය"
                      : "ඊ-පොත (ඩිජිටල්)"}
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
          className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            added
              ? "bg-green-700 text-white"
              : "bg-saffron-500 hover:bg-saffron-700 text-white shadow-saffron-500/20"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>බෑගයට එක් කරන ලදී! (Added to Cart)</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>බෑගයට එක් කරන්න (Add to Cart)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
