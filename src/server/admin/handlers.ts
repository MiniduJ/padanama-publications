import { db } from "@/server/db";
import { hashPassword } from "@/server/auth/auth";
import { RESOURCES, type ResourceDef } from "@/lib/admin-resources";
import type { AdminSession } from "@/server/auth/admin-session";

const PAGE = 25;

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/** Keep only writable, declared fields and coerce them to DB types. */
export function coerce(def: ResourceDef, body: Record<string, any>, partial: boolean) {
  const out: Record<string, any> = {};
  for (const f of def.fields) {
    if (f.type === "readonly" || f.type === "password") continue;
    if (!(f.name in body)) {
      if (!partial && f.required) throw new HttpError(400, `${f.label} is required`);
      continue;
    }
    const v = body[f.name];
    const empty = v === "" || v === null || v === undefined;
    if (f.required && empty) throw new HttpError(400, `${f.label} is required`);
    switch (f.type) {
      case "number":
      case "money":
        out[f.name] = empty ? null : Math.round(Number(v));
        if (out[f.name] !== null && !Number.isFinite(out[f.name])) throw new HttpError(400, `${f.label} must be a number`);
        break;
      case "bool": out[f.name] = Boolean(v); break;
      case "date": out[f.name] = empty ? null : new Date(v); break;
      case "images": out[f.name] = Array.isArray(v) ? v.filter((x) => typeof x === "string" && x) : []; break;
      case "select":
        if (!empty && f.options && !f.options.includes(v)) throw new HttpError(400, `Invalid ${f.label}`);
        out[f.name] = empty ? null : String(v);
        break;
      default: out[f.name] = empty ? null : String(v).trim();
    }
  }
  return out;
}

async function audit(s: AdminSession, action: string, resource: string, resourceId: string | null, after?: unknown) {
  await db.auditLog.create({
    data: {
      userId: s.uid.startsWith("env-") ? null : s.uid,
      action, resource, resourceId,
      afterData: after ? JSON.stringify(after).slice(0, 10000) : null,
    },
  }).catch(() => {});
}

// ---------- simple model mapping ----------
const SIMPLE: Record<string, { model: string; search: string[]; orderBy: any; where?: any }> = {
  categories: { model: "category", search: ["nameSi", "nameEn", "slug"], orderBy: { sortOrder: "asc" }, where: { isDeleted: false } },
  banners: { model: "banner", search: ["titleSi", "titleEn"], orderBy: { sortOrder: "asc" } },
  testimonials: { model: "testimonial", search: ["name", "comment", "location"], orderBy: { sortOrder: "asc" } },
  social: { model: "socialPost", search: ["url", "caption"], orderBy: { sortOrder: "asc" } },
  expenses: { model: "expense", search: ["description", "category"], orderBy: { date: "desc" } },
  messages: { model: "contactMessage", search: ["name", "phone", "subject", "message"], orderBy: { createdAt: "desc" } },
};

function searchWhere(fields: string[], q?: string) {
  return q ? { OR: fields.map((f) => ({ [f]: { contains: q, mode: "insensitive" } })) } : {};
}

// ---------- books (flattened: book + first paperback edition + category + sample config) ----------
const bookInclude = {
  editions: { where: { isDeleted: false }, orderBy: { createdAt: "asc" as const } },
  categories: { include: { category: true } },
  sampleConfig: true,
};

function bookRow(b: any) {
  const ed = b.editions?.find((e: any) => !e.isDigital) || b.editions?.[0] || {};
  return {
    id: b.id, productType: b.productType, coverUrl: b.coverUrl, titleSi: b.titleSi, titleEn: b.titleEn, slug: b.slug,
    categorySlug: b.categories?.[0]?.category?.slug ?? null,
    priceCents: ed.priceCents ?? null, salePriceCents: ed.salePriceCents ?? null,
    stockQuantity: ed.stockQuantity ?? null, pageCount: ed.pageCount ?? null, isbn: ed.isbn ?? null,
    synopsisSi: b.synopsisSi, synopsisEn: b.synopsisEn, isFeatured: b.isFeatured, isBestSeller: b.isBestSeller,
    grade: b.grade, subject: b.subject, bookType: b.bookType, galleryUrls: b.galleryUrls ?? [], previewUrl: b.previewUrl, materialsUrl: b.materialsUrl,
    samplePageUrls: b.sampleConfig?.samplePageUrls ?? [], maxPages: b.sampleConfig?.maxPages ?? null,
    readCount: b.readCount,
  };
}

async function writeBook(id: string | null, d: Record<string, any>) {
  const book = { titleSi: d.titleSi, titleEn: d.titleEn, slug: d.slug, coverUrl: d.coverUrl, synopsisSi: d.synopsisSi, synopsisEn: d.synopsisEn, isFeatured: d.isFeatured, isBestSeller: d.isBestSeller, productType: d.productType, grade: d.grade, subject: d.subject, bookType: d.bookType, galleryUrls: d.galleryUrls, previewUrl: d.previewUrl, materialsUrl: d.materialsUrl };
  Object.keys(book).forEach((k) => (book as any)[k] === undefined && delete (book as any)[k]);
  return db.$transaction(async (tx) => {
    const saved = id ? await tx.book.update({ where: { id }, data: book }) : await tx.book.create({ data: book as any });
    const ed = { priceCents: d.priceCents, salePriceCents: d.salePriceCents, stockQuantity: d.stockQuantity, pageCount: d.pageCount, isbn: d.isbn };
    Object.keys(ed).forEach((k) => (ed as any)[k] === undefined && delete (ed as any)[k]);
    const existing = await tx.bookEdition.findFirst({ where: { bookId: saved.id, isDigital: false, isDeleted: false } });
    if (existing) await tx.bookEdition.update({ where: { id: existing.id }, data: ed });
    else await tx.bookEdition.create({ data: { ...ed, priceCents: ed.priceCents ?? 0, bookId: saved.id, format: "PAPERBACK", sku: `PDN-${saved.slug}-PB` } as any });
    if (d.productType && d.productType !== "BOOK") {
      await tx.bookEdition.updateMany({ where: { bookId: saved.id, isDigital: true }, data: { isDeleted: true, isActive: false } });
      await tx.sampleConfig.deleteMany({ where: { bookId: saved.id } });
    }
    if (d.categorySlug !== undefined) {
      await tx.bookCategory.deleteMany({ where: { bookId: saved.id } });
      const cat = d.categorySlug && (await tx.category.findUnique({ where: { slug: d.categorySlug } }));
      if (cat) await tx.bookCategory.create({ data: { bookId: saved.id, categoryId: cat.id } });
    }
    if (d.samplePageUrls !== undefined || d.maxPages !== undefined) {
      const sc = { samplePageUrls: d.samplePageUrls ?? undefined, maxPages: d.maxPages ?? undefined, sampleType: "PAGE_RANGE" as const };
      await tx.sampleConfig.upsert({ where: { bookId: saved.id }, create: { bookId: saved.id, ...sc }, update: sc });
    }
    return tx.book.findUniqueOrThrow({ where: { id: saved.id }, include: bookInclude });
  });
}

// ---------- orders ----------
function orderRow(o: any) {
  return {
    ...o,
    createdAt: o.createdAt?.toISOString?.() ?? o.createdAt,
    itemsSummary: o.items?.map((i: any) => `${i.title} × ${i.quantity}`).join(", ") || "",
  };
}

// ---------- public API ----------
export async function listResource(key: string, q: { q?: string; page?: number; filters?: Record<string, string>; all?: boolean }) {
  const page = Math.max(1, q.page || 1);
  const take = q.all ? 500 : PAGE;
  const skip = q.all ? 0 : (page - 1) * PAGE;
  const filters = Object.fromEntries(Object.entries(q.filters || {}).filter(([k, v]) => v && RESOURCES[key]?.filters?.some((f) => f.name === k && f.options.includes(v))));

  if (key === "books") {
    const where: any = { isDeleted: false, ...filters, ...searchWhere(["titleSi", "titleEn", "slug"], q.q) };
    if (where.productType === "SCHOOL_MATERIALS") where.productType = { in: ["STATIONERY", "LEARNING_AID"] };
    const [rows, total] = await Promise.all([db.book.findMany({ where, include: bookInclude, orderBy: { updatedAt: "desc" }, skip, take }), db.book.count({ where })]);
    return { rows: rows.map(bookRow), total, pageSize: take };
  }
  if (key === "orders") {
    const where: any = { ...filters, ...searchWhere(["orderNumber", "customerName", "guestPhone", "trackingNumber"], q.q) };
    const [rows, total] = await Promise.all([db.order.findMany({ where, include: { items: true }, orderBy: { createdAt: "desc" }, skip, take }), db.order.count({ where })]);
    return { rows: rows.map(orderRow), total, pageSize: take };
  }
  if (key === "staff") {
    const where: any = { role: { not: "CUSTOMER" }, isDeleted: false, ...searchWhere(["name", "email"], q.q) };
    const [rows, total] = await Promise.all([
      db.user.findMany({ where, select: { id: true, name: true, email: true, phoneNumber: true, role: true, isActive: true }, orderBy: { createdAt: "asc" }, skip, take }),
      db.user.count({ where }),
    ]);
    return { rows, total, pageSize: take };
  }
  if (key === "customers") {
    const where: any = { role: "CUSTOMER", isDeleted: false, ...searchWhere(["name", "email", "phoneNumber"], q.q) };
    const [rows, total] = await Promise.all([
      db.user.findMany({ where, select: { id: true, name: true, email: true, phoneNumber: true, isActive: true, createdAt: true, _count: { select: { orders: true } } }, orderBy: { createdAt: "desc" }, skip, take }),
      db.user.count({ where }),
    ]);
    return { rows: rows.map(({ _count, ...u }) => ({ ...u, orderCount: _count.orders })), total, pageSize: take };
  }
  if (key === "content") {
    const where: any = searchWhere(["key", "value"], q.q);
    const [rows, total] = await Promise.all([db.setting.findMany({ where, orderBy: { key: "asc" }, skip, take }), db.setting.count({ where })]);
    return { rows: rows.map((r) => ({ ...r, id: r.key })), total, pageSize: take };
  }
  const m = SIMPLE[key];
  if (!m) throw new HttpError(404, "Unknown resource");
  const where = { ...(m.where || {}), ...filters, ...searchWhere(m.search, q.q) };
  const delegate = (db as any)[m.model];
  const [rows, total] = await Promise.all([delegate.findMany({ where, orderBy: m.orderBy, skip, take }), delegate.count({ where })]);
  return { rows, total, pageSize: take };
}

export async function saveResource(key: string, id: string | null, body: Record<string, any>, s: AdminSession) {
  const def = RESOURCES[key];
  if (!def) throw new HttpError(404, "Unknown resource");
  if (!id && !def.canCreate) throw new HttpError(405, "Create not allowed");
  const data = coerce(def, body, !!id);
  let result: any;

  if (key === "books") {
    if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) throw new HttpError(400, "Slug: lowercase letters, numbers and dashes only");
    result = bookRow(await writeBook(id, data));
  } else if (key === "orders") {
    const before = await db.order.findUnique({ where: { id: id! } });
    if (!before) throw new HttpError(404, "Order not found");
    result = await db.order.update({ where: { id: id! }, data, include: { items: true } });
    if (data.status && data.status !== before.status) {
      await db.orderStatusHistory.create({ data: { orderId: id!, status: data.status, changedBy: s.email } });
    }
    if (data.deliveryCourier || data.trackingNumber) {
      const sh = await db.shipment.findFirst({ where: { orderId: id! } });
      const shData = { courierName: result.deliveryCourier || "UNASSIGNED", trackingNumber: result.trackingNumber, dispatchedAt: result.status === "SHIPPED" ? new Date() : undefined };
      if (sh) await db.shipment.update({ where: { id: sh.id }, data: shData });
      else await db.shipment.create({ data: { orderId: id!, ...shData } });
    }
    result = orderRow(result);
  } else if (key === "staff") {
    if (data.role === "SUPER_ADMIN" && s.role !== "SUPER_ADMIN") throw new HttpError(403, "Only a super admin can create super admins");
    const pwd = body.password ? String(body.password) : "";
    if (pwd && pwd.length < 10) throw new HttpError(400, "Password must be at least 10 characters");
    if (!id && !pwd) throw new HttpError(400, "Password is required for new staff");
    if (data.email) data.email = data.email.toLowerCase();
    const write = { ...data, ...(pwd ? { passwordHash: hashPassword(pwd) } : {}) };
    const sel = { id: true, name: true, email: true, phoneNumber: true, role: true, isActive: true };
    result = id ? await db.user.update({ where: { id }, data: write, select: sel }) : await db.user.create({ data: write as any, select: sel });
  } else if (key === "customers") {
    result = await db.user.update({ where: { id: id!, role: "CUSTOMER" }, data: { isActive: data.isActive }, select: { id: true, name: true, isActive: true } });
  } else if (key === "content") {
    const k = id || data.key;
    result = await db.setting.upsert({ where: { key: k }, create: { key: k, value: data.value, description: data.description, updatedBy: s.email }, update: { value: data.value, description: data.description, updatedBy: s.email } });
    result = { ...result, id: result.key };
  } else {
    const m = SIMPLE[key];
    const delegate = (db as any)[m.model];
    result = id ? await delegate.update({ where: { id }, data }) : await delegate.create({ data });
  }
  await audit(s, id ? "UPDATE" : "CREATE", key, result.id, data);
  return result;
}

export async function deleteResource(key: string, id: string, s: AdminSession) {
  const def = RESOURCES[key];
  if (!def?.canDelete) throw new HttpError(405, "Delete not allowed");
  if (key === "books") await db.book.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
  else if (key === "categories") await db.category.update({ where: { id }, data: { isDeleted: true } });
  else if (key === "staff") {
    if (id === s.uid) throw new HttpError(400, "You cannot remove your own account");
    await db.user.update({ where: { id }, data: { isActive: false, isDeleted: true, deletedAt: new Date() } });
  } else if (key === "content") await db.setting.delete({ where: { key: id } });
  else await (db as any)[SIMPLE[key].model].delete({ where: { id } });
  await audit(s, "DELETE", key, id);
}
