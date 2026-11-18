import { MetadataRoute } from "next";
import { getFallbackBooks } from "@/server/catalog/books";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://padanamapublication.lk";
  const locales = ["si", "en", "ta"];

  const staticRoutes = [
    "",
    "/books",
    "/library",
    "/authors",
    "/book-fair",
    "/about",
    "/contact",
    "/faq",
    "/shipping-delivery",
    "/returns-refunds",
    "/wholesale",
    "/terms",
    "/privacy",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static routes for each locale with hreflang alternates
  for (const route of staticRoutes) {
    for (const locale of locales) {
      const url = `${baseUrl}/${locale}${route}`;
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === "" || route === "/books" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route === "/books" || route === "/library" ? 0.9 : 0.7,
        alternates: {
          languages: {
            si: `${baseUrl}/si${route}`,
            en: `${baseUrl}/en${route}`,
            ta: `${baseUrl}/ta${route}`,
          },
        },
      });
    }
  }

  // 2. Book detail routes
  const catalog = getFallbackBooks();
  for (const book of catalog.books) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/books/${book.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            si: `${baseUrl}/si/books/${book.slug}`,
            en: `${baseUrl}/en/books/${book.slug}`,
            ta: `${baseUrl}/ta/books/${book.slug}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
