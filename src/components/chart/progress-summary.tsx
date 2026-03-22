"use client";

import { Progress } from "@/components/ui/progress";
import { TOTAL_DAPIM } from "@/lib/daf-yomi";

interface ProgressSummaryProps {
  learnedCount: number;
}

export function ProgressSummary({ learnedCount }: ProgressSummaryProps) {
  const percentage = Math.round((learnedCount / TOTAL_DAPIM) * 1000) / 10;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-card rounded-lg border">
      <div className="w-full sm:flex-1">
        <Progress value={percentage} className="h-3" />
      </div>
      <div className="text-sm font-medium whitespace-nowrap">
        <span className="text-learned font-bold">{learnedCount.toLocaleString()}</span>
        <span className="text-muted-foreground"> מתוך </span>
        <span className="font-bold">{TOTAL_DAPIM.toLocaleString()}</span>
        <span className="text-muted-foreground"> דפים </span>
        <span className="text-today font-bold">({percentage}%)</span>
      </div>
    </div>
  );
}
