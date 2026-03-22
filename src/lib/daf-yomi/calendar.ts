import { MASECHTOT, TOTAL_DAPIM } from "./masechtot";
import { TodaysDaf } from "./types";

// The 14th Daf Yomi cycle began on January 5, 2020 with Berakhot daf 2
const CYCLE_14_START = new Date(2020, 0, 5); // Month is 0-indexed
const MS_PER_DAY = 86400000;

export function getDafForDate(date: Date = new Date()): TodaysDaf {
  // Normalize to midnight to avoid timezone issues
  const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const cycleStart = new Date(CYCLE_14_START.getFullYear(), CYCLE_14_START.getMonth(), CYCLE_14_START.getDate());

  const daysSinceCycleStart = Math.floor(
    (normalized.getTime() - cycleStart.getTime()) / MS_PER_DAY
  );

  // Handle both positive and negative modulo (for dates before cycle start)
  const dayInCycle = ((daysSinceCycleStart % TOTAL_DAPIM) + TOTAL_DAPIM) % TOTAL_DAPIM;

  let accumulated = 0;
  for (const masechet of MASECHTOT) {
    if (dayInCycle < accumulated + masechet.totalDapim) {
      const daf = masechet.startDaf + (dayInCycle - accumulated);
      return { masechetId: masechet.id, daf };
    }
    accumulated += masechet.totalDapim;
  }

  // Fallback (should never reach)
  return { masechetId: MASECHTOT[0].id, daf: 2 };
}

export function getTodaysDaf(): TodaysDaf {
  return getDafForDate(new Date());
}
