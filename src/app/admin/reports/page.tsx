"use client";

import React, { useState } from "react";
import { formatLkr } from "@/lib/money";
import {
  TrendingUp,
  Download,
  Calendar,
  Filter,
  Users,
  BookOpen,
  DollarSign,
  FileSpreadsheet,
} from "lucide-react";

interface RoyaltyEntry {
  id: string;
  authorName: string;
  bookTitle: string;
  format: "Paperback" | "Hardcover" | "E-Book";
  unitPriceCents: number;
  unitsSold: number;
  grossSalesCents: number;
  royaltyRatePercent: number;
  royaltyPayableCents: number;
}

const INITIAL_ROYALTIES: RoyaltyEntry[] = [
  {
    id: "r-1",
    authorName: "මහාචාර්ය ආනන්ද ගුණසේකර",
    bookTitle: "10 ශ්‍රේණිය සිංහල සාහිත්‍ය සංග්‍රහය",
    format: "Paperback",
    unitPriceCents: 75000,
    unitsSold: 420,
    grossSalesCents: 31500000, // Rs. 315,000
    royaltyRatePercent: 12,
    royaltyPayableCents: 3780000, // Rs. 37,800
  },
  {
    id: "r-2",
    authorName: "මහාචාර්ය ආනන්ද ගුණසේකර",
    bookTitle: "10 ශ්‍රේණිය සිංහල සාහිත්‍ය සංග්‍රහය",
    format: "E-Book",
    unitPriceCents: 45000,
    unitsSold: 185,
    grossSalesCents: 8325000,
    royaltyRatePercent: 20, // 20% on digital
    royaltyPayableCents: 1665000,
  },
  {
    id: "r-3",
    authorName: "කේ. එම්. බණ්ඩාර",
    bookTitle: "සාමාන්‍ය පෙළ ගණිතය කෙටි සටහන් සහ සූත්‍ර",
    format: "Paperback",
    unitPriceCents: 58000,
    unitsSold: 610,
    grossSalesCents: 35380000,
    royaltyRatePercent: 10,
    royaltyPayableCents: 3538000,
  },
  {
    id: "r-4",
    authorName: "ඉංජිනේරු සුගත් සමරවීර",
    bookTitle: "උසස් පෙළ සංයුක්ත ගණිතය",
    format: "Paperback",
    unitPriceCents: 125000,
    unitsSold: 280,
    grossSalesCents: 35000000,
    royaltyRatePercent: 12,
    royaltyPayableCents: 4200000,
  },
];

export default function AdminReportsPage() {
  const [period, setPeriod] = useState("2026-Q4");
  const [royalties] = useState<RoyaltyEntry[]>(INITIAL_ROYALTIES);

  const totalGrossCents = royalties.reduce((s, r) => s + r.grossSalesCents, 0);
  const totalRoyaltiesCents = royalties.reduce((s, r) => s + r.royaltyPayableCents, 0);
  const totalUnits = royalties.reduce((s, r) => s + r.unitsSold, 0);

  const handleExportCsv = () => {
    const headers = "Author,Book Title,Format,Unit Price (LKR),Units Sold,Gross Revenue (LKR),Royalty %,Royalty Payable (LKR)\n";
    const rows = royalties
      .map(
        (r) =>
          `"${r.authorName}","${r.bookTitle}","${r.format}",${r.unitPriceCents / 100},${r.unitsSold},${r.grossSalesCents / 100},${r.royaltyRatePercent}%,${r.royaltyPayableCents / 100}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `padanama-author-royalties-${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-saffron-500" />
            <span>Author Royalty Statements & Sales Reports</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Automated author royalty calculation based on contracted rates and units sold.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export to CSV (Excel)</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Total Gross Book Revenue
          </span>
          <div className="text-2xl font-black text-gray-900">
            {formatLkr(totalGrossCents, "en")}
          </div>
          <span className="text-[11px] text-gray-400">Total catalogue revenue for {period}</span>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Total Author Royalties Payable
          </span>
          <div className="text-2xl font-black text-maroon-900">
            {formatLkr(totalRoyaltiesCents, "en")}
          </div>
          <span className="text-[11px] text-gray-400">Calculated on net contracted percentages</span>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Total Copies Sold & Licensed
          </span>
          <div className="text-2xl font-black text-saffron-700">
            {totalUnits.toLocaleString()} units
          </div>
          <span className="text-[11px] text-gray-400">Print copies + Digital E-books</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <span className="font-bold text-xs text-gray-800">
            Author Royalty Breakdown ({period})
          </span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-xs font-semibold border border-gray-200 rounded-lg p-1.5 bg-gray-50"
          >
            <option value="2026-Q4">Q4 2026 (Oct - Dec)</option>
            <option value="2026-Q3">Q3 2026 (Jul - Sep)</option>
            <option value="2026-ANNUAL">Full Year 2026</option>
          </select>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">කර්තෘ (Author)</th>
                <th className="py-3 px-4">කෘතිය (Title)</th>
                <th className="py-3 px-4">ආකෘතිය (Format)</th>
                <th className="py-3 px-4">ඒකක මිල (Price)</th>
                <th className="py-3 px-4">විකිණූ ඒකක (Units)</th>
                <th className="py-3 px-4">Gross Sales</th>
                <th className="py-3 px-4">Royalty %</th>
                <th className="py-3 px-4 text-right">Royalty Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {royalties.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-900">{r.authorName}</td>
                  <td className="py-3.5 px-4 text-gray-800">{r.bookTitle}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-semibold">
                      {r.format}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{formatLkr(r.unitPriceCents, "en")}</td>
                  <td className="py-3.5 px-4 font-mono font-bold">{r.unitsSold}</td>
                  <td className="py-3.5 px-4">{formatLkr(r.grossSalesCents, "en")}</td>
                  <td className="py-3.5 px-4 font-bold text-saffron-700">
                    {r.royaltyRatePercent}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-maroon-900">
                    {formatLkr(r.royaltyPayableCents, "en")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {royalties.map((r) => (
            <div key={r.id} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{r.authorName}</h4>
                  <p className="text-xs text-gray-600 leading-tight">{r.bookTitle}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-700 shrink-0">
                  {r.format}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 block">Units Sold</span>
                  <span className="font-mono font-bold text-gray-800">{r.unitsSold} copies</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Contract Rate</span>
                  <span className="font-bold text-saffron-700">{r.royaltyRatePercent}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Gross Sales</span>
                  <span className="font-semibold text-gray-700">{formatLkr(r.grossSalesCents, "en")}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Royalty Payable</span>
                  <span className="font-extrabold text-maroon-900">{formatLkr(r.royaltyPayableCents, "en")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
