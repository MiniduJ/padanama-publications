"use client";

import { useLocale } from "next-intl";

/**
 * Translate a Sinhala UI string used in cart/checkout.
 * "සිංහල (English)" strings need no entry: en/ta show the English part.
 * Sinhala-only strings are listed below as [English, Tamil].
 */
const DICT: Record<string, [string, string]> = {
  "(ඉවත්)": ["(removed)", "(நீக்கப்பட்டது)"],
  "+රු. 100 ගාස්තුවක්": ["+Rs. 100 fee", "+ரூ. 100 கட்டணம்"],
  "1 ඩිජිටල් පිටපතකි": ["1 digital copy", "1 டிஜிட்டல் பிரதி"],
  "256-Bit SSL ආරක්ෂිත සන්නිවේදනය": ["256-bit SSL secure connection", "256-bit SSL பாதுகாப்பான இணைப்பு"],
  "BOC, සම්පත් හෝ කොමර්ෂල් බැංකු ගිණුම්වලට මුදල් තැන්පත් කර ලදුපත උඩුගත කරන්න.": ["Deposit to our bank account and upload the slip.", "எமது வங்கிக் கணக்கில் வைப்புச் செய்து பற்றுச்சீட்டைப் பதிவேற்றவும்."],
  "COD ඇණවුම තහවුරු විය. Domex කුරියර් වෙත භාරදීමට නියමිතයි.": ["COD order confirmed. It will be handed to the courier shortly.", "COD ஆர்டர் உறுதிசெய்யப்பட்டது. விரைவில் கூரியரிடம் ஒப்படைக்கப்படும்."],
  "COD හැසිරවීමේ ගාස්තුව:": ["COD handling fee:", "COD கையாளுதல் கட்டணம்:"],
  "PAID (ගෙවා ඇත)": ["PAID", "செலுத்தப்பட்டது"],
  "Visa, MasterCard, Amex, eZ Cash, FriMi, Genie හරහා ආරක්ෂිත ක්ෂණික ගෙවීම.": ["Secure instant payment via Visa, MasterCard, Amex, eZ Cash, FriMi, Genie.", "Visa, MasterCard, Amex, eZ Cash, FriMi, Genie மூலம் பாதுகாப்பான உடனடி கட்டணம்."],
  "අංක 142, ගාලු පාර, කොළඹ 03. වැඩකරන දිනවල පෙ.ව. 9.00 සිට ප.ව. 5.00 දක්වා.": ["No. 142, Galle Road, Colombo 03. Weekdays 9.00 am – 5.00 pm.", "இல. 142, காலி வீதி, கொழும்பு 03. வார நாட்களில் காலை 9.00 – மாலை 5.00."],
  "අංක 45/2, ගාලු පාර": ["No. 45/2, Galle Road", "இல. 45/2, காலி வீதி"],
  "ඇණවුම ඉදිරිපත් කිරීමේදී දෝෂයක් සිදු විය. නැවත උත්සාහ කරන්න.": ["Something went wrong placing your order. Please try again.", "ஆர்டர் செய்வதில் பிழை. மீண்டும் முயற்சிக்கவும்."],
  "ඇණවුමේ වත්මන් තත්ත්වය:": ["Current order status:", "தற்போதைய ஆர்டர் நிலை:"],
  "ඇතුළත්": ["included", "உள்ளடங்கும்"],
  "ඉවත් කරන්න": ["Remove", "நீக்கு"],
  "ඊ-පොත": ["E-book", "மின்னூல்"],
  "ඊ-පොත (ඩිජිටල්)": ["E-book (digital)", "மின்னூல் (டிஜிட்டல்)"],
  "උදා: පන්සල අසල / ඔරලෝසු කණුව අසල": ["e.g. near the temple / clock tower", "உ.ம்: கோவில் அருகில்"],
  "උදා: සති අන්තයේ භාරදෙන්න / කාර්යාල ලිපිනයයි...": ["e.g. deliver on the weekend / office address...", "உ.ம்: வார இறுதியில் விநியோகிக்கவும்..."],
  "ඔබගේ ඇණවුම සාර්ථකව භාරගන්නා ලදී!": ["Your order has been placed!", "உங்கள் ஆர்டர் வெற்றிகரமாகப் பெறப்பட்டது!"],
  "ඔබගේ සාප්පු සවාරි බෑගය හිස්ව පවතී": ["Your cart is empty", "உங்கள் கூடை காலியாக உள்ளது"],
  "කුරියර් රියදුරු පැමිණි පසු කරුණාකර මුදල් ගෙවා පාර්සලය ලබාගන්න. කුරියර් පිටත් කිරීමට පෙර Domex සේවාව මගින් ඔබගේ දුරකථන අංකයට 4-digit SMS තහවුරු කිරීමේ කේතයක් එවනු ලැබේ.": ["Pay the courier when your parcel arrives. You'll get an SMS confirmation before dispatch.", "பார்சல் வந்ததும் கூரியரிடம் பணம் செலுத்தவும். அனுப்புவதற்கு முன் SMS உறுதிப்படுத்தல் வரும்."],
  "කුරියර් රියදුරු වෙත මුදල් ගෙවා පාර්සලය ලබාගන්න. ආරක්ෂාව සඳහා පිටත් කිරීමට පෙර 4-digit SMS කේතයක් මඟින් තහවුරු කරනු ලැබේ.": ["Pay the courier on delivery. We confirm by SMS before dispatch.", "விநியோகத்தின் போது கூரியரிடம் செலுத்தவும். அனுப்புவதற்கு முன் SMS மூலம் உறுதிப்படுத்துவோம்."],
  "කොළඹ 1-15 ප්‍රදේශ සඳහා පැය 24ක් තුළ කඩිනමින් භාරදීම.": ["Delivered within 24 hours in Colombo 1–15.", "கொழும்பு 1–15 இல் 24 மணி நேரத்தில் விநியோகம்."],
  "ගෙවීම සාර්ථකව තහවුරු වී ඇත. පාර්සලය සකස් කරමින් පවතී.": ["Payment confirmed. We're preparing your parcel.", "கட்டணம் உறுதிசெய்யப்பட்டது. பார்சல் தயாராகிறது."],
  "ගෙවීම් කළ ලදුපත (Deposit Slip / Screenshot) මෙතැනින් උඩුගත කරන්න:": ["Upload your deposit slip / screenshot here:", "வைப்புச் சீட்டு / திரைப்பிடிப்பை இங்கே பதிவேற்றவும்:"],
  "ගෙවීම් ලදුපත (Slip) උඩුගත කරන්න (විකල්ප):": ["Upload payment slip (optional):", "கட்டணச் சீட்டைப் பதிவேற்றவும் (விருப்பம்):"],
  "ඩෙබිට් කාඩ්පත මගින් කිසිදු අමතර පොලියක් නොමැතිව මාස 3කින් ගෙවන්න.": ["Pay in 3 months with your debit card, no extra interest.", "டெபிட் அட்டையுடன் 3 மாதங்களில் வட்டியின்றி செலுத்துங்கள்."],
  "තවත් පොත් බලන්න": ["Browse more books", "மேலும் நூல்கள்"],
  "දෘඩ කවරය": ["Hardcover", "கடின அட்டை"],
  "පදනම ප්‍රකාශන නිල බැංකු ගිණුම් තොරතුරු:": ["Padanama Publications bank account details:", "பதனம வெளியீடுகள் வங்கிக் கணக்கு விவரங்கள்:"],
  "පදනම ප්‍රකාශන නිල මුද්‍රණ තත්ත්ව සහතිකය": ["Official Padanama print-quality guarantee", "அதிகாரப்பூர்வ பதனம அச்சுத் தர உத்தரவாதம்"],
  "පදනම ප්‍රකාශන නිල වෙබ් අඩවියෙන් සෘජු මිලදී ගැනීමකි.": ["Bought directly from the official Padanama website.", "அதிகாரப்பூர்வ பதனம இணையதளத்திலிருந்து நேரடி கொள்வனவு."],
  "පෙරේරා / Perera": ["Perera", "பெரேரா"],
  "සුනිල් / Sunil": ["Sunil", "சுனில்"],
  "පොතක්": ["book", "நூல்"],
  "පොත්": ["books", "நூல்கள்"],
  "පොත් නාමාවලිය වෙත": ["Go to the catalogue", "நூல் பட்டியலுக்கு"],
  "බැංකු තැන්පතු තොරතුරු සහ ලදුපත උඩුගත කිරීම:": ["Bank deposit details & slip upload:", "வங்கி வைப்பு விவரங்கள் & சீட்டு பதிவேற்றம்:"],
  "බැංකු තැන්පතු ලදුපත තහවුරු කිරීම අපේක්ෂාවෙන් පවතී.": ["Waiting for bank slip verification.", "வங்கிச் சீட்டு சரிபார்ப்புக்காகக் காத்திருக்கிறது."],
  "මිලදී ගැනීමට පෙර කරුණාකර පොත් එකතුවෙන් ඔබ කැමති පොත් තෝරාගන්න.": ["Pick the books you need from the catalogue first.", "முதலில் பட்டியலிலிருந்து நூல்களைத் தேர்ந்தெடுக்கவும்."],
  "මුද්‍රණය": ["Print", "அச்சு"],
  "මුළු එකතුව:": ["Total:", "மொத்தம்:"],
  "මුළු ගෙවිය යුතු මුදල:": ["Total to pay:", "செலுத்த வேண்டிய மொத்தம்:"],
  "වැඩකරන දින 2-4 ක් ඇතුළත නිවසටම බෙදාහැරීම. පාර්සලය පිටත් කළ පසු SMS මගින් Tracking ලින්ක් එක ලැබේ.": ["Doorstep delivery in 2–4 working days. You'll get a tracking SMS once dispatched.", "2–4 வேலை நாட்களில் வீட்டு விநியோகம். அனுப்பியதும் கண்காணிப்பு SMS வரும்."],
  "ස්තූතියි! පදනම ප්‍රකාශන වෙතින් පොත් ඇණවුම් කිරීම පිළිබඳව අපි ඉතාමත් සතුටු වන්නෙමු.": ["Thank you for ordering from Padanama Publications!", "பதனம வெளியீடுகளில் ஆர்டர் செய்ததற்கு நன்றி!"],
  "සාමාන්‍ය මුද්‍රණය": ["Paperback", "சாதாரண அச்சு"],
  "✓ ඔබගේ ගෙවීම් ලදුපත අප වෙත ලැබී ඇත. අපගේ ගිණුම් අංශය විසින් එය අනුමත කරනු ඇත.": ["✓ We received your payment slip. Our accounts team will verify it.", "✓ உங்கள் கட்டணச் சீட்டு கிடைத்தது. எமது கணக்குப் பிரிவு சரிபார்க்கும்."],
};

export function translate(s: string, locale: string): string {
  if (locale === "si") return s;
  const hit = DICT[s];
  if (hit) return locale === "ta" ? hit[1] : hit[0];
  // "සිංහල (English)" → English part
  const m = s.match(/\(([^()]*[A-Za-z][^()]*)\)\s*([:.!]?)\s*$/);
  if (m) return m[1].trim() + m[2];
  const slash = s.match(/\/\s*([A-Za-z][^/]*)$/);
  return slash ? slash[1].trim() : s;
}

export function useTx() {
  const locale = useLocale();
  return (s: string) => translate(s, locale);
}
