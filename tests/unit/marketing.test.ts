import { describe, it, expect } from "vitest";
import { NotificationEngine } from "@/server/notifications/notifications";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("Phase 8: Marketing, Notifications, SEO & Social Feeds", () => {
  it("orchestrates customer notification messages with proper Sri Lankan context", async () => {
    const engine = new NotificationEngine();

    const orderSuccess = await engine.notifyOrderPlaced({
      orderNumber: "PDN-2026-000412",
      customerName: "Sunil Shantha",
      phone: "94718008533",
      totalCents: 245000,
      paymentMethod: "CASH_ON_DELIVERY",
      deliveryCity: "Kottawa",
    });

    expect(orderSuccess).toBe(true);

    const dispatchSuccess = await engine.notifyCourierDispatched({
      orderNumber: "PDN-2026-000412",
      customerName: "Sunil Shantha",
      phone: "94718008533",
      courierName: "Domex Courier",
      waybillNumber: "DMX-LK-7749102",
      trackingUrl: "https://domex.lk/tracking?wb=DMX-LK-7749102",
    });

    expect(dispatchSuccess).toBe(true);
  });

  it("generates trilingual sitemap entries with hreflang alternate tags", () => {
    const entries = sitemap();

    expect(entries.length).toBeGreaterThanOrEqual(39); // 13 static routes * 3 locales
    const homeSi = entries.find((e) => e.url === "https://padanamapublication.lk/si");
    expect(homeSi).toBeDefined();
    expect(homeSi?.priority).toBe(1.0);
    expect(homeSi?.alternates?.languages?.en).toBe("https://padanamapublication.lk/en");
    expect(homeSi?.alternates?.languages?.ta).toBe("https://padanamapublication.lk/ta");
  });

  it("configures robots.txt disallowing admin and account private directories", () => {
    const robotRules = robots();

    expect(robotRules.sitemap).toBe("https://padanamapublication.lk/sitemap.xml");
    const rules = Array.isArray(robotRules.rules) ? robotRules.rules[0] : robotRules.rules;
    expect(rules.disallow).toContain("/admin/");
    expect(rules.disallow).toContain("/account/");
    expect(rules.disallow).toContain("/api/");
  });
});
