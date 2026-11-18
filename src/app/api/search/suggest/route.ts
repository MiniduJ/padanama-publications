import { NextRequest, NextResponse } from "next/server";
import { singlishToSinhala } from "@/lib/transliteration";
import { getBooks } from "@/server/catalog/books";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";

  if (!q) {
    return NextResponse.json({ query: "", suggestions: [] });
  }

  const transliterated = singlishToSinhala(q);
  const { books } = await getBooks({ query: q, limit: 5 });

  const suggestions = books.map((b: any) => ({
    title: b.titleSi,
    titleEn: b.titleEn,
    slug: b.slug,
    author: b.authors?.[0]?.author?.nameSi || "පදනම ප්‍රකාශන",
    priceCents: b.editions?.[0]?.priceCents || 0,
    hasFreeSample: !!b.sampleConfig,
  }));

  return NextResponse.json({
    query: q,
    transliterated: transliterated !== q ? transliterated : null,
    suggestions,
  });
}
