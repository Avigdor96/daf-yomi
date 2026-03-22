const ONES = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
const TENS = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
const HUNDREDS = ["", "ק", "ר"];

export function toHebrewNumeral(n: number): string {
  if (n <= 0 || n > 999) return String(n);

  let result = "";
  let remaining = n;

  if (remaining >= 100) {
    result += HUNDREDS[Math.floor(remaining / 100)];
    remaining %= 100;
  }

  if (remaining === 15) {
    result += "טו";
  } else if (remaining === 16) {
    result += "טז";
  } else {
    if (remaining >= 10) {
      result += TENS[Math.floor(remaining / 10)];
      remaining %= 10;
    }
    result += ONES[remaining];
  }

  // Add geresh (׳) for single letter, gershayim (״) before last letter for multiple
  if (result.length === 1) {
    return result + "\u05F3"; // geresh ׳
  }
  return result.slice(0, -1) + "\u05F4" + result.slice(-1); // gershayim ״
}
