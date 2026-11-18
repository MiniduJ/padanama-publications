import React from "react";
import { Link } from "@/i18n/routing";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { MobileBottomNav } from "@/components/store/MobileBottomNav";
import {
  User,
  ShoppingBag,
  BookOpen,
  MapPin,
  ShieldCheck,
  LogOut,
} from "lucide-react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: "ගිණුම් දළ විශ්ලේෂණය (Overview)", href: "/account", icon: User },
    { label: "මගේ ඇණවුම් (Order History)", href: "/account/orders", icon: ShoppingBag },
    { label: "මගේ පුස්තකාලය (My E-Books)", href: "/account/my-library", icon: BookOpen },
    { label: "ලිපින පොත (Saved Addresses)", href: "/account/addresses", icon: MapPin },
    { label: "පුද්ගලිකත්ව මධ්‍යස්ථානය (PDPA Privacy)", href: "/account/privacy", icon: ShieldCheck },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Customer Navigation Sidebar */}
          <aside className="bg-white p-6 rounded-2xl border border-maroon-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-maroon-700 text-cream font-bold text-lg flex items-center justify-center border-2 border-gold-500">
                ද
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-sm text-ink block truncate">
                  දිල්රුක්ෂි ජයවර්ධන
                </span>
                <span className="text-xs text-ink-muted block truncate">
                  077 123 4567
                </span>
              </div>
            </div>

            <nav className="space-y-1 text-xs font-semibold">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-maroon-50 text-ink hover:text-maroon-900 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-saffron-500 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-gray-100">
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>පිටවීම (Sign Out)</span>
                </Link>
              </div>
            </nav>
          </aside>

          {/* Customer Content View */}
          <div className="md:col-span-3">{children}</div>
        </div>
      </main>
      <StoreFooter />
      <MobileBottomNav />
    </div>
  );
}
