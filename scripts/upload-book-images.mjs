// Moves book images (downloaded by scrape-publisher.mjs into public/images/books) to Supabase Storage
// and points Book.coverUrl / Book.galleryUrls at the storage copies. Safe to re-run.
// Needs: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL; public bucket "media".
// Usage: node --env-file=.env scripts/upload-book-images.mjs
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
const DIR = "public/images/books";
const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif" };
const db = new PrismaClient();
const done = new Map();

async function toStorage(src) {
  if (!src || src.includes("/storage/v1/object/public/")) return src;
  const name = path.basename(new URL(src, "https://x").pathname);
  if (done.has(name)) return done.get(name);
  const local = path.join(DIR, name);
  const body = fs.existsSync(local) ? fs.readFileSync(local) : Buffer.from(await (await fetch(src)).arrayBuffer());
  const r = await fetch(`${url}/storage/v1/object/media/books/${name}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": TYPES[path.extname(name).toLowerCase()] || "application/octet-stream", "x-upsert": "true" },
    body,
  });
  if (!r.ok) throw new Error(`${name}: ${r.status} ${await r.text()}`);
  const out = `${url}/storage/v1/object/public/media/books/${name}`;
  done.set(name, out);
  return out;
}

const books = await db.book.findMany({ select: { id: true, coverUrl: true, galleryUrls: true } });
let n = 0;
for (const b of books) {
  try {
    const coverUrl = await toStorage(b.coverUrl);
    const galleryUrls = await Promise.all(b.galleryUrls.map(toStorage));
    await db.book.update({ where: { id: b.id }, data: { coverUrl, galleryUrls } });
    if (++n % 50 === 0) console.log(`${n}/${books.length}`);
  } catch (e) {
    console.warn(`skip ${b.id}: ${e.message}`);
  }
}
console.log(`done: ${n} books, ${done.size} images`);
await db.$disconnect();
