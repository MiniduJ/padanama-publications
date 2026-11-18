import React from "react";

export default function ReturnsRefundsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-left">
      <div className="space-y-3 border-b border-maroon-100 pb-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-maroon-900 tracking-tight">
          ආපසු භාරගැනීම් සහ මුදල් ආපසු ගෙවීම් (Returns & Refunds Policy)
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          2003 අංක 09 දරන පාරිභෝගික කටයුතු පිළිබඳ අධිකාරී පනත (Consumer Affairs Authority Act) යටතේ පාරිභෝගික සුරක්ෂිතතාවය තහවුරු කරයි.
        </p>
      </div>

      <div className="prose prose-maroon max-w-none text-xs sm:text-sm text-ink leading-sinhala space-y-6">
        <h2 className="font-display font-bold text-lg text-maroon-900">1. පොත් ආපසු භාරගැනීමේ කොන්දේසි (Eligibility)</h2>
        <p>
          ඔබ වෙත ලැබුණු මුද්‍රිත පොතක මුද්‍රණ දෝෂයක්, පිටු අඩුවක් හෝ කුරියර් ප්‍රවාහනයේදී සිදුවූ භෞතික හානියක් පවතින්නේ නම්, පැකේජය ලැබී දින 7ක් ඇතුළත අප වෙත දැනුම් දීමෙන් සම්පූර්ණයෙන්ම නොමිලේ අලුත් පිටපතක් ලබාගත හැක.
        </p>

        <h2 className="font-display font-bold text-lg text-maroon-900">2. මුදල් ආපසු ගෙවීම (Refunds Process)</h2>
        <p>
          තොග අවසන් වීමක් හෝ පිළිගත් අවලංගු කිරීමකදී, ඔබ මුදල් ගෙවූ ක්‍රමවේදය ඔස්සේම (PayHere කාඩ්පත වෙත හෝ ඔබගේ බැංකු ගිණුම වෙත) වැඩකරන දින 3–5ක් ඇතුළත සම්පූර්ණ මුදල ආපසු බැර කෙරේ.
        </p>
      </div>
    </div>
  );
}
