import React from "react";
import { getBooks } from "@/server/catalog/books";
import { BookCard } from "@/components/ui/BookCard";
import { Link } from "@/i18n/routing";
import { Filter, SlidersHorizontal, BookOpen } from "lucide-react";

interface BooksPageProps {
  searchParams: Promise<{
    category?: string;
    author?: string;
    format?: string;
    sort?: "newest" | "price_asc" | "price_desc" | "rating" | "title";
    page?: string;
  }>;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const { books, pagination } = await getBooks({
    category: resolvedParams.category,
    author: resolvedParams.author,
    format: resolvedParams.format,
    sort: resolvedParams.sort || "newest",
    page,
    limit: 12,
  });

  const categories = [
    { slug: "all", name: "සියලු පොත් (All Books)" },
    { slug: "scholarship-grade-5", name: "5 ශ්‍රේණිය ශිෂ්‍යත්වය" },
    { slug: "ordinary-level", name: "සාමාන්‍ය පෙළ (O/L)" },
    { slug: "advanced-level", name: "උසස් පෙළ (A/L)" },
    { slug: "sinhala-novels", name: "සිංහල නවකතා හා සාහිත්‍ය" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-maroon-100 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-maroon-900 tracking-tight">
            පොත් නාමාවලිය (Book Catalog)
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            ශ්‍රී ලංකා විෂය නිර්දේශයට අනුකූල අධ්‍යාපනික වැඩපොත් සහ සම්මානනීය කෘති {pagination.total}ක්.
          </p>
        </div>

        {/* Category Pills on Mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none md:hidden">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={c.slug === "all" ? "/books" : `/books?category=${c.slug}`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border ${
                (resolvedParams.category === c.slug || (!resolvedParams.category && c.slug === "all"))
                  ? "bg-maroon-500 text-white border-maroon-500"
                  : "bg-white text-ink border-maroon-200"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block bg-white p-6 rounded-2xl border border-maroon-100 shadow-sm space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-maroon-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-saffron-500" />
              <span>පෙරහන් (Filters)</span>
            </h3>
            <Link href="/books" className="text-xs text-saffron-600 hover:underline">
              ඉවත් කරන්න
            </Link>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider">
              ප්‍රවර්ග (Categories)
            </h4>
            <div className="space-y-1.5 text-xs font-medium">
              {categories.map((c) => {
                const isActive = resolvedParams.category === c.slug || (!resolvedParams.category && c.slug === "all");
                return (
                  <Link
                    key={c.slug}
                    href={c.slug === "all" ? "/books" : `/books?category=${c.slug}`}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      isActive ? "bg-maroon-50 text-maroon-900 font-bold" : "text-ink hover:bg-gray-50"
                    }`}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Free Digital Sample Filter */}
          <div className="pt-4 border-t border-gray-100">
            <Link
              href="/library"
              className="p-3 rounded-xl bg-gold-50 border border-gold-200 block text-center space-y-1 hover:bg-gold-100 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-maroon-700 mx-auto" />
              <span className="text-xs font-bold text-maroon-900 block">
                ඩිජිටල් සාම්පල පුස්තකාලය
              </span>
              <span className="text-[10px] text-ink-muted block">
                මිලදී ගැනීමට පෙර නොමිලේ කියවන්න
              </span>
            </Link>
          </div>
        </aside>

        {/* Books Grid */}
        <div className="md:col-span-3 space-y-8">
          {books.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-maroon-200">
              <p className="text-sm text-ink-muted">මෙම පෙරහනට අදාළ පොත්පත් කිසිවක් හමු නොවීය.</p>
              <Link href="/books" className="text-xs text-saffron-600 font-bold hover:underline mt-2 inline-block">
                සියලු පොත් බලන්න
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}
