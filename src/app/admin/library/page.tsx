"use client";

import React, { useState } from "react";
import {
  Library,
  BookOpen,
  Lock,
  Plus,
  ShieldCheck,
  Check,
  UserCheck,
  Eye,
  Sliders,
} from "lucide-react";

interface SampleRule {
  id: string;
  bookSlug: string;
  bookTitle: string;
  maxSamplePages: number;
  percentageLimit: number;
  isActive: boolean;
}

const INITIAL_RULES: SampleRule[] = [
  {
    id: "sr-1",
    bookSlug: "scholarship-grade-5-model-papers",
    bookTitle: "5 ශ්‍රේණිය ශිෂ්‍යත්ව පෙරහුරු ප්‍රශ්න පත්‍ර",
    maxSamplePages: 20,
    percentageLimit: 15,
    isActive: true,
  },
  {
    id: "sr-2",
    bookSlug: "ol-mathematics-short-notes",
    bookTitle: "සාමාන්‍ය පෙළ ගණිතය කෙටි සටහන් සහ සූත්‍ර සංග්‍රහය",
    maxSamplePages: 20,
    percentageLimit: 20,
    isActive: true,
  },
  {
    id: "sr-3",
    bookSlug: "sinhala-sahithya-sangrahaya-gr10",
    bookTitle: "10 ශ්‍රේණිය සිංහල සාහිත්‍ය සංග්‍රහය",
    maxSamplePages: 25,
    percentageLimit: 15,
    isActive: true,
  },
];

export default function AdminLibraryPage() {
  const [rules, setRules] = useState<SampleRule[]>(INITIAL_RULES);
  const [reviewEmail, setReviewEmail] = useState("");
  const [selectedBook, setSelectedBook] = useState(rules[0].bookSlug);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUpdatePages = (ruleId: string, newMax: number) => {
    setRules(
      rules.map((r) => (r.id === ruleId ? { ...r, maxSamplePages: Math.max(5, newMax) } : r))
    );
    setToastMessage("නොමිලේ සාම්පල සීමාව යාවත්කාලීන කරන ලදී (Sample Boundary Updated)");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGrantReviewCopy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewEmail) return;
    setToastMessage(
      `නොමිලේ කියවීමේ බලපත්‍රය (Review Copy Entitlement) ${reviewEmail} වෙත සාර්ථකව පවරන ලදී.`
    );
    setReviewEmail("");
    setTimeout(() => setToastMessage(null), 4000);
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
            <Library className="w-6 h-6 text-saffron-500" />
            <span>Digital Library & Sample Preview Rules</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure free sample page cutoffs, DRM watermarking, and review copy entitlements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sample Rules Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-saffron-500" />
              <span>පොත් සඳහා නොමිලේ සාම්පල සීමා (Sample Page Cutoff Configuration)</span>
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="font-bold text-xs text-gray-900 block">{rule.bookTitle}</span>
                  <span className="text-[11px] text-gray-400 font-mono">/read/{rule.bookSlug}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">නොමිලේ පිටු ගණන:</span>
                    <input
                      type="number"
                      value={rule.maxSamplePages}
                      onChange={(e) => handleUpdatePages(rule.id, Number(e.target.value))}
                      className="w-16 p-1.5 border border-gray-200 rounded-lg text-center font-bold"
                    />
                  </div>

                  <a
                    href={`/read/${rule.bookSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-gray-400 hover:text-maroon-900"
                    title="Live Reader Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Grant Review Copy Entitlement */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-green-700" />
              <span>Manual Review Copy Grant (විචාරක පිටපත්)</span>
            </h3>
            <p className="text-[11px] text-gray-500 mt-1">
              Grant a 100% free digital reading entitlement to a teacher, examiner, or literary reviewer.
            </p>
          </div>

          <form onSubmit={handleGrantReviewCopy} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Select Book Title:</label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-semibold"
              >
                {rules.map((r) => (
                  <option key={r.id} value={r.bookSlug}>
                    {r.bookTitle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Recipient Email or Phone (+94):
              </label>
              <input
                type="text"
                required
                value={reviewEmail}
                onChange={(e) => setReviewEmail(e.target.value)}
                placeholder="reviewer@school.lk or 0718008533"
                className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-maroon-900 hover:bg-maroon-950 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Grant Full Digital Access</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
