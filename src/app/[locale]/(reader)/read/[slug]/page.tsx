"use client";

import React, { useState, useEffect, use } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { formatLkr } from "@/lib/money";
import { cartActions } from "@/lib/cart-store";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bookmark,
  Sun,
  Moon,
  Type,
  Maximize2,
  Minimize2,
  Lock,
  ShoppingBag,
  Sparkles,
  Truck,
  CheckCircle2,
  Sliders,
  X,
} from "lucide-react";
import { getReaderBookContent, ReaderBookData } from "@/server/reader/sample-data";

interface ReaderPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

type ThemeMode = "cream" | "sepia" | "night" | "white";

const THEME_STYLES: Record<ThemeMode, { bg: string; text: string; headerBg: string; border: string; accent: string }> = {
  cream: {
    bg: "bg-[#FFF9EE]",
    text: "text-[#2B231D]",
    headerBg: "bg-[#FFF9EE]/95",
    border: "border-[#EADCC8]",
    accent: "text-maroon-900",
  },
  sepia: {
    bg: "bg-[#F4ECD8]",
    text: "text-[#3D3024]",
    headerBg: "bg-[#F4ECD8]/95",
    border: "border-[#E2D4BD]",
    accent: "text-[#694820]",
  },
  night: {
    bg: "bg-[#181615]",
    text: "text-[#E6E0D6]",
    headerBg: "bg-[#181615]/95",
    border: "border-[#2D2926]",
    accent: "text-gold-400",
  },
  white: {
    bg: "bg-[#FFFFFF]",
    text: "text-[#1A1817]",
    headerBg: "bg-[#FFFFFF]/95",
    border: "border-gray-200",
    accent: "text-maroon-900",
  },
};

export default function BookReaderPage({ params }: ReaderPageProps) {
  const router = useRouter();
  const { slug } = use(params);

  const [bookData, setBookData] = useState<ReaderBookData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [theme, setTheme] = useState<ThemeMode>("cream");
  const [fontSize, setFontSize] = useState<number>(16); // 14, 16, 18, 22
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isTurning, setIsTurning] = useState(false);
  const [turnDirection, setTurnDirection] = useState<"next" | "prev" | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Synthesized realistic paper page rustle sound via Web Audio API (100% offline, zero latency)
  const playPageTurnSound = () => {
    try {
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.14);

      const bufferSize = ctx.sampleRate * 0.14;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.connect(filter);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(ctx.currentTime + 0.14);
    } catch {
      // Audio playback silently skipped if browser permissions restrict
    }
  };

  // Load content
  useEffect(() => {
    const data = getReaderBookContent(slug);
    setBookData(data);

    // Load saved page
    const saved = localStorage.getItem(`padanama_reading_${slug}`);
    if (saved) {
      const p = parseInt(saved, 10);
      if (!isNaN(p) && p >= 1 && p <= data.pages.length) {
        setCurrentPage(p);
      }
    }
  }, [slug]);

  // Save progress
  useEffect(() => {
    if (bookData) {
      localStorage.setItem(`padanama_reading_${slug}`, String(currentPage));
    }
  }, [currentPage, slug, bookData]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showPaywall || showToc) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        handleNextPage();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        handlePrevPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, bookData, showPaywall, showToc]);

  if (!bookData) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#FFF9EE]">
        <div className="text-center space-y-3">
          <BookOpen className="w-8 h-8 text-maroon-700 animate-pulse mx-auto" />
          <p className="text-xs font-bold text-maroon-900">පොත සූදානම් කරමින්... (Loading Book)</p>
        </div>
      </div>
    );
  }

  const activePage = bookData.pages.find((p) => p.pageNumber === currentPage) || bookData.pages[0];
  const totalSamplePages = bookData.pages.length;
  const progressPercent = Math.round((currentPage / totalSamplePages) * 100);
  const themeClass = THEME_STYLES[theme];

  const handleNextPage = () => {
    if (currentPage < totalSamplePages) {
      playPageTurnSound();
      setTurnDirection("next");
      setIsTurning(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setIsTurning(false);
      }, 190);
    } else {
      setShowPaywall(true);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      playPageTurnSound();
      setTurnDirection("prev");
      setIsTurning(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setIsTurning(false);
      }, 190);
      setShowPaywall(false);
    }
  };

  const toggleBookmark = () => {
    if (bookmarkedPages.includes(currentPage)) {
      setBookmarkedPages(bookmarkedPages.filter((p) => p !== currentPage));
    } else {
      setBookmarkedPages([...bookmarkedPages, currentPage]);
    }
  };

  const handleBuy = (format: "EBOOK" | "PAPERBACK") => {
    const priceCents = format === "EBOOK" ? bookData.ebookPriceCents : bookData.paperbackPriceCents;
    cartActions.addItem({
      id: `${bookData.slug}_${format}`,
      bookId: bookData.slug,
      slug: bookData.slug,
      title: bookData.titleSi,
      titleSi: bookData.titleSi,
      titleEn: bookData.titleEn,
      authorName: bookData.authorName,
      format,
      priceCents,
      weightGrams: format === "EBOOK" ? 0 : 350,
      coverImage: bookData.coverImage,
    });
    router.push("/checkout");
  };

  // Touch Swipe Page Turn Handlers for Mobile Devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45; // 45px swipe threshold

    if (distance > minSwipeDistance) {
      handleNextPage();
    } else if (distance < -minSwipeDistance) {
      handlePrevPage();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between select-none relative ${themeClass.bg} ${themeClass.text} transition-colors duration-200`}
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Reading Navigation Bar */}
      <header
        className={`sticky top-0 z-30 h-14 px-4 sm:px-6 flex items-center justify-between border-b backdrop-blur-md ${themeClass.headerBg} ${themeClass.border}`}
      >
        <div className="flex items-center gap-3">
          <Link
            href={`/books/${slug}`}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
            title="Back to Book"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => setShowToc(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/10 hover:bg-black/5 text-xs font-bold transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">පටුන (Contents)</span>
          </button>

          <div className="hidden md:block">
            <span className="text-xs font-bold truncate max-w-xs block leading-tight">
              {bookData.titleSi}
            </span>
            <span className="text-[10px] opacity-70 block">{activePage.chapterTitle}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Bookmark */}
          <button
            type="button"
            onClick={toggleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              bookmarkedPages.includes(currentPage)
                ? "text-saffron-500 fill-saffron-500"
                : "opacity-70 hover:opacity-100"
            }`}
            title="Bookmark Page"
          >
            <Bookmark
              className="w-4 h-4"
              fill={bookmarkedPages.includes(currentPage) ? "currentColor" : "none"}
            />
          </button>

          {/* Theme Quick Switcher */}
          <button
            type="button"
            onClick={() => {
              const modes: ThemeMode[] = ["cream", "sepia", "night", "white"];
              const nextIdx = (modes.indexOf(theme) + 1) % modes.length;
              setTheme(modes[nextIdx]);
            }}
            className="p-2 rounded-lg opacity-70 hover:opacity-100 transition-colors"
            title="Toggle Reading Theme"
          >
            {theme === "night" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Font Controls */}
          <div className="flex items-center border border-black/10 rounded-lg px-2 py-1 text-xs gap-2">
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.max(13, s - 2))}
              className="opacity-70 hover:opacity-100 font-bold"
              title="Smaller font"
            >
              A-
            </button>
            <span className="text-[10px] font-semibold opacity-60">{fontSize}px</span>
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.min(24, s + 2))}
              className="opacity-70 hover:opacity-100 font-bold"
              title="Larger font"
            >
              A+
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Canvas: Physical Book Simulation with 3D Page Turn */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-8 py-6 sm:py-10 flex flex-col justify-between relative perspective-[1400px]">
        {/* Physical Book Leaf Container */}
        <div
          className={`relative w-full flex-1 rounded-2xl p-6 sm:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.08)] border border-black/10 flex flex-col justify-between transition-all duration-300 ${
            isTurning
              ? turnDirection === "next"
                ? "animate-page-turn-next"
                : "animate-page-turn-prev"
              : ""
          }`}
          style={{
            backgroundColor: theme === "cream" ? "#FFFDF7" : theme === "sepia" ? "#F5EEDC" : theme === "night" ? "#1E1C1A" : "#FFFFFF",
          }}
        >
          {/* Left Spine Binding Shadow (Inner Gutter) */}
          <div className="absolute top-0 bottom-0 left-0 w-6 sm:w-10 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none rounded-l-2xl z-20" />

          {/* Right Stacked Pages Depth Effect */}
          <div className="absolute top-2 bottom-2 -right-2.5 w-2.5 bg-gradient-to-r from-[#EDE2CA] via-[#E2D4BA] to-[#C9BA9E] rounded-r-sm shadow-sm pointer-events-none hidden sm:block border-y border-r border-[#C4B495]" />

          {/* Dynamic Translucent Watermark Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-5 z-0 select-none">
            <p className="text-3xl sm:text-5xl font-black rotate-[-25deg] text-center leading-relaxed">
              {bookData.watermark}
            </p>
          </div>

          {/* Page Content */}
          <article className="relative z-10 space-y-6">
            {/* Running Header */}
            <div className="text-[11px] font-serif uppercase tracking-widest text-center opacity-60 pb-3 border-b border-black/10 flex items-center justify-between text-ink-muted">
              <span className="truncate max-w-[200px]">{bookData.titleSi}</span>
              <span className="text-[9px] opacity-40">•</span>
              <span className="truncate max-w-[200px]">{activePage.chapterTitle}</span>
            </div>

            <header className="pb-2">
              {activePage.subTitle && (
                <h1 className="font-display font-black text-xl sm:text-2xl mt-1 leading-snug">
                  {activePage.subTitle}
                </h1>
              )}
            </header>

            <div
              className="space-y-5 leading-[1.9] font-normal"
              style={{ fontSize: `${fontSize}px` }}
            >
              {activePage.content.map((paragraph, idx) => (
                <p key={idx} className="indent-4 sm:indent-8 text-justify">
                  {paragraph}
                </p>
              ))}
            </div>

            {activePage.notes && (
              <footer className="pt-6 border-t border-black/10 text-xs italic opacity-70">
                {activePage.notes}
              </footer>
            )}

            {/* Centered Page Number */}
            <div className="text-center font-serif text-xs opacity-60 pt-4">
              — {currentPage} —
            </div>
          </article>

          {/* Corner Page Curl Button for Next Page */}
          {currentPage < totalSamplePages && (
            <button
              type="button"
              onClick={handleNextPage}
              className="absolute bottom-0 right-0 w-12 h-12 overflow-hidden cursor-pointer group z-30"
              title="ඊළඟ පිටුවට පෙරලන්න (Flip Page)"
            >
              <div className="absolute bottom-0 right-0 w-0 h-0 border-solid border-b-[24px] border-l-[24px] border-b-amber-300/80 border-l-transparent group-hover:border-b-amber-500 group-hover:scale-110 transition-all shadow" />
            </button>
          )}

          {/* Bottom Page Navigation Controls */}
          <div className="relative z-10 pt-6 flex items-center justify-between border-t border-black/10 mt-8">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={handlePrevPage}
              className="py-2 px-4 rounded-xl border border-black/10 hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 text-xs font-bold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>පෙර පිටුව (Prev)</span>
            </button>

            <span className="text-xs font-mono font-bold opacity-80">
              පිටුව {currentPage} / {totalSamplePages}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              className="py-2 px-4 rounded-xl bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white flex items-center gap-1.5 text-xs font-extrabold shadow transition-colors"
            >
              <span>
                {currentPage === totalSamplePages ? "සාම්පලය අවසන් (Finish)" : "ඊළඟ පිටුව (Next ↷)"}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Progress Bar */}
      <footer className="h-1.5 w-full bg-black/10 sticky bottom-0 z-30">
        <div
          className="h-full bg-saffron-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </footer>

      {/* TABLE OF CONTENTS DRAWER */}
      {showToc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-start">
          <div
            className={`w-full max-w-sm h-full p-6 space-y-6 shadow-2xl overflow-y-auto ${themeClass.bg} ${themeClass.text}`}
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-saffron-500" />
                <h3 className="font-display font-bold text-base">පටුන (Table of Contents)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowToc(false)}
                className="p-1 rounded-full hover:bg-black/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {bookData.chapters.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    setCurrentPage(ch.startPage);
                    setShowToc(false);
                    setShowPaywall(false);
                  }}
                  className="w-full text-left p-3 rounded-xl border border-black/10 hover:bg-black/5 flex items-center justify-between text-xs font-bold transition-colors"
                >
                  <span className="truncate pr-2">{ch.title}</span>
                  <span className="opacity-60 text-[10px] font-mono shrink-0">
                    පිටුව {ch.startPage}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 text-xs space-y-1">
              <span className="font-bold text-maroon-900 block">නොමිලේ සාම්පල සීමාව:</span>
              <p className="text-[11px] opacity-80 leading-relaxed">
                මෙම පොතෙහි පළමු පිටු {totalSamplePages} ඔබට නොමිලේ කියවිය හැක. සම්පූර්ණ කෘතිය පිටු {bookData.totalPages} කින් සමන්විතය.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PAYWALL CONVERSION MODAL / CARD */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white text-ink rounded-3xl shadow-2xl border-2 border-gold-500/50 p-6 sm:p-8 space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-maroon-50 text-maroon-900 rounded-2xl flex items-center justify-center mx-auto border border-maroon-200 shadow-inner">
                <Lock className="w-7 h-7 text-saffron-500" />
              </div>

              <h2 className="font-display font-black text-xl sm:text-2xl text-maroon-900">
                නොමිලේ සාම්පලයේ අවසානයට පැමිණියා
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted max-w-sm mx-auto">
                {bookData.titleSi} කෘතියේ ඉදිරි පරිච්ඡේද සම්පූර්ණයෙන්ම කියවීමට පහත ක්‍රම වලින් එකක් තෝරාගන්න:
              </p>
            </div>

            {/* Buying Options */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Option 1: E-Book Instant Access */}
              <div className="p-4 rounded-2xl border-2 border-maroon-700 bg-maroon-50/50 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-maroon-900 tracking-wider bg-maroon-200/50 px-2 py-0.5 rounded-full inline-block">
                    ක්ෂණික කියවීම
                  </span>
                  <h4 className="font-bold text-sm text-maroon-900">E-Book (ඩිජිටල් පොත)</h4>
                  <p className="text-[11px] text-ink-muted">
                    ජංගම දුරකථනයෙන් හෝ පරිගණකයෙන් දැන්ම සම්පූර්ණ පොත කියවන්න.
                  </p>
                </div>

                <div>
                  <span className="font-display font-black text-xl text-maroon-900 block mb-2">
                    {formatLkr(bookData.ebookPriceCents, "si")}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBuy("EBOOK")}
                    className="w-full py-2.5 px-3 rounded-xl bg-maroon-900 hover:bg-maroon-950 text-cream font-bold text-xs shadow transition-colors"
                  >
                    E-Book එක ගන්න
                  </button>
                </div>
              </div>

              {/* Option 2: Paperback Print Delivery */}
              <div className="p-4 rounded-2xl border-2 border-saffron-500 bg-cream/70 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-saffron-800 tracking-wider bg-gold-200/50 px-2 py-0.5 rounded-full inline-block">
                    නිවසටම බෙදාහැරීම
                  </span>
                  <h4 className="font-bold text-sm text-maroon-900">මුද්‍රිත පොත (Paperback)</h4>
                  <p className="text-[11px] text-ink-muted">
                    දිවයින පුරා Domex කුරියර් මගින් දින 2-4 ක් තුළ නිවසටම ගෙන්වාගන්න.
                  </p>
                </div>

                <div>
                  <span className="font-display font-black text-xl text-saffron-700 block mb-2">
                    {formatLkr(bookData.paperbackPriceCents, "si")}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBuy("PAPERBACK")}
                    className="w-full py-2.5 px-3 rounded-xl bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white font-extrabold text-xs shadow transition-colors"
                  >
                    මුද්‍රිත පොත ඇණවුම් කරන්න
                  </button>
                </div>
              </div>
            </div>

            {/* Guarantee Note */}
            <div className="text-center text-[11px] text-ink-muted pt-2 border-t border-gray-100 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span>පදනම ප්‍රකාශන නිල සහතිකය • 100% ආරක්ෂිත ගෙවීම්</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
