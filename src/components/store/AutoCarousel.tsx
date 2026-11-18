"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Auto-advancing horizontal carousel built on CSS scroll-snap.
 * Children are the slides; widths come from `itemClass`. Pauses on hover/focus and for reduced-motion users.
 */
export function AutoCarousel({ children, label, itemClass = "w-[85%] sm:w-[48%] lg:w-[32%]", intervalMs = 4000 }: { children: React.ReactNode[]; label: string; itemClass?: string; intervalMs?: number }) {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const w = (el.firstElementChild as HTMLElement | null)?.offsetWidth || el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: dir * (w + 16), behavior: "smooth" });
  };

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => step(1), intervalMs);
    return () => clearInterval(t);
  }, [paused, intervalMs]);

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div ref={track} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children.map((c, i) => <div key={i} className={`snap-start shrink-0 ${itemClass}`}>{c}</div>)}
      </div>
      <button type="button" onClick={() => step(-1)} aria-label="Previous" className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg text-brandNavy flex items-center justify-center hover:bg-brandYellow">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button type="button" onClick={() => step(1)} aria-label="Next" className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg text-brandNavy flex items-center justify-center hover:bg-brandYellow">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
