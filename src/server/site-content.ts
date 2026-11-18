import { db } from "@/server/db";
import type { HeroSlide } from "@/components/store/HeroSlider";
import type { SocialItem } from "@/components/store/SocialMediaSection";
import type { Review } from "@/components/store/UserReviewsSection";
import { DEFAULT_SLIDES, DEFAULT_SOCIAL, DEFAULT_SETTINGS } from "@/data/site-defaults";

/** Run a DB read; any failure (DB down, schema not migrated) falls back to static content. */
const safe = <T>(fn: () => Promise<T>, fallback: T): Promise<T> => Promise.resolve().then(fn).catch(() => fallback);

// Everything here is editable in the admin panel; the fallbacks keep the site complete before content is added.


export async function getHeroSlides(locale: string, alts: string[]): Promise<HeroSlide[]> {
  const now = new Date();
  const rows = await safe(() => db.banner.findMany({
    where: { isActive: true, AND: [{ OR: [{ startsAt: null }, { startsAt: { lte: now } }] }, { OR: [{ endsAt: null }, { endsAt: { gte: now } }] }] },
    orderBy: { sortOrder: "asc" },
  }), [] as any[]);
  if (rows.length) return rows.map((b) => ({ id: b.id, image: b.imageUrl, href: b.linkUrl || "/books", alt: locale === "si" ? b.titleSi : b.titleEn }));
  return DEFAULT_SLIDES.map((s, i) => ({ id: `d${i}`, ...s, alt: alts[i] || "" }));
}

export async function getTestimonials(): Promise<Review[] | undefined> {
  const rows = await safe(() => db.testimonial.findMany({ where: { isApproved: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take: 12 }), [] as any[]);
  if (!rows.length) return undefined;
  return rows.map((t, i) => ({
    id: i + 1, dbId: t.id, name: t.name, role: "", location: t.location || "", rating: Math.min(5, Math.max(1, t.rating)),
    date: t.createdAt.toLocaleDateString("en-GB"), badge: "✓", title: "", comment: t.comment, helpfulCount: t.likes,
  }));
}

export async function getSocialItems(): Promise<SocialItem[]> {
  const rows = await safe(() => db.socialPost.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, take: 24 }), [] as any[]);
  if (rows.length) return rows.map((r) => ({ id: r.id, kind: r.kind === "VIDEO" ? "VIDEO" : "POST", url: r.url, thumbnailUrl: r.thumbnailUrl, caption: r.caption }));
  // Fallback: link tiles to the real page/channel (no invented likes or views).
  return DEFAULT_SOCIAL;
}



/** Key/value page content from Admin → Page Content. */
export async function getSettings(): Promise<Record<string, string>> {
  const rows = await safe(() => db.setting.findMany({ where: { OR: [{ key: { startsWith: "contact." } }, { key: { startsWith: "bank." } }] } }), [] as any[]);
  return { ...DEFAULT_SETTINGS, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) };
}
