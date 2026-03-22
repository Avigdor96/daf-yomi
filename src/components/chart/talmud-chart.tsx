"use client";

import { useState, useCallback } from "react";
import { SEDARIM, getMasechtotBySeder, getMasechetById, getTodaysDaf, toHebrewNumeral, getSefariaUrl, getMDYYouTubeUrl } from "@/lib/daf-yomi";
import { SederEnum } from "@/lib/daf-yomi";
import { MasechetRow } from "./masechet-row";
import { ProgressSummary } from "./progress-summary";
import { DafPopup } from "@/components/ui/daf-popup";
import { useProgress } from "@/hooks/use-progress";

export function TalmudChart() {
  const { isLearned, toggleDaf, getLearnedCount } = useProgress();
  const todayDaf = getTodaysDaf();
  const learnedCount = getLearnedCount();
  const [selectedDaf, setSelectedDaf] = useState<{ masechetId: string; daf: number } | null>(null);

  const handleSelect = useCallback((masechetId: string, daf: number) => {
    setSelectedDaf({ masechetId, daf });
  }, []);

  const selectedMasechet = selectedDaf ? getMasechetById(selectedDaf.masechetId) : null;

  return (
    <div className="space-y-6">
      <ProgressSummary learnedCount={learnedCount} />

      {SEDARIM.map((seder) => {
        const masechtot = getMasechtotBySeder(seder as SederEnum);
        return (
          <div key={seder} className="space-y-1">
            <h3 className="text-sm font-bold text-seder-header border-b border-border pb-1">
              סדר {seder}
            </h3>
            {masechtot.map((masechet) => (
              <MasechetRow
                key={masechet.id}
                masechet={masechet}
                todayDaf={todayDaf}
                isLearned={isLearned}
                onSelect={handleSelect}
              />
            ))}
          </div>
        );
      })}

      {/* Popup for selected daf - works on mobile and desktop */}
      {selectedDaf && selectedMasechet && (
        <DafPopup
          masechetName={selectedMasechet.nameHe}
          dafLabel={toHebrewNumeral(selectedDaf.daf)}
          isLearned={isLearned(selectedDaf.masechetId, selectedDaf.daf)}
          sefariaUrl={getSefariaUrl(selectedMasechet, selectedDaf.daf)}
          youtubeUrl={getMDYYouTubeUrl(selectedMasechet, selectedDaf.daf)}
          onToggle={() => toggleDaf(selectedDaf.masechetId, selectedDaf.daf)}
          onClose={() => setSelectedDaf(null)}
        />
      )}
    </div>
  );
}
