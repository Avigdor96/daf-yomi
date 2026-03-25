"use client";

import { toHebrewNumeral } from "@/lib/daf-yomi";

interface DafCellProps {
  masechetName: string;
  masechetId: string;
  daf: number;
  isLearned: boolean;
  isToday: boolean;
  onSelect: (masechetId: string, daf: number) => void;
}

export function DafCell({ masechetName, masechetId, daf, isLearned, isToday, onSelect }: DafCellProps) {
  return (
    <button
      onPointerDown={(e) => { e.preventDefault(); onSelect(masechetId, daf); }}
      onClick={() => onSelect(masechetId, daf)}
      aria-label={`${masechetName} דף ${toHebrewNumeral(daf)} - ${isLearned ? "נלמד" : "לא נלמד"}`}
      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[2px] transition-all duration-150 hover:scale-125 cursor-pointer ${
        isLearned
          ? "bg-learned"
          : "bg-gray-200 hover:bg-gray-300"
      } ${isToday ? "ring-2 ring-today ring-offset-1" : ""}`}
    />
  );
}
