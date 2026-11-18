import React from "react";
import { getBooks } from "@/server/catalog/books";
import { BookCard } from "@/components/ui/BookCard";
import { Link } from "@/i18n/routing";
import { SlidersHorizontal, BookOpen } from "lucide-react";

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
    limit: 18,
  });

  const categories = [
    { slug: "all", name: "සියලු පොත් (All Books)" },
    { slug: "preschool-grade-1-2", name: "පෙර පාසල, 1 සහ 2 ශ්‍රේණි" },
    { slug: "primary", name: "ප්‍රාථමික ශ්‍රේණි (3, 4, 5)" },
    { slug: "grade-6-7", name: "6 සහ 7 ශ්‍රේණි" },
    { slug: "grade-8-9", name: "8 සහ 9 ශ්‍රේණි" },
    { slug: "gce-ol", name: "සාමාන්‍ය පෙළ (O/L) 10, 11 ශ්‍රේණි" },
    { slug: "gce-al-science", name: "උසස් පෙළ (A/L) Science" },
    { slug: "gce-al-tech", name: "උසස් පෙළ (A/L) Technology" },
    { slug: "gce-al-commerce", name: "උසස් පෙළ (A/L) Commerce" },
    { slug: "gce-al-art", name: "උසස් පෙළ (A/L) Art" },
    { slug: "gov-exam-past-papers", name: "රජයේ විභාග පසුගිය ප්‍රශ්න පත්‍ර" },
    { slug: "gov-books", name: "රජයේ පෙළපොත්" },
    { slug: "donations", name: "ධර්ම දානය සඳහා" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-maroon-100 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-maroon-900 tracking-tight">
            පොත් නාමාවලිය (Official Book Catalog)
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            ශ්‍රී ලංකා විෂය නිර්දේශයට අනුකූල නිල පදනම ප්‍රකාශන පොත්පත් සහ පසුගිය ප්‍රශ්න පත්‍ර {pagination.total}ක්.
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
              <span>පෙරහන් (Categories)</span>
            </h3>
            <Link href="/books" className="text-xs text-saffron-600 hover:underline">
              ඉවත් කරන්න
            </Link>
          </div>

          {/* Categories */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">
              ශ්‍රේණි සහ විෂය ධාරා
            </h4>
            <div className="space-y-1 text-xs font-medium max-h-[480px] overflow-y-auto pr-1">
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

          {/* Promo Box */}
          <div className="p-4 bg-maroon-50 border border-maroon-100 rounded-xl space-y-2 text-center">
            <Link href="/library" className="block group">
              <BookOpen className="w-5 h-5 text-maroon-700 mx-auto" />
              <span className="text-xs font-bold text-maroon-900 block mt-1">
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
                    coverUrl={book.coverUrl}
                    priceCents={primaryEdition.priceCents || 75000}
                    salePriceCents={primaryEdition.salePriceCents}
                    rating={book.averageRating || 4.8}
                    format={primaryEdition.format || "Paperback"}
                    hasFreeSample={true}
                    isBestSeller={book.isBestSeller}
                  />
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6 border-t border-maroon-100">
              {Array.from({ length: Math.min(8, pagination.totalPages) }, (_, i) => i + 1).map((p) => {
                const isActive = p === pagination.page;
                const catParam = resolvedParams.category ? `&category=${resolvedParams.category}` : "";
                return (
                  <Link
                    key={p}
                    href={`/books?page=${p}${catParam}`}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                      isActive
                        ? "bg-maroon-500 text-white shadow-sm"
                        : "bg-white text-ink border border-maroon-100 hover:bg-maroon-50"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
