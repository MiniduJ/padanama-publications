// End-to-end checks of real route handlers against a live database.
// Run: INTEGRATION_DB=1 DATABASE_URL=postgresql://... AUTH_SECRET=... npx vitest run tests/integration
import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";

const run = process.env.INTEGRATION_DB === "1";

describe.skipIf(!run)("database integration", () => {
  let cookie = "";
  const req = (url: string, init: any = {}) =>
    new NextRequest(`http://localhost${url}`, { ...init, headers: { "content-type": "application/json", host: "localhost", cookie, ...(init.headers || {}) } });
  const ctx = (params: any) => ({ params: Promise.resolve(params) });

  beforeAll(async () => {
    const { signAdminSession, ADMIN_COOKIE } = await import("@/server/auth/admin-session");
    cookie = `${ADMIN_COOKIE}=${await signAdminSession({ uid: "env-super-admin", email: "qa@test.lk", role: "SUPER_ADMIN" })}`;
  });

  it("rejects admin API without a valid session", async () => {
    const { GET } = await import("@/app/api/admin/[resource]/route");
    const saved = cookie; cookie = "padanama_admin_token=forged";
    const r = await GET(req("/api/admin/books"), ctx({ resource: "books" }));
    cookie = saved;
    expect(r.status).toBe(401);
  });

  it("lists the seeded catalogue and edits a book with sample pages", async () => {
    const { GET } = await import("@/app/api/admin/[resource]/route");
    const { PATCH } = await import("@/app/api/admin/[resource]/[id]/route");
    const list = await (await GET(req("/api/admin/books?q=382"), ctx({ resource: "books" }))).json();
    expect(list.total).toBeGreaterThan(0);
    const book = list.rows.find((r: any) => r.slug === "382");
    const upd = await PATCH(req(`/api/admin/books/${book.id}`, { method: "PATCH", body: JSON.stringify({ priceCents: 99900, salePriceCents: null, samplePageUrls: ["https://x.test/p1.jpg", "https://x.test/p2.jpg"], maxPages: 10 }) }), ctx({ resource: "books", id: book.id }));
    const saved = await upd.json();
    expect(upd.status).toBe(200);
    expect(saved.priceCents).toBe(99900);
    expect(saved.samplePageUrls).toHaveLength(2);
  });

  it("lists items with photos first, across page boundaries, without gaps or repeats", async () => {
    const { getBooks } = await import("@/server/catalog/books");
    const { db } = await import("@/server/db");
    const withPhoto = await db.book.count({ where: { isDeleted: false, coverUrl: { not: null } } });
    const limit = 12, boundary = Math.floor(withPhoto / limit) + 1; // page that holds the last photo items and the first placeholders
    const seen: any[] = [];
    for (const page of [1, boundary, boundary + 1]) {
      const { books, pagination } = await getBooks({ page, limit });
      expect(books).toHaveLength(limit);
      expect(pagination.total).toBeGreaterThan(withPhoto);
      seen.push(...books.map((b: any, i: number) => ({ id: b.id, photo: !!b.coverUrl, pos: (page - 1) * limit + i })));
    }
    for (const s of seen) expect(s.photo).toBe(s.pos < withPhoto);
    expect(new Set(seen.map((s) => s.id)).size).toBe(seen.length);
  });

  it("reader preview serves admin pages and counts reads", async () => {
    const { GET } = await import("@/app/api/reader/[slug]/preview/route");
    const d = await (await GET(req("/api/reader/382/preview"), ctx({ slug: "382" }))).json();
    expect(d.pageImages).toHaveLength(2);
    expect(d.paperbackPriceCents).toBe(99900);
    const { db } = await import("@/server/db");
    expect((await db.book.findUnique({ where: { slug: "382" } }))!.readCount).toBeGreaterThan(0);
  });

  it("checkout stores order with DB prices + courier, visible in admin", async () => {
    const { POST } = await import("@/app/api/orders/create/route");
    const r = await POST(req("/api/orders/create", { method: "POST", body: JSON.stringify({
      contact: { firstName: "QA", lastName: "Tester", phone: "0771234567" },
      shippingAddress: { street1: "1 Test Rd", city: "Kandy", district: "Kandy" },
      deliveryMethod: "COURIER", courier: "DOMEX", paymentMethod: "CASH_ON_DELIVERY",
      items: [{ bookId: "pdn-382", format: "PAPERBACK", quantity: 2, priceCents: 1 }], // tampered price ignored
    }) }));
    const o = await r.json();
    expect(r.status).toBe(200);
    expect(o.totalCents).toBe(99900 * 2 + 30000 + 10000);
    const { GET } = await import("@/app/api/admin/[resource]/route");
    const list = await (await GET(req(`/api/admin/orders?q=${o.orderNumber}`), ctx({ resource: "orders" }))).json();
    expect(list.rows[0].deliveryCourier).toBe("DOMEX");
    expect(list.rows[0].itemsSummary).toContain("× 2");
  });

  it("order status update writes history + shipment", async () => {
    const { db } = await import("@/server/db");
    const order = await db.order.findFirstOrThrow({ where: { customerName: "QA Tester" }, orderBy: { createdAt: "desc" } });
    const { PATCH } = await import("@/app/api/admin/[resource]/[id]/route");
    const r = await PATCH(req(`/api/admin/orders/${order.id}`, { method: "PATCH", body: JSON.stringify({ status: "SHIPPED", trackingNumber: "DMX123" }) }), ctx({ resource: "orders", id: order.id }));
    expect(r.status).toBe(200);
    expect(await db.shipment.count({ where: { orderId: order.id, trackingNumber: "DMX123" } })).toBe(1);
    expect(await db.orderStatusHistory.count({ where: { orderId: order.id, status: "SHIPPED" } })).toBe(1);
  });

  it("contact form lands in admin inbox; content CRUD + stats work", async () => {
    const contact = await import("@/app/api/contact/route");
    expect((await contact.POST(req("/api/contact", { method: "POST", body: JSON.stringify({ name: "Parent", phone: "0712345678", message: "Grade 5 books?" }) }))).status).toBe(200);
    const { POST, GET } = await import("@/app/api/admin/[resource]/route");
    expect((await POST(req("/api/admin/banners", { method: "POST", body: JSON.stringify({ imageUrl: "https://x.test/b.jpg", titleSi: "ස", titleEn: "S", sortOrder: 1, isActive: true }) }), ctx({ resource: "banners" }))).status).toBe(200);
    expect((await POST(req("/api/admin/expenses", { method: "POST", body: JSON.stringify({ date: "2026-11-18", category: "PRINTING", description: "QA print run", amountCents: 50000 }) }), ctx({ resource: "expenses" }))).status).toBe(200);
    const inbox = await (await GET(req("/api/admin/messages"), ctx({ resource: "messages" }))).json();
    expect(inbox.rows.some((m: any) => m.name === "Parent")).toBe(true);
    const stats = await import("@/app/api/admin/stats/route");
    const s = await (await stats.GET(req("/api/admin/stats"), ctx({}))).json();
    expect(s.revenue30dCents).toBeGreaterThan(0);
    expect(s.expenses30dCents).toBeGreaterThanOrEqual(50000);
  });

  it("staff account can log in; wrong password rejected", async () => {
    const { POST } = await import("@/app/api/admin/[resource]/route");
    const email = `editor${Date.now()}@test.lk`;
    expect((await POST(req("/api/admin/staff", { method: "POST", body: JSON.stringify({ name: "Ed", email, role: "EDITOR", password: "a-long-password-123", isActive: true }) }), ctx({ resource: "staff" }))).status).toBe(200);
    const login = await import("@/app/api/admin/login/route");
    expect((await login.POST(req("/api/admin/login", { method: "POST", body: JSON.stringify({ email, password: "a-long-password-123" }) }))).status).toBe(200);
    expect((await login.POST(req("/api/admin/login", { method: "POST", headers: { "x-forwarded-for": "9.9.9.9" }, body: JSON.stringify({ email, password: "wrong" }) }))).status).toBe(401);
  });

  it("customer register -> account shows real details + linked order; admin cookie can't be reused", async () => {
    const reg = await import("@/app/api/account/register/route");
    const phone = `07${String(Date.now()).slice(-8)}`;
    const r = await reg.POST(req("/api/account/register", { method: "POST", body: JSON.stringify({ name: "Nimal Perera", phone, email: `n${Date.now()}@test.lk`, password: "password123" }) }));
    expect(r.status).toBe(200);
    const custCookie = r.headers.get("set-cookie")!.split(";")[0];
    const saved = cookie; cookie = custCookie;
    const order = await import("@/app/api/orders/create/route");
    const o = await (await order.POST(req("/api/orders/create", { method: "POST", body: JSON.stringify({
      contact: { firstName: "Nimal", phone }, shippingAddress: { street1: "x", city: "Galle", district: "Galle" },
      deliveryMethod: "COURIER", courier: "KOOMBIYO", paymentMethod: "CASH_ON_DELIVERY", items: [{ bookId: "pdn-382", format: "PAPERBACK", quantity: 1 }],
    }) }))).json();
    const me = await import("@/app/api/account/me/route");
    const d = await (await me.GET(req("/api/account/me"))).json();
    expect(d.user.name).toBe("Nimal Perera");
    expect(d.orders[0].orderNumber).toBe(o.orderNumber);
    // customer token placed in the admin cookie must be rejected
    const { GET } = await import("@/app/api/admin/[resource]/route");
    cookie = `padanama_admin_token=${custCookie.split("=")[1]}`;
    expect((await GET(req("/api/admin/books"), ctx({ resource: "books" }))).status).toBe(401);
    cookie = saved;
  });
});
