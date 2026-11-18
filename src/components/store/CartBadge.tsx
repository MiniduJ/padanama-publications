"use client";

import { useCart } from "@/lib/cart-store";

export function CartBadge() {
  const { itemCount, isHydrated } = useCart();

  if (!isHydrated || itemCount === 0) return null;

  return (
    <span className="absolute -top-1.5 -right-1.5 bg-saffron-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-in fade-in zoom-in-50 duration-200">
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  );
}
