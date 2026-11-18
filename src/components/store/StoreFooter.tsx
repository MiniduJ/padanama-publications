import React from "react";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/ui/Logo";
import { Phone, Mail, MapPin, Facebook, Instagram, ShieldCheck, Truck, CreditCard } from "lucide-react";

export function StoreFooter() {
  return (
    <footer className="bg-maroon-900 text-cream pt-14 pb-20 md:pb-12 border-t-4 border-gold-500 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Publisher Brand */}
          <div className="space-y-4">
            <Logo size="md" showText={false} />
            <h3 className="font-display font-bold text-xl text-gold-500">
              පදනම ප්‍රකාශන
            </h3>
            <p className="text-xs leading-relaxed opacity-85">
              1 වසරේ සිට 13 වසර දක්වා විෂයානුබද්ධ පාසල් වැඩපොත්, ආදර්ශ ප්‍රශ්න පත්‍ර සහ විශිෂ්ටතම සිංහල සාහිත්‍ය කෘති ප්‍රකාශනය සහ දිවයින පුරා බෙදාහැරීම.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-maroon-800 hover:bg-gold-500 hover:text-maroon-900 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-maroon-800 hover:bg-gold-500 hover:text-maroon-900 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-gold-500 uppercase tracking-wider">
              පොත් සහ ප්‍රවර්ග
            </h4>
            <ul className="text-xs space-y-2 opacity-85">
              <li><Link href="/books" className="hover:text-gold-500">සියලු පොත් නාමාවලිය</Link></li>
              <li><Link href="/library" className="hover:text-gold-500">ඩිජිටල් පුස්තකාලය (නොමිලේ සාම්පල)</Link></li>
              <li><Link href="/books?category=scholarship-grade-5" className="hover:text-gold-500">5 ශ්‍රේණිය ශිෂ්‍යත්වය</Link></li>
              <li><Link href="/books?category=ordinary-level" className="hover:text-gold-500">සාමාන්‍ය පෙළ (O/L)</Link></li>
              <li><Link href="/books?category=advanced-level" className="hover:text-gold-500">උසස් පෙළ (A/L)</Link></li>
              <li><Link href="/books?category=sinhala-novels" className="hover:text-gold-500">නවකතා හා සාහිත්‍ය</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-gold-500 uppercase tracking-wider">
              පාරිභෝගික සේවය
            </h4>
            <ul className="text-xs space-y-2 opacity-85">
              <li><Link href="/about" className="hover:text-gold-500">අප ගැන (About Us)</Link></li>
              <li><Link href="/contact" className="hover:text-gold-500">සම්බන්ධ වන්න (Contact)</Link></li>
              <li><Link href="/shipping-delivery" className="hover:text-gold-500">බෙදාහැරීමේ ගාස්තු සහ දින (25 Districts)</Link></li>
              <li><Link href="/returns-refunds" className="hover:text-gold-500">ආපසු භාරගැනීම් (Returns & Refunds)</Link></li>
              <li><Link href="/wholesale" className="hover:text-gold-500">තොග ඇණවුම් (Wholesale Enquiries)</Link></li>
              <li><Link href="/privacy" className="hover:text-gold-500">පුද්ගලිකත්ව ප්‍රතිපත්තිය (PDPA)</Link></li>
              <li><Link href="/terms" className="hover:text-gold-500">සේවා කොන්දේසි (Terms)</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-gold-500 uppercase tracking-wider">
              ලිපිනය සහ සබඳතා
            </h4>
            <div className="space-y-2.5 text-xs opacity-85">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span>නො. 912/A, බෝගහ හන්දිය පාර, ගෝඨාභය, කොලොන්නාව, ශ්‍රී ලංකාව.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <span>+94 71 800 8533 / +94 77 088 2228</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <span>hello@padanamapublication.lk</span>
              </div>
            </div>

            <div className="pt-3">
              <span className="text-[11px] font-bold block text-gold-500 mb-1">
                පිළිගත් ගෙවීම් සහ කුරියර්
              </span>
              <p className="text-[11px] opacity-75">
                PayHere • Koko • Visa • MasterCard • eZ Cash • Genie • Direct Bank Transfer • Cash on Delivery • Domex • Koombiyo
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-maroon-800 text-center text-xs opacity-70">
          <p>© {new Date().getFullYear()} Padanama Publications (Pvt) Ltd. All Rights Reserved. Designed & Engineered with Modern Web Standards.</p>
        </div>
      </div>
    </footer>
  );
}
