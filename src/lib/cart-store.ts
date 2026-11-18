import { useEffect, useState, useSyncExternalStore } from "react";
import { formatLkr } from "./money";

export interface CartItem {
  id: string; // `${bookId}_${format}`
  bookId: string;
  slug: string;
  title: string;
  titleSi?: string;
  titleEn?: string;
  titleTa?: string;
  authorName: string;
  format: "PAPERBACK" | "HARDCOVER" | "EBOOK";
  priceCents: number;
  originalPriceCents?: number;
  quantity: number;
  coverImage?: string;
  weightGrams: number;
}

export interface AppliedCoupon {
  code: string;
  discountCents: number;
  type: "PERCENT" | "FIXED";
  value: number; // e.g. 10 for 10% or 50000 for Rs. 500
  description: string;
}

export interface CartState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
}

const STORAGE_KEY = "padanama_cart_v1";
const CART_UPDATE_EVENT = "padanama_cart_change";

const DEFAULT_STATE: CartState = {
  items: [],
  coupon: null,
};

// Available promotional coupons for Padanama Publications
export const VALID_COUPONS: Record<string, { type: "PERCENT" | "FIXED"; value: number; minSubtotalCents: number; description: string }> = {
  WELCOME10: {
    type: "PERCENT",
    value: 10,
    minSubtotalCents: 100000, // Rs. 1,000
    description: "Welcome Discount: 10% off on your first order",
  },
  PADANAMA500: {
    type: "FIXED",
    value: 50000, // Rs. 500
    minSubtotalCents: 250000, // Rs. 2,500
    description: "Padanama Readers Club: Rs. 500 off orders over Rs. 2,500",
  },
  CIBF2026: {
    type: "PERCENT",
    value: 20,
    minSubtotalCents: 150000, // Rs. 1,500
    description: "Colombo International Book Fair: 20% Special Discount",
  },
};

function getStoredState(): CartState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_STATE;
  }
}

function saveStoredState(state: CartState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event(CART_UPDATE_EVENT));
  } catch (e) {
    console.error("Failed to save cart to localStorage", e);
  }
}

// Memory cache for useSyncExternalStore
let cachedState = DEFAULT_STATE;
if (typeof window !== "undefined") {
  cachedState = getStoredState();
}

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent | Event) => {
    cachedState = getStoredState();
    callback();
  };
  if (typeof window !== "undefined") {
    window.addEventListener(CART_UPDATE_EVENT, handleStorage);
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener(CART_UPDATE_EVENT, handleStorage);
      window.removeEventListener("storage", handleStorage);
    }
  };
}

export function getCartSnapshot(): CartState {
  return cachedState;
}

export const cartActions = {
  addItem(item: Omit<CartItem, "quantity">, quantity: number = 1) {
    const current = getStoredState();
    const existingIndex = current.items.findIndex((i) => i.id === item.id);
    let nextItems: CartItem[];

    if (existingIndex > -1) {
      nextItems = current.items.map((i, idx) =>
        idx === existingIndex ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      nextItems = [...current.items, { ...item, quantity }];
    }

    // Recalculate coupon discount if present
    const updatedCoupon = recalculateCoupon(current.coupon, nextItems);

    cachedState = { items: nextItems, coupon: updatedCoupon };
    saveStoredState(cachedState);
    emitChange();
  },

  updateQuantity(itemId: string, quantity: number) {
    const current = getStoredState();
    let nextItems: CartItem[];
    if (quantity <= 0) {
      nextItems = current.items.filter((i) => i.id !== itemId);
    } else {
      nextItems = current.items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
    }

    const updatedCoupon = recalculateCoupon(current.coupon, nextItems);
    cachedState = { items: nextItems, coupon: updatedCoupon };
    saveStoredState(cachedState);
    emitChange();
  },

  removeItem(itemId: string) {
    const current = getStoredState();
    const nextItems = current.items.filter((i) => i.id !== itemId);
    const updatedCoupon = recalculateCoupon(current.coupon, nextItems);
    cachedState = { items: nextItems, coupon: updatedCoupon };
    saveStoredState(cachedState);
    emitChange();
  },

  clearCart() {
    cachedState = DEFAULT_STATE;
    saveStoredState(DEFAULT_STATE);
    emitChange();
  },

  applyCoupon(rawCode: string): { success: boolean; message: string } {
    const code = rawCode.trim().toUpperCase();
    const couponDef = VALID_COUPONS[code];
    if (!couponDef) {
      return { success: false, message: "වලංගු නොවන කූපන් කේතයකි (Invalid coupon code)" };
    }

    const current = getStoredState();
    const subtotalCents = current.items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

    if (subtotalCents < couponDef.minSubtotalCents) {
      return {
        success: false,
        message: `මෙම කූපනය සඳහා අවම ඇණවුම් අගය ${formatLkr(couponDef.minSubtotalCents, "si")} විය යුතුය.`,
      };
    }

    let discountCents = 0;
    if (couponDef.type === "PERCENT") {
      discountCents = Math.round((subtotalCents * couponDef.value) / 100);
    } else {
      discountCents = couponDef.value;
    }

    const applied: AppliedCoupon = {
      code,
      discountCents,
      type: couponDef.type,
      value: couponDef.value,
      description: couponDef.description,
    };

    cachedState = { ...current, coupon: applied };
    saveStoredState(cachedState);
    emitChange();
    return { success: true, message: `කූපනය සාර්ථකව ඇතුළත් විය (${applied.description})` };
  },

  removeCoupon() {
    const current = getStoredState();
    cachedState = { ...current, coupon: null };
    saveStoredState(cachedState);
    emitChange();
  },
};

function recalculateCoupon(coupon: AppliedCoupon | null, items: CartItem[]): AppliedCoupon | null {
  if (!coupon) return null;
  const def = VALID_COUPONS[coupon.code];
  if (!def) return null;

  const subtotalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  if (subtotalCents < def.minSubtotalCents) {
    return null; // Coupon revoked due to dropping below minimum
  }

  let discountCents = 0;
  if (def.type === "PERCENT") {
    discountCents = Math.round((subtotalCents * def.value) / 100);
  } else {
    discountCents = def.value;
  }

  return {
    ...coupon,
    discountCents,
  };
}

export const FREE_DELIVERY_THRESHOLD_CENTS = 350000; // Rs. 3,500.00

export function useCart() {
  const [isClient, setIsClient] = useState(false);
  const cart = useSyncExternalStore(subscribe, getCartSnapshot, () => DEFAULT_STATE);

  useEffect(() => {
    setIsClient(true);
    cachedState = getStoredState();
    emitChange();
  }, []);

  const items = isClient ? cart.items : [];
  const coupon = isClient ? cart.coupon : null;

  const subtotalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  const originalSubtotalCents = items.reduce(
    (sum, item) => sum + (item.originalPriceCents || item.priceCents) * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const weightGrams = items.reduce(
    (sum, item) => sum + (item.format === "EBOOK" ? 0 : item.weightGrams * item.quantity),
    0
  );

  const discountCents = coupon ? coupon.discountCents : 0;
  const netSubtotalCents = Math.max(0, subtotalCents - discountCents);

  const isFreeDelivery = subtotalCents >= FREE_DELIVERY_THRESHOLD_CENTS;
  const distanceToFreeDeliveryCents = Math.max(0, FREE_DELIVERY_THRESHOLD_CENTS - subtotalCents);
  const freeDeliveryProgressPercent = Math.min(
    100,
    Math.round((subtotalCents / FREE_DELIVERY_THRESHOLD_CENTS) * 100)
  );

  return {
    items,
    itemCount,
    subtotalCents,
    originalSubtotalCents,
    discountCents,
    netSubtotalCents,
    weightGrams,
    coupon,
    isFreeDelivery,
    distanceToFreeDeliveryCents,
    freeDeliveryProgressPercent,
    freeDeliveryThresholdCents: FREE_DELIVERY_THRESHOLD_CENTS,
    isHydrated: isClient,
    addItem: cartActions.addItem,
    updateQuantity: cartActions.updateQuantity,
    removeItem: cartActions.removeItem,
    clearCart: cartActions.clearCart,
    applyCoupon: cartActions.applyCoupon,
    removeCoupon: cartActions.removeCoupon,
  };
}
