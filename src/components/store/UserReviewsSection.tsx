"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Star, CheckCircle2, ThumbsUp, Sparkles, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { DEFAULT_REVIEWS, type Review } from "@/data/site-defaults";
export type { Review };



export function UserReviewsSection({ reviews }: { reviews?: Review[] } = {}) {
  // Reviews managed in Admin → Reviews; built-in examples until some are published.
  const REVIEWS = reviews?.length ? reviews : DEFAULT_REVIEWS;
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    REVIEWS.forEach((r) => {
      initial[r.id] = r.helpfulCount;
    });
    return initial;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Load saved likes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("padanama_review_likes");
      if (stored) {
        const parsed = JSON.parse(stored);
        setLikes(parsed);
        setLikeCounts((prev) => {
          const updated = { ...prev };
          Object.keys(parsed).forEach((k) => {
            const id = Number(k);
            if (parsed[id] && !prev[id]) {
              const base = REVIEWS.find((r) => r.id === id)?.helpfulCount || 0;
              updated[id] = base + 1;
            }
          });
          return updated;
        });
      }
    } catch {
      // Local storage not available or SSR
    }
  }, []);

  const handleToggleLike = (id: number) => {
    const dbId = REVIEWS.find((r) => r.id === id)?.dbId;
    if (dbId) fetch(`/api/reviews/${dbId}/like`, { method: likes[id] ? "DELETE" : "POST" }).catch(() => {});
    setLikes((prev) => {
      const isLiked = !prev[id];
      const updated = { ...prev, [id]: isLiked };
      try {
        localStorage.setItem("padanama_review_likes", JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }

      setLikeCounts((cPrev) => {
        const base = REVIEWS.find((r) => r.id === id)?.helpfulCount || 0;
        return {
          ...cPrev,
          [id]: isLiked ? base + 1 : base,
        };
      });

      return updated;
    });
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  }, []);

  // Auto move carousel every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section className="w-full space-y-8">
      {/* Header with Aggregated Rating */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-maroon-100 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brandYellow text-brandNavy font-black text-xs shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brandNavy" />
            <span>පාරිභෝගික ඇගයුම් • 1,850+ Customer Reviews</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-brandNavy tracking-tight">
            ගුරුභවතුන්, දෙමාපියන් සහ සිසුන්ගේ සත්‍ය අදහස්
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted max-w-2xl leading-relaxed">
            දිවයින පුරා පදනම ප්‍රකාශන පරිහරණය කළ සිසු දරු දැරියන්, පාසල් ගුරුවරුන් සහ දෙමාපියන් පළ කළ විශ්වාසනීය ප්‍රතිචාර.
          </p>
        </div>

        {/* Aggregated Score Pill & Carousel Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-maroon-100 shadow-sm shrink-0">
            <div className="text-center border-r border-maroon-100 pr-4">
              <span className="font-display font-black text-3xl sm:text-4xl text-brandNavy block leading-none">
                4.9
              </span>
              <span className="text-[10px] text-ink-muted uppercase font-bold tracking-wider">
                5.0 න්
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-brandYellow">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brandYellow" />
                ))}
              </div>
              <p className="text-xs font-extrabold text-brandNavy">
                98.6% තෘප්තිමත් පාරිභෝගිකයින්
              </p>
              <p className="text-[10px] text-ink-muted">
                දිවයිනේ දිස්ත්‍රික්ක 25ම ආවරණය කරමින්
              </p>
            </div>
          </div>

          {/* Carousel Arrows & Pause Control */}
          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous Review"
              className="w-10 h-10 rounded-xl bg-white border border-maroon-200 text-brandNavy hover:bg-brandRed hover:text-white hover:border-brandRed transition-all flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? "Play Auto Carousel" : "Pause Auto Carousel"}
              className="w-10 h-10 rounded-xl bg-white border border-maroon-200 text-brandNavy hover:bg-brandYellow hover:border-brandYellow transition-all flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
            >
              {isPaused ? <Play className="w-4 h-4 text-brandNavy" /> : <Pause className="w-4 h-4 text-brandNavy" />}
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next Review"
              className="w-10 h-10 rounded-xl bg-white border border-maroon-200 text-brandNavy hover:bg-brandRed hover:text-white hover:border-brandRed transition-all flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ONE ROW AUTO-MOVING CAROUSEL */}
      <div
        className="relative overflow-hidden w-full py-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={sliderRef}
          className="flex transition-transform duration-700 ease-out gap-4 sm:gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / (typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : typeof window !== "undefined" && window.innerWidth >= 640 ? 2 : 1))}%)`,
          }}
        >
          {REVIEWS.map((rev) => {
            const isLiked = !!likes[rev.id];
            const count = likeCounts[rev.id] || rev.helpfulCount;

            return (
              <div
                key={rev.id}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 bg-white rounded-3xl p-5 sm:p-6 border border-maroon-100 shadow-sm hover:shadow-xl hover:border-brandRed/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  {/* Top Row: Stars, Badge without 'සත්‍යාපිත', Date */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-brandYellow">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-brandYellow" />
                      ))}
                    </div>
                    <span className="text-[10px] text-ink-muted font-medium">{rev.date}</span>
                  </div>

                  {/* Clean Pill (No 'සත්‍යාපිත' word) */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{rev.badge}</span>
                  </div>

                  {/* Review Title */}
                  <h3 className="font-display font-extrabold text-sm sm:text-base text-brandNavy group-hover:text-brandRed transition-colors leading-snug">
                    "{rev.title}"
                  </h3>

                  {/* Review Comment */}
                  <p className="text-xs text-ink/80 leading-relaxed font-normal line-clamp-4">
                    {rev.comment}
                  </p>

                  {/* Related Book Pill */}
                  {rev.bookTitle && (
                    <div className="pt-2">
                      <span className="text-[10px] bg-slate-50 text-brandNavy font-semibold px-2.5 py-1 rounded-lg border border-slate-200 inline-block truncate max-w-full">
                        📖 {rev.bookTitle}
                      </span>
                    </div>
                  )}
                </div>

                {/* Author Footer with Working Interactive Like Button */}
                <div className="pt-4 mt-5 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brandNavy to-brandRed text-brandYellow font-extrabold flex items-center justify-center text-sm shadow">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-brandNavy leading-tight">{rev.name}</h4>
                      <p className="text-[10px] text-ink-muted leading-tight">
                        {rev.role} • <span className="font-semibold text-brandRed">{rev.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Working Interactive Like Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleLike(rev.id)}
                    aria-label={`Like review by ${rev.name}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer active:scale-90 ${
                      isLiked
                        ? "bg-brandRed/10 text-brandRed border border-brandRed/30 shadow-xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <ThumbsUp
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isLiked ? "fill-brandRed text-brandRed scale-110" : "text-slate-500"
                      }`}
                    />
                    <span>{count}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Progress Dots */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {REVIEWS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentIndex === idx
                ? "w-8 h-2.5 bg-brandRed"
                : "w-2.5 h-2.5 bg-maroon-200 hover:bg-maroon-400"
            }`}
          />
        ))}
      </div>

      {/* Trust Highlights Strip */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brandNavy/5 via-cream to-brandNavy/5 border border-maroon-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <span className="font-display font-extrabold text-lg text-brandNavy block">
            100% නිල විභාග නිර්දේශ
          </span>
          <p className="text-xs text-ink-muted">
            ජාතික අධ්‍යාපන ආයතන (NIE) නව විෂය නිර්දේශයන්ට අනුකූලයි
          </p>
        </div>
        <div className="space-y-1 border-t sm:border-t-0 sm:border-x border-maroon-100 pt-3 sm:pt-0">
          <span className="font-display font-extrabold text-lg text-brandNavy block">
            දින 2-4න් වේගවත් බෙදාහැරීම
          </span>
          <p className="text-xs text-ink-muted">
            Domex සහ Koombiyo කුරියර් මඟින් දිවයින පුරා නිවසටම
          </p>
        </div>
        <div className="space-y-1 border-t sm:border-t-0 border-maroon-100 pt-3 sm:pt-0">
          <span className="font-display font-extrabold text-lg text-brandNavy block">
            පහසු මුදල් ගෙවීමේ ක්‍රම
          </span>
          <p className="text-xs text-ink-muted">
            භාණ්ඩ ලැබුණු පසු මුදල් ගෙවීම (COD), PayHere හෝ Koko BNPL
          </p>
        </div>
      </div>
    </section>
  );
}
