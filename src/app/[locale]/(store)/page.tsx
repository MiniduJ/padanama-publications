import React from "react";
import { Link } from "@/i18n/routing";
import { getBooks } from "@/server/catalog/books";
import { BookCard } from "@/components/ui/BookCard";
import {
  BookOpen,
  ShieldCheck,
  Truck,
  CreditCard,
  Sparkles,
  Phone,
  ArrowRight,
  GraduationCap,
  Award,
  Layers,
} from "lucide-react";

export default async function HomePage() {
  const { books: featuredBooks } = await getBooks({ limit: 8, sort: "newest" });
  const { books: primaryBooks } = await getBooks({ category: "primary", limit: 4 });
  const { books: olBooks } = await getBooks({ category: "gce-ol", limit: 4 });
  const { books: alScienceBooks } = await getBooks({ category: "gce-al-science", limit: 4 });

  const categories = [
    { slug: "preschool-grade-1-2", name: "පෙර පාසල හා 1-2 ශ්‍රේණි", desc: "මුල් ළමාවිය ක්‍රියාකාරකම්" },
    { slug: "primary", name: "ප්‍රාථමික 3, 4, 5 ශිෂ්‍යත්වය", desc: "ආදර්ශ ප්‍රශ්න පත්‍ර සහ පෙරහුරු" },
    { slug: "grade-6-7", name: "6 සහ 7 ශ්‍රේණි", desc: "විෂයානුබද්ධ වැඩපොත්" },
    { slug: "grade-8-9", name: "8 සහ 9 ශ්‍රේණි", desc: "කෙටි සටහන් සහ අභ්‍යාස" },
    { slug: "gce-ol", name: "සාමාන්‍ය පෙළ (O/L)", desc: "10, 11 ශ්‍රේණි විභාග පොත්" },
    { slug: "gce-al-science", name: "උසස් පෙළ විද්‍යා අංශය", desc: "ජීව විද්‍යාව, රසායන හා භෞතික" },
    { slug: "gce-al-tech", name: "උසස් පෙළ තාක්ෂණවේදය", desc: "තාක්ෂණවේදය සඳහා විද්‍යාව" },
    { slug: "gce-al-commerce", name: "උසස් පෙළ වාණිජ අංශය", desc: "ගිණුම්කරණය, ව්‍යාපාර අධ්‍යයනය" },
    { slug: "gov-exam-past-papers", name: "පසුගිය ප්‍රශ්න පත්‍ර", desc: "විභාග පෙරහුරු අත්පොත්" },
  ];

  return (
    <div className="flex flex-col space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-maroon-50 via-cream to-white py-12 md:py-20 border-b border-maroon-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-maroon-100 border border-maroon-200 text-maroon-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>නිල පදනම ප්‍රකාශන වෙබ් අඩවිය (padanamapublication.lk)</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-maroon-900 tracking-tight leading-tight">
              දැනුමෙන් සන්නද්ධ දරු පරපුරකට <br className="hidden sm:inline" />
              <span className="text-saffron-500 underline decoration-gold-500 decoration-wavy decoration-2">
                විශ්වාසනීය පදනම
              </span>
            </h1>

            <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl">
              1 වසරේ සිට උසස් පෙළ දක්වා විෂයානුබද්ධ වැඩ පොත්, කෙටි සටහන්, පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ ආදර්ශ ගැටලු විසඳුම් දැන් නිවසටම ගෙන්වා ගන්න.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/books"
                className="px-6 py-3.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>සියලු පොත් බලන්න</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/library"
                className="px-6 py-3.5 rounded-xl bg-white border-2 border-maroon-500 text-maroon-900 hover:bg-maroon-50 font-bold text-sm shadow-sm transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-maroon-700" />
                <span>නොමිලේ සාම්පල කියවීම</span>
              </Link>
            </div>
          </div>

          {/* Hero Visual Presentation with Real Cover */}
          <div className="relative flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-maroon-100 p-6 relative z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-maroon-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-gold-500" />
                  <span>ජනප්‍රියම අධ්‍යාපනික කෘතිය</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-bold">
                  ඉන්ස්ටන්ට් සාම්පලය
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-cream border border-gold-500/20 text-center space-y-3">
                <div className="w-32 h-44 mx-auto rounded-lg overflow-hidden shadow-lg border-2 border-white bg-maroon-100">
                  <img
                    src="https://padanamapublication.lk/image/books/1627556979.jpg"
                    alt="සිංහල ව්‍යාකරණ 10-11 ශ්‍රේණි"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-maroon-900 text-base">
                  සිංහල ව්‍යාකරණ 10-11 ශ්‍රේණි
                </h3>
                <p className="text-xs text-ink-muted">
                  සාමාන්‍ය පෙළ විභාගය ඉලක්ක කරගත් සම්පූර්ණ ව්‍යාකරණ සංග්‍රහය.
                </p>
                <div className="flex justify-center gap-2 pt-1">
                  <Link
                    href="/read/pdn-189"
                    className="py-2 px-4 bg-maroon-500 hover:bg-maroon-700 text-cream text-xs font-bold rounded-lg shadow transition-colors flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>පෙරදසුන බලන්න</span>
                  </Link>
                  <Link
                    href="/books/pdn-189"
                    className="py-2 px-4 bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold rounded-lg shadow transition-colors"
                  >
                    මිලදී ගන්න (Rs. 184)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-2xl border border-maroon-100 p-6 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ink">දිවයින පුරා බෙදාහැරීම</h4>
              <p className="text-[11px] text-ink-muted">දින 2-4ක් ඇතුළත නිවසටම</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ink">ආරක්ෂිත ගෙවීම්</h4>
              <p className="text-[11px] text-ink-muted">PayHere & Koko BNPL</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ink">භාණ්ඩ ලැබුණු පසු ගෙවීම</h4>
              <p className="text-[11px] text-ink-muted">Cash on Delivery (COD)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ink">100% නිල මුද්‍රණ</h4>
              <p className="text-[11px] text-ink-muted">පදනම ප්‍රකාශන සත්‍යාපිත</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grade Categories Exploration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex items-end justify-between border-b border-maroon-100 pb-4">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-maroon-900 tracking-tight">
              ශ්‍රේණි අනුව ග්‍රන්ථ නාමාවලිය
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              පෙර පාසලේ සිට උසස් පෙළ දක්වා ඔබට අවශ්‍ය ශ්‍රේණිය තෝරන්න.
            </p>
          </div>
          <Link href="/books" className="text-xs font-bold text-saffron-600 hover:underline flex items-center gap-1">
            <span>සියල්ල</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/books?category=${cat.slug}`}
              className="group p-5 bg-white rounded-2xl border border-maroon-100 hover:border-saffron-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-maroon-50 text-maroon-700 group-hover:bg-saffron-50 group-hover:text-saffron-700 flex items-center justify-center transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-saffron-600 transform group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-sm text-maroon-900 group-hover:text-saffron-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-ink-muted mt-0.5">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Publisher Books (Live Covers & Pricing) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex items-end justify-between border-b border-maroon-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>නවතම නිකුත් කිරීම්</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-maroon-900 tracking-tight">
              විශේෂාංග පොත්පත් (Featured Books)
            </h2>
          </div>
          <Link href="/books" className="text-xs font-bold text-saffron-600 hover:underline flex items-center gap-1">
            <span>තවත් බලන්න</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book: any) => {
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
      </section>

      {/* Primary & Scholarship Section */}
      {primaryBooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
          <div className="flex items-end justify-between border-b border-maroon-100 pb-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-maroon-900 tracking-tight">
                ප්‍රාථමික සහ 5 ශ්‍රේණිය ශිෂ්‍යත්ව අත්වැල
              </h2>
              <p className="text-xs text-ink-muted mt-1">ශිෂ්‍යත්ව විභාගයට ඉලක්කගත ආදර්ශ ප්‍රශ්න පත්‍ර සහ පෙරහුරු අභ්‍යාස</p>
            </div>
            <Link href="/books?category=primary" className="text-xs font-bold text-saffron-600 hover:underline">
              ප්‍රාථමික සියලු පොත්
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {primaryBooks.map((book: any) => {
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
        </section>
      )}

      {/* O/L Section */}
      {olBooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
          <div className="flex items-end justify-between border-b border-maroon-100 pb-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-maroon-900 tracking-tight">
                සාමාන්‍ය පෙළ (O/L) කෙටි සටහන් සහ විභාග ප්‍රශ්න පත්‍ර
              </h2>
              <p className="text-xs text-ink-muted mt-1">10 සහ 11 ශ්‍රේණි සඳහා විද්‍යාව, ගණිතය, සිංහල, ඉතිහාසය සහ වාණිජ</p>
            </div>
            <Link href="/books?category=gce-ol" className="text-xs font-bold text-saffron-600 hover:underline">
              සා.පෙ. සියලු පොත්
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {olBooks.map((book: any) => {
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
        </section>
      )}

      {/* A/L Science Section */}
      {alScienceBooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
          <div className="flex items-end justify-between border-b border-maroon-100 pb-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-maroon-900 tracking-tight">
                උසස් පෙළ (A/L) විෂය ධාරා
              </h2>
              <p className="text-xs text-ink-muted mt-1">විද්‍යා, ගණිත, වාණිජ, තාක්ෂණවේදය සහ කලා විභාග සහයක කෘති</p>
            </div>
            <Link href="/books?category=gce-al-science" className="text-xs font-bold text-saffron-600 hover:underline">
              උසස් පෙළ සියලු පොත්
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {alScienceBooks.map((book: any) => {
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
        </section>
      )}

      {/* Official Publisher Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-maroon-900 text-cream rounded-3xl p-8 md:p-12 border-2 border-gold-500/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="font-display font-bold text-2xl md:text-3xl text-gold-500">
              පදනම ප්‍රකාශන නිල සේවාව හා සම්බන්ධ වන්න
            </h3>
            <p className="text-sm opacity-85 max-w-xl">
              නො. 912/A, බෝගහ හන්දිය පාර, 10120, ශ්‍රී ලංකාව. ඕනෑම විමසීමක් හෝ පාසල් තොග ඇණවුම් සඳහා අපගේ දුරකථන අංක අමතන්න.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs pt-2">
              <span className="font-semibold text-gold-400">දුරකථන: +94 71 800 8533 / +94 77 088 2228</span>
              <span>•</span>
              <span className="font-semibold text-gold-400">විද්‍යුත් තැපෑල: hello@padanamapublication.lk</span>
            </div>
          </div>
          <Link
            href="/contact"
            className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-maroon-950 font-extrabold text-sm rounded-xl shadow-lg transition-transform hover:scale-105 shrink-0"
          >
            සම්බන්ධ වන්න
          </Link>
        </div>
      </section>
    </div>
  );
}
