// One-off copy of every table from the current database (DATABASE_URL, Prisma Postgres) into Supabase
// (POSTGRES_URL_NON_POOLING, set by the Vercel Supabase integration). Runs inside the Vercel production build,
// so no connection string is ever handled by hand. Skips itself once Supabase already holds the catalogue.
// The source database is only read, never changed.
import { PrismaClient, Prisma } from "@prisma/client";

const src = process.env.DATABASE_URL, dst = process.env.POSTGRES_URL_NON_POOLING;
if (!src || !dst || src === dst) { console.log("db copy: nothing to do (no separate Supabase URL)"); process.exit(0); }

const from = new PrismaClient({ datasourceUrl: src });
const to = new PrismaClient({ datasourceUrl: dst });
const delegate = (c, model) => c[model[0].toLowerCase() + model.slice(1)];

try {
  if ((await to.book.count()) > 0) { console.log("db copy: Supabase already has data, skipping"); process.exit(0); }

  // Parents before children: a model depends on the models its foreign keys point to.
  const models = Prisma.dmmf.datamodel.models;
  const deps = new Map(models.map((m) => [m.name, new Set(m.fields.filter((f) => f.kind === "object" && f.relationFromFields?.length && f.type !== m.name).map((f) => f.type))]));
  const order = [], seen = new Set();
  const visit = (n) => { if (seen.has(n)) return; seen.add(n); deps.get(n).forEach(visit); order.push(n); };
  models.forEach((m) => visit(m.name));

  let total = 0;
  for (const name of order) {
    const m = models.find((x) => x.name === name);
    const keys = m.primaryKey?.fields ?? m.fields.filter((f) => f.isId).map((f) => f.name); // stable paging order
    const read = delegate(from, name), write = delegate(to, name);
    let copied = 0;
    for (let skip = 0; ; skip += 1000) {
      const rows = await read.findMany({ skip, take: 1000, orderBy: keys.map((k) => ({ [k]: "asc" })) });
      if (!rows.length) break;
      for (let i = 0; i < rows.length; i += 500) copied += (await write.createMany({ data: rows.slice(i, i + 500), skipDuplicates: true })).count;
      if (rows.length < 1000) break;
    }
    const expected = await read.count();
    if (copied !== expected) throw new Error(`${name}: copied ${copied} of ${expected}`);
    if (copied) console.log(`db copy: ${name} ${copied}`);
    total += copied;
  }
  console.log(`db copy: done, ${total} rows across ${order.length} tables`);
} finally {
  await Promise.all([from.$disconnect(), to.$disconnect()]);
}
