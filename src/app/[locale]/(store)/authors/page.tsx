import React from "react";
import { Link } from "@/i18n/routing";
import { Users, BookOpen } from "lucide-react";

export default function AuthorsPage() {
  const authors = [
    {
      slug: "sybil-wettasinghe",
      nameSi: "සිබිල් වෙත්තසිංහ",
      nameEn: "Sybil Wettasinghe",
      bio: "ශ්‍රී ලාංකීය ළමා සාහිත්‍යයේ අසහාය මාතාව සහ ජාත්‍යන්තර සම්මානනීය චිත්‍ර ශිල්පිනිය.",
      bookCount: 14,
    },
    {
      slug: "padanama-editorial-board",
      nameSi: "පදනම අධ්‍යාපනික කර්තෘ මණ්ඩලය",
      nameEn: "Padanama Educational Editorial Board",
      bio: "ප්‍රවීණ ආචාර්ය මහාචාර්යවරුන් සහ විෂය ප්‍රවීණයන්ගෙන් සමන්විත අධ්‍යාපනික කමිටුව.",
      bookCount: 28,
    },
    {
      slug: "kusal-gunasekara",
      nameSi: "කුසල් ගුණසේකර",
      nameEn: "Kusal Gunasekara",
      bio: "සම්මානනීය සමකාලීන සිංහල නවකතා සහ කෙටිකතා රචක.",
      bookCount: 6,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      <div className="border-b border-maroon-100 pb-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-maroon-900 tracking-tight flex items-center gap-3">
          <Users className="w-8 h-8 text-saffron-500" />
          <span>කතුවරුන් (Authors & Contributors)</span>
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          පදනම ප්‍රකාශන සමඟ අත්වැල් බැඳගත් ශ්‍රී ලාංකීය ප්‍රවීණ සහ සම්මානනීය විද්වතුන්.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((a) => (
          <Link
            key={a.slug}
            href={`/authors/${a.slug}`}
            className="p-6 bg-white rounded-2xl border border-maroon-100 shadow-sm hover:shadow-md transition-all space-y-3 block group"
          >
            <div className="w-14 h-14 rounded-full bg-maroon-100 text-maroon-800 font-bold text-xl flex items-center justify-center border-2 border-gold-500/50 group-hover:scale-105 transition-transform">
              {a.nameSi[0]}
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-base text-maroon-900 group-hover:text-saffron-600 transition-colors">
                {a.nameSi}
              </h3>
              <p className="text-xs text-saffron-700 font-semibold">{a.nameEn}</p>
            </div>

            <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
              {a.bio}
            </p>

            <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-xs text-ink-muted">
              <BookOpen className="w-3.5 h-3.5 text-maroon-700" />
              <span>ප්‍රකාශිත පොත් {a.bookCount}ක්</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
