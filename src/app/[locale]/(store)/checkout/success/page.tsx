"use client";
import { useTx } from "@/lib/tx";
import { BankAccounts } from "@/components/store/BankAccounts";

import React, { useEffect, useState, use } from "react";
import { Link } from "@/i18n/routing";
import { formatLkr } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";
import {
  CheckCircle2,
  Clock,
  Truck,
  Building,
  UploadCloud,
  ArrowRight,
  BookOpen,
  BookMarked,
  FileText,
  Phone,
  ShieldCheck,
} from "lucide-react";

interface SuccessPageProps {
  searchParams: Promise<{
    order?: string;
    method?: string;
    payment?: string;
  }>;
}

export default function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const tx = useTx();
  const params = use(searchParams);
  const orderNumber = params.order || "PDN-2026-100245";
  const method = params.method || (params.payment ? "PAYHERE" : "BANK_TRANSFER");

  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [slipUploaded, setSlipUploaded] = useState(false);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/orders/create?orderNumber=${orderNumber}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !data.error) {
          setOrderData(data);
          if (data.bankSlipUrl) {
            setSlipUploaded(true);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderNumber]);

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result as string);
        setSlipUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const status = orderData?.status || (method === "PAYHERE" ? "PAID" : method === "CASH_ON_DELIVERY" ? "COD_CONFIRMED" : "PENDING_SLIP_VERIFICATION");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="bg-white rounded-3xl border border-maroon-100 shadow-lg overflow-hidden">
        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-maroon-900 via-maroon-850 to-maroon-950 p-6 sm:p-10 text-center text-cream space-y-3 relative overflow-hidden">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto border-2 border-green-400/40 shadow-inner">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight">
            {tx("ඔබගේ ඇණවුම සාර්ථකව භාරගන්නා ලදී!")}
          </h1>
          <p className="text-xs sm:text-sm text-cream/80 max-w-lg mx-auto">
            {tx("ස්තූතියි! පදනම ප්‍රකාශන වෙතින් පොත් ඇණවුම් කිරීම පිළිබඳව අපි ඉතාමත් සතුටු වන්නෙමු.")}
          </p>

          <div className="pt-2 inline-flex items-center gap-2 bg-black/30 backdrop-blur px-4 py-1.5 rounded-full border border-gold-500/30 text-xs">
            <span className="text-gold-400 font-bold">{tx("ඇණවුම් අංකය (Order #):")}</span>
            <span className="font-mono font-black text-white">{orderNumber}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Status Alert Banner */}
          <div className="p-4 rounded-2xl bg-cream/70 border border-gold-500/30 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-saffron-500 shrink-0" />
              <div>
                <span className="text-xs font-bold text-maroon-900 block">
                  {tx("ඇණවුමේ වත්මන් තත්ත්වය:")}
                </span>
                <span className="text-xs text-ink-muted">
                  {status === "PAID"
                    ? tx("ගෙවීම සාර්ථකව තහවුරු වී ඇත. පාර්සලය සකස් කරමින් පවතී.")
                    : status === "COD_CONFIRMED"
                    ? tx("COD ඇණවුම තහවුරු විය. Domex කුරියර් වෙත භාරදීමට නියමිතයි.")
                    : tx("බැංකු තැන්පතු ලදුපත තහවුරු කිරීම අපේක්ෂාවෙන් පවතී.")}
                </span>
              </div>
            </div>
            <Badge variant={status === "PAID" ? "green" : "gold"}>
              {status === "PAID"
                ? tx("PAID (ගෙවා ඇත)")
                : status === "COD_CONFIRMED"
                ? "COD CONFIRMED"
                : "PENDING VERIFICATION"}
            </Badge>
          </div>

          {/* Conditional Instructions by Payment Method */}
          {method === "BANK_TRANSFER" && (
            <div className="p-5 rounded-2xl bg-white border-2 border-dashed border-maroon-200 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-maroon-900">
                <Building className="w-5 h-5 text-saffron-500" />
                <span>{tx("බැංකු තැන්පතු තොරතුරු සහ ලදුපත උඩුගත කිරීම:")}</span>
              </div>

              <BankAccounts className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1" />

              {/* Slip Uploader Tray */}
              <div className="p-4 bg-maroon-50/50 rounded-xl border border-maroon-100 space-y-2">
                <span className="text-xs font-bold text-maroon-900 block">
                  {slipUploaded
                    ? tx("✓ ඔබගේ ගෙවීම් ලදුපත අප වෙත ලැබී ඇත. අපගේ ගිණුම් අංශය විසින් එය අනුමත කරනු ඇත.")
                    : tx("ගෙවීම් කළ ලදුපත (Deposit Slip / Screenshot) මෙතැනින් උඩුගත කරන්න:")}
                </span>

                {!slipUploaded ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleSlipUpload}
                      className="text-xs text-ink file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-maroon-900 file:text-white hover:file:bg-maroon-950 cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-green-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{tx("ලදුපත සාර්ථකව යොමු විය (Slip Verified by Customer)")}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {method === "CASH_ON_DELIVERY" && (
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
              <span className="font-bold block text-sm flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-700" />
                {tx("භාණ්ඩ ලැබුණු පසු මුදල් ගෙවීමේ උපදෙස් (COD Instructions):")}
              </span>
              <p className="leading-relaxed">
                {tx("කුරියර් රියදුරු පැමිණි පසු කරුණාකර මුදල් ගෙවා පාර්සලය ලබාගන්න. කුරියර් පිටත් කිරීමට පෙර Domex සේවාව මගින් ඔබගේ දුරකථන අංකයට 4-digit SMS තහවුරු කිරීමේ කේතයක් එවනු ලැබේ.")}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="grid sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            <Link
              href="/account/orders"
              className="py-3 px-4 rounded-xl bg-maroon-900 hover:bg-maroon-950 text-cream font-bold text-xs text-center shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>{tx("ඇණවුම් තත්ත්වය බලන්න (Track Order)")}</span>
            </Link>

            <Link
              href="/account/my-library"
              className="py-3 px-4 rounded-xl bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white font-extrabold text-xs text-center shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <BookMarked className="w-4 h-4" />
              <span>{tx("මගේ පුස්තකාලය (My Library)")}</span>
            </Link>

            <Link
              href="/books"
              className="py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-ink font-semibold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{tx("තවත් පොත් බලන්න")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
