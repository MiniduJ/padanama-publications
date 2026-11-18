"use client";

import React, { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useCart, VALID_COUPONS } from "@/lib/cart-store";
import { formatLkr } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  BookOpen,
} from "lucide-react";

const SRI_LANKA_DISTRICTS = [
  { id: "colombo", name: "Colombo (කොළඹ / கொழும்பு)", rate: 20000 },
  { id: "gampaha", name: "Gampaha (ගම්පහ / கம்பஹா)", rate: 25000 },
  { id: "kalutara", name: "Kalutara (කළුතර / களுத்துறை)", rate: 25000 },
  { id: "kandy", name: "Kandy (මහනුවර / கண்டி)", rate: 30000 },
  { id: "matale", name: "Matale (මාතලේ / மாத்தளை)", rate: 30000 },
  { id: "nuwara-eliya", name: "Nuwara Eliya (නුවරඑළිය / நுவரெலியா)", rate: 30000 },
  { id: "galle", name: "Galle (ගාල්ල / காலி)", rate: 30000 },
  { id: "matara", name: "Matara (මාතර / மாத்தறை)", rate: 30000 },
  { id: "hambantota", name: "Hambantota (හම්බන්තොට / அம்பாந்தோட்டை)", rate: 30000 },
  { id: "jaffna", name: "Jaffna (යාපනය / யாழ்ப்பாணம்)", rate: 35000 },
  { id: "kilinochchi", name: "Kilinochchi (කිලිනොච්චිය / கிளிநொச்சி)", rate: 35000 },
  { id: "mannar", name: "Mannar (මන්නාරම / மன்னார்)", rate: 35000 },
  { id: "vavuniya", name: "Vavuniya (වවුනියාව / வவுனியா)", rate: 35000 },
  { id: "mullaitivu", name: "Mullaitivu (මුලතිව් / முல்லைத்தீவு)", rate: 35000 },
  { id: "batticaloa", name: "Batticaloa (මඩකලපුව / மட்டக்களப்பு)", rate: 35000 },
  { id: "ampara", name: "Ampara (අම්පාර / அம்பாறை)", rate: 35000 },
  { id: "trincomalee", name: "Trincomalee (ත්‍රිකුණාමලය / திருகோணமலை)", rate: 35000 },
  { id: "kurunegala", name: "Kurunegala (කුරුණෑගල / குருநாகல்)", rate: 30000 },
  { id: "puttalam", name: "Puttalam (පුත්තලම / புத்தளம்)", rate: 30000 },
  { id: "anuradhapura", name: "Anuradhapura (අනුරාධපුරය / அனுராதபுரம்)", rate: 35000 },
  { id: "polonnaruwa", name: "Polonnaruwa (පොළොන්නරුව / பொலன்னறுவை)", rate: 35000 },
  { id: "badulla", name: "Badulla (බදුල්ල / பதுளை)", rate: 35000 },
  { id: "monaragala", name: "Monaragala (මොනරාගල / மொனராகலை)", rate: 35000 },
  { id: "ratnapura", name: "Ratnapura (රත්නපුර / இரத்தினபுரி)", rate: 30000 },
  { id: "kegalle", name: "Kegalle (කෑගල්ල / கேகாலை)", rate: 30000 },
];

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotalCents,
    discountCents,
    netSubtotalCents,
    coupon,
    isFreeDelivery,
    distanceToFreeDeliveryCents,
    freeDeliveryProgressPercent,
    isHydrated,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState("colombo");

  const currentDistrictObj =
    SRI_LANKA_DISTRICTS.find((d) => d.id === selectedDistrict) || SRI_LANKA_DISTRICTS[0];

  const deliveryCents = isFreeDelivery || items.every((i) => i.format === "EBOOK")
    ? 0
    : currentDistrictObj.rate;

  const grandTotalCents = netSubtotalCents + deliveryCents;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback({ text: res.message, isError: !res.success });
    if (res.success) setCouponCode("");
  };

  const handleQuickCoupon = (code: string) => {
    const res = applyCoupon(code);
    setCouponFeedback({ text: res.message, isError: !res.success });
  };

  if (!isHydrated) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-maroon-100/50 rounded w-48 mx-auto" />
          <div className="h-64 bg-cream/70 rounded-2xl max-w-4xl mx-auto" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="ඔබගේ පොත් බෑගය හිස්ව පවතී (Your Cart is Empty)"
          description="ඔබ මෙතෙක් කිසිදු පොතක් බෑගයට එක් කර නොමැත. පදනම ප්‍රකාශන විශිෂ්ට පොත් එකතුවෙන් ඔබ කැමති පොත් තෝරාගන්න."
          icon={ShoppingBag}
          actionLabel="පොත් නාමාවලිය වෙත (Browse Catalog)"
          onAction={() => {
            router.push("/books");
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Milestone Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-black text-2xl sm:text-3xl text-maroon-900">
            සාප්පු සවාරි බෑගය (Shopping Cart)
            <span className="text-sm font-normal text-ink-muted ml-3">
              ({itemCount} {itemCount === 1 ? "පොතක්" : "පොත්"})
            </span>
          </h1>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-red-600 hover:text-red-800 underline font-semibold"
          >
            බෑගය හිස් කරන්න (Clear All)
          </button>
        </div>

        {/* Free Delivery Milestone Progress Meter */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cream via-white to-cream border border-gold-500/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-maroon-900">
              <Sparkles className="w-4 h-4 text-gold-500" />
              {isFreeDelivery ? (
                <span className="text-green-700">
                  🎉 සුබ පැතුම්! ඔබ නොමිලේ දිවයින පුරා බෙදාහැරීම දිනාගත්තා! (Free Delivery Unlocked!)
                </span>
              ) : (
                <span>
                  නොමිලේ දිවයින පුරා බෙදාහැරීම ලබාගැනීමට තවත්{" "}
                  <strong className="text-saffron-700 font-black">
                    {formatLkr(distanceToFreeDeliveryCents, "si")}
                  </strong>{" "}
                  ක පොත් එක්කරන්න!
                </span>
              )}
            </span>
            <span className="text-ink-muted">{freeDeliveryProgressPercent}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isFreeDelivery ? "bg-green-600" : "bg-gradient-to-r from-saffron-500 to-gold-500"
              }`}
              style={{ width: `${freeDeliveryProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-maroon-100 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              {/* Book Info */}
              <div className="flex gap-4 items-start">
                <div className="w-16 h-22 sm:w-20 sm:h-28 rounded-lg overflow-hidden bg-maroon-50 border border-maroon-200 shrink-0 shadow-inner flex items-center justify-center">
                  {item.coverImage ? (
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-6 h-6 text-maroon-400" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.format === "EBOOK" ? "gold" : "maroon"}>
                      {item.format === "PAPERBACK"
                        ? "සාමාන්‍ය මුද්‍රණය"
                        : item.format === "HARDCOVER"
                        ? "දෘඩ කවරය"
                        : "ඊ-පොත (ඩිජිටල්)"}
                    </Badge>
                  </div>
                  <Link
                    href={`/books/${item.slug}`}
                    className="font-display font-bold text-base sm:text-lg text-maroon-900 hover:text-saffron-700 transition-colors line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-ink-muted">{item.authorName}</p>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-bold text-sm text-saffron-700">
                      {formatLkr(item.priceCents, "si")}
                    </span>
                    {item.originalPriceCents && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatLkr(item.originalPriceCents, "si")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls & Subtotal */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                {item.format === "EBOOK" ? (
                  <span className="text-[11px] font-semibold text-ink-muted bg-gray-100 px-2.5 py-1 rounded-md">
                    1 ඩිජිටල් පිටපතකි
                  </span>
                ) : (
                  <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-gray-500 hover:text-maroon-900 transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-xs text-ink px-2">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-gray-500 hover:text-maroon-900 transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="text-right">
                  <span className="font-display font-black text-base text-maroon-900 block">
                    {formatLkr(item.priceCents * item.quantity, "si")}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-1 justify-end"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ඉවත් කරන්න</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Quick Coupons Suggestion */}
          <div className="p-4 rounded-2xl bg-cream/70 border border-gold-500/20 text-xs space-y-2">
            <span className="font-bold text-maroon-900 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-saffron-500" />
              ලබාගත හැකි විශේෂ වට්ටම් කේත (Available Promo Coupons):
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.entries(VALID_COUPONS).map(([code, def]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleQuickCoupon(code)}
                  className="px-2.5 py-1 rounded-lg border border-dashed border-maroon-300 bg-white hover:bg-gold-50 text-[11px] font-bold text-maroon-800 transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <span className="text-saffron-700">{code}</span>
                  <span className="text-ink-muted">({def.type === "PERCENT" ? `${def.value}%` : `රු. ${def.value / 100}`})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-maroon-200 shadow-md space-y-5">
            <h2 className="font-display font-black text-lg text-maroon-900 border-b border-gray-100 pb-3">
              ඇණවුම් සාරාංශය (Order Summary)
            </h2>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-ink">
                <span>පොත් එකතුව (Subtotal):</span>
                <span className="font-bold">{formatLkr(subtotalCents, "si")}</span>
              </div>

              {coupon && (
                <div className="flex justify-between items-center text-green-700 font-semibold bg-green-50 p-2 rounded-lg">
                  <div className="flex items-center gap-1 text-xs">
                    <Tag className="w-3.5 h-3.5" />
                    <span>වට්ටම ({coupon.code}):</span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[10px] text-red-500 underline ml-1"
                    >
                      (ඉවත්)
                    </button>
                  </div>
                  <span className="font-bold">-{formatLkr(discountCents, "si")}</span>
                </div>
              )}

              {/* District Delivery Selector */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-ink text-xs">
                  <span className="font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-saffron-500" />
                    දිස්ත්‍රික්කය (District):
                  </span>
                  <span className="font-bold">
                    {deliveryCents === 0 ? (
                      <span className="text-green-700 font-black">නොමිලේ (FREE)</span>
                    ) : (
                      formatLkr(deliveryCents, "si")
                    )}
                  </span>
                </div>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-gray-50 font-medium focus:ring-1 focus:ring-maroon-500 focus:outline-none"
                >
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t-2 border-dashed border-gray-200 flex justify-between items-baseline">
                <div>
                  <span className="font-display font-black text-lg text-maroon-900 block">
                    මුළු එකතුව:
                  </span>
                  <span className="text-[11px] text-ink-muted">Estimated Total (LKR)</span>
                </div>
                <span className="font-display font-black text-2xl text-maroon-900">
                  {formatLkr(grandTotalCents, "si")}
                </span>
              </div>
            </div>

            {/* Promo Code Input Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold text-ink block">කූපන් කේතය (Promo Code):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. WELCOME10"
                  className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-500 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-maroon-900 hover:bg-maroon-950 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  ඇතුළත්
                </button>
              </div>
              {couponFeedback && (
                <p
                  className={`text-[11px] font-semibold ${
                    couponFeedback.isError ? "text-red-600" : "text-green-700"
                  }`}
                >
                  {couponFeedback.text}
                </p>
              )}
            </form>

            {/* Checkout Action CTA */}
            <div className="space-y-3 pt-2">
              <Link
                href="/checkout"
                className="w-full py-4 px-6 rounded-xl bg-saffron-500 hover:bg-saffron-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>මිලදී ගැනීමට ඉදිරියට (Proceed to Checkout)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/books"
                className="w-full py-2.5 px-4 rounded-xl border border-maroon-200 hover:bg-cream text-maroon-900 font-semibold text-xs text-center block transition-colors"
              >
                තවත් පොත් තෝරන්න (Continue Shopping)
              </Link>
            </div>

            {/* Trust & Guarantee Badges */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-[11px] text-ink-muted">
              <div className="flex items-center gap-2 text-green-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                <span>100% ආරක්ෂිත ගෙවීම් (PayHere, Bank Transfer, COD)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-saffron-500 shrink-0" />
                <span>පදනම ප්‍රකාශන නිල මුද්‍රණ තත්ත්ව සහතිකය</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
