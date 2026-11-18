import { describe, it, expect } from "vitest";
import { getReaderBookContent } from "@/server/reader/sample-data";

describe("Phase 6: Free-Sample Reader & DRM Engine", () => {
  it("retrieves sample reader content for valid book slug", () => {
    const data = getReaderBookContent("scholarship-grade-5-model-papers");

    expect(data.slug).toBe("scholarship-grade-5-model-papers");
    expect(data.titleSi).toContain("5 ශ්‍රේණිය ශිෂ්‍යත්ව");
    expect(data.pages.length).toBeGreaterThan(0);
    expect(data.sampleMaxPages).toBe(20);
    expect(data.totalPages).toBe(160);
    expect(data.isEntitled).toBe(false);
  });

  it("stamps public preview watermark on unentitled sample reads", () => {
    const data = getReaderBookContent("scholarship-grade-5-model-papers", {
      isEntitled: false,
    });

    expect(data.watermark).toContain("පදනම නොමිලේ සාම්පල පෙරදසුන");
    expect(data.watermark).toContain("padanamapublication.lk");
  });

  it("stamps customized customer license watermark on entitled reads", () => {
    const data = getReaderBookContent("scholarship-grade-5-model-papers", {
      isEntitled: true,
      userIdentifier: "Nimal Gunawardena (Order PDN-2026-100245)",
    });

    expect(data.isEntitled).toBe(true);
    expect(data.watermark).toContain("Padanama Official Edition");
    expect(data.watermark).toContain("Nimal Gunawardena");
  });

  it("provides paywall pricing with integer cents for both digital e-book and print", () => {
    const data = getReaderBookContent("ol-mathematics-short-notes");

    expect(data.ebookPriceCents).toBeGreaterThan(0);
    expect(data.paperbackPriceCents).toBeGreaterThan(data.ebookPriceCents);
    expect(data.ebookPriceCents % 1).toBe(0); // strict integer
    expect(data.paperbackPriceCents % 1).toBe(0); // strict integer
  });

  it("contains structured table of contents chapters aligned with page numbers", () => {
    const data = getReaderBookContent("scholarship-grade-5-model-papers");

    expect(data.chapters.length).toBeGreaterThanOrEqual(2);
    expect(data.chapters[0].startPage).toBe(1);
    expect(data.chapters[1].startPage).toBeGreaterThan(data.chapters[0].startPage);
  });
});
