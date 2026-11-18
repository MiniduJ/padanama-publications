import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

// ponytail: one like per browser is enforced client-side only; add a per-visitor table if likes get gamed.
async function change(id: string, by: 1 | -1) {
  const r = await db.testimonial
    .updateMany({ where: { id, isApproved: true, ...(by < 0 ? { likes: { gt: 0 } } : {}) }, data: { likes: { increment: by } } })
    .catch(() => null);
  return NextResponse.json({ success: !!r?.count });
}

type Ctx = { params: Promise<{ id: string }> };
export const POST = async (_: NextRequest, c: Ctx) => change((await c.params).id, 1);
export const DELETE = async (_: NextRequest, c: Ctx) => change((await c.params).id, -1);
