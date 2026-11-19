import { notFound } from "next/navigation";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { RESOURCES } from "@/lib/admin-resources";

// URL section → resource (+ optional preset filter)
const SECTIONS: Record<string, { resource: string; filters?: Record<string, string>; title?: string; defaults?: Record<string, unknown> }> = {
  ...Object.fromEntries(Object.keys(RESOURCES).map((k) => [k, { resource: k }])),
  catalog: { resource: "books", title: "All Catalogue Items" },
  books: { resource: "books", filters: { productType: "BOOK" }, title: "Books", defaults: { productType: "BOOK" } },
  materials: { resource: "books", filters: { productType: "SCHOOL_MATERIALS" }, title: "School Materials", defaults: { productType: "STATIONERY" } },
  slips: { resource: "orders", filters: { status: "PENDING_SLIP_VERIFICATION" } },
};

export default async function AdminSection({ params }: { params: Promise<{ section: string }> }) {
  const section = (await params).section;
  const s = SECTIONS[section];
  if (!s) notFound();
  // key: switching between Books and School Materials remounts with that page's filter
  return <ResourceManager key={section} resource={s.resource} initialFilters={s.filters} title={s.title} defaults={s.defaults} />;
}
