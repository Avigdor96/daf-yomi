"use client";

import { memo } from "react";
import { DafCell } from "./daf-cell";
import type { Masechet, TodaysDaf } from "@/lib/daf-yomi";

interface MasechetRowProps {
  masechet: Masechet;
  todayDaf: TodaysDaf;
  isLearned: (masechetId: string, daf: number) => boolean;
  onSelect: (masechetId: string, daf: number) => void;
}

export const MasechetRow = memo(function MasechetRow({
  masechet,
  todayDaf,
  isLearned,
  onSelect,
}: MasechetRowProps) {
  const dapim = Array.from({ length: masechet.totalDapim }, (_, i) => masechet.startDaf + i);
  const learnedCount = dapim.filter((daf) => isLearned(masechet.id, daf)).length;

  return (
    <div className="flex items-start gap-2 py-1">
      <a
        href={`/masechet/${masechet.id}`}
        className="w-16 sm:w-20 text-[11px] sm:text-xs font-medium text-foreground shrink-0 hover:text-today transition-colors pt-0.5 leading-tight"
        title={masechet.nameHe}
      >
        <span className="block">{masechet.nameHe}</span>
        <span className="text-[9px] sm:text-[10px] text-muted-foreground">{learnedCount}/{masechet.totalDapim}</span>
      </a>
      <div className="flex flex-wrap gap-[2px] sm:gap-[3px]">
        {dapim.map((daf) => (
          <DafCell
            key={daf}
            masechetName={masechet.nameHe}
            masechetId={masechet.id}
            daf={daf}
            isLearned={isLearned(masechet.id, daf)}
            isToday={todayDaf.masechetId === masechet.id && todayDaf.daf === daf}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
});
