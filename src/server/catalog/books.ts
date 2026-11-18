import { db } from "@/server/db";
import { singlishToSinhala } from "@/lib/transliteration";

export interface BookFilterParams {
  category?: string;
  author?: string;
  format?: string;
  language?: string;
  query?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "rating" | "title";
  page?: number;
  limit?: number;
}

export async function getBooks(params: BookFilterParams = {}) {
  const { category, author, format, language, query, sort = "newest", page = 1, limit = 12 } = params;
  const skip = (page - 1) * limit;

  try {
    // If search query is provided, check Singlish transliteration
    const transliteratedQuery = query ? singlishToSinhala(query) : undefined;

    const where: any = {
      isDeleted: false,
    };

    if (category) {
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
          editions: { where: { isDeleted: false } },
          sampleConfig: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.book.count({ where }),
    ]);

    return {
      books,
      pagination: {
        total: totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.warn("Database query failed, returning seeded fallback catalog:", error);
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
        editions: { where: { isDeleted: false } },
        sampleConfig: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true } } },
        },
      },
    });
    if (book) return book;
  } catch (e) {
    // fallback
  }
  const fallback = getFallbackBooks();
  return fallback.books.find((b: any) => b.slug === slug) || null;
}

// Resilient fallback dataset matching seed data for offline / preview states
export function getFallbackBooks(params: BookFilterParams = {}) {
  const allBooks = [
    {
      id: "sample-book-1",
      slug: "scholarship-grade-5-model-papers",
      titleSi: "5 ශ්‍රේණිය ශිෂ්‍යත්ව පෙරහුරු ප්‍රශ්න පත්‍ර",
      titleEn: "Grade 5 Scholarship Model Papers",
      transliterated: "shishyathwaya 5 perahuru prashna pathra",
      language: "SINHALA",
      publishedYear: 2026,
      averageRating: 4.9,
      reviewCount: 38,
      isFeatured: true,
      isBestSeller: true,
      isAwardWinner: false,
      synopsisSi: "නව විෂය නිර්දේශයට අනුව සැකසූ ආදර්ශ ප්‍රශ්න පත්‍ර 10ක් සහ සම්පූර්ණ ලකුණු ලබාදීමේ ක්‍රමවේද අඩංගුයි. ශිෂ්‍යත්ව විභාගයට පෙනී සිටින දූ දරුවන්ට අත්‍යවශ්‍ය පුහුණු අත්පොතකි.",
      synopsisEn: "10 comprehensive model examination papers with step-by-step marking schemes aligned with the latest scholarship syllabus.",
      authors: [{ author: { nameSi: "පදනම අධ්‍යාපනික කර්තෘ මණ්ඩලය", nameEn: "Padanama Editorial Board", slug: "padanama-editorial-board" } }],
      categories: [{ category: { nameSi: "5 ශ්‍රේණිය ශිෂ්‍යත්වය", nameEn: "Grade 5 Scholarship", slug: "scholarship-grade-5" } }],
      sampleConfig: { maxPages: 20, percentageLimit: 20 },
      editions: [
        {
          id: "ed-1",
          format: "PAPERBACK",
          isbn: "978-955-8001-01-2",
          sku: "PDN-SCH-01-PB",
          priceCents: 65000,
          salePriceCents: 52000,
          stockQuantity: 250,
          pageCount: 160,
          isDigital: false,
        },
        {
          id: "ed-2",
          format: "EBOOK",
          sku: "PDN-SCH-01-EB",
          priceCents: 35000,
          stockQuantity: 99999,
          pageCount: 160,
          isDigital: true,
        },
      ],
    },
    {
      id: "sample-book-2",
      slug: "ol-mathematics-short-notes",
      titleSi: "සාමාන්‍ය පෙළ ගණිතය කෙටි සටහන් සහ සූත්‍ර සංග්‍රහය",
      titleEn: "O/L Mathematics Short Notes & Formula Book",
      transliterated: "ganithaya 10 11 keti satahan sutra",
      language: "SINHALA",
      publishedYear: 2026,
      averageRating: 4.8,
      reviewCount: 24,
      isFeatured: true,
      isBestSeller: true,
      isAwardWinner: false,
      synopsisSi: "10 සහ 11 ශ්‍රේණිවල සියලුම ගණිත පාඩම් ආවරණය වන පරිදි සැකසූ අත්‍යවශ්‍ය සූත්‍ර සහ කෙටි සටහන්. විභාගයට පෙර කඩිනම් පුනරීක්ෂණය සඳහා කදිමයි.",
      synopsisEn: "Complete G.C.E. O/L revision manual covering all theorems, formulas, and past paper question models.",
      authors: [{ author: { nameSi: "පදනම අධ්‍යාපනික කර්තෘ මණ්ඩලය", nameEn: "Padanama Editorial Board", slug: "padanama-editorial-board" } }],
      categories: [{ category: { nameSi: "අ.පො.ස. සාමාන්‍ය පෙළ (O/L)", nameEn: "G.C.E. Ordinary Level", slug: "ordinary-level" } }],
      sampleConfig: { maxPages: 15, percentageLimit: 15 },
      editions: [
        {
          id: "ed-3",
          format: "PAPERBACK",
          isbn: "978-955-8001-02-9",
          sku: "PDN-OL-MTH-PB",
          priceCents: 85000,
          stockQuantity: 180,
          pageCount: 140,
          isDigital: false,
        },
        {
          id: "ed-4",
          format: "EBOOK",
          sku: "PDN-OL-MTH-EB",
          priceCents: 45000,
          stockQuantity: 99999,
          pageCount: 140,
          isDigital: true,
        },
      ],
    },
    {
      id: "sample-book-3",
      slug: "hanthana-kadu-pamula",
      titleSi: "හන්තාන කඳු පාමුල",
      titleEn: "At the Foot of Hanthana Mountains",
      transliterated: "hanthana kadu pamula novel",
      language: "SINHALA",
      publishedYear: 2026,
      averageRating: 4.9,
      reviewCount: 52,
      isFeatured: true,
      isBestSeller: false,
      isAwardWinner: true,
      synopsisSi: "පේරාදෙණිය විශ්වවිද්‍යාලීය පරිසරය හා බැඳුණු සොඳුරු ආදර කතාවක් සහ තාරුණ්‍යයේ අභියෝග විවරණය කෙරෙන සම්මානනීය නවකතාව.",
      synopsisEn: "A poignant coming-of-age Sinhala novel set against the scenic backdrop of the University of Peradeniya.",
      authors: [{ author: { nameSi: "කුසල් ගුණසේකර", nameEn: "Kusal Gunasekara", slug: "kusal-gunasekara" } }],
      categories: [{ category: { nameSi: "සිංහල සාහිත්‍ය හා නවකතා", nameEn: "Sinhala Literature", slug: "sinhala-novels" } }],
      sampleConfig: { maxPages: 25, percentageLimit: 20, allowedChapters: "1,2" },
      editions: [
        {
          id: "ed-5",
          format: "PAPERBACK",
          isbn: "978-955-8001-03-6",
          sku: "PDN-NOV-01-PB",
          priceCents: 95000,
          stockQuantity: 120,
          pageCount: 280,
          isDigital: false,
        },
        {
          id: "ed-6",
          format: "HARDCOVER",
          isbn: "978-955-8001-03-HC",
          sku: "PDN-NOV-01-HC",
          priceCents: 140000,
          stockQuantity: 40,
          pageCount: 280,
          isDigital: false,
        },
        {
          id: "ed-7",
          format: "EBOOK",
          sku: "PDN-NOV-01-EB",
          priceCents: 49000,
          stockQuantity: 99999,
          pageCount: 280,
          isDigital: true,
        },
      ],
    },
  ];

  return {
    books: allBooks as any,
    pagination: {
      total: allBooks.length,
      page: 1,
      totalPages: 1,
    },
  };
}
