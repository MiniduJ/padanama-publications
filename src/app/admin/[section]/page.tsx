import { notFound } from "next/navigation";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { RESOURCES } from "@/lib/admin-resources";

// URL section → resource (+ optional preset filter)
const SECTIONS: Record<string, { resource: string; filters?: Record<string, string> }> = {
  catalog: { resource: "books" },
  slips: { resource: "orders", filters: { status: "PENDING_SLIP_VERIFICATION" } },
  ...Object.fromEntries(Object.keys(RESOURCES).map((k) => [k, { resource: k }])),
};

export default async function AdminSection({ params }: { params: Promise<{ section: string }> }) {
  const s = SECTIONS[(await params).section];
  if (!s) notFound();
  return <ResourceManager resource={s.resource} initialFilters={s.filters} />;
}
