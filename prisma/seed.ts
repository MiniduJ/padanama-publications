import { PrismaClient, BookFormat, BookLanguage, RoleType, SampleType } from "@prisma/client";

import { REAL_PUBLISHER_BOOKS } from "../src/data/publisher-books";
import { DEFAULT_SLIDES, DEFAULT_SOCIAL, DEFAULT_SETTINGS, DEFAULT_REVIEWS, HERO_ALTS_SI, HERO_ALTS_EN } from "../src/data/site-defaults";

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

  // Import the full publisher catalogue (ids match the static fallback so existing carts keep working).
  // Existing rows keep admin edits unless SEED_REFRESH_CATALOG=1.
  const refresh = process.env.SEED_REFRESH_CATALOG === "1";
  const cats = new Map<string, string>();
  const authors = new Map<string, string>();
  const isbns = new Set((await prisma.bookEdition.findMany({ where: { isbn: { not: null } }, select: { isbn: true } })).map((e) => e.isbn));
  // Fast path for repeat deploys: catalogue already loaded and no refresh requested.
  const catalogueLoaded = !refresh && (await prisma.book.count({ where: { id: { startsWith: "pdn-" } } })) >= REAL_PUBLISHER_BOOKS.length;
  for (const b of catalogueLoaded ? [] : REAL_PUBLISHER_BOOKS) {
    if (!cats.has(b.categorySlug)) {
      const c = await prisma.category.upsert({ where: { slug: b.categorySlug }, update: {}, create: { slug: b.categorySlug, nameSi: b.categoryNameSi, nameEn: b.categoryNameSi } });
      cats.set(b.categorySlug, c.id);
    }
    if (!authors.has(b.author)) {
      const slug = b.author.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `author-${authors.size}`;
      const a = await prisma.author.upsert({ where: { slug }, update: {}, create: { slug, nameSi: b.author, nameEn: b.author } });
      authors.set(b.author, a.id);
    }
    // Legacy site reuses some ISBNs across products; the unique column only takes the first.
    const isbn = b.isbn && !isbns.has(b.isbn) ? b.isbn : null;
    if (isbn) isbns.add(isbn);
    const fields = {
      slug: b.slug, titleSi: b.titleSi, titleEn: b.titleEn, transliterated: b.transliterated, language: b.language as BookLanguage,
      coverUrl: b.coverUrl, synopsisSi: b.description, grade: b.grade, subject: b.subject, bookType: b.type,
      galleryUrls: b.gallery, previewUrl: b.previewUrl, materialsUrl: b.materialsUrl, publisherId: publisher.id,
    };
    const exists = await prisma.book.findUnique({ where: { id: b.id }, select: { id: true } });
    if (exists && !refresh) continue;
    if (exists) {
      await prisma.book.update({ where: { id: b.id }, data: fields });
      await prisma.bookEdition.updateMany({ where: { id: `${b.id}-ed-pb` }, data: { priceCents: b.priceCents, salePriceCents: b.salePriceCents, stockQuantity: b.stock, ...(isbn ? { isbn } : {}) } });
      await prisma.bookEdition.updateMany({ where: { id: `${b.id}-ed-eb` }, data: { priceCents: Math.round(b.priceCents * 0.65), salePriceCents: b.salePriceCents ? Math.round(b.salePriceCents * 0.65) : null } });
      await prisma.bookCategory.deleteMany({ where: { bookId: b.id } });
      await prisma.bookCategory.create({ data: { bookId: b.id, categoryId: cats.get(b.categorySlug)! } });
      await prisma.bookAuthor.deleteMany({ where: { bookId: b.id } });
      await prisma.bookAuthor.create({ data: { bookId: b.id, authorId: authors.get(b.author)! } });
      continue;
    }
    await prisma.book.create({
      data: {
        id: b.id, ...fields,
        categories: { create: { categoryId: cats.get(b.categorySlug)! } },
        authors: { create: { authorId: authors.get(b.author)! } },
        sampleConfig: { create: { sampleType: SampleType.PAGE_RANGE, maxPages: 20 } },
        editions: {
          create: [
            { id: `${b.id}-ed-pb`, format: BookFormat.PAPERBACK, sku: `PDN-${b.originalId}-PB`, isbn, priceCents: b.priceCents, salePriceCents: b.salePriceCents, stockQuantity: b.stock },
            { id: `${b.id}-ed-eb`, format: BookFormat.EBOOK, sku: `PDN-${b.originalId}-EB`, isDigital: true, stockQuantity: 99999,
              priceCents: Math.round(b.priceCents * 0.65), salePriceCents: b.salePriceCents ? Math.round(b.salePriceCents * 0.65) : null },
          ],
        },
      },
    });
  }
  console.log(`📚 Catalogue: ${REAL_PUBLISHER_BOOKS.length} books, ${cats.size} categories, ${authors.size} authors`);

  // Site content shown on the storefront → editable in admin (only seeded into empty tables)
  if (!(await prisma.banner.count())) {
    await prisma.banner.createMany({ data: DEFAULT_SLIDES.map((sl, i) => ({ imageUrl: sl.image, linkUrl: sl.href, titleSi: HERO_ALTS_SI[i], titleEn: HERO_ALTS_EN[i], sortOrder: i })) });
  }
  if (!(await prisma.socialPost.count())) {
    await prisma.socialPost.createMany({ data: DEFAULT_SOCIAL.map((p, i) => ({ kind: p.kind, url: p.url, thumbnailUrl: p.thumbnailUrl ?? null, caption: p.caption ?? null, sortOrder: i })) });
  }
  if (!(await prisma.testimonial.count())) {
    await prisma.testimonial.createMany({ data: DEFAULT_REVIEWS.map((r, i) => ({ name: r.name, location: r.location, rating: r.rating, comment: r.title ? `${r.title}

${r.comment}` : r.comment, likes: r.helpfulCount, sortOrder: i })) });
  }
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value, description: "Shown on storefront" } });
  }
  console.log("🖼️  Site content: hero slides, social feed, reviews, contact settings");

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
