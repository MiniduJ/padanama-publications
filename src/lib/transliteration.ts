/**
 * Singlish to Sinhala Phonetic Transliteration Engine
 * Converts Latin phonetics (e.g. "madol duwa", "ganithaya", "hasthipala")
 * into Sinhala Unicode representation for instant book and author search matching.
 */

interface PhoneticMap {
  [key: string]: string;
}

const CONSONANTS: PhoneticMap = {
  th: "ත",
  dh: "ද",
  sh: "ශ",
  ch: "ච",
  jh: "ඣ",
  ph: "ඵ",
  bh: "භ",
  kh: "ඛ",
  gh: "ඝ",
  ng: "ං",
  gn: "ඥ",
  kn: "ඥ",
  k: "ක",
  g: "ග",
  t: "ට",
  d: "ද",      // Standard dental 'da' (e.g. "duwa" -> "දුව")
  nd: "ඳ",
  n: "න",
  N: "ණ",
  p: "ප",
  b: "බ",
  m: "ම",
  y: "ය",
  r: "ර",
  l: "ල",
  v: "ව",
  w: "ව",
  s: "ස",
  h: "හ",
  j: "ජ",
};

// Word-level phonetic dictionary for common book terms
const COMMON_WORD_OVERRIDES: Record<string, string> = {
  "ganithaya": "ගණිතය",
  "duwa": "දූව",
  "madol": "මඩොල්",
  "potha": "පොත",
  "poth": "පොත්",
  "satahan": "සටහන්",
  "keti": "කෙටි",
  "shishyathwaya": "ශිෂ්‍යත්වය",
  "perahuru": "පෙරහුරු",
  "prashna": "ප්‍රශ්න",
  "pathra": "පත්‍ර",
  "vidyava": "විද්‍යාව",
  "ithihasaya": "ඉතිහාසය",
  "sinhala": "සිංහල",
};

const VOWEL_MODIFIERS: PhoneticMap = {
  aae: "ෑ",
  ae: "ැ",
  aa: "ා",
  ee: "ී",
  ii: "ී",
  oo: "ූ",
  uu: "ූ",
  ei: "ේ",
  oe: "ෝ",
  au: "ෞ",
  ai: "ෛ",
  a: "",
  i: "ි",
  u: "ු",
  e: "ෙ",
  o: "ො",
};

const STANDALONE_VOWELS: PhoneticMap = {
  aae: "ඈ",
  ae: "ඇ",
  aa: "ආ",
  ee: "ඊ",
  ii: "ඊ",
  oo: "ඌ",
  uu: "ඌ",
  ei: "ඒ",
  oe: "ඕ",
  au: "ඖ",
  ai: "ඓ",
  a: "අ",
  i: "ඉ",
  u: "උ",
  e: "එ",
  o: "ඔ",
};

export function transliterateWord(word: string): string {
  const lower = word.toLowerCase();
  if (COMMON_WORD_OVERRIDES[lower]) {
    return COMMON_WORD_OVERRIDES[lower];
  }

  let result = "";
  let i = 0;

  while (i < word.length) {
    if (!/[a-zA-Z]/.test(word[i])) {
      result += word[i];
      i++;
      continue;
    }

    // Two-letter consonant match
    let matchedConsonant = "";
    let consLen = 0;

    if (i + 1 < word.length && CONSONANTS[word.substring(i, i + 2).toLowerCase()]) {
      matchedConsonant = CONSONANTS[word.substring(i, i + 2).toLowerCase()];
      consLen = 2;
    } else if (CONSONANTS[word[i]]) {
      matchedConsonant = CONSONANTS[word[i]];
      consLen = 1;
    } else if (CONSONANTS[word[i].toLowerCase()]) {
      matchedConsonant = CONSONANTS[word[i].toLowerCase()];
      consLen = 1;
    }

    if (matchedConsonant) {
      const remainder = word.substring(i + consLen).toLowerCase();
      let matchedVowelMod = "";
      let vowelLen = 0;

      const vowelCandidates = ["aae", "ae", "aa", "ee", "ii", "oo", "uu", "ei", "oe", "au", "ai", "a", "i", "u", "e", "o"];
      for (const cand of vowelCandidates) {
        if (remainder.startsWith(cand)) {
          matchedVowelMod = VOWEL_MODIFIERS[cand];
          vowelLen = cand.length;
          break;
        }
      }

      if (vowelLen > 0) {
        result += matchedConsonant + matchedVowelMod;
        i += consLen + vowelLen;
      } else {
        result += matchedConsonant + "්";
        i += consLen;
      }
    } else {
      // Standalone vowel
      let standalone = "";
      let vLen = 0;
      const standaloneCandidates = ["aae", "ae", "aa", "ee", "ii", "oo", "uu", "ei", "oe", "au", "ai", "a", "i", "u", "e", "o"];
      const remainder = word.substring(i).toLowerCase();
      for (const cand of standaloneCandidates) {
        if (remainder.startsWith(cand)) {
          standalone = STANDALONE_VOWELS[cand];
          vLen = cand.length;
          break;
        }
      }

      if (vLen > 0) {
        result += standalone;
        i += vLen;
      } else {
        result += word[i];
        i++;
      }
    }
  }

  return result;
}

export function singlishToSinhala(text: string): string {
  if (!text) return "";
  return text
    .split(/(\s+)/)
    .map((token) => (/\s+/.test(token) ? token : transliterateWord(token)))
    .join("");
}
