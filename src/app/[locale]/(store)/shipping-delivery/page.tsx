import React from "react";
import { Truck, ShieldCheck, Clock, MapPin } from "lucide-react";

export default function ShippingDeliveryPage() {
  const zones = [
    {
      title: "කලාපය 1: කොළඹ නගර සීමාව සහ තදාසන්න (Zone 1 — Colombo Metro)",
      districts: "කොළඹ දිස්ත්‍රික්කය (Colombo)",
      duration: "වැඩකරන දින 1–2 ඇතුළත",
      fee: "රු. 200.00 (පළමු කිලෝග්‍රෑමය සඳහා)",
    },
    {
      title: "කලාපය 2: බස්නාහිර පළාත (Zone 2 — Greater Western)",
      districts: "ගම්පහ සහ කළුතර දිස්ත්‍රික්ක (Gampaha & Kalutara)",
      duration: "වැඩකරන දින 2–3 ඇතුළත",
      fee: "රු. 250.00",
    },
    {
      title: "කලාපය 3: ප්‍රධාන දිස්ත්‍රික් මධ්‍යස්ථාන (Zone 3 — Major Provincial Hubs)",
      districts: "මහනුවර, ගාල්ල, මාතර, කුරුණෑගල, රත්නපුර, කෑගල්ල",
      duration: "වැඩකරන දින 2–4 ඇතුළත",
      fee: "රු. 300.00",
    },
    {
      title: "කලාපය 4: පිට පළාත් දිස්ත්‍රික්ක (Zone 4 — Outstation Districts)",
      districts: "යාපනය, කිලිනොච්චිය, අනුරාධපුරය, පොළොන්නරුව, ත්‍රිකුණාමලය, මඩකලපුව, අම්පාර, බදුල්ල, මොණරාගල, හම්බන්තොට, මාතලේ, නුවරඑළිය, පුත්තලම, වවුනියාව, මන්නාරම, මුලතිව්",
      duration: "වැඩකරන දින 3–5 ඇතුළත",
      fee: "රු. 350.00",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-left">
      <div className="space-y-3 border-b border-maroon-100 pb-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-maroon-900 tracking-tight">
          බෙදාහැරීමේ තොරතුරු (Shipping & Delivery Across 25 Districts)
        </h1>
        <p className="text-sm text-ink-muted">
          දිවයිනේ සියලුම දිස්ත්‍රික්ක 25 වෙත සුරක්ෂිතව සහ කඩිනමින් පාසල් පොත් සහ සාහිත්‍ය කෘති බෙදාහරිනු ලැබේ.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 font-bold text-sm flex items-center gap-3">
        <Truck className="w-5 h-5 text-green-700 shrink-0" />
        <span>විශේෂ දීමනාව: රු. 3,500 ට වැඩි ඕනෑම ඇණවුමක් සඳහා දිවයින පුරා බෙදාහැරීම සම්පූර්ණයෙන්ම නොමිලේ!</span>
      </div>

      <div className="space-y-6">
        <h2 className="font-display font-bold text-xl text-maroon-900">
          දිස්ත්‍රික්ක අනුව බෙදාහැරීමේ ගාස්තු සහ කාලරාමුව
        </h2>

        <div className="space-y-4">
          {zones.map((z, idx) => (
            <div key={idx} className="p-5 bg-white rounded-2xl border border-maroon-100 shadow-sm space-y-2">
              <h3 className="font-bold text-sm text-maroon-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-saffron-500" />
                <span>{z.title}</span>
              </h3>
              <p className="text-xs text-ink"><strong>ආවරණය වන දිස්ත්‍රික්ක:</strong> {z.districts}</p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-ink-muted border-t border-gray-100">
                <span>⏱ <strong>බෙදාහැරීමේ කාලය:</strong> {z.duration}</span>
                <span>💵 <strong>ගාස්තුව:</strong> {z.fee}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h2 className="font-display font-bold text-xl text-maroon-900">කුරියර් සහකරු සහ පැකේජ සොයාගැනීම (Tracking)</h2>
        <p className="text-xs sm:text-sm text-ink leading-relaxed">
          අපගේ පාර්සල් බෙදාහැරීම් ප්‍රමුඛතම දේශීය කුරියර් සේවාවන් වන <strong>Domex</strong> සහ <strong>Koombiyo</strong> හරහා සිදු කෙරේ. ඔබගේ ඇණවුම අප ගබඩාවෙන් පිටත් වූ විගස සජීවී Tracking අංකය සහ ලින්ක් එක SMS පණිවිඩයක් මඟින් ඔබගේ දුරකථනයට ලැබෙනු ඇත.
        </p>
      </div>
    </div>
  );
}
