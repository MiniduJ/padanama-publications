"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { Home, BookOpen, Library, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, isHydrated } = useCart();

  const tabs = [
    { label: "මුල් පිටුව", href: "/", icon: Home },
    { label: "පොත්", href: "/books", icon: BookOpen },
    { label: "සාම්පල", href: "/library", icon: Library },
    {
      label: "බෑගය",
      href: "/cart",
      icon: ShoppingBag,
      badge: isHydrated && itemCount > 0 ? (itemCount > 99 ? "99+" : String(itemCount)) : undefined,
    },
    { label: "ගිණුම", href: "/account", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-maroon-100 shadow-lg px-2 py-1.5 flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold transition-colors relative",
              isActive ? "text-maroon-700" : "text-ink-muted hover:text-ink"
            )}
          >
            <div className="relative">
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
              {tab.badge && (
                <span className="absolute -top-1 -right-2 bg-saffron-500 text-white text-[9px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="mt-0.5 leading-none">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
