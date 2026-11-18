import React from "react";
import { getBooks } from "@/server/catalog/books";
import { singlishToSinhala } from "@/lib/transliteration";
import { BookCard } from "@/components/ui/BookCard";
import { Link } from "@/i18n/routing";
import { Search, Sparkles } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const transliterated = query ? singlishToSinhala(query) : "";
  const { books } = await getBooks({ query, limit: 20 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="border-b border-maroon-100 pb-6 space-y-2">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-maroon-900 tracking-tight flex items-center gap-3">
          <Search className="w-6 h-6 text-saffron-500" />
          <span>සොයුම් ප්‍රතිඵල (Search Results)</span>
        </h1>
        {query && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <span>සොයන ලද්දේ: <strong className="text-ink font-mono">&quot;{query}&quot;</strong></span>
            {transliterated && transliterated.toLowerCase() !== query.toLowerCase() && (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-100 text-maroon-900 font-semibold text-xs border border-gold-300">
                <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
                සිංග්ලිෂ් පරිවර්තනය: <strong>&quot;{transliterated}&quot;</strong>
              </span>
            )}
            <span>— පොත් {books.length}ක් හමුවිය.</span>
          </div>
        )}
      </div>

      {/* Results Grid */}
      {books.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-maroon-200 max-w-lg mx-auto p-8 space-y-4">
          <Search className="w-12 h-12 text-maroon-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-ink">පොත්පත් කිසිවක් හමු නොවීය</h3>
            <p className="text-xs text-ink-muted">
              වෙනත් නමක්, කතුවරයෙකුගේ නමක් හෝ ISBN අංකයක් යොදා නැවත සොයා බලන්න.
            </p>
          </div>
          <Link
            href="/books"
            className="inline-block px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white font-extrabold text-xs shadow transition-colors"
          >
            සියලු පොත් බලන්න
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book: any) => {
            const primaryEdition = book.editions?.[0] || {};
            const author = book.authors?.[0]?.author?.nameSi || "පදනම ප්‍රකාශන";

            return (
              <BookCard
                key={book.id}
                slug={book.slug}
                title={book.titleSi}
                authorName={author}
                priceCents={primaryEdition.priceCents || 75000}
                salePriceCents={primaryEdition.salePriceCents}
                rating={book.averageRating || 4.8}
                format={primaryEdition.format || "Paperback"}
                hasFreeSample={!!book.sampleConfig}
                isBestSeller={book.isBestSeller}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
