import { adminRoute } from "@/server/admin/guard";
import { deleteResource, saveResource } from "@/server/admin/handlers";

type Ctx = { params: Promise<{ resource: string; id: string }> };
const res = async (c: Ctx) => (await c.params).resource;

export const PATCH = adminRoute<Ctx>(res, async (req, s, c) => {
  const { resource, id } = await c.params;
  return saveResource(resource, decodeURIComponent(id), await req.json(), s);
});

export const DELETE = adminRoute<Ctx>(res, async (_req, s, c) => {
  const { resource, id } = await c.params;
  await deleteResource(resource, decodeURIComponent(id), s);
  return { success: true };
});
