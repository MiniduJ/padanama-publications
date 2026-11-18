import { adminRoute } from "@/server/admin/guard";
import { listResource, saveResource } from "@/server/admin/handlers";

type Ctx = { params: Promise<{ resource: string }> };
const res = async (c: Ctx) => (await c.params).resource;

export const GET = adminRoute<Ctx>(res, async (req, _s, c) => {
  const sp = req.nextUrl.searchParams;
  const filters: Record<string, string> = {};
  sp.forEach((v, k) => k.startsWith("f.") && (filters[k.slice(2)] = v));
  return listResource(await res(c), { q: sp.get("q") || undefined, page: Number(sp.get("page")) || 1, filters, all: sp.get("all") === "1" });
});

export const POST = adminRoute<Ctx>(res, async (req, s, c) => saveResource(await res(c), null, await req.json(), s));
