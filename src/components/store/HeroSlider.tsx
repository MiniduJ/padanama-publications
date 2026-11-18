"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "@/i18n/routing";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  href: string;
}

const INTERVAL_MS = 5500;

/** Auto-rotating hero. Slides come from Admin → Hero Slides (Banner table), with built-in defaults. */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = slides.length;

  const go = useCallback((d: number) => setCurrent((p) => (p + d + n) % n), [n]);

  useEffect(() => {
    // Respect users who ask for less motion: start paused.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setUserPaused(true);
  }, []);

  useEffect(() => {
    if (userPaused || focusPaused || n < 2) return;
    const t = setInterval(() => go(1), INTERVAL_MS);
    return () => clearInterval(t);
  }, [userPaused, focusPaused, go, n]);

  if (!n) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-brandNavy shadow-xl select-none"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured"
      onFocus={() => setFocusPaused(true)}
      onBlur={() => setFocusPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = touchX.current - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 50) go(dx > 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="relative w-full aspect-[16/7] max-h-[600px] min-h-[220px]">
        {slides.map((s, i) => (
          <Link
            key={s.id}
            href={s.href}
            aria-hidden={i !== current}
            tabIndex={i === current ? 0 : -1}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
          >
            <img src={s.image} alt={s.alt} className="w-full h-full object-cover object-center" loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "low"} />
          </Link>
        ))}
      </div>

      {n > 1 && (
        <>
          <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 hover:bg-brandYellow text-brandNavy shadow-lg items-center justify-center">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next slide" className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 hover:bg-brandYellow text-brandNavy shadow-lg items-center justify-center">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md">
            <button type="button" onClick={() => setUserPaused(!userPaused)} className="text-white hover:text-brandYellow p-1" aria-label={userPaused ? "Play slide rotation" : "Pause slide rotation"}>
              {userPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            </button>
            <div className="w-px h-3 bg-white/30" />
            {slides.map((_, i) => (
              <button key={i} type="button" onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`} aria-current={i === current}
                className={`rounded-full transition-all ${i === current ? "w-7 h-2 bg-brandYellow" : "w-2 h-2 bg-white/60 hover:bg-white"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
