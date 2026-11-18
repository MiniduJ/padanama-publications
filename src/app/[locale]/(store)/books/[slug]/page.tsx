import React from "react";
import { notFound } from "next/navigation";
import { getBookBySlug } from "@/server/catalog/books";
import { formatLkr } from "@/lib/money";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { Link } from "@/i18n/routing";
import {
  BookOpen,
  BookMarked,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle,
  Share2,
  Calendar,
  FileText,
  Bookmark,
} from "lucide-react";

const TEXT = {
  si: {
    grade: "ශ්‍රේණිය",
    subject: "විෂය / වාරය",
    bookType: "පොත් වර්ගය",
    stock: "තොගයේ ඇත",
    outOfStock: "තොග අවසන්",
    gallery: "පොතේ පිටු සහ පිටකවරය",
    preview: "පොත පෙරළා බලන්න",
    videos: "වීඩියෝ පාඩම් බලන්න",
    home: "මුල් පිටුව",
    books: "පොත්",
    publisher: "පදනම ප්‍රකාශන",
    sample: "නොමිලේ සාම්පලය පෙරලන්න",
    read: "කියවන්න ↷",
    inStock: "තොග ඇත (In Stock)",
    reviews: "සමාලෝචන",
    delivery: "දිස්ත්‍රික්කය අනුව බෙදාහැරීමේ ගාස්තු සහ දින (Delivery Estimate):",
    western: "කොළඹ / ගම්පහ (Western Province):",
    westernEta: "දින 1-2ක් ඇතුළත • රු. 200–250",
    other: "පිට පළාත් (Other 23 Districts):",
    otherEta: "දින 2-4ක් ඇතුළත • රු. 300–350",
    free: "✓ රු. 3,500 ට වැඩි ඇණවුම් සඳහා දිවයින පුරා බෙදාහැරීම සම්පූර්ණයෙන්ම නොමිලේ!",
    synopsis: "පොත පිළිබඳ විස්තරය (Synopsis)",
    specs: "තාක්ෂණික තොරතුරු (Specifications)",
    isbn: "ISBN අංකය",
    pages: "පිටු ගණන",
    pagesUnit: " පිටු",
    language: "භාෂාව",
    sinhala: "සිංහල (Sinhala)",
    sampleDesc: (n: number) => "පළමු පිටු " + n + " පොතක් මෙන් පෙරළා කියවන්න",
  },
  en: {
    grade: "Grade",
    subject: "Subject / term",
    bookType: "Book type",
    stock: "In stock",
    outOfStock: "Out of stock",
    gallery: "Inside pages & back cover",
    preview: "Flip through the book",
    videos: "Watch video lessons",
    home: "Home",
    books: "Books",
    publisher: "Padanama Publications",
    sample: "Flip through the free sample",
    read: "Read ↷",
    inStock: "In stock",
    reviews: "reviews",
    delivery: "Delivery estimate by district:",
    western: "Colombo / Gampaha (Western Province):",
    westernEta: "1-2 days • Rs. 200–250",
    other: "Other 23 districts:",
    otherEta: "2-4 days • Rs. 300–350",
    free: "✓ Free islandwide delivery on orders over Rs. 3,500!",
    synopsis: "About this book",
    specs: "Specifications",
    isbn: "ISBN",
    pages: "Pages",
    pagesUnit: " pages",
    language: "Language",
    sinhala: "Sinhala",
    sampleDesc: (n: number) => "Read the first " + n + " pages like a real book",
  },
  ta: {
    grade: "தரம்",
    subject: "பாடம்",
    bookType: "நூல் வகை",
    stock: "கையிருப்பு",
    outOfStock: "கையிருப்பில் இல்லை",
    gallery: "உள் பக்கங்கள்",
    preview: "நூலைப் புரட்டிப் பாருங்கள்",
    videos: "வீடியோ பாடங்கள்",
    home: "முகப்பு",
    books: "நூல்கள்",
    publisher: "பதனம வெளியீடுகள்",
    sample: "இலவச மாதிரியைப் புரட்டுங்கள்",
    read: "படிக்க ↷",
    inStock: "கையிருப்பில் உள்ளது",
    reviews: "மதிப்புரைகள்",
    delivery: "மாவட்ட வாரியான விநியோகம்:",
    western: "கொழும்பு / கம்பஹா (மேல் மாகாணம்):",
    westernEta: "1-2 நாட்கள் • ரூ. 200–250",
    other: "ஏனைய 23 மாவட்டங்கள்:",
    otherEta: "2-4 நாட்கள் • ரூ. 300–350",
    free: "✓ ரூ. 3,500 க்கு மேற்பட்ட ஆர்டர்களுக்கு இலவச விநியோகம்!",
    synopsis: "நூல் பற்றி",
    specs: "விவரக்குறிப்புகள்",
    isbn: "ISBN",
    pages: "பக்கங்கள்",
    pagesUnit: " பக்கங்கள்",
    language: "மொழி",
    sinhala: "சிங்களம்",
    sampleDesc: (n: number) => " முதல் " + n + " பக்கங்களைப் புத்தகம் போல் படியுங்கள்",
  },
};

interface BookDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { slug, locale } = await params;
  const book = await getBookBySlug(slug);
  const t = TEXT[(locale as keyof typeof TEXT)] || TEXT.si;
  const isBook = !book.productType || book.productType === "BOOK";

  if (!book) {
    notFound();
  }

  const primaryEdition = book.editions?.[0] || {};
  const authorName = book.authors?.[0]?.author?.nameSi || "පදනම ප්‍රකාශන";
  const categoryName = book.categories?.[0]?.category?.nameSi || "අධ්‍යාපනික";
  const currentPriceCents = primaryEdition.salePriceCents || primaryEdition.priceCents || 65000;
  const isDiscounted = primaryEdition.salePriceCents && primaryEdition.salePriceCents < primaryEdition.priceCents;

  // JSON-LD structured data for Google Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": book.productType && book.productType !== "BOOK" ? "Product" : "Book",
    name: book.titleSi,
    alternateName: book.titleEn,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Padanama Publications",
      url: "https://padanamapublication.lk",
    },
    isbn: primaryEdition.isbn,
    numberOfPages: primaryEdition.pageCount || 160,
    inLanguage: "si",
    offers: {
      "@type": "Offer",
      price: (currentPriceCents / 100).toFixed(2),
      priceCurrency: "LKR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Padanama Publications",
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:py-10 space-y-10 sm:space-y-12">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="text-xs text-ink-muted flex items-center gap-2">
        <Link href="/" className="hover:text-maroon-700">{t.home}</Link>
        <span>/</span>
        <Link href="/books" className="hover:text-maroon-700">{t.books}</Link>
        <span>/</span>
        <span className="text-maroon-900 font-bold truncate">{book.titleSi}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Book Cover Presentation */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm aspect-[1/1.4] bg-gradient-to-tr from-maroon-100 via-cream to-white rounded-3xl border-2 border-maroon-100 p-6 flex items-center justify-center shadow-lg relative overflow-hidden">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.titleSi}
                className="w-full h-full object-contain max-h-[380px] rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-52 h-72 bg-maroon-700 text-cream rounded-xl shadow-2xl p-6 flex flex-col justify-between border-4 border-gold-500/40 relative transform hover:scale-105 transition-transform duration-300">
                <span className="text-xs font-bold text-gold-500 tracking-widest uppercase">
                  {t.publisher}
                </span>
                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-lg line-clamp-3 leading-tight">
                    {book.titleSi}
                  </h3>
                  <p className="text-[11px] text-cream/70 line-clamp-1">{authorName}</p>
                </div>
                <div className="text-[10px] text-cream/60 border-t border-cream/20 pt-2 flex justify-between items-center">
                  <span>{primaryEdition.isbn || "ISBN Verified"}</span>
                  <span>{book.publishedYear}</span>
                </div>
              </div>
            )}

            {book.isBestSeller && (
              <Badge variant="saffron" className="absolute top-4 left-4 shadow">
                Best Seller
              </Badge>
            )}
          </div>

          {/* Free Sample Interactive Book Reader Invitation */}
          {book.sampleConfig && (
            <div className="mt-6 w-full max-w-sm p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-saffron-300 shadow-md flex items-center justify-between gap-3 relative overflow-hidden group">
              <div className="space-y-0.5">
                <span className="text-xs font-black text-brandNavy flex items-center gap-1.5">
                  <BookMarked className="w-4 h-4 text-brandRed" />
                  <span>{t.sample}</span>
                </span>
                <span className="text-[11px] text-ink-muted block">
                  {t.sampleDesc(book.sampleConfig.maxPages || 20)}
                </span>
              </div>
              <Link
                href={`/read/${book.slug}`}
                className="px-4 py-2.5 bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 hover:scale-105"
              >
                <span>{t.read}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Book Details & Buying Box */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-2">
              <Badge variant="maroon">{categoryName}</Badge>
              <Badge variant="green">{t.inStock}</Badge>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl text-maroon-900 leading-snug">
              {book.titleSi}
            </h1>
            <p className="text-sm font-semibold text-saffron-700">{book.titleEn}</p>

            <div className="flex items-center gap-3 pt-2">
              <Rating value={book.averageRating || 4.9} size="md" />
              <span className="text-xs font-bold text-ink-muted">
                {book.averageRating} ({book.reviewCount || 28} {t.reviews})
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="flex items-baseline gap-3">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-maroon-900">
              {formatLkr(currentPriceCents, locale as any)}
            </span>
            {isDiscounted && (
              <span className="text-base text-gray-400 line-through">
                {formatLkr(primaryEdition.priceCents, locale as any)}
              </span>
            )}
          </div>

          {/* Interactive Format Selector, Quantity, Add to Cart & Buy Now */}
          <AddToCartButton
            book={{
              id: book.id,
              slug: book.slug,
              titleSi: book.titleSi,
              titleEn: book.titleEn,
              authorName: authorName,
              coverImage: book.coverUrl || undefined,
              editions: book.editions?.map((e: any) => ({
                id: e.id,
                format: e.format,
                priceCents: e.priceCents,
                salePriceCents: e.salePriceCents,
                weightGrams: e.weightGrams,
              })) || [],
            }}
            defaultFormat={(primaryEdition.format as any) || "PAPERBACK"}
            locale={locale as any}
            showBuyNow={true}
          />

          {/* Islandwide Delivery Calculator Box */}
          <div className="p-4 rounded-2xl bg-white border border-maroon-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-maroon-900">
              <Truck className="w-4 h-4 text-saffron-500" />
              <span>{t.delivery}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="font-bold block text-ink">{t.western}</span>
                <span className="text-ink-muted">{t.westernEta}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="font-bold block text-ink">{t.other}</span>
                <span className="text-ink-muted">{t.otherEta}</span>
              </div>
            </div>
            <p className="text-[11px] text-green-700 font-semibold">
              {t.free}
            </p>
          </div>

          {/* Synopsis */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <h3 className="font-bold text-sm text-maroon-900">{t.synopsis}</h3>
            <p className="text-xs sm:text-sm text-ink leading-relaxed">
              {locale === "si" ? book.synopsisSi : book.synopsisEn || book.synopsisSi}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="font-bold text-sm text-maroon-900">{t.specs}</h3>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {([
                [t.grade, book.grade],
                [t.subject, book.subject],
                [t.bookType, book.bookType],
                ...(isBook ? [
                  [t.isbn, primaryEdition.isbn],
                  [t.pages, primaryEdition.pageCount && `${primaryEdition.pageCount}${t.pagesUnit}`],
                  [t.language, book.language === "ENGLISH" ? "English" : book.language === "TAMIL" ? "தமிழ்" : t.sinhala],
                ] : []),
                [t.stock, primaryEdition.stockQuantity > 0 ? `${primaryEdition.stockQuantity}` : t.outOfStock],
              ] as [string, any][]).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="p-3 bg-white rounded-lg border border-gray-100">
                  <dt className="text-gray-400 text-[10px]">{k}</dt>
                  <dd className="font-bold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {(book.galleryUrls?.length > 0 || book.previewUrl || book.materialsUrl) && (
        <section className="space-y-6">
          {book.galleryUrls?.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-bold text-sm text-maroon-900">{t.gallery}</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {book.galleryUrls.map((u: string) => (
                  <a key={u} href={u} target="_blank" rel="noreferrer" className="shrink-0"><img src={u} alt="" loading="lazy" className="h-48 w-auto rounded-xl border shadow-sm" /></a>
                ))}
              </div>
            </div>
          )}
          {book.previewUrl && (
            <div className="space-y-3">
              <h2 className="font-bold text-sm text-maroon-900">{t.preview}</h2>
              <iframe src={book.previewUrl} title={`${book.titleSi} preview`} loading="lazy" allowFullScreen className="w-full h-[520px] rounded-2xl border border-maroon-100 bg-white" />
            </div>
          )}
          {book.materialsUrl && (
            <a href={book.materialsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF0000] text-white text-sm font-extrabold">▶ {t.videos}</a>
          )}
        </section>
      )}
    </div>
  );
}