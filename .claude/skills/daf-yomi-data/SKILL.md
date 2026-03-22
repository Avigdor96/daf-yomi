---
name: daf-yomi-data
description: Use this skill whenever working on the "הש"ס שלי" Daf Yomi tracker project. Provides the authoritative list of all 37 masechtot (tractates) with exact daf counts, the Daf Yomi calendar calculation algorithm, Sefaria link generation, and Hebrew numeral (gematria) conversion. Trigger whenever creating or modifying components that reference masechtot data, daf numbers, today's daf, Hebrew numerals, or Sefaria links. Also use when debugging daf calculation issues or validating data integrity.
---

# Daf Yomi Data Reference

This skill contains the core domain data and algorithms for the "הש"ס שלי" project.

## Masechtot Data

The Talmud Bavli has **37 masechtot** studied in the Daf Yomi cycle, grouped into 6 sedarim (orders). Every masechet starts at daf 2 (daf bet). The `totalDapim` is the number of dapim studied (last daf number minus 1).

### Complete List (Daf Yomi cycle order)

| # | Seder | ID | Hebrew | English | Dapim |
|---|-------|----|--------|---------|-------|
| 1 | זרעים | berakhot | ברכות | Berakhot | 63 |
| 2 | מועד | shabbat | שבת | Shabbat | 156 |
| 3 | מועד | eruvin | עירובין | Eruvin | 104 |
| 4 | מועד | pesachim | פסחים | Pesachim | 120 |
| 5 | מועד | shekalim | שקלים | Shekalim | 21 |
| 6 | מועד | yoma | יומא | Yoma | 87 |
| 7 | מועד | sukkah | סוכה | Sukkah | 55 |
| 8 | מועד | beitzah | ביצה | Beitzah | 39 |
| 9 | מועד | rosh-hashanah | ראש השנה | Rosh Hashanah | 34 |
| 10 | מועד | taanit | תענית | Taanit | 30 |
| 11 | מועד | megillah | מגילה | Megillah | 31 |
| 12 | מועד | moed-katan | מועד קטן | Moed Katan | 28 |
| 13 | מועד | chagigah | חגיגה | Chagigah | 26 |
| 14 | נשים | yevamot | יבמות | Yevamot | 121 |
| 15 | נשים | ketubot | כתובות | Ketubot | 111 |
| 16 | נשים | nedarim | נדרים | Nedarim | 90 |
| 17 | נשים | nazir | נזיר | Nazir | 65 |
| 18 | נשים | sotah | סוטה | Sotah | 48 |
| 19 | נשים | gittin | גיטין | Gittin | 89 |
| 20 | נשים | kiddushin | קידושין | Kiddushin | 81 |
| 21 | נזיקין | bava-kamma | בבא קמא | Bava Kamma | 118 |
| 22 | נזיקין | bava-metzia | בבא מציעא | Bava Metzia | 118 |
| 23 | נזיקין | bava-batra | בבא בתרא | Bava Batra | 175 |
| 24 | נזיקין | sanhedrin | סנהדרין | Sanhedrin | 112 |
| 25 | נזיקין | makkot | מכות | Makkot | 23 |
| 26 | נזיקין | shevuot | שבועות | Shevuot | 48 |
| 27 | נזיקין | avodah-zarah | עבודה זרה | Avodah Zarah | 75 |
| 28 | נזיקין | horayot | הוריות | Horayot | 13 |
| 29 | קדשים | zevachim | זבחים | Zevachim | 119 |
| 30 | קדשים | menachot | מנחות | Menachot | 109 |
| 31 | קדשים | chullin | חולין | Chullin | 141 |
| 32 | קדשים | bekhorot | בכורות | Bekhorot | 60 |
| 33 | קדשים | arakhin | ערכין | Arakhin | 33 |
| 34 | קדשים | temurah | תמורה | Temurah | 33 |
| 35 | קדשים | keritot | כריתות | Keritot | 27 |
| 36 | קדשים | meilah | מעילה | Meilah | 21 |
| 37 | קדשים | tamid | תמיד | Tamid | 9 |
| 38 | טהרות | niddah | נידה | Niddah | 72 |

**Total: 2,711 dapim**

Note: Tamid in the Vilna edition starts at daf 25b, but for Daf Yomi counting purposes it has 9 dapim (25b-33b). The `startDaf` for Tamid should be set accordingly.

## Daf Yomi Calendar Algorithm

The 14th Daf Yomi cycle began on **January 5, 2020** (6 Tevet 5780) with Berakhot daf 2.

```typescript
const CYCLE_14_START = new Date(2020, 0, 5); // Jan 5, 2020
const TOTAL_DAPIM = 2711;

function getTodaysDaf(date: Date = new Date()): { masechetId: string; daf: number } {
  const msPerDay = 86400000;
  const daysSinceCycleStart = Math.floor(
    (date.getTime() - CYCLE_14_START.getTime()) / msPerDay
  );
  const dayInCycle = ((daysSinceCycleStart % TOTAL_DAPIM) + TOTAL_DAPIM) % TOTAL_DAPIM;

  let accumulated = 0;
  for (const masechet of MASECHTOT) {
    if (dayInCycle < accumulated + masechet.totalDapim) {
      return { masechetId: masechet.id, daf: masechet.startDaf + (dayInCycle - accumulated) };
    }
    accumulated += masechet.totalDapim;
  }
  return { masechetId: MASECHTOT[0].id, daf: 2 };
}
```

### Verification Points
- Jan 5, 2020 → Berakhot 2
- Mar 8, 2020 (63 days later) → Shabbat 2
- The 14th cycle ends approximately June 7, 2027

## Sefaria Links

Sefaria uses English masechet names with dots and amud notation:

```
https://www.sefaria.org/{EnglishName}.{dafNumber}a
```

Examples:
- Berakhot daf 2 → `https://www.sefaria.org/Berakhot.2a`
- Bava Kamma daf 45 → `https://www.sefaria.org/Bava_Kamma.45a`
- Rosh Hashanah daf 12 → `https://www.sefaria.org/Rosh_Hashanah.12a`

Rules:
- Spaces in masechet names become underscores: "Bava Kamma" → "Bava_Kamma"
- "Rosh Hashanah" → "Rosh_Hashanah"
- "Moed Katan" → "Moed_Katan"
- "Avodah Zarah" → "Avodah_Zarah"
- Append `a` for amud alef (side a of the daf)

Each masechet entry should have a `sefariaName` field for generating links:

| ID | Sefaria Name |
|----|-------------|
| berakhot | Berakhot |
| shabbat | Shabbat |
| eruvin | Eruvin |
| pesachim | Pesachim |
| shekalim | Shekalim |
| yoma | Yoma |
| sukkah | Sukkah |
| beitzah | Beitzah |
| rosh-hashanah | Rosh_Hashanah |
| taanit | Taanit |
| megillah | Megillah |
| moed-katan | Moed_Katan |
| chagigah | Chagigah |
| yevamot | Yevamot |
| ketubot | Ketubot |
| nedarim | Nedarim |
| nazir | Nazir |
| sotah | Sotah |
| gittin | Gittin |
| kiddushin | Kiddushin |
| bava-kamma | Bava_Kamma |
| bava-metzia | Bava_Metzia |
| bava-batra | Bava_Batra |
| sanhedrin | Sanhedrin |
| makkot | Makkot |
| shevuot | Shevuot |
| avodah-zarah | Avodah_Zarah |
| horayot | Horayot |
| zevachim | Zevachim |
| menachot | Menachot |
| chullin | Chullin |
| bekhorot | Bekhorot |
| arakhin | Arakhin |
| temurah | Temurah |
| keritot | Keritot |
| meilah | Meilah |
| tamid | Tamid |
| niddah | Niddah |

## Hebrew Numerals (Gematria)

Convert daf numbers (2-176) to Hebrew letters. Rules:

- Units: א=1, ב=2, ג=3, ד=4, ה=5, ו=6, ז=7, ח=8, ט=9
- Tens: י=10, כ=20, ל=30, מ=40, נ=50, ס=60, ע=70, פ=80, צ=90
- Hundreds: ק=100, ר=200
- Special cases: 15 = ט״ו (not י״ה), 16 = ט״ז (not י״ו)
- Single letter gets geresh (׳): ב׳, ג׳, ה׳
- Multiple letters get gershayim (״) before last letter: י״א, ל״ב, קכ״ה

```typescript
function toHebrewNumeral(n: number): string {
  const ones = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  const hundreds = ['', 'ק', 'ר'];

  let result = '';
  if (n >= 100) { result += hundreds[Math.floor(n / 100)]; n %= 100; }
  if (n === 15) { result += 'טו'; }
  else if (n === 16) { result += 'טז'; }
  else {
    if (n >= 10) { result += tens[Math.floor(n / 10)]; n %= 10; }
    result += ones[n];
  }

  // Add geresh/gershayim
  if (result.length === 1) return result + '׳';
  return result.slice(0, -1) + '״' + result.slice(-1);
}
```

### Examples
| Number | Hebrew |
|--------|--------|
| 2 | ב׳ |
| 5 | ה׳ |
| 10 | י׳ |
| 15 | ט״ו |
| 16 | ט״ז |
| 22 | כ״ב |
| 32 | ל״ב |
| 100 | ק׳ |
| 119 | קי״ט |
| 175 | קע״ה |
