"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { BookCard } from "@/components/ui/BookCard";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

interface BestsellersSectionProps {
  books: any[];
}

const LABELS = {
  si: { more: "තවත් බලන්න", less: "අඩු කරන්න", all: "සියලුම පොත් සාප්පුවට යන්න" },
  en: { more: "See more", less: "Show less", all: "Shop all books" },
  ta: { more: "மேலும் காண்க", less: "குறைவாகக் காண்க", all: "அனைத்து நூல்களும்" },
};

export function BestsellersSection({ books }: BestsellersSectionProps) {
  const L = LABELS[useLocale() as keyof typeof LABELS] || LABELS.si;
  const [expanded, setExpanded] = useState(false);

  // In one row on desktop (lg:grid-cols-4), 4 books are shown.
  // When expanded, show 8 books (another full row).
  const visibleBooks = expanded ? books.slice(0, 8) : books.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {visibleBooks.map((book: any) => {
          const primaryEdition = book.editions?.[0] || {};
          const author = book.authors?.[0]?.author?.nameSi || "පදනම ප්‍රකාශන";
          const catName = book.categories?.[0]?.category?.nameSi;

          return (
            <BookCard
              key={book.id}
              slug={book.slug}
              title={book.titleSi}
              authorName={author}
              categoryName={catName}
              coverUrl={book.coverUrl}
              priceCents={primaryEdition.priceCents || 75000}
              salePriceCents={primaryEdition.salePriceCents}
              rating={book.averageRating || 4.9}
              format={primaryEdition.format || "Paperback"}
              hasFreeSample={!!book.sampleConfig}
              isBestSeller={book.isBestSeller}
            />
          );
        })}
      </div>

      {books.length > 4 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-white border-2 border-brandRed text-brandRed hover:bg-brandRed hover:text-white font-extrabold text-sm shadow-sm transition-all duration-200 active:scale-95 group cursor-pointer"
          >
            <span>{expanded ? L.less : L.more}</span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            )}
          </button>

          <Link
            href="/books"
            className="text-xs font-bold text-ink-muted hover:text-brandRed hover:underline flex items-center gap-1.5 transition-colors py-2 px-3"
          >
            <span>{L.all}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
