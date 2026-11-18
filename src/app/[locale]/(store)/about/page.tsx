import React from "react";
import { Logo } from "@/components/ui/Logo";
import { BookOpen, Award, Users, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12 text-left">
      <div className="space-y-4 border-b border-maroon-100 pb-8 text-center sm:text-left">
        <Logo size="lg" />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-maroon-900 tracking-tight">
          අප ගැන (About Padanama Publications)
        </h1>
        <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
          දැනුමෙන් සන්නද්ධ, ගුණගරුක දරු පරපුරක් සහ සාහිත්‍යකාමී සමාජයක් බිහිකිරීම උදෙසා කැපවුණු ශ්‍රී ලාංකීය ප්‍රකාශන ආයතනය.
        </p>
      </div>

      <div className="prose prose-maroon max-w-none text-ink text-sm sm:text-base leading-sinhala space-y-6">
        <p>
          <strong>පදනම ප්‍රකාශන (Padanama Publications)</strong> යනු ශ්‍රී ලංකාවේ ප්‍රමුඛ පෙළේ අධ්‍යාපනික සහ සාහිත්‍යමය ග්‍රන්ථ ප්‍රකාශන ආයතනයකි. කොළඹ දිස්ත්‍රික්කයේ කොලොන්නාව, ගෝඨාභය ප්‍රදේශය කේන්ද්‍ර කරගනිමින් ආරම්භ වූ පදනම ප්‍රකාශන, දශකයකට අධික කාලයක් පුරා පාසල් දූ දරුවන්, ගුරුවරුන් සහ දෙමව්පියන්ගේ නොමඳ විශ්වාසය දිනාගෙන ඇත.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 not-prose">
          <div className="p-6 bg-white rounded-2xl border border-maroon-100 shadow-sm space-y-2">
            <BookOpen className="w-8 h-8 text-saffron-500" />
            <h3 className="font-bold text-base text-maroon-900">අධ්‍යාපනික විශිෂ්ටත්වය</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              1 වසරේ සිට 13 වසර දක්වා ජාතික විෂය නිර්දේශයට පූර්ණ ලෙස අනුකූල වැඩ පොත්, කෙටි සටහන් සහ ආදර්ශ විභාග ප්‍රශ්න පත්‍ර.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-maroon-100 shadow-sm space-y-2">
            <Award className="w-8 h-8 text-gold-500" />
            <h3 className="font-bold text-base text-maroon-900">සම්මානනීය සාහිත්‍යය</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              ප්‍රවීණ සහ නවක ලේඛක ලේඛිකාවන්ගේ විශිෂ්ට සිංහල නවකතා, පරිවර්තන සහ ළමා සාහිත්‍ය කෘති මුද්‍රණය.
            </p>
          </div>
        </div>

        <h2 className="font-display font-bold text-xl text-maroon-900 pt-4">අපගේ මෙහෙවර (Our Mission)</h2>
        <p>
          ගුණාත්මක අධ්‍යාපන සම්පත් දිවයිනේ දුෂ්කරම ප්‍රදේශවල සිටින දූ දරුවන්ට පවා සාධාරණ මිලකට, කාර්යක්ෂම බෙදාහැරීමේ ක්‍රමවේද ඔස්සේ සපයා දීම අපගේ පරම අභිප්‍රායයි. එමෙන්ම නවීන ඩිජිටල් තාක්ෂණය උපයෝගී කරගනිමින්, මිලදී ගැනීමට පෙර නොමිලේ සාම්පල කියවීමේ විප්ලවීය පහසුකම අපි ශ්‍රී ලංකාවේ ප්‍රථම වරට පාඨකයන් වෙත තිළිණ කර ඇත්තෙමු.
        </p>
      </div>
    </div>
  );
}
