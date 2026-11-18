"use client";

import React, { useState } from "react";
import { ShieldCheck, Download, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AccountPrivacyPage() {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadData = () => {
    // Generate machine-readable JSON data export as required by Sri Lanka PDPA Act No. 9 of 2022
    const exportData = {
      user: {
        name: "දිල්රුක්ෂි ජයවර්ධන",
        phoneNumber: "+94771234567",
        email: "dilrukshi@example.lk",
        registeredDate: "2026-09-12",
      },
      orders: [
        {
          orderNumber: "PDN-2026-000412",
          totalLkr: 3450.00,
          status: "SHIPPED",
          items: ["5 ශ්‍රේණිය ශිෂ්‍යත්ව පෙරහුරු ප්‍රශ්න පත්‍ර", "සාමාන්‍ය පෙළ ගණිතය කෙටි සටහන්"],
        },
      ],
      digitalLibraryEntitlements: ["Hanthana Kadu Pamula", "OL Mathematics Short Notes"],
      timestamp: new Date().toISOString(),
      complianceLaw: "Sri Lanka Personal Data Protection Act No. 9 of 2022",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `padanama-my-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
  };

  const handleDeleteRequest = () => {
    if (confirm("ඔබගේ ගිණුම සහ දත්ත පද්ධතියෙන් ඉවත් කිරීමට අවශ්‍ය බව තහවුරු කරන්නද? (Confirm Account Deletion Request)")) {
      alert("ඔබගේ ඉල්ලීම ලියාපදිංචි විය. පැය 24ක් ඇතුළත ඔබගේ පුද්ගලික දත්ත පද්ධතියෙන් මකාදමනු ඇත.");
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div className="border-b border-maroon-100 pb-4">
        <h1 className="font-display font-bold text-2xl text-maroon-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-green-700" />
          <span>පුද්ගලිකත්ව මධ්‍යස්ථානය (PDPA Privacy Center)</span>
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          2022 අංක 09 දරන ශ්‍රී ලංකා පුද්ගලික දත්ත ආරක්ෂණ පනත යටතේ ඔබ සතු අයිතිවාසිකම් මෙතැනින් ක්‍රියාත්මක කළ හැක.
        </p>
      </div>

      {/* 1. Download My Data */}
      <div className="p-6 bg-white rounded-3xl border border-maroon-100 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-700 shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-ink">
              මගේ දත්ත පිටපතක් ලබාගන්න (Download Machine-Readable Data)
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              අප පද්ධතිය සතු ඔබගේ ගිණුම් තොරතුරු, ලිපින, මිලදී ගත් පොත් සහ ඇණවුම් ඉතිහාසය පරිගණක කියවිය හැකි JSON ගොනුවක් ලෙස බාගත කරන්න.
            </p>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-700" />
            <span>ඔබගේ දත්ත ගොනුව සාර්ථකව බාගත විය.</span>
          </div>
        )}

        <Button variant="outline" size="sm" onClick={handleDownloadData}>
          <Download className="w-4 h-4 mr-1.5" />
          <span>දත්ත බාගත කරන්න (JSON Export)</span>
        </Button>
      </div>

      {/* 2. Right to Erasure */}
      <div className="p-6 bg-white rounded-3xl border border-red-100 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-red-50 text-red-700 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-red-900">
              ගිණුම සහ තොරතුරු මකාදැමීම (Right to Erasure / To be Forgotten)
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              ඔබගේ ගිණුම සහ පුද්ගලික තොරතුරු පද්ධතියෙන් ස්ථිරවම ඉවත් කිරීමට ඉල්ලුම් කරන්න. බදු සහ ගිණුම්කරණ නීතිමය හේතූන් මත අවශ්‍ය වන මූල්‍ය ලදුපත් හැර අනෙකුත් සියලුම තොරතුරු නිර්නාමික කරනු ඇත.
            </p>
          </div>
        </div>

        <Button variant="default" size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteRequest}>
          <Trash2 className="w-4 h-4 mr-1.5" />
          <span>ගිණුම මකාදැමීමට ඉල්ලුම් කරන්න</span>
        </Button>
      </div>
    </div>
  );
}
