import React from "react";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "පොත් ඇණවුමක් නිවසට ගෙන්වා ගැනීමට කොපමණ කාලයක් ගතවේද?",
      a: "කොළඹ සහ ගම්පහ දිස්ත්‍රික්ක තුළ දින 1-2ක් ඇතුළත ද, අනෙකුත් සියලුම දිස්ත්‍රික්ක වෙත දින 2-4ක් ඇතුළත ද Domex හෝ Koombiyo කුරියර් සේවාව මඟින් නිවසටම බෙදාහරිනු ලැබේ.",
    },
    {
      q: "භාණ්ඩ ලැබුණු පසු මුදල් ගෙවිය හැකිද (Cash on Delivery)?",
      a: "ඔව්, දිවයිනේ ඕනෑම දිස්ත්‍රික්කයකට COD පහසුකම ක්‍රියාත්මක වේ. ඇණවුම තහවුරු කිරීමට දුරකථනයට ලැබෙන SMS OTP කේතය ඇතුළත් කිරීම පමණක් ප්‍රමාණවත් වේ.",
    },
    {
      q: "නොමිලේ සාම්පල කියවීම (Digital Sample Preview) ක්‍රියාත්මක වන්නේ කෙසේද?",
      a: "වෙබ් අඩවියේ ඇති ඕනෑම පොතක 'නොමිලේ කියවන්න' බොත්තම ක්ලික් කිරීමෙන් බ්‍රවුසරය තුළදීම පළමු පිටු 15–20 කිසිදු බාගත කිරීමකින් තොරව ක්ෂණිකව කියවිය හැක.",
    },
    {
      q: "බැංකු තැන්පතු මඟින් ගෙවීම් කරන්නේ කෙසේද?",
      a: "චෙක්අවුට් පිටුවේදී 'Bank Transfer' තෝරාගෙන, එහි දැක්වෙන අපගේ ලංකා බැංකුව (BOC), සම්පත් බැංකුව හෝ කොමර්ෂල් බැංකු ගිණුමකට මුදල් තැන්පත් කර, එම ලදුපතේ ඡායාරූපයක් වෙබ් අඩවියට උඩුගත කරන්න.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-left">
      <div className="space-y-3 border-b border-maroon-100 pb-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-maroon-900 tracking-tight flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-saffron-500" />
          <span>නිතර අසන ප්‍රශ්න (Frequently Asked Questions)</span>
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          පොත් ඇණවුම් කිරීම, ගෙවීම් ක්‍රම සහ බෙදාහැරීම් පිළිබඳ ඔබගේ ගැටලු සඳහා පිළිතුරු මෙහි අඩංගු වේ.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-5 bg-white rounded-2xl border border-maroon-100 shadow-sm space-y-2">
            <h3 className="font-bold text-sm sm:text-base text-maroon-900">
              {idx + 1}. {faq.q}
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
