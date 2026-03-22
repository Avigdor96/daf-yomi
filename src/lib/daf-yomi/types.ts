export enum Seder {
  ZERAIM = "זרעים",
  MOED = "מועד",
  NASHIM = "נשים",
  NEZIKIN = "נזיקין",
  KODASHIM = "קדשים",
  TAHOROT = "טהרות",
}

export interface Masechet {
  id: string;
  nameHe: string;
  nameEn: string;
  seder: Seder;
  totalDapim: number;
  startDaf: number;
  order: number;
  sefariaName: string;
}

export interface TodaysDaf {
  masechetId: string;
  daf: number;
}
