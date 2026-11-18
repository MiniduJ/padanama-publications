"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "@/i18n/routing";
import { ChevronLeft, ChevronRight, BookOpen, ShoppingBag, ArrowRight, Sparkles, ShieldCheck, Truck } from "lucide-react";

interface Slide {
  id: number;
  image: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  primaryLink: string;
  primaryCta: string;
  secondaryLink: string;
  secondaryCta: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: "https://www.padanamapublication.lk/image/bg-images/mainslide1.jpg",
    badge: "නිල වෙබ් අඩවිය • padanamapublication.lk",
    title: "දැනුමෙන් සන්නද්ධ දරු පරපුරකට",
    highlight: "විශ්වාසනීය පදනම",
    description: "1 වසරේ සිට උසස් පෙළ දක්වා ශ්‍රී ලංකා විෂය නිර්දේශිත සියලුම පාසල් වැඩපොත්, කෙටි සටහන් සහ ආදර්ශ ප්‍රශ්න පත්‍ර දැන් පහසුවෙන් නිවසටම ගෙන්වා ගන්න.",
    primaryLink: "/products",
    primaryCta: "පොත් සාප්පුව (Shop Now)",
    secondaryLink: "/library",
    secondaryCta: "නොමිලේ සාම්පල කියවන්න",
  },
  {
    id: 2,
    image: "https://www.padanamapublication.lk/image/bg-images/mainslide2.jpg",
    badge: "10 සහ 11 ශ්‍රේණි • G.C.E O/L",
    title: "සාමාන්‍ය පෙළ විභාග ජයග්‍රහණයේ",
    highlight: "කෙටි සටහන් සහ සූත්‍ර සංග්‍රහ",
    description: "විද්‍යාව, ගණිතය, සිංහල, ඉතිහාසය සහ වාණිජ්‍ය විෂයයන්හි සියලු ප්‍රමේය, සූත්‍ර සහ පසුගිය ප්‍රශ්න පත්‍ර විවරණ එකම තැනකින්.",
    primaryLink: "/products?category=gce-ol",
    primaryCta: "O/L පොත් බලන්න",
    secondaryLink: "/read/pdn-189",
    secondaryCta: "නොමිලේ පෙරදසුන",
  },
  {
    id: 3,
    image: "https://www.padanamapublication.lk/image/bg-images/mainslide3.jpg",
    badge: "5 ශ්‍රේණිය ශිෂ්‍යත්වය • Scholarship",
    title: "පුංචි දූ දරුවන්ගේ අනාගතයට",
    highlight: "ශිෂ්‍යත්ව පෙරහුරු ප්‍රශ්න පත්‍ර",
    description: "නව විෂය නිර්දේශයට අනුව සැකසූ ආදර්ශ ප්‍රශ්න පත්‍ර සහ සම්පූර්ණ ලකුණු ලබාදීමේ ක්‍රමවේද අඩංගු අත්‍යවශ්‍ය පුහුණු අත්පොත් පෙළ.",
    primaryLink: "/products?category=primary",
    primaryCta: "ශිෂ්‍යත්ව පොත් නාමාවලිය",
    secondaryLink: "/library",
    secondaryCta: "සාම්පල පෙරදසුන",
  },
  {
    id: 4,
    image: "https://www.padanamapublication.lk/image/bg-images/mainslide4.jpg",
    badge: "උසස් පෙළ • G.C.E A/L",
    title: "විද්‍යා, තාක්ෂණ, වාණිජ සහ කලා",
    highlight: "උසස් පෙළ විෂය ධාරා සහයක කෘති",
    description: "ජීව විද්‍යාව, රසායන විද්‍යාව, භෞතික විද්‍යාව, තාක්ෂණවේදය, ගිණුම්කරණය සහ කලා විෂයයන්හි නවතම විභාග ප්‍රශ්න පත්‍ර සහ විවරණ.",
    primaryLink: "/products?category=gce-al-science",
    primaryCta: "A/L පොත් බලන්න",
    secondaryLink: "/products",
    secondaryCta: "සියලු පොත් බලන්න",
  },
  {
    id: 5,
    image: "https://www.padanamapublication.lk/image/bg-images/mainslide5.jpg",
    badge: "දිවයින පුරා බෙදාහැරීම • 2-4 Days Delivery",
    title: "පොත් ඇණවුම් ඔබේ නිවසටම",
    highlight: "භාණ්ඩ ලැබුණු පසු මුදල් ගෙවන්න (COD)",
    description: "Domex සහ Koombiyo කුරියර් සේවාවන් මඟින් ආරක්ෂිතව දිවයිනේ ඕනෑම තැනකට බෙදාහැරීම. PayHere සහ Koko BNPL පහසුකම් ද සහිතයි.",
    primaryLink: "/products",
    primaryCta: "දැන්ම ඇණවුම් කරන්න",
    secondaryLink: "/contact",
    secondaryCta: "අප අමතන්න",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const slide = SLIDES[current];

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl bg-maroon-950 border border-maroon-900 shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides */}
      <div className="relative min-h-[460px] sm:min-h-[500px] md:min-h-[540px] flex items-center">
        {SLIDES.map((s, index) => {
          const isActive = index === current;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image with optimized dark gradient overlay */}
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brandNavy/95 via-brandNavy/75 to-transparent md:to-black/30" />
            </div>
          );
        })}

        {/* Slide Content Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-12 md:py-20 w-full">
          <div className="max-w-2xl space-y-5 text-left text-cream">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brandYellow text-brandNavy text-xs font-black tracking-wide shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-brandNavy" />
              <span>{slide.badge}</span>
            </div>

            {/* Slide Title */}
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-[1.18] drop-shadow-md">
              {slide.title} <br />
              <span className="text-brandYellow underline decoration-brandRed decoration-wavy decoration-2">
                {slide.highlight}
              </span>
            </h1>

            {/* Slide Description */}
            <p className="text-sm sm:text-base text-cream/90 leading-relaxed font-medium drop-shadow-sm max-w-xl">
              {slide.description}
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <Link
                href={slide.primaryLink}
                className="px-6 py-3.5 rounded-xl bg-brandRed hover:bg-brandRed-600 text-white font-extrabold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-brandRed-700"
              >
                <span>{slide.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={slide.secondaryLink}
                className="px-6 py-3.5 rounded-xl bg-white/90 hover:bg-white text-brandNavy font-extrabold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 backdrop-blur-sm"
              >
                <BookOpen className="w-4 h-4 text-brandRed" />
                <span>{slide.secondaryCta}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrow Controls */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 hover:bg-brandYellow text-brandNavy hover:scale-110 shadow-lg flex items-center justify-center transition-all backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 hover:bg-brandYellow text-brandNavy hover:scale-110 shadow-lg flex items-center justify-center transition-all backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? "w-8 h-2.5 bg-brandYellow" : "w-2.5 h-2.5 bg-white/60 hover:bg-white"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
