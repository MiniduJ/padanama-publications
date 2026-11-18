import { adminRoute } from "@/server/admin/guard";
import { db } from "@/server/db";

const PAID = ["PAID", "COD_CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"] as const;

export const GET = adminRoute(() => null, async () => {
  const since = new Date(Date.now() - 30 * 864e5);
  const [revenue, expenses, ordersByStatus, books, lowStock, slips, messages, topRead, recent] = await Promise.all([
    db.order.aggregate({ _sum: { totalCents: true }, _count: true, where: { status: { in: [...PAID] }, createdAt: { gte: since } } }),
    db.expense.aggregate({ _sum: { amountCents: true }, where: { date: { gte: since } } }),
    db.order.groupBy({ by: ["status"], _count: true }),
    db.book.count({ where: { isDeleted: false } }),
    db.bookEdition.count({ where: { isDeleted: false, isDigital: false, stockQuantity: { lte: 5 } } }),
    db.order.count({ where: { status: "PENDING_SLIP_VERIFICATION" } }),
    db.contactMessage.count({ where: { isHandled: false } }),
    db.book.findMany({ where: { isDeleted: false }, orderBy: { readCount: "desc" }, take: 5, select: { id: true, titleSi: true, readCount: true } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 8, select: { id: true, orderNumber: true, customerName: true, totalCents: true, status: true, createdAt: true } }),
  ]);
  const rev = revenue._sum.totalCents || 0, exp = expenses._sum.amountCents || 0;
  return {
    revenue30dCents: rev, orders30d: revenue._count, expenses30dCents: exp, profit30dCents: rev - exp,
    ordersByStatus: Object.fromEntries(ordersByStatus.map((o) => [o.status, o._count])),
    books, lowStock, slips, messages, topRead, recent,
  };
});
