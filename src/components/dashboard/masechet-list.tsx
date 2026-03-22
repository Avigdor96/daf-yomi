"use client";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { SEDARIM, getMasechtotBySeder } from "@/lib/daf-yomi";
import { SederEnum } from "@/lib/daf-yomi";
import { useProgress } from "@/hooks/use-progress";

export function MasechetList() {
  const { getLearnedCount } = useProgress();

  return (
    <div className="space-y-4">
      {SEDARIM.map((seder) => {
        const masechtot = getMasechtotBySeder(seder as SederEnum);
        return (
          <div key={seder}>
            <h3 className="text-sm font-bold text-seder-header mb-2">סדר {seder}</h3>
            <div className="space-y-1">
              {masechtot.map((m) => {
                const learned = getLearnedCount(m.id);
                const pct = Math.round((learned / m.totalDapim) * 100);
                return (
                  <Link
                    key={m.id}
                    href={`/masechet/${m.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <span className="w-20 text-sm font-medium truncate">{m.nameHe}</span>
                    <Progress value={pct} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground w-16 text-start">
                      {learned}/{m.totalDapim}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
