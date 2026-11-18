import { NextRequest, NextResponse } from "next/server";
import { getFallbackBooks } from "@/server/catalog/books";

export async function GET(request: NextRequest) {
  const catalog = getFallbackBooks();
  const domain = "https://padanamapublication.lk";

  const xmlItems = catalog.books
    .map((book: any) => {
      const primaryEdition = book.editions?.[0] || {};
      const priceLkr = ((primaryEdition.salePriceCents || primaryEdition.priceCents || 65000) / 100).toFixed(2);
      const authorName = book.authors?.[0]?.author?.nameSi || "Padanama Publications";

      return `    <item>
      <g:id>${book.slug}</g:id>
      <g:title><![CDATA[${book.titleSi} - ${book.titleEn}]]></g:title>
      <g:description><![CDATA[${book.synopsisSi || book.synopsisEn || ""}]]></g:description>
      <g:link>${domain}/si/books/${book.slug}</g:link>
      <g:image_link>${domain}${book.coverImage || "/images/books/placeholder.jpg"}</g:image_link>
      <g:brand>Padanama Publications</g:brand>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${priceLkr} LKR</g:price>
      <g:google_product_category>Media &gt; Books &gt; Print Books</g:google_product_category>
      <g:author><![CDATA[${authorName}]]></g:author>
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Padanama Publications - Official Meta Product Feed</title>
    <link>${domain}</link>
    <description>Trilingual educational and literature catalogue for Facebook and Instagram Shops</description>
${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=14400",
    },
  });
}
