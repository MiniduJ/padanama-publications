"use client";

import React, { useState, useEffect } from "react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/Logo";
import { Search, ShoppingBag, BookOpen, User, Phone, Sparkles, Menu, X } from "lucide-react";
import { CartBadge } from "./CartBadge";

export function StoreHeader() {
  const t = useTranslations("common");
  const nav = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-maroon-100 shadow-sm">
      {/* Top Banner */}
      <div className="bg-maroon-900 text-cream text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>{t("freeDeliveryNotice")}</span>
          </div>
          <div className="flex items-center gap-3 text-xs opacity-90">
            <Link href={pathname} locale="si" className="hover:text-gold-500">සිංහල</Link>
            <span>|</span>
            <Link href={pathname} locale="en" className="hover:text-gold-500">English</Link>
            <span>|</span>
            <Link href={pathname} locale="ta" className="hover:text-gold-500">தமிழ்</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <Logo size="md" />
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-4 py-2 bg-white border border-maroon-200 rounded-full text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
            <Search className="w-4 h-4 text-maroon-700 absolute left-3.5 top-3" />
          </div>
        </form>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold text-ink">
          <Link href="/books" className="hover:text-maroon-700 transition-colors">
            {nav("books")}
          </Link>
          <Link href="/library" className="hover:text-maroon-700 flex items-center gap-1.5 text-maroon-900 transition-colors">
            <BookOpen className="w-4 h-4 text-saffron-500" />
            <span>{nav("digitalLibrary")}</span>
          </Link>
          <Link href="/authors" className="hover:text-maroon-700 transition-colors">
            {nav("authors")}
          </Link>
          <Link href="/about" className="hover:text-maroon-700 transition-colors">
            {nav("about")}
          </Link>
          <Link href="/contact" className="hover:text-maroon-700 transition-colors">
            {nav("contact")}
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2.5 rounded-full bg-white border border-maroon-100 hover:border-saffron-500 text-maroon-900 transition-colors shadow-sm"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5 text-maroon-700" />
            <CartBadge />
          </Link>

          <Link
            href="/login"
            className="p-2.5 rounded-full bg-white border border-maroon-100 hover:border-saffron-500 text-maroon-900 transition-colors shadow-sm"
            aria-label="Account"
          >
            <User className="w-5 h-5 text-maroon-700" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-ink hover:text-maroon-700"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream border-b border-maroon-200 px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative pb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-9 pr-4 py-2 bg-white border border-maroon-200 rounded-lg text-sm text-ink"
            />
            <Search className="w-4 h-4 text-maroon-700 absolute left-3 top-2.5" />
          </form>

          <div className="flex flex-col space-y-2 text-sm font-semibold">
            <Link href="/books" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-maroon-100">
              {nav("books")}
            </Link>
            <Link href="/library" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-maroon-100 text-maroon-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-saffron-500" />
              <span>{nav("digitalLibrary")}</span>
            </Link>
            <Link href="/authors" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-maroon-100">
              {nav("authors")}
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-maroon-100">
              {nav("about")}
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="py-2">
              {nav("contact")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
