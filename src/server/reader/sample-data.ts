import { REAL_PUBLISHER_BOOKS } from "@/data/publisher-books";

export interface ReaderPage {
  pageNumber: number;
  chapterTitle: string;
  subTitle?: string;
  content: string[]; // Paragraphs / equations / bullet points
  hasDiagram?: boolean;
  notes?: string;
}

export interface ReaderChapter {
  id: string;
  title: string;
  startPage: number;
}

export interface ReaderBookData {
  slug: string;
  bookId: string; // catalogue id used by the cart/order API
  pageImages?: string[]; // admin-uploaded sample page scans (shown instead of text pages)
  titleSi: string;
  titleEn: string;
  authorName: string;
  coverImage?: string;
  totalPages: number;
  sampleMaxPages: number;
  chapters: ReaderChapter[];
  pages: ReaderPage[];
  isEntitled: boolean;
  watermark: string;
  paperbackPriceCents: number;
  ebookPriceCents: number;
}

const DEFAULT_SAMPLE_PAGES: Record<string, { chapters: ReaderChapter[]; pages: ReaderPage[] }> = {
  "scholarship-grade-5-model-papers": {
    chapters: [
      { id: "ch-1", title: "පෙරවදන සහ විභාග මඟපෙන්වීම (Introduction)", startPage: 1 },
      { id: "ch-2", title: "පළමු ආදර්ශ ප්‍රශ්න පත්‍රය (Model Paper 1)", startPage: 4 },
      { id: "ch-3", title: "දෙවන ආදර්ශ ප්‍රශ්න පත්‍රය (Model Paper 2)", startPage: 12 },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterTitle: "පෙරවදන සහ විභාග මඟපෙන්වීම",
        subTitle: "ශිෂ්‍යත්ව විභාග ජයග්‍රහණයේ රහස්",
        content: [
          "ශ්‍රී ලංකා අධ්‍යාපන අමාත්‍යාංශයේ 5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාගය යනු දරුවෙකුගේ මූලික අධ්‍යාපන දිවියේ ප්‍රධානතම සන්ධිස්ථානයකි.",
          "මෙම අත්පොත සකස් කර ඇත්තේ ප්‍රශ්න රටාව පිළිබඳව දරුවා තුළ ඇති අනවශ්‍ය බිය පහකොට, තාර්කික චින්තනය හා කාල කළමනාකරණය ප්‍රගුණ කරවීම සඳහාය.",
          "පළමු ප්‍රශ්න පත්‍රය සඳහා නියමිත කාලය මිනිත්තු 45 කි. බහුවරණ ප්‍රශ්න 40 කට පිළිතුරු සැපයිය යුතුය. සෑම ප්‍රශ්නයකටම ලැබෙන්නේ මිනිත්තුවකට ආසන්න කාලයකි.",
        ],
        notes: "පදනම ප්‍රකාශන මණ්ඩලය • කොළඹ",
      },
      {
        pageNumber: 2,
        chapterTitle: "පෙරවදන සහ විභාග මඟපෙන්වීම",
        subTitle: "පළමු ප්‍රශ්න පත්‍රයට මුහුණදීමේ ක්‍රමවේදය",
        content: [
          "1. ප්‍රශ්නය අවධානයෙන් කියවන්න. ප්‍රශ්නයේ අවසානයේ 'නොවන්නේ කුමක්ද', 'වැරදි ප්‍රකාශය කුමක්ද' යන වචන අවධානයෙන් කියවන්න.",
          "2. දන්නා ප්‍රශ්න පළමුව විසඳන්න. අපහසු ප්‍රශ්න සඳහා වැඩි වේලාවක් ගත නොකර ඊළඟ ප්‍රශ්නයට යන්න.",
          "3. පිළිතුරු පත්‍රයේ නිවැරදි කවය පැහැදිලිව කළු කරන්න.",
        ],
      },
      {
        pageNumber: 3,
        chapterTitle: "පෙරවදන සහ විභාග මඟපෙන්වීම",
        subTitle: "දෙවන ප්‍රශ්න පත්‍රයේ ලකුණු ලබා ගැනීමේ උපාය මාර්ග",
        content: [
          "දෙවන ප්‍රශ්න පත්‍රය භාෂා ඥානය සහ පරිසරය ආශ්‍රිත ප්‍රශ්නවලින් සමන්විත වේ.",
          "සෑම විටම පිළිතුර පැහැදිලි සහ සංක්ෂිප්ත අත්අකුරින් ලියන්න.",
          "රූප සටහන් ඇඳීමේදී සහ නම් කිරීමේදී පැන්සලක් භාවිතා කරන්න.",
        ],
      },
      {
        pageNumber: 4,
        chapterTitle: "පළමු ආදර්ශ ප්‍රශ්න පත්‍රය (Paper 1)",
        subTitle: "තාර්කික බුද්ධි පරීක්ෂණය (IQ & Mental Aptitude)",
        content: [
          "1. පහත දී ඇති රූප පෙළෙහි ඊළඟට පැමිණිය යුතු රූපය කුමක්ද?",
          "   [■ ▲ ●] -> [▲ ● ■] -> [● ■ ▲] -> [?]",
          "   (1) [■ ▲ ●]   (2) [▲ ■ ●]   (3) [■ ● ▲]",
          "2. අශ්වයා : හේෂාරවය නම්, ඇතා : ?",
          "   (1) කුංචනාදය   (2) නාදය   (3) ගර්ජනය",
          "3. 2, 5, 10, 17, 26, ... ශ්‍රේණියේ ඊළඟ සංඛ්‍යාව කුමක්ද?",
          "   විසඳුම: +3, +5, +7, +9, +11 => 26 + 11 = 37.",
        ],
        notes: "පදනම ශිෂ්‍යත්ව ආදර්ශ පත්‍රිකා • සියලු හිමිකම් ඇවිරිණි",
      },
      {
        pageNumber: 5,
        chapterTitle: "පළමු ආදර්ශ ප්‍රශ්න පත්‍රය (Paper 1)",
        subTitle: "ගණිතමය සංකල්ප සහ රටා",
        content: [
          "4. කූඩයක ඇති අඹ ගෙඩි 24 න් 1/3 ක් ඉදුණු ඒවාය. නොඉදුණු අඹ ගෙඩි ගණන කීයද?",
          "   විසඳුම: ඉදුණු අඹ = 24 / 3 = 8. නොඉදුණු අඹ = 24 - 8 = 16.",
          "5. පැය 2 යි මිනිත්තු 35 ට මිනිත්තු 45 ක් එකතු කළ විට ලැබෙන වේලාව කීයද?",
          "   විසඳුම: පැය 2 යි මිනිත්තු 80 => පැය 3 යි මිනිත්තු 20.",
        ],
      },
    ],
  },
  "ol-mathematics-short-notes": {
    chapters: [
      { id: "ch-1", title: "1. සංඛ්‍යා සහ දර්ශක (Numbers & Indices)", startPage: 1 },
      { id: "ch-2", title: "2. වීජ ගණිතය සහ සමීකරණ (Algebra)", startPage: 5 },
      { id: "ch-3", title: "3. ජ්‍යාමිතිය ප්‍රමේය (Geometric Theorems)", startPage: 10 },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterTitle: "1. සංඛ්‍යා සහ දර්ශක (Numbers & Indices)",
        subTitle: "මූලික දර්ශක නීති (Rules of Indices)",
        content: [
          "1. a^m × a^n = a^(m + n)",
          "2. a^m ÷ a^n = a^(m - n)",
          "3. (a^m)^n = a^(m × n)",
          "4. a^0 = 1 (a ≠ 0)",
          "5. a^(-n) = 1 / a^n",
          "6. a^(1/n) = n√a",
        ],
        notes: "පදනම සාමාන්‍ය පෙළ කෙටි සටහන් පෙළ",
      },
      {
        pageNumber: 2,
        chapterTitle: "1. සංඛ්‍යා සහ දර්ශක (Numbers & Indices)",
        subTitle: "ලඝුගණක මූලධර්ම (Logarithmic Principles)",
        content: [
          "දර්ශක ආකාරය y = a^x නම්, එහි ලඝුගණක ආකාරය log_a(y) = x වේ.",
          "1. log_a(xy) = log_a(x) + log_a(y)",
          "2. log_a(x / y) = log_a(x) - log_a(y)",
          "3. log_a(x^k) = k × log_a(x)",
          "4. log_a(a) = 1 සහ log_a(1) = 0",
        ],
      },
      {
        pageNumber: 3,
        chapterTitle: "1. සංඛ්‍යා සහ දර්ශක (Numbers & Indices)",
        subTitle: "වාණිජ ගණිතය සහ ප්‍රතිශත (Commercial Arithmetic)",
        content: [
          "1. සුළු පොලිය (Simple Interest): I = (P × R × T) / 100",
          "   P = මූලධනය, R = වාර්ෂික පොලී අනුපාතිකය, T = කාලය (වසර වලින්)",
          "2. වැට් බදු (VAT) ගණනය කිරීම: භාණ්ඩයක මිලට එකතු කළ අගය මත බද්ද එකතු වන ආකාරය.",
          "3. කොටස් වෙළඳපොළ: ලාභාංශ ආදායම = කොටස් ගණන × කොටසකට ලාභාංශය.",
        ],
      },
      {
        pageNumber: 4,
        chapterTitle: "1. සංඛ්‍යා සහ දර්ශක (Numbers & Indices)",
        subTitle: "පළමු ඒකකයේ පුහුණු අභ්‍යාස",
        content: [
          "අභ්‍යාසය 1: සුළු කරන්න: (2^3 × 2^5) ÷ 2^4 = 2^(8-4) = 2^4 = 16.",
          "අභ්‍යාසය 2: x සොයන්න: 3^(2x - 1) = 27 = 3^3. එබැවින් 2x - 1 = 3 => 2x = 4 => x = 2.",
          "අභ්‍යාසය 3: log 2 = 0.3010 සහ log 3 = 0.4771 නම් log 6 අගය ගණනය කරන්න.",
          "විසඳුම: log 6 = log(2 × 3) = log 2 + log 3 = 0.3010 + 0.4771 = 0.7781.",
        ],
      },
      {
        pageNumber: 5,
        chapterTitle: "2. වීජ ගණිතය සහ සමීකරණ (Algebra)",
        subTitle: "වීජීය ප්‍රකාශන සහ සාධක (Factorization)",
        content: [
          "වර්ග දෙකක අන්තරය: a^2 - b^2 = (a - b)(a + b)",
          "පූර්ණ වර්ග: (a + b)^2 = a^2 + 2ab + b^2",
          "වර්ගජ සමීකරණ විසඳීමේ සාමාන්‍ය සූත්‍රය: x = [-b ± √(b^2 - 4ac)] / 2a",
        ],
      },
    ],
  },
};

export function getReaderBookContent(
  slug: string,
  options: { isEntitled?: boolean; userIdentifier?: string } = {}
): ReaderBookData {
  const isEntitled = Boolean(options.isEntitled);

  // Look up matched book in REAL_PUBLISHER_BOOKS
  const matchedBook = REAL_PUBLISHER_BOOKS.find((b) => b.slug === slug || b.id === slug || `pdn-${b.originalId}` === slug);

  const sampleData = DEFAULT_SAMPLE_PAGES[slug] || DEFAULT_SAMPLE_PAGES["scholarship-grade-5-model-papers"];

  const sampleMaxPages = 20;
  const totalPages = 160;

  const watermark = isEntitled
    ? `Padanama Official Edition • ${options.userIdentifier || "Licensed Customer"}`
    : `පදනම නොමිලේ සාම්පල පෙරදසුන • padanamapublication.lk`;

  return {
    slug,
    bookId: matchedBook?.id || slug,
    titleSi: matchedBook ? matchedBook.titleSi : (slug === "ol-mathematics-short-notes" ? "සාමාන්‍ය පෙළ ගණිතය කෙටි සටහන් සහ සූත්‍ර සංග්‍රහය" : "5 ශ්‍රේණිය ශිෂ්‍යත්ව පෙරහුරු ප්‍රශ්න පත්‍ර"),
    titleEn: matchedBook ? matchedBook.titleEn : (slug === "ol-mathematics-short-notes" ? "O/L Mathematics Short Notes" : "Grade 5 Scholarship Model Papers"),
    authorName: "පදනම අධ්‍යාපනික මණ්ඩලය",
    coverImage: matchedBook?.coverUrl || "https://ufmcnjfvzxumcvmddpal.supabase.co/storage/v1/object/public/media/books/1627556979.jpg",
    totalPages,
    sampleMaxPages,
    chapters: sampleData.chapters,
    pages: sampleData.pages,
    isEntitled,
    watermark,
    paperbackPriceCents: matchedBook ? (matchedBook.salePriceCents || matchedBook.priceCents) : 58000,
    ebookPriceCents: matchedBook ? Math.round(matchedBook.priceCents * 0.6) : 32000,
  };
}
