// Built-in site content. Used as fallback before admin content exists, and loaded into the DB by prisma/seed.ts.
// Keep imports relative (seed runs without the @ alias).
const IMG = "https://www.padanamapublication.lk/image";
export const FACEBOOK_URL = "https://www.facebook.com/padanama07/";
export const YOUTUBE_URL = "https://www.youtube.com/@padanamapublication";

export const HERO_ALTS_SI = ["පදනම ප්‍රකාශන – 1 වසරේ සිට උසස් පෙළ දක්වා", "සාමාන්‍ය පෙළ කෙටි සටහන් සහ ප්‍රශ්න පත්‍ර", "5 ශ්‍රේණිය ශිෂ්‍යත්ව පෙරහුරු", "උසස් පෙළ විෂය ධාරා පොත්", "දිවයින පුරා නිවසටම බෙදාහැරීම"];
export const HERO_ALTS_EN = ["Padanama Publications – from Grade 1 to A/L", "O/L short notes and question papers", "Grade 5 scholarship practice papers", "A/L stream study guides", "Islandwide doorstep delivery"];

export const DEFAULT_SLIDES = [
  { image: `${IMG}/bg-images/mainslide1.jpg`, href: "/books" },
  { image: `${IMG}/bg-images/mainslide2.jpg`, href: "/books?category=gce-ol" },
  { image: `${IMG}/bg-images/mainslide3.jpg`, href: "/books?category=primary" },
  { image: `${IMG}/bg-images/mainslide4.jpg`, href: "/books?category=gce-al-science" },
  { image: `${IMG}/bg-images/mainslide5.jpg`, href: "/books" },
];

export const DEFAULT_SOCIAL: { id: string; kind: "POST" | "VIDEO"; url: string; thumbnailUrl?: string | null; caption?: string | null }[] = [
    { id: "f1", kind: "POST", url: FACEBOOK_URL, thumbnailUrl: `${IMG}/bg-images/mainslide1.jpg` },
    { id: "f2", kind: "VIDEO", url: YOUTUBE_URL, thumbnailUrl: `${IMG}/bg-images/mainslide3.jpg` },
    { id: "f3", kind: "POST", url: FACEBOOK_URL, thumbnailUrl: `${IMG}/others/shortnotes.jpg` },
    { id: "f4", kind: "VIDEO", url: YOUTUBE_URL, thumbnailUrl: `${IMG}/bg-images/mainslide2.jpg` },
    { id: "f5", kind: "POST", url: FACEBOOK_URL, thumbnailUrl: `${IMG}/others/pastpapers.jpg` },
    { id: "f6", kind: "VIDEO", url: YOUTUBE_URL, thumbnailUrl: `${IMG}/others/termpapers.jpg` },
    { id: "f7", kind: "POST", url: FACEBOOK_URL, thumbnailUrl: `${IMG}/others/modelpapers.jpg` },
    { id: "f8", kind: "VIDEO", url: YOUTUBE_URL, thumbnailUrl: `${IMG}/bg-images/mainslide4.jpg` },
    { id: "f9", kind: "POST", url: FACEBOOK_URL, thumbnailUrl: `${IMG}/bg-images/mainslide5.jpg` },
];

export const DEFAULT_SETTINGS: Record<string, string> = {
  "contact.phone": "+94 71 800 8533",
  "contact.phone2": "+94 77 088 2228",
  "contact.whatsapp": "94718008533",
  "contact.email": "hello@padanamapublication.lk",
  "contact.address": "No. 912/A, Bogaha Junction Road, 10120, Sri Lanka",
};

export interface Review {
  id: number;
  dbId?: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  date: string;
  badge: string;
  title: string;
  comment: string;
  helpfulCount: number;
  bookTitle?: string;
}

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 1,
    name: "කුමුදුනී අබේසිංහ",
    role: "දෙමව්පියෙකි (මවක්)",
    location: "මහනුවර",
    rating: 5,
    date: "පෙරේදා",
    badge: "මිලදී ගැනීමක් ✓",
    title: "ශිෂ්‍යත්ව විභාගය 186කින් විශිෂ්ට ලෙස සමත් වුණා!",
    comment:
      "මගේ දුව පසුගිය 5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාගයෙන් ලකුණු 186ක් අරගෙන දිස්ත්‍රික්කයේ ඉහළින්ම සමත් වුණා. පදනම ආදර්ශ ප්‍රශ්න පත්‍ර සහ පෙරහුරු අභ්‍යාස පොත්වල තිබුණු ප්‍රශ්න රටාව සැබෑ විභාග ප්‍රශ්න පත්‍රයට ගොඩක් සමානයි. මුද්‍රණයේ ගුණාත්මක බව සහ පැහැදිලි පිළිතුරු විවරණ ඉතා විශිෂ්ටයි.",
    helpfulCount: 48,
    bookTitle: "5 ශ්‍රේණිය ශිෂ්‍යත්ව ආදර්ශ ප්‍රශ්න පත්‍ර එකතුව",
  },
  {
    id: 2,
    name: "ඩී. එම්. සෙනෙවිරත්න",
    role: "ගණිත හා විද්‍යා ආචාර්ය",
    location: "කුරුණෑගල",
    rating: 5,
    date: "පසුගිය සතියේ",
    badge: "පාසල් ආචාර්ය ✓",
    title: "O/L සිසුන්ට නිර්දේශ කළ හැකි අංක 1 පොත් පෙළ",
    comment:
      "සාමාන්‍ය පෙළ ගණිතය සහ විද්‍යාව කෙටි සටහන් සහ පසුගිය විභාග ප්‍රශ්න විවරණ පොත් පෙළ මගේ පන්තිවල ළමයින්ට නිර්දේශ කළා. විෂය කරුණු ඉතාම ක්‍රමානුකූලව සහ සරලව කෙටි සටහන් ලෙස ඉදිරිපත් කර තිබීම දරුවන්ට විභාගය ආසන්නයේ මතක තබා ගැනීමට ඉතා පහසුයි.",
    helpfulCount: 62,
    bookTitle: "සාමාන්‍ය පෙළ විද්‍යාව සහ ගණිතය කෙටි සටහන්",
  },
  {
    id: 3,
    name: "කවීෂා මධුෂානි",
    role: "A/L ජීව විද්‍යා ශිෂ්‍යාව (2025)",
    location: "ගාල්ල",
    rating: 5,
    date: "දින 3කට පෙර",
    badge: "A/L විද්‍යා ශිෂ්‍යාව ✓",
    title: "කොළඹ නොගිහින් දවස් 2න් පොත් ටික ගෙදරටම ආවා!",
    comment:
      "A/L Biology Resource Book එකට අනුකූලව හදපු MCQ ප්‍රශ්න සහ විවරණ පොත් ටික නම් උපරිමයි. කොළඹ සාප්පු ගානේ රස්තියාදු නොවී ගෙදර ඉඳලම ඔන්ලයින් ඕඩර් කරලා දවස් 2න් Domex කුරියර් හරහා පොත් ලැබුණා. COD ක්‍රමයට ගෙවන්න ලැබීමත් ලොකු සහනයක්.",
    helpfulCount: 39,
    bookTitle: "උසස් පෙළ ජීව විද්‍යාව බහුවරණ ප්‍රශ්න හා විවරණ",
  },
  {
    id: 4,
    name: "චමින්ද විජේකෝන්",
    role: "දෙමව්පියෙකි (පියෙක්)",
    location: "කොළඹ 06",
    rating: 5,
    date: "සති 2කට පෙර",
    badge: "මිලදී ගැනීමක් ✓",
    title: "පොත් සාම්පල ඔන්ලයින් කියවලා තීරණය කරන්න ලැබුණා",
    comment:
      "වෙබ් අඩවියෙන් ඇණවුම් කිරීම ඉතාම පහසුයි. විශේෂයෙන්ම නොමිලේ ඩිජිටල් පුස්තකාලයෙන් පිටු 20ක සාම්පල කලින්ම කියවලා බලන්න ලැබීම විශිෂ්ට අත්දැකීමක්. පොත්වල අන්තර්ගතය ගැන පූර්ණ අවබෝධයකින් මිලදී ගන්න පුළුවන් වුණා.",
    helpfulCount: 31,
    bookTitle: "6-9 ශ්‍රේණි විෂයානුබද්ධ වැඩපොත් කට්ටලය",
  },
  {
    id: 5,
    name: "එන්. එස්. මුදලිගේ",
    role: "ඉතිහාසය හා සිංහල ආචාරිනී",
    location: "මාතර",
    rating: 5,
    date: "සති 3කට පෙර",
    badge: "පාසල් ආචාරිනී ✓",
    title: "ලකුණු ලබාදීමේ පටිපාටිය (Marking Scheme) අතිවිශිෂ්ටයි",
    comment:
      "පදනම ප්‍රකාශන මඟින් ඉදිරිපත් කරන O/L ආදර්ශ ප්‍රශ්න පත්‍ර කට්ටල වාර විභාග සඳහා පුහුණු වීමට අතිශය ප්‍රයෝජනවත්. විශේෂයෙන්ම ලකුණු ලබාදීමේ පටිපාටිය (Marking Scheme) විභාග දෙපාර්තමේන්තු මට්ටමටම සකසා තිබීම අගය කළ යුතුයි.",
    helpfulCount: 54,
    bookTitle: "සාමාන්‍ය පෙළ ඉතිහාසය සහ සිංහල ආදර්ශ ප්‍රශ්න පත්‍ර",
  },
  {
    id: 6,
    name: "දිනෙත් ප්‍රනාන්දු",
    role: "O/L 9A විශිෂ්ට සාමාර්ථ්‍යලාභී ශිෂ්‍යයෙක්",
    location: "ගම්පහ",
    rating: 5,
    date: "මාසයකට පෙර",
    badge: "O/L 9A විශිෂ්ටයෙක් ✓",
    title: "විභාගයට මාස 3කට පෙර ගෙන්නා ගත්තා — 9A ප්‍රතිඵලයක් ලැබුණා",
    comment:
      "විභාගයට මාස 3කට කලින් පදනම කෙටි සටහන් පොත් සියල්ල ගෙන්නා ගත්තා. විශේෂයෙන් විද්‍යාව හා ඉතිහාසය පාඩම් ඉතා ඉක්මනින් ආවරණය කරගන්න පුළුවන් වුණා. මගේ 9A ජයග්‍රහණයට පදනම පොත් ලොකු ශක්තියක් වුණා. හැම ශිෂ්‍යයෙකුටම මම නිර්දේශ කරනවා.",
    helpfulCount: 77,
    bookTitle: "O/L සියලු විෂයයන්හි කෙටි සටහන් පෙළ",
  },
];
