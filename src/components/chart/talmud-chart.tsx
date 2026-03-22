"use client";

import { SEDARIM, getMasechtotBySeder, getTodaysDaf } from "@/lib/daf-yomi";
import { SederEnum } from "@/lib/daf-yomi";
import { MasechetRow } from "./masechet-row";
import { ProgressSummary } from "./progress-summary";
import { useProgress } from "@/hooks/use-progress";

export function TalmudChart() {
  const { isLearned, toggleDaf, getLearnedCount } = useProgress();
  const todayDaf = getTodaysDaf();
  const learnedCount = getLearnedCount();

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
                onToggle={toggleDaf}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
