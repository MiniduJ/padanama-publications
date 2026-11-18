"use client";

import React from "react";
import { Star, CheckCircle2, Quote, ThumbsUp, Sparkles, MessageSquare } from "lucide-react";

interface Review {
  id: number;
  name: string;
  role: string;
  location: string;
  rating: number;
  date: string;
  badge: string;
  title: string;
  comment: string;
  helpfulCount: number;
  bookTitle?: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "කුමුදුනී අබේසිංහ",
    role: "දෙමව්පියෙකි (මවක්)",
    location: "මහනුවර",
    rating: 5,
    date: "පෙරේදා",
    badge: "සත්‍යාපිත මිලදී ගැනීමක් ✓",
    title: "ශිෂ්‍යත්ව විභාගය 186කින් විශිෂ්ට ලෙස සමත් වුණා!",
    comment:
      "මගේ දුව පසුගිය 5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාගයෙන් ලකුණු 186ක් අරගෙන දිස්ත්‍රික්කයේ ඉහළින්ම සමත් වුණා. පදනම ආදර්ශ ප්‍රශ්න පත්‍ර සහ පෙරහුරු අභ්‍යාස පොත්වල තිබුණු ප්‍රශ්න රටාව සැබෑ විභාග ප්‍රශ්න පත්‍රයට ගොඩක් සමානයි. මුද්‍රණයේ ගුණාත්මක බව සහ පැහැදිලි පිළිතුරු විවරණ ඉතා විශිෂ්ටයි.",
    helpfulCount: 48,
    bookTitle: "5 ශ්‍රේණිය ශිෂ්‍යත්ව ආදර්ශ ප්‍රශ්න පත්‍ර එකතුව",
  },
  {
    id: 2,
    name: "ඩී. එම්. සෙනෙවිරත්න",
    role: "ගණිත හා විද්‍යා ආචාර්ය",
    location: "කුරුණෑගල",
    rating: 5,
    date: "පසුගිය සතියේ",
    badge: "පාසල් ආචාර්ය සත්‍යාපිත ✓",
    title: "O/L සිසුන්ට නිර්දේශ කළ හැකි අංක 1 පොත් පෙළ",
    comment:
      "සාමාන්‍ය පෙළ ගණිතය සහ විද්‍යාව කෙටි සටහන් සහ පසුගිය විභාග ප්‍රශ්න විවරණ පොත් පෙළ මගේ පන්තිවල ළමයින්ට නිර්දේශ කළා. විෂය කරුණු ඉතාම ක්‍රමානුකූලව සහ සරලව කෙටි සටහන් ලෙස ඉදිරිපත් කර තිබීම දරුවන්ට විභාගය ආසන්නයේ මතක තබා ගැනීමට ඉතා පහසුයි.",
    helpfulCount: 62,
    bookTitle: "සාමාන්‍ය පෙළ විද්‍යාව සහ ගණිතය කෙටි සටහන්",
  },
  {
    id: 3,
    name: "කවීෂා මධුෂානි",
    role: "A/L ජීව විද්‍යා ශිෂ්‍යාව (2025)",
    location: "ගාල්ල",
    rating: 5,
    date: "දින 3කට පෙර",
    badge: "A/L විද්‍යා ශිෂ්‍යාව ✓",
    title: "කොළඹ නොගිහින් දවස් 2න් පොත් ටික ගෙදරටම ආවා!",
    comment:
      "A/L Biology Resource Book එකට අනුකූලව හදපු MCQ ප්‍රශ්න සහ විවරණ පොත් ටික නම් උපරිමයි. කොළඹ සාප්පු ගානේ රස්තියාදු නොවී ගෙදර ඉඳලම ඔන්ලයින් ඕඩර් කරලා දවස් 2න් Domex කුරියර් හරහා පොත් ලැබුණා. COD ක්‍රමයට ගෙවන්න ලැබීමත් ලොකු සහනයක්.",
    helpfulCount: 39,
    bookTitle: "උසස් පෙළ ජීව විද්‍යාව බහුවරණ ප්‍රශ්න හා විවරණ",
  },
  {
    id: 4,
    name: "චමින්ද විජේකෝන්",
    role: "දෙමව්පියෙකි (පියෙක්)",
    location: "කොළඹ 06",
    rating: 5,
    date: "සති 2කට පෙර",
    badge: "සත්‍යාපිත මිලදී ගැනීමක් ✓",
    title: "පොත් සාම්පල ඔන්ලයින් කියවලා තීරණය කරන්න ලැබුණා",
    comment:
      "වෙබ් අඩවියෙන් ඇණවුම් කිරීම ඉතාම පහසුයි. විශේෂයෙන්ම නොමිලේ ඩිජිටල් පුස්තකාලයෙන් පිටු 20ක සාම්පල කලින්ම කියවලා බලන්න ලැබීම විශිෂ්ට අත්දැකීමක්. පොත්වල අන්තර්ගතය ගැන පූර්ණ අවබෝධයකින් මිලදී ගන්න පුළුවන් වුණා.",
    helpfulCount: 31,
    bookTitle: "6-9 ශ්‍රේණි විෂයානුබද්ධ වැඩපොත් කට්ටලය",
  },
  {
    id: 5,
    name: "එන්. එස්. මුදලිගේ",
    role: "ඉතිහාසය හා සිංහල ආචාරිනී",
    location: "මාතර",
    rating: 5,
    date: "සති 3කට පෙර",
    badge: "පාසල් ආචාරිනී ✓",
    title: "ලකුණු ලබාදීමේ පටිපාටිය (Marking Scheme) අතිවිශිෂ්ටයි",
    comment:
      "පදනම ප්‍රකාශන මඟින් ඉදිරිපත් කරන O/L ආදර්ශ ප්‍රශ්න පත්‍ර කට්ටල වාර විභාග සඳහා පුහුණු වීමට අතිශය ප්‍රයෝජනවත්. විශේෂයෙන්ම ලකුණු ලබාදීමේ පටිපාටිය (Marking Scheme) විභාග දෙපාර්තමේන්තු මට්ටමටම සකසා තිබීම අගය කළ යුතුයි.",
    helpfulCount: 54,
    bookTitle: "සාමාන්‍ය පෙළ ඉතිහාසය සහ සිංහල ආදර්ශ ප්‍රශ්න පත්‍ර",
  },
  {
    id: 6,
    name: "දිනෙත් ප්‍රනාන්දු",
    role: "O/L 9A විශිෂ්ට සාමාර්ථ්‍යලාභී ශිෂ්‍යයෙක්",
    location: "ගම්පහ",
    rating: 5,
    date: "මාසයකට පෙර",
    badge: "O/L 9A විශිෂ්ටයෙක් ✓",
    title: "විභාගයට මාස 3කට පෙර ගෙන්නා ගත්තා — 9A ප්‍රතිඵලයක් ලැබුණා",
    comment:
      "විභාගයට මාස 3කට කලින් පදනම කෙටි සටහන් පොත් සියල්ල ගෙන්නා ගත්තා. විශේෂයෙන් විද්‍යාව හා ඉතිහාසය පාඩම් ඉතා ඉක්මනින් ආවරණය කරගන්න පුළුවන් වුණා. මගේ 9A ජයග්‍රහණයට පදනම පොත් ලොකු ශක්තියක් වුණා. හැම ශිෂ්‍යයෙකුටම මම නිර්දේශ කරනවා.",
    helpfulCount: 77,
    bookTitle: "O/L සියලු විෂයයන්හි කෙටි සටහන් පෙළ",
  },
];

export function UserReviewsSection() {
  return (
    <section className="w-full space-y-8">
      {/* Header with Aggregated Rating */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-maroon-100 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brandYellow text-brandNavy font-black text-xs shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brandNavy" />
            <span>සත්‍යාපිත පාරිභෝගික ඇගයුම් • 1,850+ Customer Reviews</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-brandNavy tracking-tight">
            ගුරුභවතුන්, දෙමාපියන් සහ සිසුන්ගේ සත්‍ය අදහස්
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted max-w-2xl leading-relaxed">
            දිවයින පුරා පදනම ප්‍රකාශන පරිහරණය කළ සිසු දරු දැරියන්, පාසල් ගුරුවරුන් සහ දෙමාපියන් පළ කළ විශ්වාසනීය ප්‍රතිචාර.
          </p>
        </div>

        {/* Aggregated Score Pill */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-maroon-100 shadow-sm shrink-0">
          <div className="text-center border-r border-maroon-100 pr-4">
            <span className="font-display font-black text-3xl sm:text-4xl text-brandNavy block leading-none">
              4.9
            </span>
            <span className="text-[10px] text-ink-muted uppercase font-bold tracking-wider">
              5.0 න්
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-brandYellow">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-brandYellow" />
              ))}
            </div>
            <p className="text-xs font-extrabold text-brandNavy">
              98.6% තෘප්තිමත් පාරිභෝගිකයින්
            </p>
            <p className="text-[10px] text-ink-muted">
              දිවයිනේ දිස්ත්‍රික්ක 25ම ආවරණය කරමින්
            </p>
          </div>
        </div>
      </div>

      {/* 6 Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl p-6 border border-maroon-100 shadow-sm hover:shadow-xl hover:border-brandRed/30 transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-3.5">
              {/* Top Row: Stars, Badge, Date */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-brandYellow">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brandYellow" />
                  ))}
                </div>
                <span className="text-[10px] text-ink-muted font-medium">{rev.date}</span>
              </div>

              {/* Verified Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{rev.badge}</span>
              </div>

              {/* Review Title */}
              <h3 className="font-display font-extrabold text-sm sm:text-base text-brandNavy group-hover:text-brandRed transition-colors leading-snug">
                "{rev.title}"
              </h3>

              {/* Review Comment */}
              <p className="text-xs text-ink/80 leading-relaxed font-normal">
                {rev.comment}
              </p>

              {/* Related Book Pill */}
              {rev.bookTitle && (
                <div className="pt-2">
                  <span className="text-[10px] bg-slate-50 text-brandNavy font-semibold px-2.5 py-1 rounded-lg border border-slate-200 inline-block truncate max-w-full">
                    📖 {rev.bookTitle}
                  </span>
                </div>
              )}
            </div>

            {/* Author Footer */}
            <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brandNavy to-brandRed text-brandYellow font-extrabold flex items-center justify-center text-sm shadow">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-brandNavy leading-tight">{rev.name}</h4>
                  <p className="text-[10px] text-ink-muted leading-tight">
                    {rev.role} • <span className="font-semibold text-brandRed">{rev.location}</span>
                  </p>
                </div>
              </div>

              {/* Helpful count */}
              <div className="flex items-center gap-1 text-ink-muted text-[11px]">
                <ThumbsUp className="w-3 h-3 text-ink-muted" />
                <span>{rev.helpfulCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Highlights Strip */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brandNavy/5 via-cream to-brandNavy/5 border border-maroon-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <span className="font-display font-extrabold text-lg text-brandNavy block">
            100% සත්‍යාපිත විභාග නිර්දේශ
          </span>
          <p className="text-xs text-ink-muted">
            ජාතික අධ්‍යාපන ආයතන (NIE) නව විෂය නිර්දේශයන්ට අනුකූලයි
          </p>
        </div>
        <div className="space-y-1 border-t sm:border-t-0 sm:border-x border-maroon-100 pt-3 sm:pt-0">
          <span className="font-display font-extrabold text-lg text-brandNavy block">
            දින 2-4න් වේගවත් බෙදාහැරීම
          </span>
          <p className="text-xs text-ink-muted">
            Domex සහ Koombiyo කුරියර් මඟින් දිවයින පුරා නිවසටම
          </p>
        </div>
        <div className="space-y-1 border-t sm:border-t-0 border-maroon-100 pt-3 sm:pt-0">
          <span className="font-display font-extrabold text-lg text-brandNavy block">
            පහසු මුදල් ගෙවීමේ ක්‍රම
          </span>
          <p className="text-xs text-ink-muted">
            භාණ්ඩ ලැබුණු පසු මුදල් ගෙවීම (COD), PayHere හෝ Koko BNPL
          </p>
        </div>
      </div>
    </section>
  );
}