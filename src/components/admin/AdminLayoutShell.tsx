"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Library,
  ShoppingBag,
  FileCheck,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Store,
  Images,
  Star,
  Share2,
  FileText,
  Inbox,
  Users,
  UserCheck,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

interface AdminLayoutShellProps {
  children: React.ReactNode;
}

const NAV_ITEMS: { href: string; label: string; icon: any; badge?: number }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders & Deliveries", icon: ShoppingBag },
  { href: "/admin/slips", label: "Bank Slip Queue", icon: FileCheck },
  { href: "/admin/catalog", label: "Catalogue", icon: BookOpen },
  { href: "/admin/categories", label: "Categories", icon: Library },
  { href: "/admin/banners", label: "Hero Slides", icon: Images },
  { href: "/admin/testimonials", label: "Reviews", icon: Star },
  { href: "/admin/social", label: "Social Feed", icon: Share2 },
  { href: "/admin/content", label: "Page Content", icon: FileText },
  { href: "/admin/messages", label: "Inbox", icon: Inbox },
  { href: "/admin/customers", label: "Customers", icon: UserCheck },
  { href: "/admin/finance", label: "Finance", icon: TrendingUp },
  { href: "/admin/staff", label: "Staff", icon: Users },
];

export function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // If on admin login page, render clean full-screen standalone page without the admin sidebar or shell
  if (pathname === "/admin/login") {
    return <main className="w-full min-h-screen">{children}</main>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
      window.location.href = "/admin/login";
    } catch {
      window.location.href = "/admin/login";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 font-sans flex flex-col lg:flex-row">
      {/* ================= MOBILE ADMIN APP BAR (<1024px) ================= */}
      <header className="lg:hidden sticky top-0 z-40 bg-brandNavy text-cream h-16 px-4 flex items-center justify-between border-b border-brandNavy/60 shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 -ml-2 rounded-xl text-cream hover:text-brandYellow hover:bg-white/10 transition-colors"
            aria-label="Toggle admin navigation menu"
          >
            {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brandYellow text-brandNavy font-black flex items-center justify-center text-sm shadow">
              ප
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block leading-none">
                Padanama Admin
              </span>
              <span className="text-[10px] text-brandYellow font-semibold">Management Console</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          

          <Link
            href="/"
            className="p-2 rounded-xl text-cream/80 hover:text-white hover:bg-white/10"
            title="View Storefront"
          >
            <Store className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* ================= MOBILE SLIDE-OVER DRAWER (<1024px) ================= */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] bg-brandNavy text-cream flex flex-col h-full shadow-2xl z-10 border-r border-brandNavy/70">
            <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brandYellow text-brandNavy font-black flex items-center justify-center text-sm shadow">
                  ප
                </div>
                <span className="font-extrabold text-sm text-white">Navigation</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-cream/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-brandRed text-white shadow-md font-bold"
                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-brandYellow"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-[11px] font-black rounded-full bg-brandYellow text-brandNavy shadow">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 hover:text-white transition-colors"
              >
                <Store className="w-4 h-4 text-brandYellow" />
                <span>Back to Storefront</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ================= DESKTOP STATIC SIDEBAR (>=1024px) ================= */}
      <aside className="hidden lg:flex w-64 bg-brandNavy text-cream flex-col border-r border-brandNavy/80 shrink-0 sticky top-0 h-screen">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-brandYellow text-brandNavy font-black flex items-center justify-center text-base shadow">
            ප
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide block text-white">Padanama Admin</span>
            <span className="text-[10px] text-brandYellow font-semibold">SUPER_ADMIN Console</span>
          </div>
        </div>

        <nav className="flex-1 py-5 px-3 space-y-1.5 text-sm font-medium overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-brandRed text-white shadow-md font-bold"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-brandYellow"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-brandYellow text-brandNavy shadow">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-brandYellow" />
            <span>Back to Storefront</span>
            <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-300 hover:text-white hover:bg-red-500/20 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ================= ADMIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col min-w-0 w-full overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 pb-12">
        {children}
      </main>
    </div>
  );
}