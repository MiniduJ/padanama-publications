import React from "react";
import { Link } from "@/i18n/routing";
import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import { getBooks } from "@/server/catalog/books";
import { getHeroSlides, getSettings, getSocialItems, getTestimonials } from "@/server/site-content";
import { BookCard } from "@/components/ui/BookCard";
import { BestsellersSection } from "@/components/store/BestsellersSection";
import { HeroSlider } from "@/components/store/HeroSlider";
import { AutoCarousel } from "@/components/store/AutoCarousel";
import { UserReviewsSection } from "@/components/store/UserReviewsSection";
import { SocialMediaSection } from "@/components/store/SocialMediaSection";
import { BookOpen, ShieldCheck, Truck, CreditCard, Sparkles, Phone, ArrowRight, GraduationCap } from "lucide-react";

const IMG = "https://www.padanamapublication.lk/image";
const FEATURE_META = [
  { image: `${IMG}/others/shortnotes.jpg`, link: "/books?category=gce-ol" },
  { image: `${IMG}/others/termpapers.jpg`, link: "/books" },
  { image: `${IMG}/others/modelpapers.jpg`, link: "/books?category=primary" },
  { image: `${IMG}/others/pastpapers.jpg`, link: "/books?category=gov-exam-past-papers" },
];
const CATEGORY_SLUGS = ["preschool-grade-1-2", "primary", "grade-6-7", "grade-8-9", "gce-ol", "gce-al-science", "gce-al-tech", "gce-al-commerce", "gov-exam-past-papers"];
const TRUST_ICONS = [Truck, ShieldCheck, CreditCard, BookOpen];

function BookGrid({ books, locale }: { books: any[]; locale: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {books.map((book) => {
        const ed = book.editions?.[0] || {};
        return (
          <BookCard
            key={book.id}
            slug={book.slug}
            title={locale === "si" ? book.titleSi : book.titleEn || book.titleSi}
            authorName={book.authors?.[0]?.author?.[locale === "si" ? "nameSi" : "nameEn"] || "Padanama"}
            categoryName={book.categories?.[0]?.category?.[locale === "si" ? "nameSi" : "nameEn"]}
            coverUrl={book.coverUrl}
            priceCents={ed.priceCents || 75000}
            salePriceCents={ed.salePriceCents}
            rating={book.averageRating || 4.9}
            format={ed.format || "Paperback"}
            hasFreeSample
            isBestSeller={book.isBestSeller}
          />
        );
      })}
    </div>
  );
}

function SectionHead({ title, sub, href, cta }: { title: string; sub?: string; href: string; cta: string }) {
  return (
    <div className="flex items-end justify-between gap-3 border-b border-maroon-100 pb-4">
      <div>
        <h2 className="font-display font-extrabold text-2xl text-brandNavy tracking-tight">{title}</h2>
        {sub && <p className="text-sm text-ink-muted mt-1">{sub}</p>}
      </div>
      <Link href={href} className="text-xs font-extrabold text-brandRed hover:underline shrink-0">{cta}</Link>
    </div>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  const locale = await getLocale();
  const t = await getTranslations("home");
  const features = t.raw("features") as { title: string; subtitle: string; tag: string }[];
  const trust = t.raw("trust") as [string, string][];
  const cats = t.raw("categories") as [string, string][];

  const [{ books: featuredBooks }, { books: primaryBooks }, { books: olBooks }, slides, reviews, social, cfg] = await Promise.all([
    getBooks({ limit: 8, sort: "newest" }),
    getBooks({ category: "primary", limit: 4 }),
    getBooks({ category: "gce-ol", limit: 4 }),
    getHeroSlides(locale, t.raw("heroAlt") as string[]),
    getTestimonials(),
    getSocialItems(),
    getSettings(),
  ]);

  const px = "w-full px-4 sm:px-8 lg:px-12";

  return (
    <div className="w-full flex flex-col space-y-10 sm:space-y-16 pb-12">
      <section className="w-full"><HeroSlider slides={slides} /></section>

      {/* Quick finder: what parents do first — search or pick the child's grade */}
      <section className={px}>
        <div className="-mt-6 sm:-mt-10 relative z-10 bg-white rounded-3xl border border-maroon-100 shadow-lg p-4 sm:p-6 space-y-4">
          <form action={`/${locale}/search`} method="get" role="search" className="flex gap-2">
            <label htmlFor="home-search" className="sr-only">{t("finderPlaceholder")}</label>
            <input id="home-search" name="q" type="search" placeholder={t("finderPlaceholder")} className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-maroon-200 text-sm focus:outline-none focus:ring-2 focus:ring-brandRed" />
            <button className="px-4 sm:px-6 py-3 rounded-xl bg-brandRed hover:bg-brandRed-600 text-white text-sm font-extrabold shrink-0">{t("finderBtn")}</button>
          </form>
          <div>
            <p className="text-xs font-bold text-brandNavy mb-2 flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-brandRed" />{t("gradesKicker")}</p>
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap">
              {CATEGORY_SLUGS.map((slug, i) => (
                <Link key={slug} href={`/books?category=${slug}`} className="shrink-0 px-3.5 py-2 rounded-full border border-maroon-200 bg-cream/40 hover:bg-brandYellow/40 hover:border-brandYellow text-xs font-bold text-brandNavy">
                  {cats[i]?.[0]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Book-type carousel (auto-rotates) */}
      <section className={px}>
        <AutoCarousel label={t("featuresLabel")}>
          {features.map((card, i) => (
            <Link key={i} href={FEATURE_META[i]?.link || "/books"} className="group relative block overflow-hidden rounded-3xl border border-maroon-100 shadow-md hover:shadow-xl transition-all bg-white">
              <div className="aspect-[16/10] overflow-hidden relative">
                <img src={FEATURE_META[i]?.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-brandNavy/90 via-brandNavy/40 to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-brandYellow text-brandNavy font-extrabold text-[11px] shadow">{card.tag}</span>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-display font-extrabold text-base sm:text-lg group-hover:text-brandYellow transition-colors">{card.title}</h3>
                  <p className="text-xs text-cream/90">{card.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </AutoCarousel>
      </section>

      <section className={px}>
        <div className="bg-white rounded-3xl border border-maroon-100 p-6 sm:p-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
          {trust.map(([h, sub], i) => {
            const Icon = TRUST_ICONS[i];
            return (
              <div key={h} className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-brandYellow/30 text-brandNavy flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-brandNavy">{h}</h3>
                  <p className="text-[11px] text-ink-muted">{sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={`${px} space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-maroon-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brandRed uppercase tracking-wider mb-1"><Sparkles className="w-3.5 h-3.5 text-brandYellow" /><span>{t("bestKicker")}</span></div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brandNavy tracking-tight">{t("bestTitle")}</h2>
          </div>
          <Link href="/books" className="px-5 py-2.5 rounded-xl bg-brandRed hover:bg-brandRed-600 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 self-start sm:self-auto"><span>{t("shopAll")}</span><ArrowRight className="w-4 h-4" /></Link>
        </div>
        <BestsellersSection books={featuredBooks} />
      </section>

      {primaryBooks.length > 0 && (
        <section className={`${px} space-y-6`}>
          <SectionHead title={t("primaryTitle")} sub={t("primarySub")} href="/books?category=primary" cta={t("primaryAll")} />
          <BookGrid books={primaryBooks} locale={locale} />
        </section>
      )}

      {olBooks.length > 0 && (
        <section className={`${px} space-y-6`}>
          <SectionHead title={t("olTitle")} sub={t("olSub")} href="/books?category=gce-ol" cta={t("olAll")} />
          <BookGrid books={olBooks} locale={locale} />
        </section>
      )}

      <section className={px}><UserReviewsSection reviews={reviews} /></section>

      <section className={px}><SocialMediaSection items={social} title={t("socialTitle")} subtitle={t("socialSub")} /></section>

      <section className={px}>
        <div className="bg-gradient-to-r from-brandNavy via-brandNavy to-maroon-900 text-cream rounded-3xl p-8 md:p-12 border-2 border-brandYellow/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brandYellow text-brandNavy font-black text-xs"><Phone className="w-3.5 h-3.5" /><span>{t("ctaBadge")}</span></div>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white">{t("ctaTitle")}</h2>
            <p className="text-sm opacity-90 max-w-xl leading-relaxed">{t("ctaBody")}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs pt-1">
              <a href={`tel:${cfg["contact.phone"].replace(/\s/g, "")}`} className="font-bold text-brandYellow">{t("ctaPhone")}: {cfg["contact.phone"]} / {cfg["contact.phone2"]}</a>
              <a href={`mailto:${cfg["contact.email"]}`} className="font-bold text-brandYellow">{t("ctaEmail")}: {cfg["contact.email"]}</a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a href={`https://wa.me/${cfg["contact.whatsapp"]}`} target="_blank" rel="noreferrer" className="px-6 py-3.5 bg-green-700 hover:bg-green-800 text-white font-extrabold text-sm rounded-xl shadow-lg text-center">WhatsApp</a>
            <Link href="/contact" className="px-6 py-3.5 bg-brandYellow hover:bg-amber-400 text-brandNavy font-extrabold text-sm rounded-xl shadow-lg text-center">{t("ctaContact")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
