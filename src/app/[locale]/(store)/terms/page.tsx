import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-left">
      <div className="space-y-3 border-b border-maroon-100 pb-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-maroon-900 tracking-tight">
          සේවා කොන්දේසි (Terms of Service)
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          2006 අංක 19 දරන විද්‍යුත් ගනුදෙනු පනත (Electronic Transactions Act No. 19 of 2006) යටතේ නීත්‍යානුකූලව වලංගු වේ.
        </p>
      </div>

      <div className="prose prose-maroon max-w-none text-xs sm:text-sm text-ink leading-sinhala space-y-6">
        <p>
          පදනම ප්‍රකාශන වෙබ් අඩවිය (padanamapublication.lk) භාවිතයෙන් හෝ ඇණවුම් කිරීමෙන් ඔබ පහත සඳහන් සේවා කොන්දේසි පිළිගැනීමට එකඟ වේ.
        </p>

        <h2 className="font-display font-bold text-lg text-maroon-900">1. ඇණවුම් සහ ගෙවීම් (Orders & Payments)</h2>
        <p>
          වෙබ් අඩවියේ දක්වා ඇති සියලුම මිල ගණන් ශ්‍රී ලංකා රුපියල් (LKR) වලින් සටහන් වේ. PayHere, Koko, බැංකු තැන්පතු හෝ Cash on Delivery (COD) මඟින් ගෙවීම් කළ හැක. බැංකු තැන්පතු තෝරාගන්නා අවස්ථාවන්හිදී, වලංගු ලදුපතක් උඩුගත කිරීමෙන් පසු අපගේ කාර්ය මණ්ඩලය විසින් එය තහවුරු කළ පසුව පමණක් ඇණවුම මුදාහැරේ.
        </p>

        <h2 className="font-display font-bold text-lg text-maroon-900">2. ඩිජිටල් පුස්තකාලය සහ ප්‍රකාශන හිමිකම් (Digital Content & Copyright)</h2>
        <p>
          නොමිලේ සාම්පල පෙරදසුන් හැර, පදනම ප්‍රකාශන සතු කිසිදු ඊ-පොතක් හෝ මුද්‍රිත පොතක් අනවසරයෙන් ඡායා පිටපත් කිරීම, ඩිජිටල් ලෙස පිටපත් කර බෙදාහැරීම හෝ විකිණීම 2003 අංක 36 දරන බුද්ධිමය දේපළ පනත (Intellectual Property Act No. 36 of 2003) යටතේ දඬුවම් ලැබිය හැකි වරදකි.
        </p>
      </div>
    </div>
  );
}
