"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MASECHTOT, TOTAL_DAPIM } from "@/lib/daf-yomi";
import { useProgress } from "@/hooks/use-progress";

export function StatsCards() {
  const { getLearnedCount } = useProgress();
  const totalLearned = getLearnedCount();

  const completedMasechtot = MASECHTOT.filter(
    (m) => getLearnedCount(m.id) === m.totalDapim
  ).length;

  const percentage = Math.round((totalLearned / TOTAL_DAPIM) * 1000) / 10;

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-black text-learned">{totalLearned.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">דפים נלמדו</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-black text-today">{percentage}%</p>
          <p className="text-xs text-muted-foreground mt-1">מהש&quot;ס</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-3xl font-black text-foreground">{completedMasechtot}</p>
          <p className="text-xs text-muted-foreground mt-1">מסכתות הושלמו</p>
        </CardContent>
      </Card>
    </div>
  );
}
