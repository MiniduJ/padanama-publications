"use client";

import React, { useState, useEffect } from "react";
import { formatLkr } from "@/lib/money";
import {
  ShoppingBag,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Eye,
  Check,
  RefreshCw,
} from "lucide-react";

interface AdminOrder {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  phone: string;
  city: string;
  district: string;
  paymentMethod: "PAYHERE" | "BANK_TRANSFER" | "CASH_ON_DELIVERY";
  status: "PENDING_PAYMENT" | "PENDING_SLIP_VERIFICATION" | "PAID" | "COD_CONFIRMED" | "SHIPPED" | "DELIVERED";
  totalCents: number;
  itemsCount: number;
  courier?: string;
  waybillNumber?: string;
}

const INITIAL_ORDERS: AdminOrder[] = [
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
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [activeLabelOrder, setActiveLabelOrder] = useState<AdminOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Synchronize orders with backend repository and local checkout orders
  const loadOrders = async () => {
    setIsRefreshing(true);
    try {
      let combined: AdminOrder[] = [...INITIAL_ORDERS];

      // 1. Fetch from server repository
      try {
        const res = await fetch("/api/admin/orders");
        if (res.ok) {
          const data = await res.json();
          if (data.orders && Array.isArray(data.orders)) {
            combined = data.orders;
          }
        }
      } catch {
        // ignore
      }

      // 2. Merge with locally placed checkout orders
      try {
        const local = JSON.parse(localStorage.getItem("padanama_placed_orders") || "[]");
        if (Array.isArray(local) && local.length > 0) {
          const map = new Map<string, AdminOrder>();
          local.forEach((o: any) => map.set(o.orderNumber, o));
          combined.forEach((o) => {
            if (!map.has(o.orderNumber)) map.set(o.orderNumber, o);
          });
          combined = Array.from(map.values());
        }
      } catch {
        // ignore
      }

      setOrders(combined);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDispatchCourier = async (orderId: string) => {
    const waybill = `DMX-LK-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const targetOrder = orders.find((o) => o.id === orderId);

    setOrders(
      orders.map((o) =>
        o.id === orderId
          ? { ...o, status: "SHIPPED", courier: "Domex Courier", waybillNumber: waybill }
          : o
      )
    );

    if (targetOrder) {
      try {
        await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderNumber: targetOrder.orderNumber,
            status: "SHIPPED",
            courier: "Domex Courier",
            waybillNumber: waybill,
          }),
        });
      } catch {
        // ignore
      }
    }

    setToastMessage(`ඇණවුම Domex කුරියර් වෙත භාරදුන් බව සටහන් විය. Tracking Ref: ${waybill}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-green-800 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-brandRed" />
            <span>Orders & Courier Fulfillment</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track orders, generate Domex shipping labels, and manage courier dispatch status.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:border-brandRed text-xs font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brandRed ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "යාවත්කාලීන වෙමින්..." : "යාවත්කාලීන කරන්න (Refresh)"}</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: "ALL", label: "All Orders (සියල්ල)" },
            { id: "PAID", label: "Paid (ගෙවා ඇත)" },
            { id: "COD_CONFIRMED", label: "COD Confirmed" },
            { id: "PENDING_SLIP_VERIFICATION", label: "Pending Slip" },
            { id: "SHIPPED", label: "Shipped (පිටත් කළ)" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap text-xs ${
                statusFilter === tab.id
                  ? "bg-brandNavy text-white shadow-xs"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Customer Name, or Phone..."
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brandRed shadow-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Orders Container: Desktop Table vs Mobile Stacked Cards */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Desktop Data Table (>=768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">ඇණවුම් අංකය (Order #)</th>
                <th className="py-3 px-4">දිනය (Date)</th>
                <th className="py-3 px-4">පාරිභෝගිකයා (Customer)</th>
                <th className="py-3 px-4">ගෙවීම් ක්‍රමය (Payment)</th>
                <th className="py-3 px-4">තත්ත්වය (Status)</th>
                <th className="py-3 px-4">මුදල (Total)</th>
                <th className="py-3 px-4 text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 text-[11px]">{order.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-900 block">{order.customerName}</span>
                    <a href={`tel:${order.phone}`} className="text-[11px] text-gray-500 font-mono hover:text-brandRed">
                      {order.phone} • {order.city} ({order.district})
                    </a>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[11px]">
                      {order.paymentMethod === "PAYHERE"
                        ? "PayHere (Online)"
                        : order.paymentMethod === "BANK_TRANSFER"
                        ? "Bank Transfer"
                        : "COD"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.status === "PAID"
                          ? "bg-green-100 text-green-800"
                          : order.status === "COD_CONFIRMED"
                          ? "bg-amber-100 text-amber-800"
                          : order.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-brandNavy">
                    {formatLkr(order.totalCents, "en")}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {order.status === "PAID" || order.status === "COD_CONFIRMED" ? (
                      <button
                        type="button"
                        onClick={() => handleDispatchCourier(order.id)}
                        className="px-2.5 py-1 bg-brandRed hover:bg-brandRed-600 text-white font-bold rounded-lg text-[11px] shadow-xs inline-flex items-center gap-1 transition-all"
                      >
                        <Truck className="w-3 h-3" />
                        <span>Dispatch Domex</span>
                      </button>
                    ) : order.waybillNumber ? (
                      <span className="text-[10px] font-mono text-gray-500">
                        {order.waybillNumber}
                      </span>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setActiveLabelOrder(order)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 inline-block"
                      title="Print Shipping Label"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Order Cards (<768px) */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              ඇණවුම් කිසිවක් හමු නොවීය.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="p-4 space-y-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-black text-xs text-brandNavy">
                    {order.orderNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      order.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : order.status === "COD_CONFIRMED"
                        ? "bg-amber-100 text-amber-800"
                        : order.status === "SHIPPED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-start justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-gray-900">{order.customerName}</h4>
                    <a
                      href={`tel:${order.phone}`}
                      className="text-[11px] text-brandRed font-mono font-semibold block mt-0.5"
                    >
                      📞 {order.phone}
                    </a>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {order.city}, {order.district} • {order.itemsCount} Items
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-brandNavy block">
                      {formatLkr(order.totalCents, "en")}
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      {order.paymentMethod === "PAYHERE"
                        ? "PayHere (Online)"
                        : order.paymentMethod === "BANK_TRANSFER"
                        ? "Bank Transfer"
                        : "COD"}
                    </span>
                  </div>
                </div>

                {/* Mobile Action Buttons Bar */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-gray-400">{order.date}</span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveLabelOrder(order)}
                      className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 text-[11px] font-bold flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Label</span>
                    </button>

                    {order.status === "PAID" || order.status === "COD_CONFIRMED" ? (
                      <button
                        type="button"
                        onClick={() => handleDispatchCourier(order.id)}
                        className="px-3 py-1.5 bg-brandRed hover:bg-brandRed-600 text-white font-bold rounded-lg text-[11px] shadow-sm flex items-center gap-1 transition-all"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch Domex</span>
                      </button>
                    ) : order.waybillNumber ? (
                      <span className="text-[10px] font-mono font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {order.waybillNumber}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PRINTABLE DOMEX SHIPPING LABEL MODAL */}
      {activeLabelOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-300 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold text-gray-500 uppercase">
                Courier Shipping Label (Domex / Koombiyo)
              </span>
              <button
                type="button"
                onClick={() => setActiveLabelOrder(null)}
                className="text-xs text-gray-400 hover:text-gray-700"
              >
                ✕ Close
              </button>
            </div>

            {/* Label Area */}
            <div className="p-4 border-2 border-black rounded-lg text-black text-xs space-y-3 font-mono">
              <div className="flex justify-between items-baseline border-b border-black pb-2">
                <span className="font-bold text-sm">PADANAMA PUBLICATIONS</span>
                <span className="font-bold text-xs">{activeLabelOrder.orderNumber}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold block uppercase text-gray-600">DELIVER TO:</span>
                <p className="font-bold text-sm">{activeLabelOrder.customerName}</p>
                <p>{activeLabelOrder.city}, {activeLabelOrder.district}</p>
                <p>Phone: {activeLabelOrder.phone}</p>
              </div>

              <div className="border-t border-black pt-2 flex justify-between">
                <div>
                  <span className="text-[10px] block">PAYMENT:</span>
                  <span className="font-bold">
                    {activeLabelOrder.paymentMethod === "CASH_ON_DELIVERY"
                      ? `COD: ${formatLkr(activeLabelOrder.totalCents, "en")}`
                      : "PREPAID (PAID)"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] block">COURIER:</span>
                  <span className="font-bold">{activeLabelOrder.courier || "Domex Express"}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                window.print();
              }}
              className="w-full py-2.5 bg-maroon-900 hover:bg-maroon-950 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Label (මුද්‍රණය කරන්න)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
