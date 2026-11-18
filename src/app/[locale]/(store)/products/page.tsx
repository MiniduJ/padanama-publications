import React from "react";
import { getBooks } from "@/server/catalog/books";
import { BookCard } from "@/components/ui/BookCard";
import { Link } from "@/i18n/routing";
import { SlidersHorizontal, BookOpen, Search, ArrowUpDown, Tag, Sparkles } from "lucide-react";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    format?: string;
    sort?: "newest" | "price_asc" | "price_desc" | "rating" | "title";
    query?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const currentCategory = resolvedParams.category || "all";
  const currentSort = resolvedParams.sort || "newest";
  const currentQuery = resolvedParams.query || "";

  const { books, pagination } = await getBooks({
    category: currentCategory,
    format: resolvedParams.format,
    sort: currentSort,
    query: currentQuery,
    page,
    limit: 18,
  });

  const categories = [
    { slug: "all", name: "සියලු පොත් (All)", count: 320 },
    { slug: "preschool-grade-1-2", name: "පෙර පාසල හා 1-2 ශ්‍රේණි", count: 30 },
    { slug: "primary", name: "ප්‍රාථමික (3, 4, 5 ශිෂ්‍යත්වය)", count: 39 },
    { slug: "grade-6-7", name: "6 සහ 7 ශ්‍රේණි", count: 30 },
    { slug: "grade-8-9", name: "8 සහ 9 ශ්‍රේණි", count: 30 },
    { slug: "gce-ol", name: "සාමාන්‍ය පෙළ (O/L 10, 11)", count: 30 },
    { slug: "gce-al-science", name: "A/L විද්‍යා අංශය (Science)", count: 30 },
    { slug: "gce-al-tech", name: "A/L තාක්ෂණවේදය (Technology)", count: 18 },
    { slug: "gce-al-commerce", name: "A/L වාණිජ අංශය (Commerce)", count: 23 },
    { slug: "gce-al-art", name: "A/L කලා අංශය (Art)", count: 30 },
    { slug: "gov-exam-past-papers", name: "රජයේ විභාග පසුගිය ප්‍රශ්න පත්‍ර", count: 29 },
    { slug: "gov-books", name: "රජයේ පෙළපොත්", count: 10 },
    { slug: "donations", name: "ධර්ම දානය සඳහා", count: 16 },
  ];

  const currentCategoryObj = categories.find((c) => c.slug === currentCategory) || categories[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-brandRed transition-colors">මුල් පිටුව (Home)</Link>
        <span>/</span>
        <span className="text-brandNavy font-bold">පොත් සාප්පුව (Book Shop / Products)</span>
        {currentCategory !== "all" && (
          <>
            <span>/</span>
            <span className="text-brandRed font-semibold">{currentCategoryObj.name}</span>
          </>
        )}
      </nav>

      {/* Hero Page Header */}
      <div className="bg-gradient-to-r from-brandNavy to-maroon-900 text-cream rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border border-brandNavy/60">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brandYellow text-brandNavy text-xs font-black shadow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>නිල පදනම ප්‍රකාශන ග්‍රන්ථ නාමාවලිය</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            පොත් සාප්පුව (Book Shop)
          </h1>
          <p className="text-xs sm:text-sm text-cream/85 max-w-xl">
            1 වසරේ සිට උසස් පෙළ දක්වා විෂයානුබද්ධ වැඩපොත්, කෙටි සටහන් සහ ප්‍රශ්න පත්‍ර {pagination.total}ක් ඔබේ තේරීම සඳහා සූදානම්.
          </p>
        </div>

        {/* Quick Promo Chip */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs space-y-1.5 shrink-0 max-w-xs">
          <div className="flex items-center gap-1.5 text-brandYellow font-extrabold">
            <Tag className="w-4 h-4" />
            <span>විශේෂ වට්ටම් දීමනා සහිතයි</span>
          </div>
          <p className="text-cream/80 text-[11px] leading-relaxed">
            සියලුම පොත්පත් සඳහා මුද්‍රිත මිලට වඩා 20% කට ආසන්න විශේෂ වට්ටම් දැන් ක්‍රියාත්මකයි.
          </p>
        </div>
      </div>

      {/* Horizontal Category Slider (Mobile & Tablet) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none md:hidden">
        {categories.map((c) => {
          const isActive = currentCategory === c.slug;
          return (
            <Link
              key={c.slug}
              href={c.slug === "all" ? "/products" : `/products?category=${c.slug}`}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                isActive
                  ? "bg-brandRed text-white shadow-md scale-105"
                  : "bg-white text-brandNavy border border-maroon-100 hover:bg-maroon-50"
              }`}
            >
              {c.name}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar: Category Filter & Usability Helpers */}
        <aside className="hidden md:block bg-white p-6 rounded-3xl border border-maroon-100 shadow-sm space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-extrabold text-sm text-brandNavy flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brandRed" />
              <span>ශ්‍රේණි පෙරහන් (Categories)</span>
            </h3>
            {currentCategory !== "all" && (
              <Link href="/products" className="text-xs text-brandRed hover:underline font-bold">
                ඉවත් කරන්න
              </Link>
            )}
          </div>

          {/* Categories List */}
          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {categories.map((c) => {
              const isActive = currentCategory === c.slug;
              return (
                <Link
                  key={c.slug}
                  href={c.slug === "all" ? "/products" : `/products?category=${c.slug}`}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-brandRed text-white shadow-sm"
                      : "text-ink hover:bg-cream hover:text-brandNavy"
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-100 text-ink-muted"
                    }`}
                  >
                    {c.count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Digital Library Promotion */}
          <div className="p-4 bg-gradient-to-br from-cream to-maroon-50 border border-brandYellow/40 rounded-2xl space-y-2 text-center">
            <BookOpen className="w-6 h-6 text-brandRed mx-auto" />
            <h4 className="font-bold text-xs text-brandNavy">නොමිලේ සාම්පල කියවීම</h4>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              මිලදී ගැනීමට පෙර ඕනෑම පොතක පළමු පිටු 20 ඔන්ලයින් කියවා තීරණය කරන්න.
            </p>
            <Link
              href="/library"
              className="inline-block py-2 px-4 rounded-xl bg-brandNavy text-brandYellow text-xs font-extrabold shadow hover:scale-105 transition-transform"
            >
              පුස්තකාලයට යන්න
            </Link>
          </div>
        </aside>

        {/* Main Products Grid & Search/Sort Toolbar */}
        <div className="md:col-span-3 space-y-6">
          {/* Sorting & Search Controls */}
          <div className="bg-white p-4 rounded-2xl border border-maroon-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted w-full sm:w-auto">
              <span>ප්‍රතිඵල:</span>
              <span className="px-2 py-0.5 rounded bg-brandYellow/30 text-brandNavy font-extrabold">
                පොත් {pagination.total}ක්
              </span>
              {currentCategory !== "all" && (
                <span className="truncate max-w-[180px] font-bold text-brandRed">
                  • {currentCategoryObj.name}
                </span>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <label htmlFor="sort-select" className="text-xs text-ink-muted font-bold flex items-center gap-1 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-brandRed" />
                <span>පිළිවෙළ:</span>
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <Link
                  href={`/products?category=${currentCategory}&sort=newest`}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    currentSort === "newest" ? "bg-brandNavy text-white" : "bg-gray-100 text-ink hover:bg-gray-200"
                  }`}
                >
                  නවතම
                </Link>
                <Link
                  href={`/products?category=${currentCategory}&sort=price_asc`}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    currentSort === "price_asc" ? "bg-brandNavy text-white" : "bg-gray-100 text-ink hover:bg-gray-200"
                  }`}
                >
                  මිල අඩු සිට
                </Link>
                <Link
                  href={`/products?category=${currentCategory}&sort=price_desc`}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    currentSort === "price_desc" ? "bg-brandNavy text-white" : "bg-gray-100 text-ink hover:bg-gray-200"
                  }`}
                >
                  මිල වැඩි සිට
                </Link>
                <Link
                  href={`/products?category=${currentCategory}&sort=rating`}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    currentSort === "rating" ? "bg-brandNavy text-white" : "bg-gray-100 text-ink hover:bg-gray-200"
                  }`}
                >
                  ඇගයුම්
                </Link>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {books.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-maroon-200 space-y-3">
              <BookOpen className="w-10 h-10 text-brandRed mx-auto opacity-70" />
              <h3 className="font-bold text-base text-brandNavy">මෙම පෙරහනට අදාළ පොත් කිසිවක් හමු නොවීය</h3>
              <p className="text-xs text-ink-muted">වෙනත් කාණ්ඩයක් හෝ සෙවුම් පදයක් භාවිතා කර නැවත බලන්න.</p>
              <Link
                href="/products"
                className="inline-block py-2 px-5 bg-brandRed text-white text-xs font-bold rounded-xl shadow mt-2 hover:bg-brandRed-600 transition-colors"
              >
                සියලු පොත් පෙන්වන්න
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book: any) => {
                const primaryEdition = book.editions?.[0] || {};
                const author = book.authors?.[0]?.author?.nameSi || "පදනම ප්‍රකාශන";
                const catName = book.categories?.[0]?.category?.nameSi || "අධ්‍යාපනික";

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
                    hasFreeSample={true}
                    isBestSeller={book.isBestSeller}
                  />
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8 border-t border-maroon-100">
              {Array.from({ length: Math.min(8, pagination.totalPages) }, (_, i) => i + 1).map((p) => {
                const isActive = p === pagination.page;
                const catParam = currentCategory !== "all" ? `&category=${currentCategory}` : "";
                const sortParam = currentSort !== "newest" ? `&sort=${currentSort}` : "";
                return (
                  <Link
                    key={p}
                    href={`/products?page=${p}${catParam}${sortParam}`}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all ${
                      isActive
                        ? "bg-brandRed text-white shadow-md scale-105"
                        : "bg-white text-brandNavy border border-maroon-100 hover:bg-cream"
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
