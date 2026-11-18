// Full publisher catalogue, synced from padanamapublication.lk by `node scripts/scrape-publisher.mjs`.
// Server-only (large): used as the offline fallback and as the seed source for the database.
import raw from "./publisher-catalog.json";

export interface ScrapedBook {
  id: string; title: string; author: string; grade: string | null; medium: string; isbn: string | null;
  bookType: string | null; category: string; categorySlug: string; subCategory: string | null; subject: string | null;
  inStock: boolean; stock: number; priceCents: number | null; salePriceCents: number | null; description: string | null;
  cover: string | null; gallery: string[]; previewUrl: string | null; materialsUrl: string | null;
}

export interface PublisherBook {
  id: string;
  originalId: string;
  slug: string;
  titleSi: string;
  titleEn: string;
  transliterated: string;
  language: "SINHALA" | "ENGLISH" | "TAMIL";
  author: string;
  categoryNameSi: string;
  categorySlug: string;
  type: string;
  grade: string | null;
  subject: string | null;
  isbn: string | null;
  description: string | null;
  coverUrl: string;
  gallery: string[];
  previewUrl: string | null;
  materialsUrl: string | null;
  stock: number;
  priceCents: number;
  salePriceCents: number | null;
  isFeatured: boolean;
  isBestSeller: boolean;
  isAwardWinner: boolean;
  rating: number;
  reviewCount: number;
}

// Legacy site category names → our URL slugs (home page and filters link to these).
const CATEGORY_SLUGS: Record<string, string> = {
  "pre school, grade 1 and 2": "preschool-grade-1-2",
  "primary - ප්‍රාථමික ශ්‍රේණි ( 3,4,5)": "primary",
  "grade 6 , 7 - ශ්‍රේණි": "grade-6-7",
  "grade 8 , 9 - ශ්‍රේණි": "grade-8-9",
  "g.c.e (o/l) 10 , 11 ශ්‍රේණි": "gce-ol",
  "g.c.e (a/l) common subject": "gce-al-common",
  "g.c.e (a/l) science": "gce-al-science",
  "g.c.e (a/l) technology subject": "gce-al-tech",
  "g.c.e (a/l) commerce subject": "gce-al-commerce",
  "g.c.e (a/l) art subject": "gce-al-art",
  "donations for books ධර්ම දානය සඳහා": "donations",
  "primary": "primary-extra",
  "provincial papers": "provincial-papers",
  "government exam past paper": "gov-exam-past-papers",
  "goverment books": "gov-books",
  "school mate / පාසල් උපකරණ": "school-items",
  "school stationary / පාසල් ලිපි ද්‍රව්‍ය": "stationery",
};

export const categorySlugFor = (name: string, fallback: string) =>
  CATEGORY_SLUGS[name.trim().replace(/\s+/g, " ").toLowerCase()] || fallback || "other";

const LANG: Record<string, PublisherBook["language"]> = { english: "ENGLISH", tamil: "TAMIL" };

export const REAL_PUBLISHER_BOOKS: PublisherBook[] = (raw as ScrapedBook[])
  .filter((b) => b.priceCents)
  .map((b, idx) => ({
    id: `pdn-${b.id}`,
    originalId: b.id,
    slug: b.id,
    titleSi: b.title,
    titleEn: b.title,
    transliterated: b.title,
    language: LANG[b.medium?.toLowerCase()] || "SINHALA",
    author: b.author,
    categoryNameSi: b.category,
    categorySlug: categorySlugFor(b.category, b.categorySlug),
    type: b.bookType || "Book",
    grade: b.grade,
    subject: b.subject,
    isbn: b.isbn,
    description: b.description,
    coverUrl: b.cover || "/favicon.png",
    gallery: b.gallery,
    previewUrl: b.previewUrl,
    materialsUrl: b.materialsUrl,
    stock: b.inStock ? b.stock : 0,
    priceCents: b.priceCents!,
    salePriceCents: b.salePriceCents,
    isFeatured: idx < 16,
    isBestSeller: false,
    isAwardWinner: false,
    rating: 0,
    reviewCount: 0,
  }));
