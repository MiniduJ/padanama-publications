"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatLkr } from "@/lib/money";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit2,
  Check,
  AlertTriangle,
  ArrowUpDown,
  BookMarked,
  Eye,
} from "lucide-react";

interface AdminBook {
  id: string;
  slug: string;
  titleSi: string;
  titleEn: string;
  author: string;
  category: string;
  formats: {
    format: "PAPERBACK" | "HARDCOVER" | "EBOOK";
    isbn?: string;
    priceCents: number;
    stock: number;
  }[];
  samplePages: number;
  isActive: boolean;
}

const INITIAL_BOOKS: AdminBook[] = [
  {
    id: "b-1",
    slug: "scholarship-grade-5-model-papers",
    titleSi: "5 ශ්‍රේණිය ශිෂ්‍යත්ව පෙරහුරු ප්‍රශ්න පත්‍ර",
    titleEn: "Grade 5 Scholarship Model Papers",
    author: "පදනම කර්තෘ මණ්ඩලය",
    category: "Grade 5 Scholarship",
    formats: [
      { format: "PAPERBACK", isbn: "978-955-8001-01-2", priceCents: 65000, stock: 245 },
      { format: "EBOOK", priceCents: 35000, stock: 99999 },
    ],
    samplePages: 20,
    isActive: true,
  },
  {
    id: "b-2",
    slug: "ol-mathematics-short-notes",
    titleSi: "සාමාන්‍ය පෙළ ගණිතය කෙටි සටහන් සහ සූත්‍ර සංග්‍රහය",
    titleEn: "O/L Mathematics Short Notes & Formula Book",
    author: "කේ. එම්. බණ්ඩාර",
    category: "G.C.E. O/L",
    formats: [
      { format: "PAPERBACK", isbn: "978-955-8001-02-9", priceCents: 58000, stock: 180 },
      { format: "EBOOK", priceCents: 32000, stock: 99999 },
    ],
    samplePages: 20,
    isActive: true,
  },
  {
    id: "b-3",
    slug: "sinhala-sahithya-sangrahaya-gr10",
    titleSi: "10 ශ්‍රේණිය සිංහල සාහිත්‍ය සංග්‍රහය විචාර සහ රසවින්දනය",
    titleEn: "Grade 10 Sinhala Literature Appreciation & Analysis",
    author: "මහාචාර්ය ආනන්ද ගුණසේකර",
    category: "Sinhala Literature",
    formats: [
      { format: "PAPERBACK", isbn: "978-955-8001-03-6", priceCents: 75000, stock: 3 }, // low stock
      { format: "HARDCOVER", isbn: "978-955-8001-04-3", priceCents: 110000, stock: 45 },
      { format: "EBOOK", priceCents: 45000, stock: 99999 },
    ],
    samplePages: 25,
    isActive: true,
  },
  {
    id: "b-4",
    slug: "al-combined-maths-applied",
    titleSi: "උසස් පෙළ සංයුක්ත ගණිතය — ප්‍රායෝගික ගණිතය",
    titleEn: "G.C.E. A/L Combined Mathematics — Applied Maths",
    author: "ඉංජිනේරු සුගත් සමරවීර",
    category: "G.C.E. A/L",
    formats: [
      { format: "PAPERBACK", isbn: "978-955-8001-05-0", priceCents: 125000, stock: 95 },
    ],
    samplePages: 30,
    isActive: true,
  },
];

export default function AdminCatalogPage() {
  const [books, setBooks] = useState<AdminBook[]>(INITIAL_BOOKS);
  const [search, setSearch] = useState("");
  const [editingBook, setEditingBook] = useState<AdminBook | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredBooks = books.filter(
    (b) =>
      b.titleSi.toLowerCase().includes(search.toLowerCase()) ||
      b.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuickStockUpdate = (bookId: string, formatIndex: number, newStock: number) => {
    setBooks(
      books.map((b) => {
        if (b.id !== bookId) return b;
        const newFormats = [...b.formats];
        newFormats[formatIndex] = { ...newFormats[formatIndex], stock: Math.max(0, newStock) };
        return { ...b, formats: newFormats };
      })
    );
    setSuccessToast("තොග ප්‍රමාණය යාවත්කාලීන කරන ලදී (Stock Updated)");
    setTimeout(() => setSuccessToast(null), 2500);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-800 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Catalog & Editions Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage titles, ISBNs, multi-format prices (LKR cents), and warehouse physical inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            alert("නව පොතක් ඇතුළත් කිරීමේ පෝරමය විවෘත වේ (New Title Creation Form)");
          }}
          className="px-4 py-2.5 bg-maroon-900 hover:bg-maroon-950 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>නව පොතක් එක් කරන්න (Add New Book)</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Sinhala title, English title, or author..."
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Books Table: Desktop Table & Mobile Stacked Cards */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">පොතේ නම (Book Title)</th>
                <th className="py-3 px-4">කර්තෘ (Author)</th>
                <th className="py-3 px-4">කාණ්ඩය (Category)</th>
                <th className="py-3 px-4">මුද්‍රණ වර්ග සහ මිල (Editions & Price)</th>
                <th className="py-3 px-4">තොගය (Stock)</th>
                <th className="py-3 px-4 text-right">ක්‍රියා (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-gray-900 block leading-tight">
                      {book.titleSi}
                    </span>
                    <span className="text-[11px] text-gray-400 block">{book.titleEn}</span>
                    <span className="text-[10px] text-saffron-700 font-mono">
                      /books/{book.slug}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium">{book.author}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-700">
                      {book.category}
                    </span>
                  </td>

                  {/* Editions */}
                  <td className="py-3.5 px-4 space-y-1">
                    {book.formats.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]">
                        <span className="font-semibold text-gray-800">
                          {f.format === "PAPERBACK"
                            ? "PB"
                            : f.format === "HARDCOVER"
                            ? "HC"
                            : "EBOOK"}
                          :
                        </span>
                        <span className="font-bold text-maroon-900">
                          {formatLkr(f.priceCents, "en")}
                        </span>
                        {f.isbn && (
                          <span className="text-[10px] font-mono text-gray-400">({f.isbn})</span>
                        )}
                      </div>
                    ))}
                  </td>

                  {/* Stock Levels */}
                  <td className="py-3.5 px-4">
                    {book.formats.map((f, idx) => {
                      if (f.format === "EBOOK") {
                        return (
                          <span key={idx} className="text-[10px] text-green-700 font-bold block">
                            ∞ Digital
                          </span>
                        );
                      }
                      const isLow = f.stock <= 5;
                      return (
                        <div key={idx} className="flex items-center gap-1.5 py-0.5">
                          <span
                            className={`font-mono font-bold text-xs ${
                              isLow ? "text-red-600" : "text-gray-900"
                            }`}
                          >
                            {f.stock} copies
                          </span>
                          {isLow && (
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          )}
                          <div className="flex items-center gap-0.5 ml-2">
                            <button
                              type="button"
                              onClick={() => handleQuickStockUpdate(book.id, idx, f.stock - 1)}
                              className="w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded text-center text-xs font-bold leading-none"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickStockUpdate(book.id, idx, f.stock + 10)}
                              className="w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded text-center text-xs font-bold leading-none"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      href={`/books/${book.slug}`}
                      target="_blank"
                      className="p-1.5 text-gray-400 hover:text-maroon-900 inline-block"
                      title="View on Storefront"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/read/${book.slug}`}
                      target="_blank"
                      className="p-1.5 text-gray-400 hover:text-saffron-600 inline-block"
                      title="Preview Reader"
                    >
                      <BookOpen className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredBooks.map((book) => (
            <div key={book.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-sm text-gray-900 leading-tight">
                    {book.titleSi}
                  </h3>
                  <p className="text-[11px] text-gray-500">{book.titleEn}</p>
                  <p className="text-[10px] text-saffron-700 font-semibold">{book.author}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-700 shrink-0">
                  {book.category}
                </span>
              </div>

              {/* Formats & Stock Grid */}
              <div className="p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Editions & Warehouse Stock
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {book.formats.map((f, idx) => {
                    const isLow = f.format !== "EBOOK" && f.stock <= 5;
                    return (
                      <div key={idx} className="p-2 bg-white rounded-lg border border-gray-100 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-gray-700 text-[11px]">{f.format}</span>
                          <span className="text-maroon-900">{formatLkr(f.priceCents, "en")}</span>
                        </div>
                        {f.format === "EBOOK" ? (
                          <span className="text-[10px] text-green-700 font-bold block">∞ Digital Unlimited</span>
                        ) : (
                          <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                            <span className={`text-[10px] font-mono font-bold ${isLow ? "text-red-600" : "text-gray-700"}`}>
                              {f.stock} in stock {isLow && "⚠️"}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleQuickStockUpdate(book.id, idx, f.stock - 1)}
                                className="w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded text-center text-xs font-bold"
                              >
                                -
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickStockUpdate(book.id, idx, f.stock + 10)}
                                className="w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded text-center text-xs font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <Link
                  href={`/books/${book.slug}`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:text-maroon-900 text-xs font-bold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Storefront</span>
                </Link>
                <Link
                  href={`/read/${book.slug}`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Reader</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
