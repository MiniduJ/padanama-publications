"use client";

import React, { useState } from "react";
import { formatLkr } from "@/lib/money";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  User,
  Phone,
  Truck,
  Eye,
  AlertCircle,
  Check,
} from "lucide-react";

interface PendingSlip {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  amountCents: number;
  bankName: string;
  accountNumber: string;
  depositDate: string;
  slipUrl: string;
  items: string[];
  city: string;
}

const INITIAL_SLIPS: PendingSlip[] = [
  {
    id: "slip-1",
    orderNumber: "PDN-2026-000412",
    customerName: "Dilrukshi Jayawardena",
    phone: "0718008533",
    amountCents: 345000,
    bankName: "Bank of Ceylon (BOC)",
    accountNumber: "0001234567 (Kollupitiya)",
    depositDate: "2026-11-18 09:45 AM",
    slipUrl: "/images/books/placeholder.jpg",
    items: ["5 ශ්‍රේණිය ශිෂ්‍යත්ව පෙරහුරු ප්‍රශ්න පත්‍ර (Paperback) × 2", "සාමාන්‍ය පෙළ ගණිතය (E-Book) × 1"],
    city: "Kandy",
  },
  {
    id: "slip-2",
    orderNumber: "PDN-2026-000411",
    customerName: "Chamath Perera",
    phone: "0771234567",
    amountCents: 125000,
    bankName: "Sampath Bank",
    accountNumber: "0112345678 (Colombo Super)",
    depositDate: "2026-11-18 08:30 AM",
    slipUrl: "/images/books/placeholder.jpg",
    items: ["උසස් පෙළ සංයුක්ත ගණිතය (Paperback) × 1"],
    city: "Gampaha",
  },
  {
    id: "slip-3",
    orderNumber: "PDN-2026-000409",
    customerName: "Nirasha Fernando",
    phone: "0759876543",
    amountCents: 680000,
    bankName: "Commercial Bank",
    accountNumber: "8001234567 (Colombo 03)",
    depositDate: "2026-11-18 07:15 AM",
    slipUrl: "/images/books/placeholder.jpg",
    items: ["10 ශ්‍රේණිය සිංහල සාහිත්‍ය සංග්‍රහය (Hardcover) × 4"],
    city: "Negombo",
  },
];

export default function AdminSlipsPage() {
  const [slips, setSlips] = useState<PendingSlip[]>(INITIAL_SLIPS);
  const [selectedSlip, setSelectedSlip] = useState<PendingSlip | null>(INITIAL_SLIPS[0] || null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleApprove = (slipId: string) => {
    const slip = slips.find((s) => s.id === slipId);
    if (!slip) return;

    setSlips(slips.filter((s) => s.id !== slipId));
    setSelectedSlip(slips.find((s) => s.id !== slipId) || null);

    setActionNotice(
      `✓ ඇණවුම් අංක ${slip.orderNumber} සඳහා ගෙවීම් ලදුපත අනුමත කරන ලදී. SMS දැනුම්දීම ${slip.phone} වෙත යවන ලදී.`
    );
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleReject = (slipId: string) => {
    const reason = prompt("ප්‍රතික්ෂේප කිරීමට හේතුව ඇතුළත් කරන්න (Reason for rejection):", "ලදුපත අපැහැදිලියි. කරුණාකර පැහැදිලි ඡායාරූපයක් යොමු කරන්න.");
    if (!reason) return;

    const slip = slips.find((s) => s.id === slipId);
    if (!slip) return;

    setSlips(slips.filter((s) => s.id !== slipId));
    setSelectedSlip(slips.find((s) => s.id !== slipId) || null);

    setActionNotice(
      `ඇණවුම් අංක ${slip.orderNumber} ලදුපත ප්‍රතික්ෂේප විය. නැවත උඩුගත කිරීමේ SMS පණිවිඩය යවන ලදී.`
    );
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Toast */}
      {actionNotice && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-saffron-500" />
          <span>Bank Deposit Slip Verification Queue</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Verify deposit slips uploaded by customers who chose Direct Bank Transfer or CDM cash deposit.
        </p>
      </div>

      {slips.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
          <h3 className="font-bold text-gray-900 text-base">සියලුම ලදුපත් පරීක්ෂා කර අවසන්!</h3>
          <p className="text-xs text-gray-500">
            දැනට තහවුරු කිරීමට කිසිදු බැංකු ලදුපතක් නොමැත. (All slips processed)
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Slips List */}
          <div className="lg:col-span-5 space-y-3">
            {slips.map((slip) => {
              const isSelected = selectedSlip?.id === slip.id;
              return (
                <div
                  key={slip.id}
                  onClick={() => setSelectedSlip(slip)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-maroon-700 bg-maroon-50/50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-maroon-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-gray-900">
                      {slip.orderNumber}
                    </span>
                    <span className="font-bold text-xs text-maroon-900">
                      {formatLkr(slip.amountCents, "en")}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-xs text-gray-600">
                    <p className="font-semibold text-gray-800">{slip.customerName}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <Building className="w-3 h-3 text-saffron-500" />
                      <span>{slip.bankName}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{slip.depositDate}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Slip Inspector & Action Tray */}
          {selectedSlip && (
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-xs text-gray-400 font-mono">Order Verification</span>
                  <h3 className="font-bold text-lg text-gray-900">{selectedSlip.orderNumber}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Total Due</span>
                  <span className="font-black text-xl text-maroon-900">
                    {formatLkr(selectedSlip.amountCents, "en")}
                  </span>
                </div>
              </div>

              {/* Order & Customer Metadata */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="font-bold text-gray-700 block">Customer Information:</span>
                  <p className="text-gray-900 font-medium">{selectedSlip.customerName}</p>
                  <p className="text-gray-500 font-mono">{selectedSlip.phone}</p>
                  <p className="text-gray-500">{selectedSlip.city}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-700 block">Bank Account:</span>
                  <p className="text-gray-900 font-medium">{selectedSlip.bankName}</p>
                  <p className="text-gray-500 text-[11px]">{selectedSlip.accountNumber}</p>
                  <p className="text-gray-400 text-[10px]">Date: {selectedSlip.depositDate}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-gray-700 block">Ordered Items:</span>
                <ul className="list-disc list-inside space-y-0.5 text-gray-600 text-[11px]">
                  {selectedSlip.items.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              </div>

              {/* Slip Image Preview */}
              <div className="space-y-2">
                <span className="font-bold text-xs text-gray-700 block">
                  Uploaded Deposit Slip (ලදුපත පෙරදසුන):
                </span>
                <div className="w-full h-64 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
                  <div className="space-y-2">
                    <FileCheck className="w-10 h-10 text-saffron-500 mx-auto" />
                    <span className="text-xs font-bold text-gray-700 block">
                      {selectedSlip.bankName} Deposit Receipt
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono block">
                      Amount: {formatLkr(selectedSlip.amountCents, "en")} • Ref: 9840241
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleApprove(selectedSlip.id)}
                  className="flex-1 py-3 px-4 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>තහවුරු කර අනුමත කරන්න (Approve Payment)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleReject(selectedSlip.id)}
                  className="py-3 px-4 border border-red-300 hover:bg-red-50 text-red-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>ප්‍රතික්ෂේප (Reject)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
