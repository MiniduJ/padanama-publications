import { PrismaClient, BookFormat, BookLanguage, RoleType, SampleType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Padanama Publications database seeding...");

  // 1. Publisher
  const publisher = await prisma.publisher.upsert({
    where: { slug: "padanama-publications" },
    update: {},
    create: {
      name: "Padanama Publications",
      slug: "padanama-publications",
      imprint: "Padanama Educational & Literary",
      website: "https://padanamapublication.lk",
    },
  });

  // 2. Administrative & Sample Users
  const adminUser = await prisma.user.upsert({
    where: { email: "superadmin@padanamapublication.lk" },
    update: {},
    create: {
      email: "superadmin@padanamapublication.lk",
      name: "Padanama Administrator",
      phoneNumber: "+94718008533",
      role: RoleType.SUPER_ADMIN,
      twoFactorEnabled: true,
    },
  });

  const editorUser = await prisma.user.upsert({
    where: { email: "editor@padanamapublication.lk" },
    update: {},
    create: {
      email: "editor@padanamapublication.lk",
      name: "Chief Editor",
      phoneNumber: "+94770882228",
      role: RoleType.EDITOR,
    },
  });

  const sampleCustomer = await prisma.user.upsert({
    where: { email: "dilrukshi@example.lk" },
    update: {},
    create: {
      email: "dilrukshi@example.lk",
      name: "Dilrukshi Jayawardena",
      phoneNumber: "+94771234567",
      role: RoleType.CUSTOMER,
    },
  });

  // 3. Authors
  const authorSybil = await prisma.author.upsert({
    where: { slug: "sybil-wettasinghe" },
    update: {},
    create: {
      slug: "sybil-wettasinghe",
      nameSi: "සිබිල් වෙත්තසිංහ",
      nameEn: "Sybil Wettasinghe",
      nameTa: "சிபில் வெத்தசிங்க",
      bioSi: "ශ්‍රී ලාංකීය ළමා සාහිත්‍යයේ අසහාය මාතාව සහ ජාත්‍යන්තර සම්මානනීය චිත්‍ර ශිල්පිනිය.",
      bioEn: "Renowned Sri Lankan children's book author and illustrator.",
      royaltyRate: 12.0,
      isFeatured: true,
    },
  });

  const authorEditorial = await prisma.author.upsert({
    where: { slug: "padanama-editorial-board" },
    update: {},
    create: {
      slug: "padanama-editorial-board",
      nameSi: "පදනම අධ්‍යාපනික කර්තෘ මණ්ඩලය",
      nameEn: "Padanama Educational Editorial Board",
      bioSi: "ප්‍රවීණ ආචාර්ය මහාචාර්යවරුන් සහ විෂය ප්‍රවීණයන්ගෙන් සමන්විත අධ්‍යාපනික කමිටුව.",
      bioEn: "Specialist committee of teachers, lecturers, and curriculum advisors.",
      royaltyRate: 10.0,
      isFeatured: true,
    },
  });

  const authorNovelist = await prisma.author.upsert({
    where: { slug: "kusal-gunasekara" },
    update: {},
    create: {
      slug: "kusal-gunasekara",
      nameSi: "කුසල් ගුණසේකර",
      nameEn: "Kusal Gunasekara",
      bioSi: "සම්මානනීය සමකාලීන සිංහල නවකතා සහ කෙටිකතා රචක.",
      bioEn: "Contemporary award-winning Sinhala novelist.",
      royaltyRate: 15.0,
      isFeatured: true,
    },
  });

  // 4. Categories Hierarchy
  const catEducation = await prisma.category.upsert({
    where: { slug: "education" },
    update: {},
    create: {
      slug: "education",
      nameSi: "අධ්‍යාපනික සහ විභාග",
      nameEn: "Education & Exams",
      nameTa: "கல்வி மற்றும் தேர்வுகள்",
      isFeatured: true,
      sortOrder: 1,
    },
  });

  const catScholarship = await prisma.category.upsert({
    where: { slug: "scholarship-grade-5" },
    update: {},
    create: {
      slug: "scholarship-grade-5",
      nameSi: "5 ශ්‍රේණිය ශිෂ්‍යත්වය",
      nameEn: "Grade 5 Scholarship",
      nameTa: "தரம் 5 புலமைப்பரிசில்",
      parentId: catEducation.id,
      isFeatured: true,
      sortOrder: 2,
    },
  });

  const catOL = await prisma.category.upsert({
    where: { slug: "ordinary-level" },
    update: {},
    create: {
      slug: "ordinary-level",
      nameSi: "අ.පො.ස. සාමාන්‍ය පෙළ (O/L)",
      nameEn: "G.C.E. Ordinary Level",
      nameTa: "க.பொ.த. சாதாரண தரம்",
      parentId: catEducation.id,
      isFeatured: true,
      sortOrder: 3,
    },
  });

  const catLiterature = await prisma.category.upsert({
    where: { slug: "sinhala-literature" },
    update: {},
    create: {
      slug: "sinhala-literature",
      nameSi: "සිංහල සාහිත්‍ය හා නවකතා",
      nameEn: "Sinhala Literature & Novels",
      nameTa: "சிங்கள இலக்கியம்",
      isFeatured: true,
      sortOrder: 4,
    },
  });

  // 5. Books & Editions
  // Book 1: Grade 5 Scholarship Model Papers
  const book1 = await prisma.book.upsert({
    where: { slug: "scholarship-grade-5-model-papers" },
    update: {},
    create: {
      slug: "scholarship-grade-5-model-papers",
      titleSi: "5 ශ්‍රේණිය ශිෂ්‍යත්ව පෙරහුරු ප්‍රශ්න පත්‍ර",
      titleEn: "Grade 5 Scholarship Model Papers",
      transliterated: "shishyathwaya 5 perahuru prashna pathra",
      language: BookLanguage.SINHALA,
      publishedYear: 2026,
      publisherId: publisher.id,
      isFeatured: true,
      isBestSeller: true,
      synopsisSi: "නව විෂය නිර්දේශයට අනුව සැකසූ ආදර්ශ ප්‍රශ්න පත්‍ර 10ක් සහ සම්පූර්ණ ලකුණු ලබාදීමේ ක්‍රමවේද අඩංගුයි.",
      synopsisEn: "10 comprehensive model examination papers with step-by-step marking schemes aligned with the latest syllabus.",
      authors: {
        create: [{ authorId: authorEditorial.id }],
      },
      categories: {
        create: [{ categoryId: catScholarship.id }],
      },
      sampleConfig: {
        create: {
          sampleType: SampleType.PAGE_RANGE,
          maxPages: 20,
          percentageLimit: 20,
        },
      },
      editions: {
        create: [
          {
            format: BookFormat.PAPERBACK,
            isbn: "978-955-8001-01-2",
            sku: "PDN-SCH-01-PB",
            priceCents: 65000, // Rs. 650.00
            stockQuantity: 250,
            weightGrams: 320,
            pageCount: 160,
          },
          {
            format: BookFormat.EBOOK,
            sku: "PDN-SCH-01-EB",
            priceCents: 35000, // Rs. 350.00
            stockQuantity: 99999,
            isDigital: true,
            pageCount: 160,
          },
          {
            format: BookFormat.BUNDLE,
            sku: "PDN-SCH-01-BDL",
            priceCents: 85000, // Rs. 850.00 (Combo saving)
            stockQuantity: 100,
            weightGrams: 320,
            pageCount: 160,
          },
        ],
      },
    },
  });

  // Book 2: O/L Mathematics Short Notes
  const book2 = await prisma.book.upsert({
    where: { slug: "ol-mathematics-short-notes" },
    update: {},
    create: {
      slug: "ol-mathematics-short-notes",
      titleSi: "සාමාන්‍ය පෙළ ගණිතය කෙටි සටහන් සහ සූත්‍ර සංග්‍රහය",
      titleEn: "O/L Mathematics Short Notes & Formula Book",
      transliterated: "ganithaya 10 11 keti satahan sutra",
      language: BookLanguage.SINHALA,
      publishedYear: 2026,
      publisherId: publisher.id,
      isFeatured: true,
      synopsisSi: "10 සහ 11 ශ්‍රේණිවල සියලුම ගණිත පාඩම් ආවරණය වන පරිදි සැකසූ අත්‍යවශ්‍ය සූත්‍ර සහ කෙටි සටහන්.",
      synopsisEn: "Complete G.C.E. O/L revision manual covering all theorems, formulas, and past paper question models.",
      authors: {
        create: [{ authorId: authorEditorial.id }],
      },
      categories: {
        create: [{ categoryId: catOL.id }],
      },
      sampleConfig: {
        create: {
          sampleType: SampleType.PAGE_RANGE,
          maxPages: 15,
          percentageLimit: 15,
        },
      },
      editions: {
        create: [
          {
            format: BookFormat.PAPERBACK,
            isbn: "978-955-8001-02-9",
            sku: "PDN-OL-MTH-PB",
            priceCents: 85000, // Rs. 850.00
            stockQuantity: 180,
            weightGrams: 280,
            pageCount: 140,
          },
          {
            format: BookFormat.EBOOK,
            sku: "PDN-OL-MTH-EB",
            priceCents: 45000, // Rs. 450.00
            stockQuantity: 99999,
            isDigital: true,
            pageCount: 140,
          },
        ],
      },
    },
  });

  // Book 3: Sinhala Novel
  const book3 = await prisma.book.upsert({
    where: { slug: "hanthana-kadu-pamula" },
    update: {},
    create: {
      slug: "hanthana-kadu-pamula",
      titleSi: "හන්තාන කඳු පාමුල",
      titleEn: "At the Foot of Hanthana Mountains",
      transliterated: "hanthana kadu pamula novel",
      language: BookLanguage.SINHALA,
      publishedYear: 2026,
      publisherId: publisher.id,
      isFeatured: true,
      isAwardWinner: true,
      synopsisSi: "පේරාදෙණිය විශ්වවිද්‍යාලීය ජීවිතය හා බැඳුණු සොඳුරු ආදර කතාවක් සහ තාරුණ්‍යයේ අරගලය විවරණය කරන නවකතාවක්.",
      synopsisEn: "A poignant coming-of-age Sinhala novel set against the scenic backdrop of the University of Peradeniya.",
      authors: {
        create: [{ authorId: authorNovelist.id }],
      },
      categories: {
        create: [{ categoryId: catLiterature.id }],
      },
      sampleConfig: {
        create: {
          sampleType: SampleType.PERCENTAGE,
          percentageLimit: 20,
          allowedChapters: "1,2",
        },
      },
      editions: {
        create: [
          {
            format: BookFormat.PAPERBACK,
            isbn: "978-955-8001-03-6",
            sku: "PDN-NOV-01-PB",
            priceCents: 95000, // Rs. 950.00
            stockQuantity: 120,
            weightGrams: 350,
            pageCount: 280,
          },
          {
            format: BookFormat.HARDCOVER,
            isbn: "978-955-8001-03-HC",
            sku: "PDN-NOV-01-HC",
            priceCents: 140000, // Rs. 1,400.00
            stockQuantity: 40,
            weightGrams: 480,
            pageCount: 280,
          },
          {
            format: BookFormat.EBOOK,
            sku: "PDN-NOV-01-EB",
            priceCents: 49000, // Rs. 490.00
            stockQuantity: 99999,
            isDigital: true,
            pageCount: 280,
          },
        ],
      },
    },
  });

  // 6. Shipping Zones & 25 Districts
  const zone1 = await prisma.shippingZone.create({
    data: {
      name: "Zone 1 — Colombo Metro",
      description: "Colombo City & Immediate Suburbs (1-2 Working Days)",
      districts: ["Colombo"],
      rates: {
        create: [
          { minWeightGrams: 0, maxWeightGrams: 1000, rateCents: 20000 },
          { minWeightGrams: 1001, maxWeightGrams: 3000, rateCents: 30000 },
        ],
      },
    },
  });

  const zone2 = await prisma.shippingZone.create({
    data: {
      name: "Zone 2 — Greater Western Province",
      description: "Gampaha & Kalutara Districts (2-3 Working Days)",
      districts: ["Gampaha", "Kalutara"],
      rates: {
        create: [
          { minWeightGrams: 0, maxWeightGrams: 1000, rateCents: 25000 },
          { minWeightGrams: 1001, maxWeightGrams: 3000, rateCents: 35000 },
        ],
      },
    },
  });

  const zone3 = await prisma.shippingZone.create({
    data: {
      name: "Zone 3 — Major Provincial Hubs",
      description: "Kandy, Galle, Matara, Kurunegala, Ratnapura, Kegalle (2-4 Working Days)",
      districts: ["Kandy", "Galle", "Matara", "Kurunegala", "Ratnapura", "Kegalle"],
      rates: {
        create: [
          { minWeightGrams: 0, maxWeightGrams: 1000, rateCents: 30000 },
          { minWeightGrams: 1001, maxWeightGrams: 3000, rateCents: 42000 },
        ],
      },
    },
  });

  const zone4 = await prisma.shippingZone.create({
    data: {
      name: "Zone 4 — Outstation Districts",
      description: "Northern, Eastern, North-Central & Uva Provinces (3-5 Working Days)",
      districts: [
        "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu",
        "Trincomalee", "Batticaloa", "Ampara", "Anuradhapura", "Polonnaruwa",
        "Badulla", "Monaragala", "Hambantota", "Matale", "Nuwara Eliya", "Puttalam"
      ],
      rates: {
        create: [
          { minWeightGrams: 0, maxWeightGrams: 1000, rateCents: 35000 },
          { minWeightGrams: 1001, maxWeightGrams: 3000, rateCents: 50000 },
        ],
      },
    },
  });

  // 7. System Settings
  await prisma.setting.upsert({
    where: { key: "free_delivery_threshold_cents" },
    update: { value: "350000" },
    create: {
      key: "free_delivery_threshold_cents",
      value: "350000",
      description: "Minimum order subtotal (in cents) for free islandwide shipping (Rs. 3,500.00)",
    },
  });

  await prisma.setting.upsert({
    where: { key: "vat_enabled" },
    update: { value: "false" },
    create: {
      key: "vat_enabled",
      value: "false",
      description: "VAT calculation enabled toggle (exempt for books under 2026/2027 budget rules)",
    },
  });

  await prisma.setting.upsert({
    where: { key: "cod_fee_cents" },
    update: { value: "10000" },
    create: {
      key: "cod_fee_cents",
      value: "10000",
      description: "Convenience surcharge for Cash on Delivery (Rs. 100.00)",
    },
  });

  console.log("✅ Padanama Publications database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
