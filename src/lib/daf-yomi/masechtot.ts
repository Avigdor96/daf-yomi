import { Masechet, Seder } from "./types";
import { toHebrewNumeral } from "./hebrew-numerals";

export const MASECHTOT: Masechet[] = [
  // סדר זרעים
  { id: "berakhot", nameHe: "ברכות", nameEn: "Berakhot", seder: Seder.ZERAIM, totalDapim: 63, startDaf: 2, order: 1, sefariaName: "Berakhot" },
  // סדר מועד
  { id: "shabbat", nameHe: "שבת", nameEn: "Shabbat", seder: Seder.MOED, totalDapim: 157, startDaf: 2, order: 2, sefariaName: "Shabbat" },
  { id: "eruvin", nameHe: "עירובין", nameEn: "Eruvin", seder: Seder.MOED, totalDapim: 105, startDaf: 2, order: 3, sefariaName: "Eruvin" },
  { id: "pesachim", nameHe: "פסחים", nameEn: "Pesachim", seder: Seder.MOED, totalDapim: 121, startDaf: 2, order: 4, sefariaName: "Pesachim" },
  { id: "shekalim", nameHe: "שקלים", nameEn: "Shekalim", seder: Seder.MOED, totalDapim: 21, startDaf: 2, order: 5, sefariaName: "Shekalim" },
  { id: "yoma", nameHe: "יומא", nameEn: "Yoma", seder: Seder.MOED, totalDapim: 87, startDaf: 2, order: 6, sefariaName: "Yoma" },
  { id: "sukkah", nameHe: "סוכה", nameEn: "Sukkah", seder: Seder.MOED, totalDapim: 55, startDaf: 2, order: 7, sefariaName: "Sukkah" },
  { id: "beitzah", nameHe: "ביצה", nameEn: "Beitzah", seder: Seder.MOED, totalDapim: 39, startDaf: 2, order: 8, sefariaName: "Beitzah" },
  { id: "rosh-hashanah", nameHe: "ראש השנה", nameEn: "Rosh Hashanah", seder: Seder.MOED, totalDapim: 34, startDaf: 2, order: 9, sefariaName: "Rosh_Hashanah" },
  { id: "taanit", nameHe: "תענית", nameEn: "Taanit", seder: Seder.MOED, totalDapim: 30, startDaf: 2, order: 10, sefariaName: "Taanit" },
  { id: "megillah", nameHe: "מגילה", nameEn: "Megillah", seder: Seder.MOED, totalDapim: 31, startDaf: 2, order: 11, sefariaName: "Megillah" },
  { id: "moed-katan", nameHe: "מועד קטן", nameEn: "Moed Katan", seder: Seder.MOED, totalDapim: 28, startDaf: 2, order: 12, sefariaName: "Moed_Katan" },
  { id: "chagigah", nameHe: "חגיגה", nameEn: "Chagigah", seder: Seder.MOED, totalDapim: 26, startDaf: 2, order: 13, sefariaName: "Chagigah" },
  // סדר נשים
  { id: "yevamot", nameHe: "יבמות", nameEn: "Yevamot", seder: Seder.NASHIM, totalDapim: 122, startDaf: 2, order: 14, sefariaName: "Yevamot" },
  { id: "ketubot", nameHe: "כתובות", nameEn: "Ketubot", seder: Seder.NASHIM, totalDapim: 112, startDaf: 2, order: 15, sefariaName: "Ketubot" },
  { id: "nedarim", nameHe: "נדרים", nameEn: "Nedarim", seder: Seder.NASHIM, totalDapim: 90, startDaf: 2, order: 16, sefariaName: "Nedarim" },
  { id: "nazir", nameHe: "נזיר", nameEn: "Nazir", seder: Seder.NASHIM, totalDapim: 65, startDaf: 2, order: 17, sefariaName: "Nazir" },
  { id: "sotah", nameHe: "סוטה", nameEn: "Sotah", seder: Seder.NASHIM, totalDapim: 48, startDaf: 2, order: 18, sefariaName: "Sotah" },
  { id: "gittin", nameHe: "גיטין", nameEn: "Gittin", seder: Seder.NASHIM, totalDapim: 89, startDaf: 2, order: 19, sefariaName: "Gittin" },
  { id: "kiddushin", nameHe: "קידושין", nameEn: "Kiddushin", seder: Seder.NASHIM, totalDapim: 81, startDaf: 2, order: 20, sefariaName: "Kiddushin" },
  // סדר נזיקין
  { id: "bava-kamma", nameHe: "בבא קמא", nameEn: "Bava Kamma", seder: Seder.NEZIKIN, totalDapim: 118, startDaf: 2, order: 21, sefariaName: "Bava_Kamma" },
  { id: "bava-metzia", nameHe: "בבא מציעא", nameEn: "Bava Metzia", seder: Seder.NEZIKIN, totalDapim: 118, startDaf: 2, order: 22, sefariaName: "Bava_Metzia" },
  { id: "bava-batra", nameHe: "בבא בתרא", nameEn: "Bava Batra", seder: Seder.NEZIKIN, totalDapim: 175, startDaf: 2, order: 23, sefariaName: "Bava_Batra" },
  { id: "sanhedrin", nameHe: "סנהדרין", nameEn: "Sanhedrin", seder: Seder.NEZIKIN, totalDapim: 112, startDaf: 2, order: 24, sefariaName: "Sanhedrin" },
  { id: "makkot", nameHe: "מכות", nameEn: "Makkot", seder: Seder.NEZIKIN, totalDapim: 23, startDaf: 2, order: 25, sefariaName: "Makkot" },
  { id: "shevuot", nameHe: "שבועות", nameEn: "Shevuot", seder: Seder.NEZIKIN, totalDapim: 48, startDaf: 2, order: 26, sefariaName: "Shevuot" },
  { id: "avodah-zarah", nameHe: "עבודה זרה", nameEn: "Avodah Zarah", seder: Seder.NEZIKIN, totalDapim: 75, startDaf: 2, order: 27, sefariaName: "Avodah_Zarah" },
  { id: "horayot", nameHe: "הוריות", nameEn: "Horayot", seder: Seder.NEZIKIN, totalDapim: 13, startDaf: 2, order: 28, sefariaName: "Horayot" },
  // סדר קדשים
  { id: "zevachim", nameHe: "זבחים", nameEn: "Zevachim", seder: Seder.KODASHIM, totalDapim: 119, startDaf: 2, order: 29, sefariaName: "Zevachim" },
  { id: "menachot", nameHe: "מנחות", nameEn: "Menachot", seder: Seder.KODASHIM, totalDapim: 109, startDaf: 2, order: 30, sefariaName: "Menachot" },
  { id: "chullin", nameHe: "חולין", nameEn: "Chullin", seder: Seder.KODASHIM, totalDapim: 141, startDaf: 2, order: 31, sefariaName: "Chullin" },
  { id: "bekhorot", nameHe: "בכורות", nameEn: "Bekhorot", seder: Seder.KODASHIM, totalDapim: 60, startDaf: 2, order: 32, sefariaName: "Bekhorot" },
  { id: "arakhin", nameHe: "ערכין", nameEn: "Arakhin", seder: Seder.KODASHIM, totalDapim: 33, startDaf: 2, order: 33, sefariaName: "Arakhin" },
  { id: "temurah", nameHe: "תמורה", nameEn: "Temurah", seder: Seder.KODASHIM, totalDapim: 33, startDaf: 2, order: 34, sefariaName: "Temurah" },
  { id: "keritot", nameHe: "כריתות", nameEn: "Keritot", seder: Seder.KODASHIM, totalDapim: 27, startDaf: 2, order: 35, sefariaName: "Keritot" },
  { id: "meilah", nameHe: "מעילה", nameEn: "Meilah", seder: Seder.KODASHIM, totalDapim: 21, startDaf: 2, order: 36, sefariaName: "Meilah" },
  { id: "tamid", nameHe: "תמיד", nameEn: "Tamid", seder: Seder.KODASHIM, totalDapim: 9, startDaf: 25, order: 37, sefariaName: "Tamid" },
  // סדר טהרות
  { id: "niddah", nameHe: "נידה", nameEn: "Niddah", seder: Seder.TAHOROT, totalDapim: 73, startDaf: 2, order: 38, sefariaName: "Niddah" },
];

export const TOTAL_DAPIM = MASECHTOT.reduce((sum, m) => sum + m.totalDapim, 0);

export const SEDARIM = Object.values(Seder);

export function getMasechetById(id: string): Masechet | undefined {
  return MASECHTOT.find((m) => m.id === id);
}

export function getMasechtotBySeder(seder: Seder): Masechet[] {
  return MASECHTOT.filter((m) => m.seder === seder);
}

export function getSefariaUrl(masechet: Masechet, daf: number): string {
  return `https://www.sefaria.org/${masechet.sefariaName}.${daf}a`;
}

export function getMDYYouTubeUrl(masechet: Masechet, daf: number): string {
  // Search within the MDY Hebrew YouTube channel directly
  // Hebrew numerals give better results: "מנחות סה" not "מנחות 65"
  const hebrewDaf = toHebrewNumeral(daf);
  return `https://www.youtube.com/@MercazDafYomi/search?query=${encodeURIComponent(`${masechet.nameHe} ${hebrewDaf}`)}`;
}
