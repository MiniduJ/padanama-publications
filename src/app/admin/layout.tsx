import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Library,
  ShoppingBag,
  FileCheck,
  TrendingUp,
  Settings,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import "../globals.css";

export const metadata = {
  title: "Padanama Admin Console",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 font-sans flex">
        {/* Admin Navigation Sidebar */}
        <aside className="w-64 bg-maroon-900 text-cream flex flex-col border-r border-maroon-800 shrink-0">
          <div className="h-20 flex items-center gap-3 px-6 border-b border-maroon-800">
            <div className="w-9 h-9 rounded-lg bg-gold-500 text-maroon-950 font-bold flex items-center justify-center">
              ප
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide block">Padanama Admin</span>
              <span className="text-[10px] text-gold-500 font-medium">Role: SUPER_ADMIN</span>
            </div>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1 text-sm font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-maroon-800/80 text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-gold-500" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/catalog"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-maroon-800 text-cream/90 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-gold-500" />
              <span>Catalog Management</span>
            </Link>

            <Link
              href="/admin/library"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-maroon-800 text-cream/90 transition-colors"
            >
              <Library className="w-4 h-4 text-gold-500" />
              <span>Digital Library & Samples</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-maroon-800 text-cream/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-gold-500" />
              <span>Orders & Fulfillment</span>
            </Link>

            <Link
              href="/admin/slips"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-maroon-800 text-cream/90 transition-colors"
            >
              <FileCheck className="w-4 h-4 text-gold-500" />
              <span className="flex-1">Bank Slip Queue</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-saffron-500 text-white">
                3
              </span>
            </Link>

            <Link
              href="/admin/reports"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-maroon-800 text-cream/90 transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-gold-500" />
              <span>Royalties & Reports</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-maroon-800 text-cream/90 transition-colors"
            >
              <Settings className="w-4 h-4 text-gold-500" />
              <span>Tax, Shipping & Gateways</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-maroon-800">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs text-cream/70 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
