import React from "react";
import { ShieldCheck, Lock, FileText, UserCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-left">
      <div className="space-y-3 border-b border-maroon-100 pb-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-maroon-900 tracking-tight">
          පුද්ගලිකත්ව ප්‍රතිපත්තිය (Privacy Policy — PDPA Compliance)
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          ශ්‍රී ලංකා 2022 අංක 09 දරන පුද්ගලික දත්ත ආරක්ෂණ පනතට (Personal Data Protection Act No. 9 of 2022) අනුකූලව සකස් කරන ලදී.
        </p>
      </div>

      <div className="prose prose-maroon max-w-none text-xs sm:text-sm text-ink leading-sinhala space-y-6">
        <p>
          පදනම ප්‍රකාශන (Padanama Publications) ආයතනය අපගේ පාරිභෝගිකයන්ගේ සහ පාඨකයන්ගේ පෞද්ගලිකත්වය සහ දත්ත ආරක්ෂාව පිළිබඳව උපරිම වගකීමෙන් යුතුව කටයුතු කරයි. මෙම ප්‍රතිපත්තිය මඟින් අප ඔබගේ තොරතුරු රැස්කරන, භාවිතා කරන සහ ආරක්ෂා කරන ආකාරය පැහැදිලි කෙරේ.
        </p>

        <h2 className="font-display font-bold text-lg text-maroon-900">1. අප රැස්කරන තොරතුරු (Data We Collect)</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>ගිණුම් සහ සබඳතා තොරතුරු:</strong> ඔබගේ නම, දුරකථන අංකය, විද්‍යුත් තැපෑල සහ බෙදාහැරීමේ ලිපිනය.</li>
          <li><strong>ගනුදෙනු සහ ඇණවුම් තොරතුරු:</strong> මිලදී ගත් පොත්පත්, ගෙවීම් ක්‍රමය (PayHere / Koko / බැංකු තැන්පතු ලදුපත). <em>අප කිසිදු අවස්ථාවක ඔබගේ ණය/හර කාඩ්පත් අංක (Credit/Debit Card Details) අපගේ සර්වර් තුළ ගබඩා නොකරයි.</em></li>
          <li><strong>කියවීමේ දත්ත:</strong> ඩිජිටල් පුස්තකාලය පරිහරණයේදී පිටු සලකුණු (Bookmarks) සහ කියවා අවසන් කළ පිටු ප්‍රමාණය.</li>
        </ul>

        <h2 className="font-display font-bold text-lg text-maroon-900">2. තොරතුරු භාවිතයේ අරමුණු (Purpose of Processing)</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>ඔබ ඇණවුම් කළ පොත්පත් කුරියර් සේවාව (Domex/Koombiyo) හරහා ඔබ වෙත ලබාදීම.</li>
          <li>SMS OTP මඟින් ඔබගේ අනන්‍යතාවය තහවුරු කිරීම සහ ඇණවුම් තත්ත්වය පිළිබඳව කෙටි පණිවිඩ එවීමට.</li>
          <li>ඩිජිටල් ඊ-පොත් කියවීමේ අවසරය (Digital Entitlement) ක්‍රියාත්මක කිරීමට.</li>
        </ul>

        <h2 className="font-display font-bold text-lg text-maroon-900">3. පාඨකයා සතු අයිතිවාසිකම් (Your Data Rights under PDPA)</h2>
        <p>
          2022 අංක 09 දරන පනතට අනුව, ඔබට ඕනෑම අවස්ථාවක අප සතු ඔබගේ තොරතුරු පිටපතක් ලබාගැනීමට (Right to Access) හෝ ඔබගේ ගිණුම සහ දත්ත පද්ධතියෙන් මකාදැමීමට (Right to Erasure / To be Forgotten) අයිතියක් ඇත. ඔබගේ පාරිභෝගික ගිණුමේ <strong>Privacy Center</strong> පිටුව හරහා හෝ <code>privacy@padanamapublication.lk</code> වෙත පණිවිඩයක් එවීමෙන් මෙම ඉල්ලීම සිදුකළ හැක.
        </p>
      </div>
    </div>
  );
}
