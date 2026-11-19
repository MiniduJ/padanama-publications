import React from "react";
import { getBooks, getCategoryCounts } from "@/server/catalog/books";
import { BookCard } from "@/components/ui/BookCard";
import { Link } from "@/i18n/routing";
import { SlidersHorizontal, BookOpen, Search, ArrowUpDown, Tag, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface BooksPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    category?: string;
    format?: string;
    sort?: "newest" | "price_asc" | "price_desc" | "rating" | "title";
    query?: string;
    type?: string;
    page?: string;
  }>;
}

export default async function BooksPage({ params, searchParams }: BooksPageProps) {
  const { locale } = await params;
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const currentCategory = resolvedParams.category || "all";
  const currentSort = resolvedParams.sort || "newest";
  const currentQuery = resolvedParams.query || "";
  // Two pages: /books lists books, /books?type=items lists school materials (stationery + learning aids).
  const isItems = resolvedParams.type === "items";
  const currentType = isItems ? "items" : "BOOK";
  // Keeps the other filters when one changes.
  const qs = (over: Record<string, string | number>) => {
    const p = new URLSearchParams(Object.entries({ category: currentCategory, sort: currentSort, type: isItems ? "items" : "", query: currentQuery, ...over }).filter(([, v]) => v !== "" && v !== "all" && v !== "BOOK").map(([k, v]) => [k, String(v)]));
    const s = p.toString();
    return s ? `/books?${s}` : "/books";
  };

  const nav = await getTranslations({ locale, namespace: "nav" });
  const cat = await getTranslations({ locale, namespace: "categories" });
  const common = await getTranslations({ locale, namespace: "common" });

  const { books, pagination } = await getBooks({
    category: currentCategory,
    format: resolvedParams.format,
    sort: currentSort,
    query: currentQuery,
    type: currentType,
    page,
    limit: 18,
  });
  const counts = await getCategoryCounts(currentType);

  const L = (si: string, en: string, ta: string) => (locale === "en" ? en : locale === "ta" ? ta : si);
  const pageTitle = isItems ? L("පාසල් අධ්‍යාපන උපකරණ", "School Materials", "பாடசாலைப் பொருட்கள்") : L("පොත්", "Books", "நூல்கள்");
  const categories = [
    { slug: "all", name: cat("all") },
    { slug: "preschool-grade-1-2", name: cat("preschoolGrade12") },
    { slug: "primary", name: cat("primary") },
    { slug: "grade-6-7", name: cat("grade67") },
    { slug: "grade-8-9", name: cat("grade89") },
    { slug: "gce-ol", name: cat("gceOl") },
    { slug: "gce-al-common", name: L("උසස් පෙළ පොදු විෂය", "A/L Common Subjects", "உயர்தர பொதுப் பாடங்கள்") },
    { slug: "gce-al-science", name: cat("gceAlScience") },
    { slug: "gce-al-tech", name: cat("gceAlTech") },
    { slug: "gce-al-commerce", name: cat("gceAlCommerce") },
    { slug: "gce-al-art", name: cat("gceAlArt") },
    { slug: "gov-exam-past-papers", name: cat("pastPapers") },
    { slug: "gov-books", name: cat("govBooks") },
    { slug: "donations", name: cat("donations") },
    { slug: "school-items", name: L("පාසල් උපකරණ සහ කියවීම් පොත්", "School items & reading", "பாடசாலைப் பொருட்கள்") },
    { slug: "stationery", name: L("පාසල් ලිපි ද්‍රව්‍ය", "School stationery", "பாடசாலை எழுதுபொருட்கள்") },
    { slug: "primary-extra", name: L("ප්‍රාථමික අමතර", "Primary extras", "ஆரம்ப மேலதிக") },
  ].map((c) => ({ ...c, count: counts[c.slug] || 0 })).filter((c) => c.slug === "all" || c.count > 0);


  const currentCategoryObj = categories.find((c) => c.slug === currentCategory) || categories[0];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-brandRed transition-colors">{nav("home")}</Link>
        <span>/</span>
        <span className="text-brandNavy font-bold">{pageTitle}</span>
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
            <span>{isItems ? L("පාසල් අවශ්‍යතා", "School Essentials", "பாடசாலைத் தேவைகள்") : locale === "ta" ? "அதிகாரப்பூர்வ நூல் பட்டியல்" : locale === "en" ? "Official Book Catalog" : "නිල පදනම ප්‍රකාශන ග්‍රන්ථ නාමාවලිය"}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-cream/85 max-w-xl">
            {isItems
              ? L(`පාසල් ලිපි ද්‍රව්‍ය, පත්‍රිකා සහ ඉගෙනුම් උපකරණ ${pagination.total}ක්.`, `${pagination.total} school stationery items, wall charts and learning aids.`, `${pagination.total} பாடசாலை எழுதுபொருட்கள் மற்றும் கற்றல் உபகரணங்கள்.`)
              : locale === "ta"
              ? `தரம் 1 முதல் உயர்தரம் வரையிலான ${pagination.total} வினாத்தாள்கள் மற்றும் பயிற்சி நூல்கள்.`
              : locale === "en"
              ? `Explore our official collection of ${pagination.total} textbooks, workbooks, and past papers.`
              : `1 වසරේ සිට උසස් පෙළ දක්වා විෂයානුබද්ධ වැඩපොත්, කෙටි සටහන් සහ ප්‍රශ්න පත්‍ර ${pagination.total}ක් ඔබේ තේරීම සඳහා සූදානම්.`}
          </p>
        </div>

        {/* Quick Promo Chip */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs space-y-1.5 shrink-0 max-w-xs">
          <div className="flex items-center gap-1.5 text-brandYellow font-extrabold">
            <Tag className="w-4 h-4" />
            <span>{locale === "ta" ? "சிறப்பு தள்ளுபடி" : locale === "en" ? "Special Discounts" : "විශේෂ වට්ටම් දීමනා සහිතයි"}</span>
          </div>
          <p className="text-cream/80 text-[11px] leading-relaxed">
            {locale === "ta"
              ? "அச்சு விலையில் இருந்து 20% வரை சிறப்பு தள்ளுபடிகள்."
              : locale === "en"
              ? "Enjoy up to 20% publisher discounts across our school catalog."
              : "සියලුම පොත්පත් සඳහා මුද්‍රිත මිලට වඩා 20% කට ආසන්න විශේෂ වට්ටම් දැන් ක්‍රියාත්මකයි."}
          </p>
        </div>
      </div>

      {/* Product type: books vs school items / stationery / learning aids */}
      <div role="tablist" aria-label="Product type" className="flex gap-2 overflow-x-auto pb-1">
        {[
          ["BOOK", L("පොත්", "Books", "நூல்கள்")],
          ["items", L("පාසල් අධ්‍යාපන උපකරණ", "School Materials", "பாடசாலைப் பொருட்கள்")],
        ].map(([v, label]) => (
          <Link key={v} role="tab" aria-selected={currentType === v} href={qs({ type: v, category: "all", page: "" })}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap border ${currentType === v ? "bg-brandNavy text-white border-brandNavy" : "bg-white text-brandNavy border-maroon-100 hover:border-brandRed"}`}>
            {label}
          </Link>
        ))}
      </div>

      {/* Horizontal Category Slider (Mobile & Tablet) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none md:hidden">
        {categories.map((c) => {
          const isActive = currentCategory === c.slug;
          return (
            <Link
              key={c.slug}
              href={qs({ category: c.slug, page: "" })}
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
        {/* Desktop Sidebar: Category Filter */}
        <aside className="hidden md:block bg-white p-6 rounded-3xl border border-maroon-100 shadow-sm space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-extrabold text-sm text-brandNavy flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brandRed" />
              <span>{nav("categories")}</span>
            </h3>
            {currentCategory !== "all" && (
              <Link href="/books" className="text-xs text-brandRed hover:underline font-bold">
                {locale === "ta" ? "அனைத்தும்" : locale === "en" ? "Reset" : "සියල්ල"}
              </Link>
            )}
          </div>

          <div className="space-y-1 text-xs font-semibold max-h-[500px] overflow-y-auto pr-1">
            {categories.map((c) => {
              const isActive = currentCategory === c.slug;
              return (
                <Link
                  key={c.slug}
                  href={qs({ category: c.slug, page: "" })}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-brandRed text-white font-extrabold shadow-sm"
                      : "text-ink hover:bg-maroon-50 hover:text-brandRed"
                  }`}
                >
                  <span className="truncate pr-2">{c.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-ink-muted"}`}>
                    {c.count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Islandwide Delivery Trust Badge */}
          <div className="p-4 rounded-2xl bg-cream border border-brandYellow/60 text-xs space-y-1">
            <span className="font-bold text-brandNavy block">🚚 {locale === "ta" ? "நாடளாவிய விநியோகம்" : locale === "en" ? "Islandwide Delivery" : "දිවයින පුරා බෙදාහැරීම"}</span>
            <p className="text-[11px] text-ink-muted">
              {common("freeDeliveryNotice")}
            </p>
          </div>
        </aside>

        {/* Main Books Grid */}
        <div className="md:col-span-3 space-y-6">
          {/* Active Filter Bar & Integrated Search Controls */}
          <div className="bg-white p-4 rounded-2xl border border-maroon-100 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Left: Results Count & Active Category */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-ink-muted">{locale === "ta" ? "காட்டப்படும் நூல்கள்:" : locale === "en" ? "Showing:" : "ප්‍රතිඵල:"}</span>
              <span className="font-extrabold text-brandNavy">{pagination.total} {isItems ? L("භාණ්ඩ", "Items", "பொருட்கள்") : L("පොත්", "Books", "நூல்கள்")}</span>
              {currentCategory !== "all" && (
                <span className="px-2.5 py-0.5 rounded-full bg-brandYellow/30 text-brandNavy font-bold text-[11px]">
                  {currentCategoryObj.name}
                </span>
              )}
              {currentQuery && (
                <Link
                  href={`/books?category=${currentCategory}&sort=${currentSort}`}
                  className="px-2.5 py-0.5 rounded-full bg-red-100 hover:bg-red-200 text-brandRed font-bold text-[11px] flex items-center gap-1 transition-colors"
                  title="Clear search query"
                >
                  <span>"{currentQuery}"</span>
                  <span className="font-black">✕</span>
                </Link>
              )}
            </div>

            {/* Center: Integrated Search Bar in Filter Bar */}
            <form
              method="GET"
              action={`/${locale}/books`}
              className="flex-1 max-w-md w-full"
            >
              <input type="hidden" name="category" value={currentCategory} />
              <input type="hidden" name="sort" value={currentSort} />
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="query"
                  defaultValue={currentQuery}
                  placeholder={
                    locale === "ta"
                      ? "நூல்கள், ஆசிரியர்களைத் தேடுங்கள்..."
                      : locale === "en"
                      ? "Search titles, authors, or Singlish..."
                      : "පොත්, කතුවරුන් හෝ විෂයයන් සොයන්න..."
                  }
                  className="w-full pl-9 pr-18 py-2 bg-slate-50 border border-maroon-200 rounded-xl text-xs text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-brandRed focus:bg-white transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-brandRed absolute left-3 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-1 px-3 py-1 bg-brandNavy hover:bg-brandRed text-white text-[11px] font-extrabold rounded-lg transition-colors"
                >
                  {locale === "ta" ? "தேடு" : locale === "en" ? "Search" : "සොයන්න"}
                </button>
              </div>
            </form>

            {/* Right: Sort Options */}
            <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">
              <ArrowUpDown className="w-3.5 h-3.5 text-brandRed shrink-0" />
              <span className="text-ink-muted shrink-0">{locale === "ta" ? "வரிசைப்படுத்துக:" : locale === "en" ? "Sort by:" : "පිළිවෙල:"}</span>
              <div className="flex items-center gap-1 font-bold">
                <Link
                  href={qs({ sort: "newest", page: "" })}
                  className={`px-2 py-1 rounded-lg transition-all ${currentSort === "newest" ? "bg-brandNavy text-white font-black" : "text-ink hover:text-brandRed"}`}
                >
                  {locale === "ta" ? "புதியவை" : locale === "en" ? "Newest" : "නවතම"}
                </Link>
                <Link
                  href={qs({ sort: "price_asc", page: "" })}
                  className={`px-2 py-1 rounded-lg transition-all ${currentSort === "price_asc" ? "bg-brandNavy text-white font-black" : "text-ink hover:text-brandRed"}`}
                >
                  {locale === "ta" ? "குறைந்த விலை" : locale === "en" ? "Price Low" : "මිල (අඩු)"}
                </Link>
                <Link
                  href={qs({ sort: "price_desc", page: "" })}
                  className={`px-2 py-1 rounded-lg transition-all ${currentSort === "price_desc" ? "bg-brandNavy text-white font-black" : "text-ink hover:text-brandRed"}`}
                >
                  {locale === "ta" ? "கூடிய விலை" : locale === "en" ? "Price High" : "මිල (වැඩි)"}
                </Link>
              </div>
            </div>
          </div>

          {/* Books Cards Grid */}
          {books.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-maroon-200 p-12 text-center space-y-4">
              <BookOpen className="w-12 h-12 text-maroon-300 mx-auto" />
              <h3 className="font-extrabold text-lg text-brandNavy">
                {locale === "ta" ? "நூல்கள் எதுவும் காணப்படவில்லை" : locale === "en" ? "No Books Found" : "පොත්පත් කිසිවක් හමු නොවීය"}
              </h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                {locale === "ta"
                  ? "வேறு வகையைத் தேர்ந்தெடுத்து முயற்சிக்கவும்."
                  : locale === "en"
                  ? "Please try selecting a different category or search term."
                  : "වෙනත් ප්‍රවර්ගයක් හෝ නමක් යොදා නැවත සොයා බලන්න."}
              </p>
              <Link
                href="/books"
                className="inline-block px-5 py-2.5 rounded-xl bg-brandRed text-white text-xs font-bold shadow hover:bg-brandRed-600 transition-colors"
              >
                {locale === "ta" ? "அனைத்து நூல்கள்" : locale === "en" ? "View All Books" : "සියලු පොත් බලන්න"}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {books.map((book: any) => {
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
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <nav aria-label="Pagination" className="pt-8 flex flex-wrap items-center justify-center gap-2">
              {(() => {
                const { page, totalPages } = pagination;
                const href = (p: number) => qs({ page: p });
                // Window: first, last, current ±2, with ellipses for gaps.
                const nums = [...new Set([1, totalPages, ...[-2, -1, 0, 1, 2].map((d) => page + d)])]
                  .filter((p) => p >= 1 && p <= totalPages)
                  .sort((a, b) => a - b);
                const btn = "min-w-10 h-10 px-3 rounded-xl flex items-center justify-center text-xs font-bold transition-all";
                const idle = `${btn} bg-white text-ink border border-maroon-100 hover:border-brandRed`;
                const prevLabel = locale === "ta" ? "முந்தைய" : locale === "en" ? "Previous" : "පෙර";
                const nextLabel = locale === "ta" ? "அடுத்த" : locale === "en" ? "Next" : "ඊළඟ";
                return (
                  <>
                    {page > 1 && <Link href={href(page - 1)} className={idle} rel="prev">‹ {prevLabel}</Link>}
                    {nums.map((p, i) => (
                      <React.Fragment key={p}>
                        {i > 0 && p - nums[i - 1] > 1 && <span className="px-1 text-ink-muted" aria-hidden>…</span>}
                        <Link
                          href={href(p)}
                          aria-current={p === page ? "page" : undefined}
                          className={p === page ? `${btn} bg-brandNavy text-white shadow-md font-black` : idle}
                        >
                          {p}
                        </Link>
                      </React.Fragment>
                    ))}
                    {page < totalPages && <Link href={href(page + 1)} className={idle} rel="next">{nextLabel} ›</Link>}
                  </>
                );
              })()}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
