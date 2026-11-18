"use client";

import React, { useState, useEffect } from "react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Logo } from "@/components/ui/Logo";
import { Search, ShoppingBag, BookMarked, User, Phone, Sparkles, Menu, X, Info, Mail, Home } from "lucide-react";
import { CartBadge } from "./CartBadge";

export function StoreHeader() {
  const t = useTranslations("common");
  const nav = useTranslations("nav");
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("padanama_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-maroon-100 shadow-sm w-full">
      {/* Top Bar with Contact Us, About Us, Hotline and Languages */}
      <div className="bg-brandNavy text-cream text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-brandNavy/40 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Hotline & Free Delivery Notice */}
          <div className="flex items-center gap-3 text-[11px] sm:text-xs">
            <a
              href="tel:+94718008533"
              className="flex items-center gap-1.5 text-brandYellow hover:underline font-extrabold tracking-tight"
              title="Call Padanama Publications"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>+94 71 800 8533</span>
            </a>
            <span className="hidden md:inline text-cream/40">•</span>
            <div className="hidden sm:flex items-center gap-1.5 opacity-90">
              <Sparkles className="w-3.5 h-3.5 text-brandYellow" />
              <span>{t("freeDeliveryNotice")}</span>
            </div>
          </div>

          {/* Right: Quick Links & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs">
            <Link
              href="/about"
              className="hidden sm:flex items-center gap-1 text-cream/90 hover:text-brandYellow transition-colors font-medium"
            >
              <Info className="w-3 h-3 text-brandYellow" />
              <span>{nav("about")}</span>
            </Link>

            <span className="hidden sm:inline text-cream/40">|</span>

            <Link
              href="/contact"
              className="hidden sm:flex items-center gap-1 text-cream/90 hover:text-brandYellow transition-colors font-medium"
            >
              <Mail className="w-3 h-3 text-brandYellow" />
              <span>{nav("contact")}</span>
            </Link>

            <span className="hidden sm:inline text-cream/40">|</span>

            <div className="flex items-center gap-1.5 font-bold">
              <Link
                href={pathname}
                locale="si"
                lang="si"
                aria-label="Switch to Sinhala"
                className={`px-1.5 py-0.5 rounded transition-all ${
                  currentLocale === "si"
                    ? "bg-brandYellow text-brandNavy font-extrabold shadow-sm"
                    : "text-cream/80 hover:text-brandYellow"
                }`}
              >
                සිංහල
              </Link>
              <span className="opacity-40">/</span>
              <Link
                href={pathname}
                locale="en"
                lang="en"
                aria-label="Switch to English"
                className={`px-1.5 py-0.5 rounded transition-all ${
                  currentLocale === "en"
                    ? "bg-brandYellow text-brandNavy font-extrabold shadow-sm"
                    : "text-cream/80 hover:text-brandYellow"
                }`}
              >
                English
              </Link>
              <span className="opacity-40">/</span>
              <Link
                href={pathname}
                locale="ta"
                lang="ta"
                aria-label="Switch to Tamil"
                className={`px-1.5 py-0.5 rounded transition-all ${
                  currentLocale === "ta"
                    ? "bg-brandYellow text-brandNavy font-extrabold shadow-sm"
                    : "text-cream/80 hover:text-brandYellow"
                }`}
              >
                தமிழ்
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo with exact official image */}
        <Link href="/" className="shrink-0 flex items-center py-1">
          <Logo size="md" />
        </Link>

        {/* Global Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-maroon-200 rounded-full text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-brandRed focus:border-transparent shadow-inner"
            />
            <Search className="w-4 h-4 text-brandRed absolute left-3.5 top-3.5" />
          </div>
        </form>

        {/* Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-bold text-brandNavy">
          <Link
            href="/"
            className="hover:text-brandRed transition-colors flex items-center gap-1.5"
          >
            <Home className="w-4 h-4 text-brandRed" />
            <span>{nav("home")}</span>
          </Link>

          <Link
            href="/books"
            className="hover:text-brandRed transition-colors flex items-center gap-1"
          >
            <span>{nav("shop")}</span>
          </Link>

          <Link
            href="/library"
            className="hover:text-brandRed transition-colors flex items-center gap-1.5"
          >
            <BookMarked className="w-4 h-4 text-brandRed" />
            <span>{nav("digitalLibrary")}</span>
          </Link>

          <Link
            href="/book-fair"
            className="hover:text-brandRed transition-colors flex items-center gap-1.5 px-3 py-1 rounded-full bg-brandYellow/30 text-brandNavy font-extrabold border border-brandYellow/60 hover:bg-brandYellow/50 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-brandRed" />
            <span>{currentLocale === "ta" ? "புத்தக கண்காட்சி" : currentLocale === "en" ? "Book Fair" : "පොත් ප්‍රදර්ශනය"}</span>
          </Link>
        </nav>

        {/* Right Actions: Mobile Search Toggle, Cart & Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Instant Search Button (<768px) */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 rounded-full bg-white border border-maroon-100 hover:border-brandRed text-brandRed shadow-sm active:scale-95 transition-all"
            aria-label="Toggle mobile search"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/cart"
            className="relative p-2 sm:p-2.5 rounded-full bg-white border border-maroon-100 hover:border-brandRed text-brandNavy transition-all shadow-sm hover:scale-105 active:scale-95"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-brandRed" />
            <CartBadge />
          </Link>

          <Link
            href={currentUser ? "/account" : "/login"}
            className="p-2 sm:p-2.5 rounded-full bg-white border border-maroon-100 hover:border-brandRed text-brandNavy transition-all shadow-sm hover:scale-105 active:scale-95 relative"
            aria-label={currentUser ? `User Account: ${currentUser.name}` : "User Account"}
            title={currentUser ? `Logged in as ${currentUser.name}` : "Sign In / Register"}
          >
            <User className="w-5 h-5 text-brandNavy" />
            {currentUser && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-brandNavy hover:text-brandRed"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 py-2.5 bg-cream border-t border-maroon-100 shadow-inner animate-in slide-in-from-top-1">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="පොත් නම, කර්තෘ හෝ Singlish මඟින්..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-brandRed rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brandRed shadow-sm"
            />
            <Search className="w-4 h-4 text-brandRed absolute left-3.5 top-3.5" />
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream border-b border-maroon-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2 text-sm font-bold text-brandNavy">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-maroon-100 flex items-center gap-2"
            >
              <Home className="w-4 h-4 text-brandRed" />
              <span>{nav("home")}</span>
            </Link>
            <Link
              href="/books"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-maroon-100 flex items-center justify-between"
            >
              <span>{nav("shop")} (Book Shop)</span>
              <span className="text-xs text-brandRed font-normal">320+ Books</span>
            </Link>
            <Link
              href="/library"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-maroon-100 text-brandRed flex items-center gap-2"
            >
              <BookMarked className="w-4 h-4" />
              <span>{nav("digitalLibrary")}</span>
            </Link>
            <Link
              href="/book-fair"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-maroon-100 flex items-center gap-2 text-brandRed"
            >
              <Sparkles className="w-4 h-4 text-brandRed" />
              <span>{currentLocale === "ta" ? "புத்தக கண்காட்சி (Book Fair)" : currentLocale === "en" ? "Book Fair (CIBF)" : "පොත් ප්‍රදර්ශනය (Book Fair)"}</span>
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-maroon-100"
            >
              {nav("about")}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-maroon-100"
            >
              {nav("contact")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
