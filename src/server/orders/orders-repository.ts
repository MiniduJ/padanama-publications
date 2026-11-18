/**
 * Central In-Memory & Resilient Orders Repository for Padanama Admin
 * Stores placed orders and updates in real time across checkout and admin console.
 */

export interface StoredOrder {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  phone: string;
  city: string;
  district: string;
  paymentMethod: "PAYHERE" | "BANK_TRANSFER" | "CASH_ON_DELIVERY" | "KOKO";
  status: "PENDING_PAYMENT" | "PENDING_SLIP_VERIFICATION" | "PAID" | "COD_CONFIRMED" | "SHIPPED" | "DELIVERED";
  totalCents: number;
  itemsCount: number;
  itemsList?: string[];
  courier?: string;
  waybillNumber?: string;
  bankSlipUrl?: string | null;
  customerNote?: string | null;
}

const GLOBAL_ORDERS_CACHE_KEY = "__padanama_orders_registry__";

function getOrdersStore(): StoredOrder[] {
  if (typeof globalThis !== "undefined") {
    if (!(globalThis as any)[GLOBAL_ORDERS_CACHE_KEY]) {
      (globalThis as any)[GLOBAL_ORDERS_CACHE_KEY] = [
        {
          id: "ord-1",
          orderNumber: "PDN-2026-000415",
          date: "2026-11-18 10:15 AM",
          customerName: "Sunil Shantha",
          phone: "0718008533",
          city: "Kottawa",
          district: "Colombo",
          paymentMethod: "PAYHERE",
          status: "PAID",
          totalCents: 245000,
          itemsCount: 3,
          itemsList: ["5 ශ්‍රේණිය ශිෂ්‍යත්ව ප්‍රශ්න පත්‍ර (Paperback) × 2", "සාමාන්‍ය පෙළ කෙටි සටහන් (Paperback) × 1"],
        },
        {
          id: "ord-2",
          orderNumber: "PDN-2026-000414",
          date: "2026-11-18 09:50 AM",
          customerName: "Nirosha Jayasinghe",
          phone: "0772345678",
          city: "Peradeniya",
          district: "Kandy",
          paymentMethod: "CASH_ON_DELIVERY",
          status: "COD_CONFIRMED",
          totalCents: 185000,
          itemsCount: 2,
          itemsList: ["උසස් පෙළ ජීව විද්‍යාව විවරණ (Paperback) × 2"],
        },
        {
          id: "ord-3",
          orderNumber: "PDN-2026-000413",
          date: "2026-11-18 09:12 AM",
          customerName: "Kasun Maduranga",
          phone: "0783456789",
          city: "Kurunegala",
          district: "Kurunegala",
          paymentMethod: "BANK_TRANSFER",
          status: "PENDING_SLIP_VERIFICATION",
          totalCents: 320000,
          itemsCount: 4,
          bankSlipUrl: "/images/books/placeholder.jpg",
          itemsList: ["10 ශ්‍රේණිය ගණිතය (Hardcover) × 2", "11 ශ්‍රේණිය විද්‍යාව (Paperback) × 2"],
        },
        {
          id: "ord-4",
          orderNumber: "PDN-2026-000408",
          date: "2026-11-17 04:30 PM",
          customerName: "Malini Fonseka",
          phone: "0719876543",
          city: "Galle Fort",
          district: "Galle",
          paymentMethod: "PAYHERE",
          status: "SHIPPED",
          totalCents: 450000,
          itemsCount: 5,
          courier: "Domex",
          waybillNumber: "DMX-LK-7749102",
          itemsList: ["පෙර පාසල් වැඩපොත් කට්ටලය (Paperback) × 5"],
        },
      ];
    }
    return (globalThis as any)[GLOBAL_ORDERS_CACHE_KEY];
  }
  return [];
}

export const ordersRepository = {
  getAllOrders(): StoredOrder[] {
    return getOrdersStore();
  },

  getOrderByNumber(orderNumber: string): StoredOrder | undefined {
    const list = getOrdersStore();
    return list.find((o) => o.orderNumber === orderNumber);
  },

  addOrder(order: StoredOrder): StoredOrder {
    const list = getOrdersStore();
    const existingIndex = list.findIndex((o) => o.orderNumber === order.orderNumber);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...order };
      return list[existingIndex];
    } else {
      list.unshift(order);
      return order;
    }
  },

  updateOrderStatus(
    orderNumber: string,
    status: StoredOrder["status"],
    extra: Partial<StoredOrder> = {}
  ): StoredOrder | null {
    const list = getOrdersStore();
    const order = list.find((o) => o.orderNumber === orderNumber);
    if (order) {
      order.status = status;
      Object.assign(order, extra);
      return order;
    }
    return null;
  },
};
