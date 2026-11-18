"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/Logo";
import { Phone, Mail, MapPin, Instagram, ShieldCheck, Truck, CreditCard, CheckCircle2 } from "lucide-react";
import { FacebookIcon, YouTubeIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

export function StoreFooter() {
  const f = useTranslations("footer");
  const nav = useTranslations("nav");
  const c = useTranslations("common");

  return (
    <footer className="bg-brandNavy text-cream pt-14 pb-20 md:pb-12 border-t-4 border-brandYellow mt-20 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Publisher Brand */}
          <div className="space-y-4">
            <Logo size="md" showText={false} />
            <h3 className="font-display font-bold text-xl text-brandYellow">
              {f("aboutTitle")}
            </h3>
            <p className="text-xs leading-relaxed opacity-90 text-slate-200">
              {f("aboutDesc")}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/padanama07/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4.5 h-4.5 fill-current" />
              </a>
              <a
                href="https://www.youtube.com/@padanamapublication"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:scale-110 transition-transform shadow"
                aria-label="YouTube"
              >
                <YouTubeIcon className="w-4.5 h-4.5 fill-current" />
              </a>
              <a
                href="https://wa.me/94718008533"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5 fill-current" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-brandYellow uppercase tracking-wider">
              {f("booksCategories")}
            </h4>
            <ul className="text-xs space-y-2 opacity-90 text-slate-200">
              <li>
                <Link href="/books" className="hover:text-brandYellow font-semibold text-white flex items-center gap-1.5">
                  <span>📚 {nav("books")}</span>
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-brandYellow">
                  {nav("digitalLibrary")}
                </Link>
              </li>
              <li>
                <Link href="/books?category=primary" className="hover:text-brandYellow">
                  5 ශ්‍රේණිය ශිෂ්‍යත්වය (Scholarship)
                </Link>
              </li>
              <li>
                <Link href="/books?category=gce-ol" className="hover:text-brandYellow">
                  සාමාන්‍ය පෙළ (O/L) 10-11
                </Link>
              </li>
              <li>
                <Link href="/books?category=gce-al-science" className="hover:text-brandYellow">
                  උසස් පෙළ (A/L) Science & Tech
                </Link>
              </li>
              <li>
                <Link href="/books?category=gce-al-commerce" className="hover:text-brandYellow">
                  උසස් පෙළ (A/L) Commerce & Arts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-brandYellow uppercase tracking-wider">
              {f("customerCare")}
            </h4>
            <ul className="text-xs space-y-2 opacity-90 text-slate-200">
              <li>
                <Link href="/about" className="hover:text-brandYellow">
                  {nav("about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brandYellow">
                  {nav("contact")}
                </Link>
              </li>
              <li>
                <Link href="/shipping-delivery" className="hover:text-brandYellow">
                  {f("shippingDelivery")}
                </Link>
              </li>
              <li>
                <Link href="/returns-refunds" className="hover:text-brandYellow">
                  {f("returnsRefunds")}
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className="hover:text-brandYellow">
                  {f("wholesale")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brandYellow">
                  {f("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brandYellow">
                  {f("terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-brandYellow uppercase tracking-wider">
              {f("contactLocation")}
            </h4>
            <div className="space-y-2.5 text-xs opacity-90 text-slate-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brandYellow shrink-0 mt-0.5" />
                <span>නො. 912/A, බෝගහ හන්දිය පාර, ගෝඨාභය, කොලොන්නාව, ශ්‍රී ලංකාව.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brandYellow shrink-0" />
                <span>+94 71 800 8533 / +94 77 088 2228</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brandYellow shrink-0" />
                <span>hello@padanamapublication.lk</span>
              </div>
            </div>

            {/* Visual Payment & Courier Badges */}
            <div className="pt-3 space-y-2">
              <span className="text-[11px] font-bold block text-brandYellow">
                {f("acceptedPayments")}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-1 rounded bg-white/10 border border-white/15 text-[10px] font-bold text-white flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-brandYellow" /> PayHere
                </span>
                <span className="px-2 py-1 rounded bg-white/10 border border-white/15 text-[10px] font-bold text-white">
                  Visa / Master
                </span>
                <span className="px-2 py-1 rounded bg-white/10 border border-white/15 text-[10px] font-bold text-brandYellow">
                  Koko BNPL
                </span>
                <span className="px-2 py-1 rounded bg-white/10 border border-white/15 text-[10px] font-bold text-white">
                  eZ Cash / Genie
                </span>
                <span className="px-2 py-1 rounded bg-white/10 border border-white/15 text-[10px] font-bold text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-400" /> COD Available
                </span>
                <span className="px-2 py-1 rounded bg-white/10 border border-white/15 text-[10px] font-bold text-white flex items-center gap-1">
                  <Truck className="w-3 h-3 text-brandYellow" /> Domex / Koombiyo
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs opacity-75 text-slate-300">
          <p>© {new Date().getFullYear()} {f("rightsReserved")}</p>
        </div>
      </div>
    </footer>
  );
}
