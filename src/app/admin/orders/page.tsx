"use client";

import React, { useState } from "react";
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

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDispatchCourier = (orderId: string) => {
    const waybill = `DMX-LK-${Math.floor(1000000 + Math.random() * 9000000)}`;
    setOrders(
      orders.map((o) =>
        o.id === orderId
          ? { ...o, status: "SHIPPED", courier: "Domex Courier", waybillNumber: waybill }
          : o
      )
    );
    setToastMessage(`ඇණවුම Domex කුරියර් වෙත භාරදුන් බව සටහන් විය. Tracking Ref: ${waybill}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-green-800 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-saffron-500" />
            <span>Orders & Courier Fulfillment</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track orders, generate Domex shipping labels, and manage courier dispatch status.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
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
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-maroon-900 text-white shadow-xs"
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
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
                    <span className="text-[11px] text-gray-400 font-mono">
                      {order.phone} • {order.city} ({order.district})
                    </span>
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
                  <td className="py-3.5 px-4 font-bold text-maroon-900">
                    {formatLkr(order.totalCents, "en")}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {order.status === "PAID" || order.status === "COD_CONFIRMED" ? (
                      <button
                        type="button"
                        onClick={() => handleDispatchCourier(order.id)}
                        className="px-2.5 py-1 bg-saffron-500 hover:bg-saffron-600 text-white font-bold rounded-lg text-[11px] shadow-xs inline-flex items-center gap-1"
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
