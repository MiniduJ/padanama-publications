import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { BookOpen, ShieldCheck, Truck, CreditCard, ShoppingBag, Search, Sparkles, Phone } from "lucide-react";

export default function HomePage() {
  const t = useTranslations("common");
  const nav = useTranslations("nav");
  const trust = useTranslations("trust");
  const bookT = useTranslations("book");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Cultural Announcement Bar */}
      <div className="bg-maroon-900 text-cream text-xs sm:text-sm py-2 px-4 text-center font-medium tracking-wide flex justify-between items-center max-w-7xl mx-auto w-full">
        <span className="flex items-center gap-1.5 mx-auto">
          <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
          {t("freeDeliveryNotice")}
        </span>
        <div className="hidden md:flex gap-3 text-xs opacity-90">
          <Link href="/" locale="si" className="hover:text-gold-500 transition-colors">සිංහල</Link>
          <span>|</span>
          <Link href="/" locale="en" className="hover:text-gold-500 transition-colors">English</Link>
          <span>|</span>
          <Link href="/" locale="ta" className="hover:text-gold-500 transition-colors">தமிழ்</Link>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-maroon-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-maroon-500 text-cream flex items-center justify-center font-display font-extrabold text-2xl shadow-md border-2 border-gold-500 group-hover:scale-105 transition-transform">
              ප
            </div>
            <div>
              <span className="font-display font-bold text-2xl tracking-tight text-maroon-900 block leading-tight">
                {t("appName")}
              </span>
              <span className="text-xs text-ink-muted hidden sm:block">
                {t("tagline")}
              </span>
            </div>
          </Link>

          {/* Search Bar with Singlish Indicator */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-maroon-200 rounded-full text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent shadow-inner"
              />
              <Search className="w-4 h-4 text-maroon-700 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/library"
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-maroon-900 hover:text-saffron-700 rounded-lg hover:bg-maroon-50 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-saffron-500" />
              {nav("digitalLibrary")}
            </Link>

            <Link
              href="/cart"
              className="relative p-2.5 rounded-full bg-white border border-maroon-100 hover:border-saffron-500 text-maroon-900 transition-colors shadow-sm"
              aria-label={t("cart")}
            >
              <ShoppingBag className="w-5 h-5 text-maroon-700" />
              <span className="absolute -top-1 -right-1 bg-saffron-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-cream">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-maroon-50 via-cream to-cream py-12 md:py-20 border-b border-maroon-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-maroon-100 border border-maroon-200 text-maroon-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>නිල පදනම ප්‍රකාශන වෙබ් අඩවිය</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-maroon-900 tracking-tight leading-tight">
              දැනුමෙන් සන්නද්ධ දරු පරපුරකට <br className="hidden sm:inline" />
              <span className="text-saffron-500 underline decoration-gold-500 decoration-wavy decoration-2">
                විශ්වාසනීය පදනම
              </span>
            </h1>

            <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl">
              1 වසරේ සිට උසස් පෙළ දක්වා විෂයානුබද්ධ වැඩ පොත්, කෙටි සටහන්, පසුගිය ප්‍රශ්න පත්‍ර සහ සම්මානනීය සාහිත්‍ය කෘති දැන් එකම තැනකින් ඇණවුම් කරන්න.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/books"
                className="px-6 py-3.5 rounded-xl bg-saffron-500 hover:bg-saffron-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              >
                {nav("books")}
              </Link>
              <Link
                href="/library"
                className="px-6 py-3.5 rounded-xl bg-white border-2 border-maroon-500 text-maroon-900 hover:bg-maroon-50 font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-maroon-700" />
                {t("readSample")}
              </Link>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="relative flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-maroon-100 p-6 relative z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-maroon-700 uppercase tracking-wider">
                  නොමිලේ සාම්පල කියවීම
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold">
                  ඩිජිටල් පෙරදසුන
                </span>
              </div>
              <div className="p-4 rounded-xl bg-cream border border-gold-500/20 text-center space-y-3">
                <div className="w-16 h-20 bg-maroon-500 text-cream rounded mx-auto flex items-center justify-center font-bold text-sm shadow">
                  පොත
                </div>
                <h3 className="font-bold text-maroon-900 text-base">
                  5 ශ්‍රේණිය ශිෂ්‍යත්ව පෙරහුරු ප්‍රශ්න පත්‍ර
                </h3>
                <p className="text-xs text-ink-muted">
                  පළමු පිටු 20 දැන්ම කිසිදු ගෙවීමකින් තොරව ඔන්ලයින් කියවන්න.
                </p>
                <Link
                  href="/read/scholarship-grade-5-model-papers"
                  className="inline-block w-full py-2.5 px-4 bg-maroon-500 hover:bg-maroon-700 text-cream text-xs font-bold rounded-lg shadow transition-colors"
                >
                  {bookT("readFreeSample")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Bar */}
      <section className="bg-white border-b border-maroon-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-maroon-50 text-maroon-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ink">{trust("islandwideDelivery")}</h4>
              <p className="text-[11px] text-ink-muted">{trust("deliverySub")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-saffron-50 text-saffron-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ink">{trust("securePayment")}</h4>
              <p className="text-[11px] text-ink-muted">{trust("paymentSub")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ink">{trust("cashOnDelivery")}</h4>
              <p className="text-[11px] text-ink-muted">{trust("codSub")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold-50 text-gold-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ink">{trust("authenticBooks")}</h4>
              <p className="text-[11px] text-ink-muted">{trust("authenticSub")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-maroon-900 text-cream py-12 border-t-4 border-gold-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xl text-gold-500">
              {t("appName")}
            </h3>
            <p className="text-xs leading-relaxed opacity-80">
              නො. 912/A, බෝගහ හන්දිය පාර, ගෝඨාභය, කොලොන්නාව, ශ්‍රී ලංකාව.
            </p>
            <div className="flex items-center gap-2 text-xs text-gold-500 font-semibold">
              <Phone className="w-4 h-4" />
              <span>+94 71 800 8533 / +94 77 088 2228</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-sm text-gold-500">ප්‍රධාන සබැඳි</h4>
            <ul className="text-xs space-y-1.5 opacity-80">
              <li><Link href="/books" className="hover:text-gold-500">{nav("books")}</Link></li>
              <li><Link href="/library" className="hover:text-gold-500">{nav("digitalLibrary")}</Link></li>
              <li><Link href="/about" className="hover:text-gold-500">{nav("about")}</Link></li>
              <li><Link href="/contact" className="hover:text-gold-500">{nav("contact")}</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-sm text-gold-500">පිළිගත් ගෙවීම් ක්‍රම</h4>
            <p className="text-xs opacity-80">
              PayHere (Visa, MasterCard, eZ Cash, Genie, FriMi), Koko BNPL, බැංකු තැන්පතු සහ භාණ්ඩ ලැබුණු පසු මුදල් ගෙවීම (COD).
            </p>
            <p className="text-[11px] pt-4 opacity-60">
              © {new Date().getFullYear()} Padanama Publications. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
