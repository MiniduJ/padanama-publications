import { adminRoute } from "@/server/admin/guard";
import { HttpError } from "@/server/admin/handlers";
import { randomUUID } from "crypto";

const MAX = 8 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "application/pdf": "pdf" };

// Stores files in Supabase Storage (public bucket "media"). Needs SUPABASE_SERVICE_ROLE_KEY server-side.
export const POST = adminRoute(() => null, async (req) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new HttpError(503, "Uploads not configured: set SUPABASE_SERVICE_ROLE_KEY");
  const file = (await req.formData()).get("file");
  if (!(file instanceof File)) throw new HttpError(400, "No file");
  if (file.size > MAX) throw new HttpError(413, "File larger than 8 MB");
  const ext = TYPES[file.type];
  if (!ext) throw new HttpError(415, "Only JPG, PNG, WEBP, GIF or PDF");
  const path = `${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${ext}`;
  const up = await fetch(`${url}/storage/v1/object/media/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": file.type, "x-upsert": "false" },
    body: Buffer.from(await file.arrayBuffer()),
  });
  if (!up.ok) throw new HttpError(502, `Storage error: ${await up.text()}`);
  return { url: `${url}/storage/v1/object/public/media/${path}` };
});
