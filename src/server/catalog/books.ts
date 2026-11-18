import { db } from "@/server/db";
import { singlishToSinhala } from "@/lib/transliteration";
import { REAL_PUBLISHER_BOOKS } from "@/data/publisher-books";

export interface BookFilterParams {
  category?: string;
  author?: string;
  format?: string;
  type?: string; // BOOK | STATIONERY | LEARNING_AID | "items" (= any non-book)
  language?: string;
  query?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "rating" | "title";
  page?: number;
  limit?: number;
}

export async function getBooks(params: BookFilterParams = {}) {
  const { category, author, format, language, query, type, sort = "newest", page = 1, limit = 12 } = params;
  const skip = (page - 1) * limit;

  try {
    // If search query is provided, check Singlish transliteration
    const transliteratedQuery = query ? singlishToSinhala(query) : undefined;

    const where: any = {
      isDeleted: false,
    };

    if (type === "items") where.productType = { not: "BOOK" };
    else if (type) where.productType = type;

    if (category && category !== "all") {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }

    if (author) {
      where.authors = {
        some: {
          author: {
            slug: author,
          },
        },
      };
    }

    if (language) {
      where.language = language.toUpperCase();
    }

    if (query) {
      where.OR = [
        { titleSi: { contains: query, mode: "insensitive" } },
        { titleEn: { contains: query, mode: "insensitive" } },
        { transliterated: { contains: query, mode: "insensitive" } },
        ...(transliteratedQuery
          ? [{ titleSi: { contains: transliteratedQuery, mode: "insensitive" } }]
          : []),
        {
          editions: {
            some: {
              isbn: { contains: query.replace(/-/g, ""), mode: "insensitive" },
            },
          },
        },
      ];
    }

    const orderBy: any = [];
    if (sort === "newest") orderBy.push({ createdAt: "desc" });
    if (sort === "rating") orderBy.push({ averageRating: "desc" });
    if (sort === "title") orderBy.push({ titleSi: "asc" });

    const [books, totalCount] = await Promise.all([
      db.book.findMany({
        where,
        include: {
          authors: { include: { author: true } },
          categories: { include: { category: true } },
          editions: { where: { isDeleted: false }, orderBy: { isDigital: "asc" } },
          sampleConfig: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.book.count({ where }),
    ]);

    if (books && books.length > 0) {
      return {
        books,
        pagination: {
          total: totalCount,
          page,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    }

    return getFallbackBooks(params);
  } catch {
    return getFallbackBooks(params);
  }
}

export async function getBookBySlug(slug: string) {
  try {
    const book = await db.book.findUnique({
      where: { slug },
      include: {
        authors: { include: { author: true } },
        categories: { include: { category: true } },
        editions: { where: { isDeleted: false }, orderBy: { isDigital: "asc" } },
        sampleConfig: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true } } },
        },
      },
    });
    if (book) return book;
  } catch {
    // fallback to static list
  }
  const fallback = getFallbackBooks({ limit: 500 });
  return fallback.books.find((b: any) => b.slug === slug) || null;
}

// Convert REAL_PUBLISHER_BOOKS to internal database-like shape
const ALL_CATALOG_BOOKS = REAL_PUBLISHER_BOOKS.map((b) => ({
  id: b.id,
  slug: b.slug,
  titleSi: b.titleSi,
  titleEn: b.titleEn,
  transliterated: b.transliterated,
  language: b.language,
  publishedYear: 2026,
  averageRating: b.rating,
  reviewCount: b.reviewCount,
  isFeatured: b.isFeatured,
  isBestSeller: b.isBestSeller,
  isAwardWinner: b.isAwardWinner,
  coverUrl: b.coverUrl,
  grade: b.grade,
  subject: b.subject,
  bookType: b.type,
  galleryUrls: b.gallery,
  previewUrl: b.previewUrl,
  materialsUrl: b.materialsUrl,
  readCount: 0,
  synopsisSi: b.description || `පදනම ප්‍රකාශන මඟින් ශ්‍රී ලංකා ජාතික විෂය නිර්දේශයට අනුව සම්පාදිත ${b.titleSi} ග්‍රන්ථය. දිවයිනේ ප්‍රවීණ ගුරුභවතුන්ගේ මඟපෙන්වීමෙන් නවතම විභාග ප්‍රශ්න රටාවන්ට අනුකූලව සකස් කර ඇත.`,
  synopsisEn: `Official Padanama Publications edition of ${b.titleEn}, meticulously designed according to the latest Sri Lankan national curriculum.`,
  authors: [
    {
      author: {
        id: "auth-editorial",
        nameSi: b.author,
        nameEn: b.author,
        slug: "padanama-editorial-board",
      },
    },
  ],
  categories: [
    {
      category: {
        id: `cat-${b.categorySlug}`,
        nameSi: b.categoryNameSi,
        nameEn: b.categoryNameSi,
        slug: b.categorySlug,
      },
    },
  ],
  productType: b.productType,
  sampleConfig: b.productType === "BOOK" ? { maxPages: 20, percentageLimit: 20 } : null,
  editions: ([
    {
      id: `${b.id}-ed-pb`,
      format: "PAPERBACK",
      isbn: b.isbn,
      sku: `PDN-${b.originalId}-PB`,
      priceCents: b.priceCents,
      salePriceCents: b.salePriceCents,
      stockQuantity: b.stock,
      pageCount: null,
      isDigital: false,
    },
    {
      id: `${b.id}-ed-eb`,
      format: "EBOOK",
      sku: `PDN-${b.originalId}-EB`,
      priceCents: Math.round(b.priceCents * 0.65),
      salePriceCents: b.salePriceCents ? Math.round(b.salePriceCents * 0.65) : null,
      stockQuantity: 99999,
      pageCount: null,
      isDigital: true,
    },
  ] as any[]).filter((e) => b.productType === "BOOK" || e.format !== "EBOOK"),
}));

// Resilient fallback dataset populated with real publisher inventory
export function getFallbackBooks(params: BookFilterParams = {}) {
  const { category, query, type, sort = "newest", page = 1, limit = 12 } = params;

  let filtered = [...ALL_CATALOG_BOOKS];
  if (type) filtered = filtered.filter((b) => (type === "items" ? b.productType !== "BOOK" : b.productType === type));

  if (category && category !== "all") {
    filtered = filtered.filter((b) =>
      b.categories.some((c: any) => c.category.slug === category)
    );
  }

  if (query) {
    const q = query.toLowerCase().trim();
    const transliteratedQuery = singlishToSinhala(query).toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.titleSi.toLowerCase().includes(q) ||
        b.titleEn.toLowerCase().includes(q) ||
        b.transliterated.toLowerCase().includes(q) ||
        b.titleSi.toLowerCase().includes(transliteratedQuery)
    );
  }

  if (sort === "price_asc") {
    filtered.sort((a, b) => {
      const pA = a.editions[0]?.salePriceCents || a.editions[0]?.priceCents || 0;
      const pB = b.editions[0]?.salePriceCents || b.editions[0]?.priceCents || 0;
      return pA - pB;
    });
  } else if (sort === "price_desc") {
    filtered.sort((a, b) => {
      const pA = a.editions[0]?.salePriceCents || a.editions[0]?.priceCents || 0;
      const pB = b.editions[0]?.salePriceCents || b.editions[0]?.priceCents || 0;
      return pB - pA;
    });
  } else if (sort === "rating") {
    filtered.sort((a, b) => b.averageRating - a.averageRating);
  } else if (sort === "title") {
    filtered.sort((a, b) => a.titleSi.localeCompare(b.titleSi));
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    books: paginated as any,
    pagination: {
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

/** Live item counts per category slug (+ "all"), from the DB or the static catalogue. */
export async function getCategoryCounts(type?: string): Promise<Record<string, number>> {
  const match = (t: string) => !type || (type === "items" ? t !== "BOOK" : t === type);
  try {
    const rows = await db.bookCategory.findMany({
      where: { book: { isDeleted: false, ...(type ? { productType: type === "items" ? { not: "BOOK" } : (type as any) } : {}) } },
      select: { category: { select: { slug: true } } },
    });
    if (rows.length) {
      const c: Record<string, number> = { all: 0 };
      for (const r of rows) { c[r.category.slug] = (c[r.category.slug] || 0) + 1; c.all++; }
      return c;
    }
  } catch { /* fall back */ }
  const c: Record<string, number> = { all: 0 };
  for (const b of ALL_CATALOG_BOOKS) if (match(b.productType)) { const s = b.categories[0].category.slug; c[s] = (c[s] || 0) + 1; c.all++; }
  return c;
}
