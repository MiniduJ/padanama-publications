import { NextRequest, NextResponse } from "next/server";
import { getFallbackBooks } from "@/server/catalog/books";

export async function GET(request: NextRequest) {
  const catalog = getFallbackBooks();
  const domain = "https://padanamapublication.lk";

  const xmlItems = catalog.books
    .map((book: any) => {
      const primaryEdition = book.editions?.[0] || {};
      const priceLkr = ((primaryEdition.salePriceCents || primaryEdition.priceCents || 65000) / 100).toFixed(2);
      const isbn = primaryEdition.isbn || "9789558001012";

      return `    <item>
      <g:id>${book.slug}</g:id>
      <g:title><![CDATA[${book.titleSi} | Padanama]]></g:title>
      <g:description><![CDATA[${book.synopsisSi || book.synopsisEn || ""}]]></g:description>
      <g:link>${domain}/en/books/${book.slug}</g:link>
      <g:image_link>${domain}${book.coverImage || "/images/books/placeholder.jpg"}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${priceLkr} LKR</g:price>
      <g:brand>Padanama Publications</g:brand>
      <g:gtin>${isbn.replace(/[^0-9]/g, "")}</g:gtin>
      <g:identifier_exists>true</g:identifier_exists>
      <g:shipping>
        <g:country>LK</g:country>
        <g:service>Domex Courier</g:service>
        <g:price>200.00 LKR</g:price>
      </g:shipping>
    </item>`;
    })
    .join("\n");

  const xmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Padanama Publications Google Shopping Feed</title>
    <link>${domain}</link>
    <description>Google Merchant Center Product Catalog Feed for Sri Lanka</description>
${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(xmlFeed, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=14400",
    },
  });
}
