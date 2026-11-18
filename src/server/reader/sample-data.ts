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
        subTitle: "දෙවන ප්‍රශ්න පත්‍රය (භාෂාව සහ ගණිත ගැටලු)",
        content: [
          "දෙවන ප්‍රශ්න පත්‍රය සඳහා පැය 1යි මිනිත්තු 15ක කාලයක් හිමිවේ. මෙහිදී ලකුණු 100ක් ලබාගත හැක.",
          "ගණිත සංකල්ප: භාග, පරිමිතිය, වර්ගඵලය, කාලය හා දින දර්ශනය, මුදල් ගණනය කිරීම් සහ රටා හඳුනාගැනීම විශේෂයෙන් වැදගත් වේ.",
          "භාෂා කුසලතා: වාක්‍ය ගැලපීම, අක්ෂර වින්‍යාසය, විරුද්ධ පද, සමාන පද සහ නිවැරදි කරුණු අවබෝධය පරීක්ෂා කෙරේ.",
        ],
      },
      {
        pageNumber: 4,
        chapterTitle: "පළමු ආදර්ශ ප්‍රශ්න පත්‍රය (Model Paper 1)",
        subTitle: "පළමු කොටස — බුද්ධි පරීක්ෂණය (IQ)",
        content: [
          "1. පහත සඳහන් රූප රටාවේ හිස්තැනට ගැළපෙන රූපය තෝරන්න:",
          "  (අ) ത്രിಕೋණය  (ආ) චතුරස්‍රය  (ඇ) වෘත්තය  (ඈ) ෂඩාස්‍රය",
          "2. කමල්, නිමල්ට වඩා උසය. සුනිල්, කමල්ට වඩා උසය. වැඩිම උස ඇත්තේ කාටද?",
          "  (1) නිමල්  (2) කමල්  (3) සුනිල්  (4) නිශ්චය කළ නොහැක",
        ],
        notes: "ආදර්ශ ප්‍රශ්නාවලිය • ලකුණු 100",
      },
      {
        pageNumber: 5,
        chapterTitle: "පළමු ආදර්ශ ප්‍රශ්න පත්‍රය (Model Paper 1)",
        subTitle: "ගණිතමය තර්කනය සහ සංඛ්‍යා රටා",
        content: [
          "3. පහත සංඛ්‍යා රටාවේ ඊළඟට එන සංඛ්‍යාව කුමක්ද?",
          "   2, 5, 10, 17, 26, .....?",
          "   විසඳුම: +3, +5, +7, +9, +11... එබැවින් 26 + 11 = 37.",
          "4. පෙට්ටියක රතු බෝල 5ක්, නිල් බෝල 7ක් සහ කහ බෝල 3ක් ඇත. අහඹු ලෙස එකක් ගන්නා විට එය නිල් බෝලයක් වීමේ සම්භාවිතාව කොපමණද?",
        ],
      },
      {
        pageNumber: 6,
        chapterTitle: "පළමු ආදර්ශ ප්‍රශ්න පත්‍රය (Model Paper 1)",
        subTitle: "පාරිසරික අධ්‍යයනය හා සාමාන්‍ය දැනුම",
        content: [
          "5. ශ්‍රී ලංකාවේ උසම දියඇල්ල කුමක්ද?",
          "   (1) දියලුම ඇල්ල  (2) බඹරකන්ද ඇල්ල  (3) දුන්හිඳ ඇල්ල  (4) රම්බොඩ ඇල්ල",
          "   පිළිතුර: (2) බඹරකන්ද ඇල්ල (උස මීටර් 263)",
          "6. ශාක ප්‍රභාසංශ්ලේෂණය සඳහා අත්‍යවශ්‍ය වන වායුව කුමක්ද?",
          "   (1) ඔක්සිජන්  (2) කාබන් ඩයොක්සයිඩ්  (3) නයිට්‍රජන්  (4) හයිඩ්‍රජන්",
        ],
      },
      {
        pageNumber: 7,
        chapterTitle: "පළමු ආදර්ශ ප්‍රශ්න පත්‍රය (Model Paper 1)",
        subTitle: "භාෂා ඥානය සහ අක්ෂර වින්‍යාසය",
        content: [
          "7. නිවැරදි අක්ෂර වින්‍යාසය සහිත වචනය තෝරන්න:",
          "   (1) ආරම්භය  (2) ආරම්බය  (3) ආරම්භ්‍ය  (4) ආරාම්භය",
          "8. 'ක්ෂේමභූමිය' යන්නෙහි අර්ථය වන්නේ:",
          "   (1) විශාල වනාන්තරය  (2) කාන්තාරයක දිය උල්පත් සහිත සාරවත් බිම  (3) මුහුදු වෙරළ",
        ],
      },
      {
        pageNumber: 8,
        chapterTitle: "පළමු ආදර්ශ ප්‍රශ්න පත්‍රය (Model Paper 1)",
        subTitle: "විවරණ සහ ලකුණු ලබාදීමේ ක්‍රමවේදය",
        content: [
          "ප්‍රශ්න 1 සිට 10 දක්වා පිළිතුරු විවරණය:",
          "දරුවා සෑම ප්‍රශ්නයකටම ලබාදුන් පිළිතුර පරීක්ෂා කර, වැරදුණු ප්‍රශ්න සඳහා නැවත එම සංකල්පය පැහැදිලි කරදීම දෙමව්පියන්ගේ වගකීමකි.",
          "විශේෂයෙන් සංඛ්‍යා රටා සහ සමාන අසමානතා ප්‍රශ්න දිනපතා පුහුණු කිරීම වැදගත්ය.",
        ],
        notes: "පදනම විභාග මණ්ඩලය",
      },
    ],
  },
  "ol-mathematics-short-notes": {
    chapters: [
      { id: "ch-1", title: "1. සංඛ්‍යා සහ දර්ශක (Numbers & Indices)", startPage: 1 },
      { id: "ch-2", title: "2. වීජ ගණිතය සහ සමීකරණ (Algebra)", startPage: 5 },
      { id: "ch-3", title: "3. ත්‍රිකෝණමිතිය සහ ජ්‍යාමිතිය (Geometry)", startPage: 11 },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterTitle: "1. සංඛ්‍යා සහ දර්ශක (Numbers & Indices)",
        subTitle: "දර්ශක නීති (Laws of Indices)",
        content: [
          "සාමාන්‍ය පෙළ ගණිතය විභාගයේ ප්‍රධානතම පදනම වන්නේ දර්ශක නීති පිළිබඳ මනා දැනුමයි.",
          "නීතිය 1: a^m × a^n = a^(m+n) (පාද සමාන වන විට ගුණ කිරීමේදී දර්ශක එකතු වේ)",
          "නීතිය 2: a^m ÷ a^n = a^(m-n) (පාද සමාන වන විට බෙදීමේදී දර්ශක අඩු වේ)",
          "නීතිය 3: (a^m)^n = a^(mn)",
          "නීතිය 4: a^0 = 1 (ඕනෑම ශූන්‍ය නොවන සංඛ්‍යාවක ශූන්‍ය වන බලය 1 කි)",
          "නීතිය 5: a^(-n) = 1 / (a^n)",
        ],
        notes: "සාමාන්‍ය පෙළ ගණිතය • පදනම අධ්‍යාපන මාලාව",
      },
      {
        pageNumber: 2,
        chapterTitle: "1. සංඛ්‍යා සහ දර්ශක (Numbers & Indices)",
        subTitle: "ලඝුගණක සූත්‍ර සහ භාවිතය (Logarithms)",
        content: [
          "ලඝුගණක යනු දර්ශක ආකෘතියේ ප්‍රතිලෝමයයි.",
          "y = a^x නම්, log_a(y) = x වේ.",
          "ලඝුගණක මූලික නීති:",
          "• log(AB) = log A + log B",
          "• log(A / B) = log A - log B",
          "• log(A^k) = k × log A",
          "විභාග උපදෙස: ලඝුගණක වගුව භාවිතයෙන් ගණනය කිරීම් සිදුකිරීමේදී ලක්ෂණය සහ පූර්ණාංශය නිවැරදිව වෙන්කර හඳුනාගන්න.",
        ],
      },
      {
        pageNumber: 3,
        chapterTitle: "1. සංඛ්‍යා සහ දර්ශක (Numbers & Indices)",
        subTitle: "ප්‍රතිශත සහ වාණිජ ගණිතය (Percentages & Finance)",
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
  const sampleData = DEFAULT_SAMPLE_PAGES[slug] || DEFAULT_SAMPLE_PAGES["scholarship-grade-5-model-papers"];

  const sampleMaxPages = 20;
  const totalPages = 160;

  const watermark = isEntitled
    ? `Padanama Official Edition • ${options.userIdentifier || "Licensed Customer"}`
    : `පදනම නොමිලේ සාම්පල පෙරදසුන • padanamapublication.lk`;

  return {
    slug,
    titleSi:
      slug === "ol-mathematics-short-notes"
        ? "සාමාන්‍ය පෙළ ගණිතය කෙටි සටහන් සහ සූත්‍ර සංග්‍රහය"
        : "5 ශ්‍රේණිය ශිෂ්‍යත්ව පෙරහුරු ප්‍රශ්න පත්‍ර",
    titleEn:
      slug === "ol-mathematics-short-notes"
        ? "O/L Mathematics Short Notes & Formula Book"
        : "Grade 5 Scholarship Model Papers",
    authorName: "පදනම අධ්‍යාපනික මණ්ඩලය",
    coverImage: "/images/books/placeholder.jpg",
    totalPages,
    sampleMaxPages,
    chapters: sampleData.chapters,
    pages: sampleData.pages,
    isEntitled,
    watermark,
    paperbackPriceCents: slug === "ol-mathematics-short-notes" ? 58000 : 65000,
    ebookPriceCents: slug === "ol-mathematics-short-notes" ? 32000 : 35000,
  };
}
