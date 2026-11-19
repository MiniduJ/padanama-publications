// Uploads every catalogue image (from the local scrape cache public/images/books) to Supabase Storage
// bucket "media" (public, created if missing) and rewrites src/data/publisher-catalog.json to the storage URLs.
// The next deploy's seed syncs those URLs into the database. Safe to re-run (upsert).
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.   Usage: node --env-file=.env scripts/upload-book-images.mjs
import fs from "node:fs";
import path from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
const DIR = "public/images/books", JSON_PATH = "src/data/publisher-catalog.json";
const PUBLIC = `${url}/storage/v1/object/public/media/books/`;
const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif" };
const auth = key.startsWith("sb_") ? { apikey: key } : { Authorization: `Bearer ${key}`, apikey: key }; // new sb_secret_ keys are not JWTs

// Bucket (an "already exists" error is fine)
await fetch(`${url}/storage/v1/bucket`, { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify({ id: "media", name: "media", public: true }) });

const books = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
const base = (u) => path.basename(new URL(u).pathname);
const uploaded = new Set();
const todo = [...new Set(books.flatMap((b) => [b.cover, ...b.gallery]).filter(Boolean).map(base))].filter((n) => TYPES[path.extname(n).toLowerCase()] && fs.existsSync(path.join(DIR, n))); // images only
let failed = 0;
for (let i = 0; i < todo.length; i += 8) {
  await Promise.all(todo.slice(i, i + 8).map(async (n) => {
    const r = await fetch(`${url}/storage/v1/object/media/books/${encodeURIComponent(n)}`, {
      method: "POST",
      headers: { ...auth, "Content-Type": TYPES[path.extname(n).toLowerCase()] || "application/octet-stream", "x-upsert": "true", "Cache-Control": "max-age=31536000" },
      body: fs.readFileSync(path.join(DIR, n)),
    }).catch(() => null);
    if (r?.ok) uploaded.add(n);
    else { failed++; console.warn(`fail ${n}: ${r?.status} ${await r?.text().catch(() => "")}`); }
  }));
  if (i % 400 === 0) console.log(`${uploaded.size}/${todo.length}`);
}
const swap = (u) => (u && uploaded.has(base(u)) ? PUBLIC + base(u) : u);
for (const b of books) { b.cover = swap(b.cover); b.gallery = b.gallery.map(swap); }
fs.writeFileSync(JSON_PATH, JSON.stringify(books));
console.log(`uploaded ${uploaded.size}, failed ${failed}; catalogue now points at ${PUBLIC}`);
