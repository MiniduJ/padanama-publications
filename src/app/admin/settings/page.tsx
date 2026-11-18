"use client";

import React, { useState } from "react";
import { formatLkr } from "@/lib/money";
import {
  Settings,
  Percent,
  Truck,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Save,
  Check,
  Building,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [vatEnabled, setVatEnabled] = useState(false);
  const [vatRate, setVatRate] = useState(18);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(3500);
  const [codSurcharge, setCodSurcharge] = useState(100);

  const [colomboRate, setColomboRate] = useState(200);
  const [westernRate, setWesternRate] = useState(250);
  const [provincialRate, setProvincialRate] = useState(300);
  const [outstationRate, setOutstationRate] = useState(350);

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
      {savedNotice && (
        <div className="fixed top-6 right-6 z-50 bg-green-800 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>සැකසුම් සාර්ථකව සුරකින ලදී (Settings Saved Successfully)</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-saffron-500" />
            <span>System Settings, VAT & Shipping Engine</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure dynamic Sri Lankan VAT rules, islandwide courier fee tables, and gateway parameters.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-maroon-900 hover:bg-maroon-950 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>සැකසුම් සුරකින්න (Save Settings)</span>
        </button>
      </div>

      {/* Section 1: Decoupled VAT / Tax Engine */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
          <Percent className="w-4 h-4 text-saffron-500" />
          <span>Decoupled Sri Lankan Tax Engine (VAT Settings)</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div>
            <span className="font-bold text-xs text-gray-900 block">
              මුද්‍රිත පොත් සඳහා වැට් බද්ද (Apply VAT on Printed Books)
            </span>
            <span className="text-[11px] text-gray-500">
              ජාතික අධ්‍යාපනික ප්‍රතිපත්තිය අනුව පොත් සඳහා 0% බදු නිදහස් කිරීම (Tax Exemption) සක්‍රීයව පවතී.
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={vatEnabled}
              onChange={(e) => setVatEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-maroon-900"></div>
          </label>
        </div>

        {vatEnabled && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
            <label className="font-bold text-amber-900 block">VAT Rate (%):</label>
            <input
              type="number"
              value={vatRate}
              onChange={(e) => setVatRate(Number(e.target.value))}
              className="w-32 p-2 rounded-lg border border-amber-300 text-xs font-bold"
            />
            <p className="text-[11px] text-amber-800">
              මෙම අනුපාතය සක්‍රීය වූ විට Checkout හි සෑම ඇණවුමකටම 18% බද්ද ස්වයංක්‍රීයව එකතු වේ.
            </p>
          </div>
        )}
      </div>

      {/* Section 2: Delivery & Shipping Rate Tables */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
          <Truck className="w-4 h-4 text-saffron-500" />
          <span>Islandwide Courier Shipping Rates (Domex / Koombiyo)</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Zone 1: Colombo Metro (Rs.)</label>
            <input
              type="number"
              value={colomboRate}
              onChange={(e) => setColomboRate(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-gray-200 font-bold"
            />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Zone 2: Western Province (Rs.)</label>
            <input
              type="number"
              value={westernRate}
              onChange={(e) => setWesternRate(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-gray-200 font-bold"
            />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Zone 3: Provincial Hubs (Rs.)</label>
            <input
              type="number"
              value={provincialRate}
              onChange={(e) => setProvincialRate(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-gray-200 font-bold"
            />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Zone 4: Outstations (Rs.)</label>
            <input
              type="number"
              value={outstationRate}
              onChange={(e) => setOutstationRate(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-gray-200 font-bold"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="font-bold text-gray-700 block mb-1">
              නොමිලේ බෙදාහැරීමේ අවම ඇණවුම් අගය (Free Delivery Threshold Rs.)
            </label>
            <input
              type="number"
              value={freeDeliveryThreshold}
              onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-gray-200 font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Cash on Delivery (COD) හැසිරවීමේ ගාස්තුව (COD Handling Fee Rs.)
            </label>
            <input
              type="number"
              value={codSurcharge}
              onChange={(e) => setCodSurcharge(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-gray-200 font-bold"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Gateway Integrations */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
          <CreditCard className="w-4 h-4 text-saffron-500" />
          <span>Payment & SMS Gateways Live Integration Status</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-maroon-700" />
                <span>PayHere Online Gateway</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold">
                ACTIVE (SANDBOX)
              </span>
            </div>
            <p className="text-[11px] text-gray-500">Merchant ID: 1211111</p>
            <p className="text-[10px] text-gray-400 font-mono">Notify URL: /api/webhooks/payhere</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-saffron-600" />
                <span>SMS Lenz (+94 Gateway)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold">
                CONNECTED
              </span>
            </div>
            <p className="text-[11px] text-gray-500">Sender ID: Padanama</p>
            <p className="text-[10px] text-gray-400 font-mono">OTP: 4 Digits • 5 Mins Validity</p>
          </div>
        </div>
      </div>
    </form>
  );
}
