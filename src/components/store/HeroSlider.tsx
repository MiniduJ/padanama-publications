"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "@/i18n/routing";
import { ChevronLeft, ChevronRight, BookOpen, ArrowRight, Sparkles, Pause, Play } from "lucide-react";

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
    primaryLink: "/books",
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
    primaryLink: "/books?category=gce-ol",
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
    primaryLink: "/books?category=primary",
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
    primaryLink: "/books?category=gce-al-science",
    primaryCta: "A/L පොත් බලන්න",
    secondaryLink: "/books",
    secondaryCta: "සියලු පොත් බලන්න",
  },
  {
    id: 5,
    image: "https://www.padanamapublication.lk/image/bg-images/mainslide5.jpg",
    badge: "දිවයින පුරා බෙදාහැරීම • 2-4 Days Delivery",
    title: "පොත් ඇණවුම් ඔබේ නිවසටම",
    highlight: "භාණ්ඩ ලැබුණු පසු මුදල් ගෙවන්න (COD)",
    description: "Domex සහ Koombiyo කුරියර් සේවාවන් මඟින් ආරක්ෂිතව දිවයිනේ ඕනෑම තැනකට බෙදාහැරීම. PayHere සහ Koko BNPL පහසුකම් ද සහිතයි.",
    primaryLink: "/books",
    primaryCta: "දැන්ම ඇණවුම් කරන්න",
    secondaryLink: "/contact",
    secondaryCta: "අප අමතන්න",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

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

  // Touch Swipe Gesture Handlers for Mobile Devices
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
    const minSwipeDistance = 50; // 50px threshold

    if (distance > minSwipeDistance) {
      // Swiped left -> Next slide
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> Previous slide
      prevSlide();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const slide = SLIDES[current];

  return (
    <div
      className="relative w-full overflow-hidden bg-brandNavy shadow-xl select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pure Image Banner Slides (Wordings removed, full artwork clarity) */}
      <div className="relative w-full h-[240px] xs:h-[280px] sm:h-[380px] md:h-[460px] lg:h-[540px] xl:h-[600px] overflow-hidden">
        {SLIDES.map((s, index) => {
          const isActive = index === current;
          return (
            <Link
              key={s.id}
              href={s.primaryLink}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer block ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Crisp Official Banner Graphic without Dark Gradient or Text Overlays */}
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full object-cover object-center"
              />
            </Link>
          );
        })}
      </div>

      {/* Navigation Arrow Controls - Desktop only to keep mobile touch clean */}
      <button
        type="button"
        onClick={prevSlide}
        className="hidden sm:flex absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 hover:bg-brandYellow text-brandNavy hover:scale-110 shadow-lg items-center justify-center transition-all backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="hidden sm:flex absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 hover:bg-brandYellow text-brandNavy hover:scale-110 shadow-lg items-center justify-center transition-all backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators & WCAG Pause/Play Control */}
      <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="text-white hover:text-brandYellow transition-colors p-1"
          aria-label={isPaused ? "Play slide rotation" : "Pause slide rotation"}
          title={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
        </button>

        <div className="w-px h-3 bg-white/30" />

        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? "w-6 sm:w-7 h-2 bg-brandYellow" : "w-2 h-2 bg-white/60 hover:bg-white"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
