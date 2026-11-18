import { describe, it, expect } from "vitest";
import { singlishToSinhala } from "@/lib/transliteration";

describe("Singlish to Sinhala Transliteration", () => {
  it("converts single words correctly", () => {
    expect(singlishToSinhala("potha")).toBe("පොත");
    expect(singlishToSinhala("keti")).toBe("කෙටි");
    expect(singlishToSinhala("ganithaya")).toBe("ගණිතය");
  });

  it("converts book title phrases", () => {
    const result = singlishToSinhala("madol duwa");
    expect(result).toBe("මඩොල් දූව");
  });

  it("handles empty or non-alpha input gracefully", () => {
    expect(singlishToSinhala("")).toBe("");
    expect(singlishToSinhala("978-955-8001")).toBe("978-955-8001");
  });
});
