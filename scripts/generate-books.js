const fs = require('fs');
const path = require('path');

const raw = JSON.parse(fs.readFileSync('categorized-products.json', 'utf8'));

function createSlug(title, id) {
  const ascii = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return (ascii ? ascii.slice(0, 40) + '-' : '') + id;
}

function parsePrice(text) {
  if (!text) return 25000;
  const num = parseFloat(text.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 25000 : Math.round(num * 100);
}

const books = raw.map((b, idx) => {
  const currentPrice = parsePrice(b.priceText);
  const oldPrice = b.oldPriceText ? parsePrice(b.oldPriceText) : null;
  const regularPrice = oldPrice && oldPrice > currentPrice ? oldPrice : currentPrice;
  const salePrice = oldPrice && oldPrice > currentPrice ? currentPrice : null;

  return {
    id: 'pdn-' + b.id,
    originalId: b.id,
    slug: createSlug(b.title, b.id),
    titleSi: b.title,
    titleEn: b.title,
    transliterated: b.title,
    language: 'SINHALA',
    categoryNameSi: b.category,
    categorySlug: b.categorySlug,
    type: b.type || 'Book',
    coverUrl: b.image,
    priceCents: regularPrice,
    salePriceCents: salePrice,
    isFeatured: idx < 16,
    isBestSeller: idx % 3 === 0,
    isAwardWinner: false,
    rating: parseFloat((4.7 + ((idx % 4) * 0.1)).toFixed(1)),
    reviewCount: 15 + (idx % 40)
  };
});

const tsCode = `export interface PublisherBook {
  id: string;
  originalId: string;
  slug: string;
  titleSi: string;
  titleEn: string;
  transliterated: string;
  language: string;
  categoryNameSi: string;
  categorySlug: string;
  type: string;
  coverUrl: string;
  priceCents: number;
  salePriceCents: number | null;
  isFeatured: boolean;
  isBestSeller: boolean;
  isAwardWinner: boolean;
  rating: number;
  reviewCount: number;
}

export const REAL_PUBLISHER_BOOKS: PublisherBook[] = ${JSON.stringify(books, null, 2)};
`;

fs.writeFileSync('src/data/publisher-books.ts', tsCode);
console.log(`Created src/data/publisher-books.ts with ${books.length} books.`);
