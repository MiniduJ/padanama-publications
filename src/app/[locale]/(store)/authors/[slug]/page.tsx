import React from "react";
import { notFound } from "next/navigation";
import { getBooks } from "@/server/catalog/books";
import { BookCard } from "@/components/ui/BookCard";
import { Link } from "@/i18n/routing";
import { Users, BookOpen } from "lucide-react";

interface AuthorDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function AuthorDetailPage({ params }: AuthorDetailPageProps) {
  const { slug } = await params;
  const { books } = await getBooks({ author: slug, limit: 12 });

  const authorBios: Record<string, { nameSi: string; nameEn: string; bio: string }> = {
    "sybil-wettasinghe": {
      nameSi: "සිබිල් වෙත්තසිංහ",
      nameEn: "Sybil Wettasinghe",
      bio: "ශ්‍රී ලාංකීය ළමා සාහිත්‍යයේ අසහාය මාතාව සහ ජාත්‍යන්තර සම්මානනීය චිත්‍ර ශිල්පිනිය. පරම්පරා ගණනාවක් පුරා දූ දරුවන්ගේ සිත්සතන් ආලෝකවත් කළ විශිෂ්ට කෘති රැසක නිර්මාතෘවරිය.",
    },
    "padanama-editorial-board": {
      nameSi: "පදනම අධ්‍යාපනික කර්තෘ මණ්ඩලය",
      nameEn: "Padanama Educational Editorial Board",
      bio: "විශ්වවිද්‍යාල ආචාර්යවරුන්, ප්‍රවීණ ගුරුභවතුන් සහ ජාතික විභාග ප්‍රශ්න පත්‍ර සම්පාදක මණ්ඩල සාමාජිකයන්ගෙන් සමන්විත විශේෂඥ මණ්ඩලය.",
    },
    "kusal-gunasekara": {
      nameSi: "කුසල් ගුණසේකර",
      nameEn: "Kusal Gunasekara",
      bio: "සම්මානනීය සමකාලීන සිංහල නවකතා සහ කෙටිකතා රචක.",
    },
  };

  const author = authorBios[slug] || {
    nameSi: "පදනම කතුවරයා",
    nameEn: "Padanama Author",
    bio: "පදනම ප්‍රකාශන මඟින් එළිදැක්වුණු ග්‍රන්ථයන්හි ගෞරවනීය කර්තෘවරයා.",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-left">
      {/* Author Profile Header */}
      <div className="p-8 bg-white rounded-3xl border border-maroon-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="w-24 h-24 rounded-full bg-maroon-700 text-cream font-display font-extrabold text-4xl flex items-center justify-center border-4 border-gold-500 shadow-md shrink-0">
          {author.nameSi[0]}
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-maroon-50 text-maroon-800 text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>ලේඛක පැතිකඩ (Author Profile)</span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-maroon-900">
            {author.nameSi}
          </h1>
          <p className="text-xs font-semibold text-saffron-700">{author.nameEn}</p>

          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-2xl pt-1">
            {author.bio}
          </p>
        </div>
      </div>

      {/* Bibliography Shelf */}
      <div className="space-y-6">
        <div className="border-b border-maroon-100 pb-3 flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-maroon-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-saffron-500" />
            <span>කර්තෘගේ ප්‍රකාශිත ග්‍රන්ථ ({books.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book: any) => {
            const primaryEdition = book.editions?.[0] || {};
            return (
              <BookCard
                key={book.id}
                slug={book.slug}
                title={book.titleSi}
                authorName={author.nameSi}
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
      </div>
    </div>
  );
}
