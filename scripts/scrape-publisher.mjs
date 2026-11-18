// Crawls padanamapublication.lk (our own legacy site) → src/data/publisher-catalog.json + public/images/books/*.
// Usage: node scripts/scrape-publisher.mjs [--no-images]
// Polite: sequential requests with a small delay. Re-runnable; cached images are skipped.
import fs from "node:fs";
import path from "node:path";

const BASE = "https://www.padanamapublication.lk/";
const OUT = "src/data/publisher-catalog.json";
const IMG_DIR = "public/images/books";
const UA = { "User-Agent": "Mozilla/5.0 (PadanamaCatalogSync)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const withImages = !process.argv.includes("--no-images");

async function get(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: UA });
      if (r.ok) return await r.text();
    } catch {}
    await sleep(1000 * (i + 1));
  }
  throw new Error(`fetch failed: ${url}`);
}

const decode = (s = "") =>
  s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&zwj;/g, "‍").replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
const field = (html, label) => decode(html.match(new RegExp(`${label}:\\s*<(?:span|a)[^>]*>([\\s\\S]*?)</(?:span|a)>`))?.[1]);
const money = (t) => { const m = (t || "").replace(/,/g, "").match(/(\d+(?:\.\d+)?)/); return m ? Math.round(parseFloat(m[1]) * 100) : null; };
const abs = (src) => new URL(src.replace(/^\.\//, ""), BASE).href;

const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function parseDetail(id, html) {
  const title = decode(html.match(/<h3 class="product-title">([\s\S]*?)<\/h3>/)?.[1]);
  if (!title) return null;
  const imgs = [...html.matchAll(/class="single-slide">\s*<center><img src="([^"]+)"/g)].map((m) => m[1]).filter((u) => !u.includes("book_default"));
  const gallery = [...new Set(imgs.map(abs))];
  const stock = field(html, "Availability");
  const desc = html.match(/id="tab-1"[\s\S]*?<article class="review-article">([\s\S]*?)<\/article>/)?.[1] || "";
  const preview = html.match(/id="tab-2"[\s\S]*?<iframe[^>]+src="([^"]+)"/)?.[1] || null;
  const material = html.match(/id="tab-3"[\s\S]*?<iframe[^>]+src="([^"]+)"/)?.[1] || null;
  const yt = material?.match(/(?:list=[\w-]+|youtu\.be\/[\w-]{11}|watch\?v=[\w-]{11}|embed\/[\w-]{11}$)/) ? material.replace("https://www.youtube.com/embed/https://", "https://") : null;
  const priceNew = money(html.match(/class="price-new">([^<]+)</)?.[1]);
  const priceOld = money(html.match(/class="price-old">([^<]+)</)?.[1]);
  const category = field(html, "Category");
  return {
    id: String(id),
    title,
    author: decode(html.match(/<p class="tag-block"><a[^>]*>([\s\S]*?)<\/a>/)?.[1]) || "Padanama Education Society",
    grade: field(html, "Grade") || null,
    medium: field(html, "Medium") || "Sinhala",
    isbn: (field(html, "ISBN") || "").replace(/[^\dX]/gi, "") || null,
    bookType: field(html, "Book Type") || null,
    category, categorySlug: slugify(category || "other"),
    subCategory: field(html, "Sub Category") || null,
    subject: field(html, "Subject") || null,
    inStock: /in stock/i.test(stock),
    stock: Number(stock.match(/\((\d+)\)/)?.[1] || 0),
    priceCents: priceOld && priceNew && priceOld > priceNew ? priceOld : priceNew,
    salePriceCents: priceOld && priceNew && priceOld > priceNew ? priceNew : null,
    description: decode(desc) || null,
    cover: gallery[0] || null,
    gallery: gallery.slice(1),
    previewUrl: preview && /^https?:\/\//.test(preview) ? preview : null,
    materialsUrl: yt,
  };
}

async function download(url) {
  const name = path.basename(new URL(url).pathname);
  const dest = path.join(IMG_DIR, name);
  if (!fs.existsSync(dest)) {
    const r = await fetch(url, { headers: UA }).catch(() => null);
    if (!r?.ok) return url; // keep remote URL if download fails
    fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
    await sleep(100);
  }
  return `/images/books/${name}`;
}

async function main() {
  const ids = new Set();
  for (let page = 0; page < 200; page++) {
    const html = await get(`${BASE}products.php?page=${page}&id=`);
    const found = [...html.matchAll(/product-details\.php\?id=(\d+)/g)].map((m) => m[1]);
    const before = ids.size;
    found.forEach((x) => ids.add(x));
    process.stdout.write(`page ${page}: +${ids.size - before} (total ${ids.size})\n`);
    if (ids.size === before) break;
    await sleep(250);
  }

  fs.mkdirSync(IMG_DIR, { recursive: true });
  const books = [];
  for (const id of [...ids].sort((a, b) => a - b)) {
    try {
      const b = parseDetail(id, await get(`${BASE}product-details.php?id=${id}`));
      if (!b) continue;
      // Local copies feed scripts/upload-book-images.mjs; the JSON keeps original URLs.
      if (withImages) await Promise.all([b.cover, ...b.gallery].filter(Boolean).map(download));
      books.push(b);
      if (books.length % 25 === 0) process.stdout.write(`details: ${books.length}/${ids.size}\n`);
    } catch (e) {
      console.warn(`skip ${id}: ${e.message}`);
    }
    await sleep(200);
  }
  fs.writeFileSync(OUT, JSON.stringify(books, null, 1));
  console.log(`saved ${books.length} books → ${OUT}`);
}

main();
