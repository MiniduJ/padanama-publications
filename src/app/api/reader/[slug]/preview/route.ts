import { NextRequest, NextResponse } from "next/server";
import { getReaderBookContent } from "@/server/reader/sample-data";
import { db } from "@/server/db";
import { currentCustomer } from "@/server/account/customer";

// Sample preview for everyone; signed-in customers who own the e-book get every page and a personal watermark.
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getReaderBookContent(slug);
  try {
    const book = await db.book.findFirst({
      where: { OR: [{ slug }, { id: slug }], isDeleted: false },
      include: { sampleConfig: true, editions: { where: { isDeleted: false } } },
    });
    if (book) {
      await db.book.update({ where: { id: book.id }, data: { readCount: { increment: 1 } } });
      const pb = book.editions.find((e) => !e.isDigital), eb = book.editions.find((e) => e.isDigital);
      const customer = await currentCustomer(req).catch(() => null);
      const owned = !!customer && !!(await db.entitlement.findFirst({ where: { userId: customer.id, bookId: book.id, isActive: true } }));
      const max = owned ? undefined : book.sampleConfig?.maxPages || undefined;
      if (owned) Object.assign(data, { isEntitled: true, watermark: `Padanama • ${customer!.name || customer!.phoneNumber}` });
      Object.assign(data, {
        bookId: book.id,
        titleSi: book.titleSi,
        titleEn: book.titleEn,
        coverImage: book.coverUrl || data.coverImage,
        pageImages: (book.sampleConfig?.samplePageUrls || []).slice(0, max),
        totalPages: pb?.pageCount || data.totalPages,
        paperbackPriceCents: pb ? pb.salePriceCents ?? pb.priceCents : data.paperbackPriceCents,
        ebookPriceCents: eb ? eb.salePriceCents ?? eb.priceCents : data.ebookPriceCents,
      });
    }
  } catch {
    // DB unavailable: serve static sample
  }
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
