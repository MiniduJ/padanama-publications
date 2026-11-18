import React from "react";
import { Link } from "@/i18n/routing";
import { getBooks } from "@/server/catalog/books";
import { BookCard } from "@/components/ui/BookCard";
import { BestsellersSection } from "@/components/store/BestsellersSection";
import { HeroSlider } from "@/components/store/HeroSlider";
import { UserReviewsSection } from "@/components/store/UserReviewsSection";
import { SocialMediaSection } from "@/components/store/SocialMediaSection";
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
  Tag,
  CheckCircle2,
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

  const featureCards = [
    {
      title: "කෙටි සටහන් සහ සූත්‍ර",
      subtitle: "Short Notes & Formulas",
      image: "https://www.padanamapublication.lk/image/others/shortnotes.jpg",
      link: "/books?category=gce-ol",
      tag: "O/L & A/L",
    },
    {
      title: "වාර විභාග ප්‍රශ්න පත්‍ර",
      subtitle: "Term Test Papers",
      image: "https://www.padanamapublication.lk/image/others/termpapers.jpg",
      link: "/books",
      tag: "සියලු ශ්‍රේණි",
    },
    {
      title: "ආදර්ශ ප්‍රශ්න පත්‍ර",
      subtitle: "Model Examination Papers",
      image: "https://www.padanamapublication.lk/image/others/modelpapers.jpg",
      link: "/books?category=primary",
      tag: "ශිෂ්‍යත්ව පෙරහුරු",
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-16 pb-12">
      {/* 1. Hero Carousel Slider - Full Screen Height & Full Width */}
      <section className="w-full">
        <HeroSlider />
      </section>

      {/* 2. Three Feature Category Cards (From publisher site) */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {featureCards.map((card, idx) => (
            <Link
              key={idx}
              href={card.link}
              className="group relative overflow-hidden rounded-3xl border border-maroon-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brandNavy/90 via-brandNavy/40 to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-brandYellow text-brandNavy font-extrabold text-[11px] shadow">
                  {card.tag}
                </span>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-display font-extrabold text-base sm:text-lg group-hover:text-brandYellow transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-cream/80">{card.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Trust & Guarantee Bar with Logo Color Highlights */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="bg-white rounded-3xl border border-maroon-100 p-6 sm:p-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-brandRed/10 text-brandRed flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-brandNavy">දිවයින පුරා බෙදාහැරීම</h4>
              <p className="text-[11px] text-ink-muted">දින 2-4ක් ඇතුළත නිවසටම</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-brandYellow/30 text-brandNavy flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-brandNavy">ආරක්ෂිත ගෙවීම්</h4>
              <p className="text-[11px] text-ink-muted">PayHere & Koko BNPL</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-brandNavy">භාණ්ඩ ලැබුණු පසු මුදල්</h4>
              <p className="text-[11px] text-ink-muted">Cash on Delivery (COD)</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-brandNavy/10 text-brandNavy flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-brandNavy">100% නිල මුද්‍රණ</h4>
              <p className="text-[11px] text-ink-muted">පදනම ප්‍රකාශන සත්‍යාපිත</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Grade-Wise Explorer Bar */}
      <section className="w-full px-4 sm:px-8 lg:px-12 space-y-6">
        <div className="flex items-end justify-between border-b border-maroon-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brandRed uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>පාසල් විෂය නිර්දේශය</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brandNavy tracking-tight">
              ශ්‍රේණි අනුව ග්‍රන්ථ නාමාවලිය
            </h2>
          </div>
          <Link
            href="/books"
            className="text-xs font-extrabold text-brandRed hover:underline flex items-center gap-1"
          >
            <span>සියලු පොත් බලන්න</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/books?category=${cat.slug}`}
              className="group p-5 bg-white rounded-2xl border border-maroon-100 hover:border-brandRed hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-brandYellow/30 text-brandNavy group-hover:bg-brandRed group-hover:text-white flex items-center justify-center transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-brandRed transform group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-sm text-brandNavy group-hover:text-brandRed transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-ink-muted mt-0.5">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Featured Bestseller Books (Enhanced Cards with Discounts & Instant Cart) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-maroon-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brandRed uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-brandYellow" />
              <span>නවතම නිකුත් කිරීම් සහ වට්ටම්</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brandNavy tracking-tight">
              ජනප්‍රියම ග්‍රන්ථ (Bestselling Books)
            </h2>
          </div>
          <Link
            href="/books"
            className="px-5 py-2.5 rounded-xl bg-brandRed hover:bg-brandRed-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>පොත් සාප්පුවට යන්න (Shop All)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <BestsellersSection books={featuredBooks} />
      </section>

      {/* 6. Promotional Banner Strip (Publisher Ads from Padanama) */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/books?category=gce-ol"
            className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-maroon-100 block"
          >
            <img
              src="https://www.padanamapublication.lk/image/bg-images/570+169_pixel_ad_1.jpg"
              alt="සාමාන්‍ය පෙළ විශේෂ ප්‍රශ්න පත්‍ර කට්ටල"
              className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
            />
          </Link>

          <Link
            href="/books?category=primary"
            className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-maroon-100 block"
          >
            <img
              src="https://www.padanamapublication.lk/image/bg-images/570+169_pixel.jpg"
              alt="5 ශ්‍රේණිය ශිෂ්‍යත්ව විශේෂ පුහුණු පොත්"
              className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
            />
          </Link>
        </div>
      </section>

      {/* 7. Primary & Scholarship Section */}
      {primaryBooks.length > 0 && (
        <section className="w-full px-4 sm:px-8 lg:px-12 space-y-6">
          <div className="flex items-end justify-between border-b border-maroon-100 pb-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-brandNavy tracking-tight">
                ප්‍රාථමික සහ 5 ශ්‍රේණිය ශිෂ්‍යත්ව අත්වැල
              </h2>
              <p className="text-xs text-ink-muted mt-1">ශිෂ්‍යත්ව විභාගයට ඉලක්කගත ආදර්ශ ප්‍රශ්න පත්‍ර සහ පෙරහුරු අභ්‍යාස</p>
            </div>
            <Link href="/books?category=primary" className="text-xs font-extrabold text-brandRed hover:underline">
              ප්‍රාථමික සියලු පොත්
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {primaryBooks.map((book: any) => {
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
                  hasFreeSample={true}
                  isBestSeller={book.isBestSeller}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* 8. G.C.E. O/L Section */}
      {olBooks.length > 0 && (
        <section className="w-full px-4 sm:px-8 lg:px-12 space-y-6">
          <div className="flex items-end justify-between border-b border-maroon-100 pb-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-brandNavy tracking-tight">
                සාමාන්‍ය පෙළ (O/L) කෙටි සටහන් සහ විභාග ප්‍රශ්න පත්‍ර
              </h2>
              <p className="text-xs text-ink-muted mt-1">10 සහ 11 ශ්‍රේණි සඳහා විද්‍යාව, ගණිතය, සිංහල, ඉතිහාසය සහ වාණිජ</p>
            </div>
            <Link href="/books?category=gce-ol" className="text-xs font-extrabold text-brandRed hover:underline">
              සා.පෙ. සියලු පොත්
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {olBooks.map((book: any) => {
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
                  hasFreeSample={true}
                  isBestSeller={book.isBestSeller}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* 9. Verified Customer Reviews & Testimonials Section */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <UserReviewsSection />
      </section>

      {/* 10. Social Media Section: Left Facebook, Right YouTube */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <SocialMediaSection />
      </section>

      {/* 11. Official Publisher Direct Callout */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="bg-gradient-to-r from-brandNavy via-brandNavy to-maroon-900 text-cream rounded-3xl p-8 md:p-12 border-2 border-brandYellow/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brandYellow text-brandNavy font-black text-xs">
              <Phone className="w-3.5 h-3.5" />
              <span>පදනම ක්ෂණික පාරිභෝගික සේවය</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white">
              පොත් ඇණවුම් සහ විමසීම් සඳහා අප අමතන්න
            </h3>
            <p className="text-sm opacity-90 max-w-xl leading-relaxed">
              නො. 912/A, බෝගහ හන්දිය පාර, 10120, ශ්‍රී ලංකාව. තොග ඇණවුම්, පාසල් සැපයුම් හෝ බෙදාහැරීම් පිළිබඳ ඕනෑම සහයක් සඳහා අප අමතන්න.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs pt-1">
              <span className="font-bold text-brandYellow">දුරකථන: +94 71 800 8533 / +94 77 088 2228</span>
              <span>•</span>
              <span className="font-bold text-brandYellow">විද්‍යුත් තැපෑල: hello@padanamapublication.lk</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="https://wa.me/94718008533"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-transform hover:scale-105 text-center"
            >
              WhatsApp (+94 71 800 8533)
            </a>
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-brandYellow hover:bg-amber-400 text-brandNavy font-extrabold text-sm rounded-xl shadow-lg transition-transform hover:scale-105 text-center"
            >
              සම්බන්ධ වන්න
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
