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

interface BookDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { slug, locale } = await params;
  const book = await getBookBySlug(slug);

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
    "@type": "Book",
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
        <Link href="/" className="hover:text-maroon-700">මුල් පිටුව</Link>
        <span>/</span>
        <Link href="/books" className="hover:text-maroon-700">පොත්</Link>
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
                  පදනම ප්‍රකාශන
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
                  <span>නොමිලේ සාම්පලය පෙරලන්න</span>
                </span>
                <span className="text-[11px] text-ink-muted block">
                  පළමු පිටු {book.sampleConfig.maxPages || 20} පොතක් මෙන් කියවන්න (Interactive 3D Reader)
                </span>
              </div>
              <Link
                href={`/read/${book.slug}`}
                className="px-4 py-2.5 bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 hover:scale-105"
              >
                <span>කියවන්න ↷</span>
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Book Details & Buying Box */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-2">
              <Badge variant="maroon">{categoryName}</Badge>
              <Badge variant="green">තොග ඇත (In Stock)</Badge>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl text-maroon-900 leading-snug">
              {book.titleSi}
            </h1>
            <p className="text-sm font-semibold text-saffron-700">{book.titleEn}</p>

            <div className="flex items-center gap-3 pt-2">
              <Rating value={book.averageRating || 4.9} size="md" />
              <span className="text-xs font-bold text-ink-muted">
                {book.averageRating} ({book.reviewCount || 28} සමාලෝචන)
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
              coverImage: book.coverImage || undefined,
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
              <span>දිස්ත්‍රික්කය අනුව බෙදාහැරීමේ ගාස්තු සහ දින (Delivery Estimate):</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="font-bold block text-ink">කොළඹ / ගම්පහ (Western Province):</span>
                <span className="text-ink-muted">දින 1-2ක් ඇතුළත • රු. 200–250</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="font-bold block text-ink">පිට පළාත් (Other 23 Districts):</span>
                <span className="text-ink-muted">දින 2-4ක් ඇතුළත • රු. 300–350</span>
              </div>
            </div>
            <p className="text-[11px] text-green-700 font-semibold">
              ✓ රු. 3,500 ට වැඩි ඇණවුම් සඳහා දිවයින පුරා බෙදාහැරීම සම්පූර්ණයෙන්ම නොමිලේ!
            </p>
          </div>

          {/* Synopsis */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <h3 className="font-bold text-sm text-maroon-900">පොත පිළිබඳ විස්තරය (Synopsis)</h3>
            <p className="text-xs sm:text-sm text-ink leading-relaxed">
              {book.synopsisSi}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="font-bold text-sm text-maroon-900">තාක්ෂණික තොරතුරු (Specifications)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px]">ISBN අංකය</span>
                <span className="font-bold text-ink">{primaryEdition.isbn || "978-955-8001-01-2"}</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px]">පිටු ගණන</span>
                <span className="font-bold text-ink">{primaryEdition.pageCount || 160} පිටු</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px]">භාෂාව</span>
                <span className="font-bold text-ink">සිංහල (Sinhala)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
