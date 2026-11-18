import React from "react";
import Link from "next/link";
import { formatLkr } from "@/lib/money";
import {
  TrendingUp,
  ShoppingBag,
  FileCheck,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Today's Gross Sales",
      value: formatLkr(18450000, "en"), // Rs. 184,500.00
      change: "+18.2%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Pending Orders",
      value: "14",
      subtext: "9 awaiting dispatch",
      icon: ShoppingBag,
    },
    {
      title: "Pending Bank Slips",
      value: "3",
      subtext: "Needs manual accountant verification",
      icon: FileCheck,
      alert: true,
    },
    {
      title: "Low Stock Titles",
      value: "4",
      subtext: "Under 5 copies in warehouse",
      icon: AlertTriangle,
    },
  ];

  const pendingSlips = [
    {
      orderNumber: "PDN-2026-000412",
      customer: "Dilrukshi Jayawardena",
      amountCents: 345000,
      bank: "Bank of Ceylon (BOC)",
      timeAgo: "22 mins ago",
    },
    {
      orderNumber: "PDN-2026-000411",
      customer: "Chamath Perera",
      amountCents: 125000,
      bank: "Sampath Bank",
      timeAgo: "1 hour ago",
    },
    {
      orderNumber: "PDN-2026-000409",
      customer: "Nirasha Fernando",
      amountCents: 680000,
      bank: "Commercial Bank",
      timeAgo: "3 hours ago",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real-time overview of catalog, orders, and fulfillment operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/slips"
            className="w-full sm:w-auto px-4 py-2.5 bg-brandRed hover:bg-brandRed-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            <span>Verify Bank Slips (3)</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards: 2 Columns on Mobile, 4 Columns on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`p-4 sm:p-6 bg-white rounded-2xl border shadow-sm flex flex-col justify-between ${
                stat.alert ? "border-amber-300 bg-amber-50/20" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider line-clamp-1">
                  {stat.title}
                </span>
                <div className={`p-1.5 sm:p-2 rounded-xl shrink-0 ${stat.alert ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                {stat.change && (
                  <span className="text-[10px] sm:text-xs font-bold text-green-600 inline-flex items-center gap-0.5 mt-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </span>
                )}
                {stat.subtext && (
                  <span className="text-[10px] sm:text-xs text-gray-500 block mt-0.5 truncate">{stat.subtext}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bank Slip Verification Attention Tray */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Bank Slip Verification Queue (Pending Review)
            </h2>
            <p className="text-xs text-gray-500">
              Customers who paid via Direct Bank Transfer or CDM ATM deposit.
            </p>
          </div>
          <Link
            href="/admin/slips"
            className="text-xs font-semibold text-maroon-700 hover:text-maroon-900"
          >
            View all pending slips →
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {pendingSlips.map((slip, idx) => (
            <div key={idx} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-gray-900">
                    {slip.orderNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    Pending Verification
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {slip.customer} • Deposited to <span className="font-semibold">{slip.bank}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-bold text-sm text-gray-900">
                    {formatLkr(slip.amountCents, "en")}
                  </div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {slip.timeAgo}
                  </div>
                </div>

                <Link
                  href={`/admin/slips?order=${slip.orderNumber}`}
                  className="px-3.5 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
