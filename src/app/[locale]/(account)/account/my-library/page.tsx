import React from "react";
import { Link } from "@/i18n/routing";
import { BookOpen, Sparkles, Clock } from "lucide-react";

export default function MyLibraryPage() {
  const purchasedBooks = [
    {
      slug: "hanthana-kadu-pamula",
      titleSi: "හන්තාන කඳු පාමුල (නවකතාව)",
      authorName: "කුසල් ගුණසේකර",
      purchasedDate: "2026-11-05",
      format: "E-Book (Digital Edition)",
      progressPercent: 17,
      currentPage: 48,
      totalPages: 280,
    },
    {
      slug: "ol-mathematics-short-notes",
      titleSi: "සාමාන්‍ය පෙළ ගණිතය කෙටි සටහන් සහ සූත්‍ර සංග්‍රහය",
      authorName: "පදනම අධ්‍යාපනික කර්තෘ මණ්ඩලය",
      purchasedDate: "2026-10-18",
      format: "E-Book (Digital Edition)",
      progressPercent: 65,
      currentPage: 91,
      totalPages: 140,
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-maroon-100 pb-4">
        <h1 className="font-display font-bold text-2xl text-maroon-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-saffron-500" />
          <span>මගේ ඩිජිටල් පුස්තකාලය (My Purchased E-Books)</span>
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          ඔබ විසින් මිලදී ගත් සියලුම ඩිජිටල් ඊ-පොත් කිසිදු අමතර මෘදුකාංගයකින් තොරව බ්‍රවුසරය තුළදීම ඕනෑම මොහොතක කියවන්න.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {purchasedBooks.map((book) => (
          <div
            key={book.slug}
            className="p-6 bg-white rounded-3xl border border-maroon-100 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-200">
                සම්පූර්ණ ප්‍රවේශය (Full Access)
              </span>

              <h3 className="font-display font-bold text-base text-maroon-900 leading-snug">
                {book.titleSi}
              </h3>
              <p className="text-xs text-ink-muted">{book.authorName}</p>

              {/* Progress bar */}
              <div className="pt-2 space-y-1">
                <div className="flex justify-between text-[11px] text-ink-muted">
                  <span>කියවීමේ ප්‍රගතිය</span>
                  <span className="font-bold text-maroon-900">{book.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-saffron-500 rounded-full"
                    style={{ width: `${book.progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 block pt-0.5">
                  පිටුව {book.currentPage} / {book.totalPages}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                href={`/read/${book.slug}`}
                className="w-full py-2.5 bg-maroon-900 hover:bg-maroon-950 text-cream text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-gold-500" />
                <span>නැවත කියවීම අරඹන්න (Resume)</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
