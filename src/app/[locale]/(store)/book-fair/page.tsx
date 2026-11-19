import React from "react";
import { Link } from "@/i18n/routing";
import { formatLkr } from "@/lib/money";
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Tag,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Gift,
  Truck,
  Building,
} from "lucide-react";

export default function BookFairPage() {
  const fairBundles = [
    {
      id: "bundle-ol",
      title: "සාමාන්‍ය පෙළ සම්පූර්ණ විභාග ජයග්‍රහණ පැකේජය (O/L Master Bundle)",
      description: "ගණිතය, විද්‍යාව සහ සිංහල සාහිත්‍ය කෙටි සටහන් සහ විභාග පෙරහුරු පොත් 3ම එකට.",
      regularPriceCents: 198000,
      fairPriceCents: 158400, // 20% off
      badge: "20% OFF",
      items: ["සාමාන්‍ය පෙළ ගණිතය කෙටි සටහන්", "10 ශ්‍රේණිය සිංහල සාහිත්‍ය සංග්‍රහය", "විද්‍යාව පෙරහුරු ප්‍රශ්නාවලිය"],
    },
    {
      id: "bundle-sch",
      title: "5 ශ්‍රේණිය ශිෂ්‍යත්ව විශිෂ්ටතා පැකේජය (Scholarship Excellence Pack)",
      description: "ආදර්ශ ප්‍රශ්න පත්‍ර 10ක්, විභාග මඟපෙන්වීම සහ IQ අභ්‍යාස ඇතුළත් සම්පූර්ණ කට්ටලය.",
      regularPriceCents: 130000,
      fairPriceCents: 104000, // 20% off
      badge: "BESTSELLER",
      items: ["5 ශ්‍රේණිය ශිෂ්‍යත්ව පෙරහුරු ප්‍රශ්න පත්‍ර 1-5", "5 ශ්‍රේණිය ශිෂ්‍යත්ව පෙරහුරු ප්‍රශ්න පත්‍ර 6-10"],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-maroon-900 via-maroon-850 to-maroon-950 p-6 sm:p-12 text-cream relative overflow-hidden shadow-2xl border-2 border-gold-500/40">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 backdrop-blur px-4 py-1.5 rounded-full border border-gold-500/50 text-xs font-bold text-gold-300">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>කොළඹ ජාත්‍යන්තර පොත් ප්‍රදර්ශන විශේෂ සැමරුම 2026</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl leading-tight">
            BMICH පොත් ප්‍රදර්ශන සමය!
          </h1>

          <p className="text-xs sm:text-base text-cream/90 leading-relaxed">
            පදනම ප්‍රකාශන විශිෂ්ට පොත් එකතුව කොළඹ ජාත්‍යන්තර පොත් ප්‍රදර්ශනයේදී හෝ වෙබ් අඩවියෙන් 20% ක සුවිශේෂී වට්ටමක් සහිතව දැන්ම ලබාගන්න.
          </p>

          <div className="p-4 bg-black/30 backdrop-blur rounded-2xl border border-gold-500/30 inline-flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gold-400" />
              <span>වෙබ් අඩවි ප්‍රවර්ධන කේතය:</span>
              <span className="font-mono font-black text-white bg-gold-500/30 px-2 py-0.5 rounded text-sm tracking-wider">
                CIBF2026
              </span>
            </div>
            <span className="text-gold-300">✓ සියලුම පොත් සඳහා 20% ක වට්ටමක්</span>
          </div>
        </div>
      </div>

      {/* BMICH Stall Locator & Fair Details */}
      <div className="bg-white rounded-3xl border border-maroon-200 shadow-md p-6 sm:p-10 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-black uppercase text-saffron-700 tracking-wider">
            ප්‍රදර්ශන කුටිය හඳුනාගන්න (BMICH STALL LOCATOR)
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-maroon-900">
            පදනම ප්‍රකාශන කුටිය වෙත ඔබ සැමට සාදරයෙන් ඇරයුම්!
          </h2>
          <p className="text-xs text-ink-muted">
            BMICH හිදී අපගේ ප්‍රවීණ කර්තෘවරුන් හමුවීමටත්, මුද්‍රිත පොත් සහ ඩිජිටල් සාම්පල අත්විඳීමටත් පැමිණෙන්න.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-cream/70 border border-gold-500/30 space-y-2 text-center">
            <Building className="w-8 h-8 text-maroon-900 mx-auto" />
            <h4 className="font-bold text-sm text-maroon-900">ශාලාව සහ කුටිය (Location)</h4>
            <p className="text-xs text-ink-muted">සිරිමාවෝ බණ්ඩාරනායක ප්‍රදර්ශන ශාලාව (Hall D)</p>
            <span className="inline-block bg-maroon-900 text-cream text-xs font-bold px-3 py-1 rounded-full">
              කුටි අංක 142 & 143
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-cream/70 border border-gold-500/30 space-y-2 text-center">
            <Calendar className="w-8 h-8 text-maroon-900 mx-auto" />
            <h4 className="font-bold text-sm text-maroon-900">පැවැත්වෙන දින (Dates)</h4>
            <p className="text-xs text-ink-muted">සැප්තැම්බර් 18 සිට 27 දක්වා</p>
            <span className="inline-block bg-saffron-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              දින 10ක් පුරා
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-cream/70 border border-gold-500/30 space-y-2 text-center">
            <Clock className="w-8 h-8 text-maroon-900 mx-auto" />
            <h4 className="font-bold text-sm text-maroon-900">වේලාව (Opening Hours)</h4>
            <p className="text-xs text-ink-muted">සෑම දිනකම අඛණ්ඩව</p>
            <span className="inline-block bg-maroon-900 text-cream text-xs font-bold px-3 py-1 rounded-full">
              පෙ.ව. 9:00 - ප.ව. 9:00
            </span>
          </div>
        </div>
      </div>

      {/* Book Fair Photo Gallery & Highlights */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-maroon-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-saffron-700 tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-saffron-500" />
              <span>ප්‍රදර්ශන මතක සටහන් • Photo Gallery</span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-maroon-900 tracking-tight">
              කොළඹ ජාත්‍යන්තර පොත් ප්‍රදර්ශන විශේෂ අවස්ථා
            </h3>
            <p className="text-xs text-ink-muted mt-1 max-w-2xl">
              BMICH හි සිරිමාවෝ බණ්ඩාරනායක ශාලාවේ පදනම ප්‍රකාශන කුටිය (Hall D, 142 & 143) වෙත පැමිණි දහස් සංඛ්‍යාත සිසු දරු දැරියන්, ගුරුභවතුන් සහ දෙමාපියන්ගේ ප්‍රීතිමත් අවස්ථා.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-saffron-500/20 text-maroon-900 font-extrabold text-xs border border-saffron-500/40 self-start sm:self-auto">
            BMICH Hall D • Stall 142 & 143
          </span>
        </div>

        {/* Gallery Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "පදනම ප්‍රකාශන නිල කුටිය (Hall D - Stall 142 & 143)",
              category: "ප්‍රදර්ශන කුටිය",
              desc: "BMICH හි පැවැත්වෙන ප්‍රධාන පොත් ප්‍රදර්ශනයේ පදනම නිල ප්‍රදර්ශන කුටිය වෙත පැමිණෙන පාඨක ජනතාව.",
              image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
              tag: "Hall D • Stall 142",
            },
            {
              title: "ශිෂ්‍යත්ව සහ O/L ආදර්ශ ප්‍රශ්න පත්‍ර කට්ටල නිකුතුව",
              category: "නව මුද්‍රණ",
              desc: "2026 විභාග සඳහා අලුතෙන්ම සම්පාදනය කළ පෙරහුරු හා ආදර්ශ ප්‍රශ්න පත්‍ර පොත් පෙළ එළිදැක්වීම.",
              image: "https://ufmcnjfvzxumcvmddpal.supabase.co/storage/v1/object/public/media/site/bg-images/mainslide1.jpg",
              tag: "නව නිකුත් කිරීම්",
            },
            {
              title: "පාසල් සිසු දරු දැරියන් පොත් තෝරාගැනීමේ අවස්ථාව",
              category: "පාඨක හමුව",
              desc: "සාමාන්‍ය පෙළ සහ උසස් පෙළ කෙටි සටහන් පොත් පරිශීලනය කරන සිසු සිසුවියන්.",
              image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
              tag: "ශිෂ්‍ය සහභාගීත්වය",
            },
            {
              title: "ප්‍රවීණ කර්තෘවරුන් සහ ගුරුභවතුන් සමඟ සුහද කතාබහ",
              category: "කර්තෘ හමුව",
              desc: "පදනම ප්‍රකාශන මණ්ඩලයේ විද්වත් ආචාර්යවරුන් සහ පාසල් ගුරුවරුන් අතර අධ්‍යාපනික සාකච්ඡා.",
              image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
              tag: "කර්තෘ හමුව",
            },
            {
              title: "5 ශ්‍රේණිය ශිෂ්‍යත්ව විශේෂ පුහුණු පොත් පෙළ ප්‍රදර්ශනය",
              category: "ප්‍රාථමික අංශය",
              desc: "කුඩා දරු දැරියන් සඳහා විභාග පෙරහුරු සහ IQ ප්‍රශ්න විවරණ ග්‍රන්ථ ප්‍රදර්ශනය කෙරෙන අයුරු.",
              image: "https://ufmcnjfvzxumcvmddpal.supabase.co/storage/v1/object/public/media/site/bg-images/mainslide3.jpg",
              tag: "ශිෂ්‍යත්ව අංශය",
            },
            {
              title: "පොත් ප්‍රදර්ශන විශේෂ 20% වට්ටම් සහ තිළිණ ලබාදීම",
              category: "විශේෂ දීමනා",
              desc: "BMICH හිදී මෙන්ම padanamapublication.lk වෙබ් අඩවිය ඔස්සේ ඇණවුම් කරන පාඨකයින්ට විශේෂ දීමනා.",
              image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
              tag: "20% OFF දීමනා",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl border border-maroon-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-saffron-500 text-maroon-950 font-black text-[10px] shadow">
                  {item.tag}
                </span>
                <span className="absolute bottom-3 left-3 text-[11px] font-bold text-gold-300">
                  {item.category}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-display font-extrabold text-sm sm:text-base text-maroon-900 group-hover:text-brandRed transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Online Bundles with Free Delivery */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-maroon-900">
              පොත් ප්‍රදර්ශන විශේෂ පැකේජ (Exclusive Fair Bundles)
            </h3>
            <p className="text-xs text-ink-muted mt-1">
              BMICH වෙත පැමිණීමට නොහැකි නම් වෙබ් අඩවියෙන් ඇණවුම් කර දිවයින පුරා නොමිලේම නිවසටම ගෙන්වාගන්න.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {fairBundles.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl border border-maroon-200 shadow-md p-6 sm:p-8 space-y-5 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-3">
                <span className="px-3 py-1 bg-saffron-500 text-white text-[10px] font-black tracking-wider uppercase rounded-full inline-block">
                  {b.badge}
                </span>

                <h4 className="font-display font-black text-lg text-maroon-900 leading-snug">
                  {b.title}
                </h4>

                <p className="text-xs text-ink-muted leading-relaxed">{b.description}</p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-gray-700 block">ඇතුළත් පොත්:</span>
                  {b.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-ink">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                      <span>{it}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 line-through block">
                    {formatLkr(b.regularPriceCents, "si")}
                  </span>
                  <span className="font-display font-black text-2xl text-maroon-900">
                    {formatLkr(b.fairPriceCents, "si")}
                  </span>
                </div>

                <Link
                  href="/cart"
                  className="py-3 px-5 rounded-xl bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Gift className="w-4 h-4" />
                  <span>දැන්ම මිලදී ගන්න</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
