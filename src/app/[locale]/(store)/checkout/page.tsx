"use client";
import { useTx } from "@/lib/tx";
import { BankAccounts } from "@/components/store/BankAccounts";
import { COURIER_OPTIONS, shippingCents as calcShipping, type Courier } from "@/lib/shipping";

import React, { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useCart } from "@/lib/cart-store";
import { formatLkr } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";
import { KokoIcon } from "@/components/ui/BrandIcons";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  Banknote,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Calendar,
  Sparkles,
} from "lucide-react";

const DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

export default function CheckoutPage() {
  const tx = useTx();
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotalCents,
    discountCents,
    netSubtotalCents,
    coupon,
    isFreeDelivery,
    clearCart,
  } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1: Customer & Address State
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [address, setAddress] = useState({
    street1: "",
    street2: "",
    city: "",
    district: "Colombo",
    postalCode: "",
    landmark: "",
  });

  // Step 2: Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState<"COURIER" | "EXPRESS" | "PICKUP">("COURIER");
  const [courier, setCourier] = useState<Courier>("KOOMBIYO");

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<
    "PAYHERE" | "BANK_TRANSFER" | "CASH_ON_DELIVERY" | "KOKO"
  >("PAYHERE");

  const [bankSlipFile, setBankSlipFile] = useState<string | null>(null);
  const [bankSlipPreview, setBankSlipPreview] = useState<string | null>(null);
  const [customerNote, setCustomerNote] = useState("");

  // Calculate Shipping Cents
  const isDigitalOnly = items.length > 0 && items.every((i) => i.format === "EBOOK");

  const shippingCents = calcShipping({ district: address.district, method: deliveryMethod, subtotalCents: netSubtotalCents + discountCents, digitalOnly: isDigitalOnly });

  // COD Handling Fee
  const codFeeCents = paymentMethod === "CASH_ON_DELIVERY" ? 10000 : 0;
  const grandTotalCents = netSubtotalCents + shippingCents + codFeeCents;

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBankSlipPreview(reader.result as string);
        setBankSlipFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep1 = () => {
    if (!contact.firstName.trim()) {
      setErrorMessage(tx("කරුණාකර ඔබගේ නම ඇතුළත් කරන්න (Please enter your first name)"));
      return false;
    }
    if (!contact.phone.trim() || contact.phone.length < 9) {
      setErrorMessage(tx("කරුණාකර වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න (Please enter a valid +94 phone number)"));
      return false;
    }
    if (!isDigitalOnly && !address.street1.trim()) {
      setErrorMessage(tx("කරුණාකර ලිපිනය ඇතුළත් කරන්න (Please enter your delivery address)"));
      return false;
    }
    if (!isDigitalOnly && !address.city.trim()) {
      setErrorMessage(tx("කරුණාකර නගරය ඇතුළත් කරන්න (Please enter your city)"));
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        contact,
        shippingAddress: address,
        deliveryMethod,
        courier: deliveryMethod === "COURIER" ? courier : undefined,
        paymentMethod,
        items: items.map((i) => ({
          bookId: i.bookId,
          slug: i.slug,
          title: i.title,
          format: i.format,
          priceCents: i.priceCents,
          quantity: i.quantity,
          isDigital: i.format === "EBOOK",
        })),
        couponCode: coupon?.code,
        bankSlipUrl: bankSlipFile,
        customerNote,
      };

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order placement failed");
      }

      // Persist local order snapshot for immediate cross-tab Admin & Account visibility
      try {
        const storedOrders = JSON.parse(localStorage.getItem("padanama_placed_orders") || "[]");
        storedOrders.unshift({
          id: `ord-${Date.now()}`,
          orderNumber: data.orderNumber,
          date: new Date().toLocaleDateString("en-CA") + " " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          customerName: `${contact.firstName} ${contact.lastName || ""}`.trim(),
          phone: contact.phone,
          city: address.city || "Colombo",
          district: address.district || "Colombo",
          paymentMethod,
          status:
            paymentMethod === "CASH_ON_DELIVERY"
              ? "COD_CONFIRMED"
              : paymentMethod === "PAYHERE"
              ? "PAID"
              : bankSlipFile
              ? "PENDING_SLIP_VERIFICATION"
              : "PENDING_PAYMENT",
          totalCents: grandTotalCents,
          itemsCount: items.reduce((s, i) => s + i.quantity, 0),
          itemsList: items.map((i) => `${i.title} (${i.format}) × ${i.quantity}`),
          bankSlipUrl: bankSlipFile || null,
        });
        localStorage.setItem("padanama_placed_orders", JSON.stringify(storedOrders));
      } catch {
        // ignore
      }

      // If PayHere selected, handle checkout form submission or redirect
      if (paymentMethod === "PAYHERE" && data.payhere) {
        // Clear cart before redirect
        clearCart();

        // Create and auto-submit PayHere POST form
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.payhere.actionUrl;

        for (const [key, value] of Object.entries(data.payhere.fields)) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
        return;
      }

      // For Bank Transfer, COD, or Koko:
      clearCart();
      router.push(`/checkout/success?order=${data.orderNumber}&method=${paymentMethod}`);
    } catch (err: any) {
      setErrorMessage(err.message || tx("ඇණවුම ඉදිරිපත් කිරීමේදී දෝෂයක් සිදු විය. නැවත උත්සාහ කරන්න."));
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-display font-bold text-xl text-maroon-900">
          {tx("ඔබගේ සාප්පු සවාරි බෑගය හිස්ව පවතී")}
        </h2>
        <p className="text-sm text-ink-muted">
          {tx("මිලදී ගැනීමට පෙර කරුණාකර පොත් එකතුවෙන් ඔබ කැමති පොත් තෝරාගන්න.")}
        </p>
        <Link
          href="/books"
          className="inline-block px-6 py-3 bg-saffron-500 text-white font-bold text-sm rounded-xl"
        >
          {tx("පොත් නාමාවලිය වෙත")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 3-Step Stepper Navigation */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 w-full -z-10" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-saffron-500 transition-all duration-300 -z-10"
            style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
          />

          {/* Step 1 */}
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex flex-col items-center gap-1.5 bg-cream px-3 py-1 rounded-lg ${
              step >= 1 ? "text-maroon-900 font-bold" : "text-gray-400"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                step >= 1
                  ? "bg-maroon-900 text-white border-maroon-900 shadow-sm"
                  : "bg-white text-gray-400 border-gray-300"
              }`}
            >
              1
            </div>
            <span className="text-xs">{tx("ලිපිනය (Address)")}</span>
          </button>

          {/* Step 2 */}
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) setStep(2);
            }}
            className={`flex flex-col items-center gap-1.5 bg-cream px-3 py-1 rounded-lg ${
              step >= 2 ? "text-maroon-900 font-bold" : "text-gray-400"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                step >= 2
                  ? "bg-maroon-900 text-white border-maroon-900 shadow-sm"
                  : "bg-white text-gray-400 border-gray-300"
              }`}
            >
              2
            </div>
            <span className="text-xs">{tx("බෙදාහැරීම (Delivery)")}</span>
          </button>

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) setStep(3);
            }}
            className={`flex flex-col items-center gap-1.5 bg-cream px-3 py-1 rounded-lg ${
              step === 3 ? "text-maroon-900 font-bold" : "text-gray-400"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                step === 3
                  ? "bg-maroon-900 text-white border-maroon-900 shadow-sm"
                  : "bg-white text-gray-400 border-gray-300"
              }`}
            >
              3
            </div>
            <span className="text-xs">{tx("ගෙවීම (Payment)")}</span>
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Step Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: CONTACT & DELIVERY ADDRESS */}
          {step === 1 && (
            <div className="p-6 rounded-2xl bg-white border border-maroon-100 shadow-sm space-y-5 animate-in fade-in duration-200">
              <h2 className="font-display font-black text-xl text-maroon-900 flex items-center gap-2">
                <span>{tx("1. පාරිභෝගික සහ බෙදාහැරීමේ තොරතුරු (Contact & Delivery)")}</span>
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    {tx("මුල් නම (First Name) *")}
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="given-name"
                    value={contact.firstName}
                    onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    placeholder={tx(tx("සුනිල් / Sunil"))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    {tx("වාසගම (Last Name)")}
                  </label>
                  <input
                    type="text"
                    autoComplete="family-name"
                    value={contact.lastName}
                    onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    placeholder={tx(tx("පෙරේරා / Perera"))}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    {tx("ජංගම දුරකථන අංකය (Phone Number) *")}
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    required
                    autoComplete="tel"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    placeholder={tx(tx("071 800 8533 (SMS තහවුරු කිරීම් සඳහා)"))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    {tx("විද්‍යුත් තැපෑල (Email Address)")}
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    placeholder="receipts@example.com"
                  />
                </div>
              </div>

              {!isDigitalOnly && (
                <>
                  <div className="space-y-4 pt-3 border-t border-gray-100">
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        {tx("ලිපිනය පේළිය 1 (Street Address) *")}
                      </label>
                      <input
                        type="text"
                        required
                        autoComplete="address-line1"
                        value={address.street1}
                        onChange={(e) => setAddress({ ...address, street1: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                        placeholder={tx(tx("අංක 45/2, ගාලු පාර"))}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-ink block mb-1">
                          {tx("නගරය (City) *")}
                        </label>
                        <input
                          type="text"
                          required
                          autoComplete="address-level2"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                          placeholder={tx(tx("කොල්ලුපිටිය / Colombo"))}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-ink block mb-1">
                          {tx("දිස්ත්‍රික්කය (District) *")}
                        </label>
                        <select
                          value={address.district}
                          onChange={(e) => setAddress({ ...address, district: e.target.value })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-500 font-semibold"
                        >
                          {DISTRICTS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        {tx("හඳුනාගැනීමේ සලකුණ (Nearby Landmark - කුරියර් රියදුරු සඳහා)")}
                      </label>
                      <input
                        type="text"
                        value={address.landmark}
                        onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                        placeholder={tx(tx("උදා: පන්සල අසල / ඔරලෝසු කණුව අසල"))}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="py-3 px-6 rounded-xl bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <span>{tx("ඊළඟ පියවර: බෙදාහැරීම තෝරන්න (Next)")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY METHOD */}
          {step === 2 && (
            <div className="p-6 rounded-2xl bg-white border border-maroon-100 shadow-sm space-y-5 animate-in fade-in duration-200">
              <h2 className="font-display font-black text-xl text-maroon-900 flex items-center gap-2">
                <span>{tx("2. බෙදාහැරීමේ ක්‍රමය (Delivery Method)")}</span>
              </h2>

              <div className="space-y-3">
                {/* Standard Islandwide Courier */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                    deliveryMethod === "COURIER"
                      ? "border-maroon-700 bg-maroon-50/50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-maroon-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="COURIER"
                    checked={deliveryMethod === "COURIER"}
                    onChange={() => setDeliveryMethod("COURIER")}
                    className="mt-1 text-maroon-900 focus:ring-maroon-500"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-sm text-maroon-900">
                        {tx("දිවයින පුරා කුරියර් සේවාව (Standard Courier — Domex / Koombiyo)")}
                      </span>
                      <span className="font-black text-xs text-saffron-700">
                        {isFreeDelivery ? tx("නොමිලේ (FREE)") : formatLkr(shippingCents, "si")}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted">
                      {tx("වැඩකරන දින 2-4 ක් ඇතුළත නිවසටම බෙදාහැරීම. පාර්සලය පිටත් කළ පසු SMS මගින් Tracking ලින්ක් එක ලැබේ.")}
                    </p>
                    {deliveryMethod === "COURIER" && (
                      <fieldset className="pt-2">
                        <legend className="text-xs font-bold text-maroon-900 mb-1.5">{tx("කුරියර් සේවාව තෝරන්න (Choose courier)")}</legend>
                        <div className="grid grid-cols-2 gap-2">
                          {COURIER_OPTIONS.map((c) => (
                            <label key={c.id} className={`p-3 rounded-lg border-2 cursor-pointer text-xs font-bold flex items-center gap-2 ${courier === c.id ? "border-maroon-700 bg-white" : "border-gray-200 bg-white/60"}`}>
                              <input type="radio" name="courier" value={c.id} checked={courier === c.id} onChange={() => setCourier(c.id)} />
                              <span>{c.name}<span className="block font-normal text-ink-muted">{c.days} days</span></span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    )}
                  </div>
                </label>

                {/* Colombo Express */}
                {address.district.toLowerCase() === "colombo" && (
                  <label
                    className={`p-4 rounded-xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                      deliveryMethod === "EXPRESS"
                        ? "border-maroon-700 bg-maroon-50/50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-maroon-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="EXPRESS"
                      checked={deliveryMethod === "EXPRESS"}
                      onChange={() => setDeliveryMethod("EXPRESS")}
                      className="mt-1 text-maroon-900 focus:ring-maroon-500"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-sm text-maroon-900">
                          {tx("කොළඹ කඩිනම් බෙදාහැරීම (Express Metro — Same / Next Day)")}
                        </span>
                        <span className="font-black text-xs text-saffron-700">
                          {formatLkr(45000, "si")}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted">
                        {tx("කොළඹ 1-15 ප්‍රදේශ සඳහා පැය 24ක් තුළ කඩිනමින් භාරදීම.")}
                      </p>
                    </div>
                  </label>
                )}

                {/* Store Pickup */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                    deliveryMethod === "PICKUP"
                      ? "border-maroon-700 bg-maroon-50/50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-maroon-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="PICKUP"
                    checked={deliveryMethod === "PICKUP"}
                    onChange={() => setDeliveryMethod("PICKUP")}
                    className="mt-1 text-maroon-900 focus:ring-maroon-500"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-sm text-maroon-900">
                        {tx("පදනම ප්‍රධාන කාර්යාලයෙන් ලබාගැනීම (Store Pickup — Colombo 03)")}
                      </span>
                      <span className="font-black text-xs text-green-700">{tx("නොමිලේ (FREE)")}</span>
                    </div>
                    <p className="text-xs text-ink-muted">
                      {tx("අංක 142, ගාලු පාර, කොළඹ 03. වැඩකරන දිනවල පෙ.ව. 9.00 සිට ප.ව. 5.00 දක්වා.")}
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-ink flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{tx("ආපසු (Back)")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-3 px-6 rounded-xl bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <span>{tx("ඊළඟ පියවර: ගෙවීම් ක්‍රමය (Next)")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <div className="p-6 rounded-2xl bg-white border border-maroon-100 shadow-sm space-y-5 animate-in fade-in duration-200">
              <h2 className="font-display font-black text-xl text-maroon-900 flex items-center gap-2">
                <span>{tx("3. ගෙවීම් ක්‍රමය තෝරන්න (Payment Method)")}</span>
              </h2>

              <div className="space-y-3">
                {/* 1. PayHere */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                    paymentMethod === "PAYHERE"
                      ? "border-maroon-700 bg-maroon-50/50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-maroon-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PAYHERE"
                    checked={paymentMethod === "PAYHERE"}
                    onChange={() => setPaymentMethod("PAYHERE")}
                    className="mt-1 text-maroon-900 focus:ring-maroon-500"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-maroon-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-saffron-500" />
                        <span>{tx("ක්‍රෙඩිට් / ඩෙබිට් කාඩ්පත් සහ ඩිජිටල් පසුම්බි (PayHere)")}</span>
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted">
                      {tx("Visa, MasterCard, Amex, eZ Cash, FriMi, Genie හරහා ආරක්ෂිත ක්ෂණික ගෙවීම.")}
                    </p>
                  </div>
                </label>

                {/* 2. Bank Transfer */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-maroon-700 bg-maroon-50/50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-maroon-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={paymentMethod === "BANK_TRANSFER"}
                    onChange={() => setPaymentMethod("BANK_TRANSFER")}
                    className="mt-1 text-maroon-900 focus:ring-maroon-500"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-maroon-900 flex items-center gap-2">
                        <Building className="w-4 h-4 text-saffron-500" />
                        <span>{tx("බැංකු තැන්පතු හෝ Online Transfer (Bank Transfer)")}</span>
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted">
                      {tx("BOC, සම්පත් හෝ කොමර්ෂල් බැංකු ගිණුම්වලට මුදල් තැන්පත් කර ලදුපත උඩුගත කරන්න.")}
                    </p>

                    {/* Bank Details Box */}
                    {paymentMethod === "BANK_TRANSFER" && (
                      <div className="p-3 bg-white rounded-lg border border-gold-500/30 text-xs space-y-2 mt-2">
                        <span className="font-bold text-maroon-900 block">
                          {tx("පදනම ප්‍රකාශන නිල බැංකු ගිණුම් තොරතුරු:")}
                        </span>
                        <BankAccounts className="space-y-1 text-ink text-[11px]" />

                        {/* Slip Upload Input */}
                        <div className="pt-2 border-t border-gray-100">
                          <label className="block text-[11px] font-bold text-maroon-900 mb-1">
                            {tx("ගෙවීම් ලදුපත (Slip) උඩුගත කරන්න (විකල්ප):")}
                          </label>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleSlipUpload}
                            className="block w-full text-[11px] text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-maroon-100 file:text-maroon-900 hover:file:bg-maroon-200"
                          />
                          {bankSlipPreview && (
                            <div className="mt-2 flex items-center gap-2 text-[11px] text-green-700 font-bold">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{tx("ලදුපත සාර්ථකව තෝරාගන්නා ලදී (Slip attached)")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* 3. Cash on Delivery (COD) */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                    paymentMethod === "CASH_ON_DELIVERY"
                      ? "border-maroon-700 bg-maroon-50/50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-maroon-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH_ON_DELIVERY"
                    checked={paymentMethod === "CASH_ON_DELIVERY"}
                    onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                    className="mt-1 text-maroon-900 focus:ring-maroon-500"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-maroon-900 flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-saffron-500" />
                        <span>{tx("භාණ්ඩ ලැබුණු පසු මුදල් ගෙවීම (Cash on Delivery)")}</span>
                      </span>
                      <span className="text-[11px] font-bold text-ink-muted">{tx("+රු. 100 ගාස්තුවක්")}</span>
                    </div>
                    <p className="text-xs text-ink-muted">
                      {tx("කුරියර් රියදුරු වෙත මුදල් ගෙවා පාර්සලය ලබාගන්න. ආරක්ෂාව සඳහා පිටත් කිරීමට පෙර 4-digit SMS කේතයක් මඟින් තහවුරු කරනු ලැබේ.")}
                    </p>
                  </div>
                </label>

                {/* 4. Koko BNPL */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                    paymentMethod === "KOKO"
                      ? "border-maroon-700 bg-maroon-50/50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-maroon-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="KOKO"
                    checked={paymentMethod === "KOKO"}
                    onChange={() => setPaymentMethod("KOKO")}
                    className="mt-1 text-maroon-900 focus:ring-maroon-500"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-maroon-900 flex items-center gap-2.5">
                        <KokoIcon className="h-6 w-auto" />
                        <span>{tx("Koko — පොලී රහිත වාරික 3කින් (3 Installments)")}</span>
                      </span>
                      <span className="text-xs font-bold text-maroon-800">
                        3 x {formatLkr(Math.round(grandTotalCents / 3), "si")}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted">
                      {tx("ඩෙබිට් කාඩ්පත මගින් කිසිදු අමතර පොලියක් නොමැතිව මාස 3කින් ගෙවන්න.")}
                    </p>
                  </div>
                </label>
              </div>

              {/* Customer Note */}
              <div className="pt-2">
                <label className="text-xs font-bold text-ink block mb-1">
                  {tx("ඇණවුම පිළිබඳ විශේෂ සටහනක් (Special Instructions / Note):")}
                </label>
                <textarea
                  rows={2}
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder={tx(tx("උදා: සති අන්තයේ භාරදෙන්න / කාර්යාල ලිපිනයයි..."))}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-ink flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{tx("ආපසු (Back)")}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-maroon-200 shadow-md space-y-5 sticky top-28">
            <h3 className="font-display font-black text-lg text-maroon-900 border-b border-gray-100 pb-3">
              {tx("ඇණවුම් සාරාංශය (Order Summary)")}
            </h3>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex justify-between items-start text-xs gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-maroon-900 block line-clamp-1">
                      {it.title}
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      ප්‍රමාණය: {it.quantity} × {it.format === "EBOOK" ? tx("ඊ-පොත") : tx("මුද්‍රණය")}
                    </span>
                  </div>
                  <span className="font-bold text-ink shrink-0">
                    {formatLkr(it.priceCents * it.quantity, "si")}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
              <div className="flex justify-between text-ink">
                <span>{tx("පොත් එකතුව (Subtotal):")}</span>
                <span className="font-semibold">{formatLkr(subtotalCents, "si")}</span>
              </div>

              {coupon && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>වට්ටම ({coupon.code}):</span>
                  <span>-{formatLkr(discountCents, "si")}</span>
                </div>
              )}

              <div className="flex justify-between text-ink">
                <span>බෙදාහැරීමේ ගාස්තු ({address.district}):</span>
                <span className="font-semibold">
                  {shippingCents === 0 ? (
                    <span className="text-green-700 font-bold">{tx("නොමිලේ (FREE)")}</span>
                  ) : (
                    formatLkr(shippingCents, "si")
                  )}
                </span>
              </div>

              {codFeeCents > 0 && (
                <div className="flex justify-between text-ink">
                  <span>{tx("COD හැසිරවීමේ ගාස්තුව:")}</span>
                  <span className="font-semibold">{formatLkr(codFeeCents, "si")}</span>
                </div>
              )}

              <div className="pt-3 border-t-2 border-dashed border-gray-200 flex justify-between items-baseline">
                <div>
                  <span className="font-display font-black text-base text-maroon-900 block">
                    {tx("මුළු ගෙවිය යුතු මුදල:")}
                  </span>
                  <span className="text-[10px] text-ink-muted">Total Amount (LKR)</span>
                </div>
                <span className="font-display font-black text-2xl text-maroon-900">
                  {formatLkr(grandTotalCents, "si")}
                </span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                if (validateStep1()) {
                  handlePlaceOrder();
                }
              }}
              className="w-full py-4 px-6 rounded-xl bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Lock className="w-4 h-4" />
              <span>
                {submitting
                  ? tx("ඇණවුම සකස් කරමින්... (Processing)")
                  : paymentMethod === "PAYHERE"
                  ? tx("PayHere හරහා ගෙවන්න (Pay Now)")
                  : tx("ඇණවුම තහවුරු කරන්න (Place Order)")}
              </span>
            </button>

            {/* Security Guarantee */}
            <div className="pt-2 text-center text-[11px] text-ink-muted space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-green-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{tx("256-Bit SSL ආරක්ෂිත සන්නිවේදනය")}</span>
              </div>
              <p>{tx("පදනම ප්‍රකාශන නිල වෙබ් අඩවියෙන් සෘජු මිලදී ගැනීමකි.")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
