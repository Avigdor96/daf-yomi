"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Nav } from "@/components/nav";
import { getMasechetById, toHebrewNumeral, getSefariaUrl, getMDYYouTubeUrl } from "@/lib/daf-yomi";
import { useProgress } from "@/hooks/use-progress";
import { ExternalLink, Youtube, BookOpen } from "lucide-react";

export default function MasechetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const masechet = getMasechetById(slug);
  const { isLearned, toggleDaf, getLearnedCount } = useProgress();
  const [showOnlyUnlearned, setShowOnlyUnlearned] = useState(false);

  if (!masechet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">מסכת לא נמצאה</p>
      </div>
    );
  }

  const learnedCount = getLearnedCount(masechet.id);
  const percentage = Math.round((learnedCount / masechet.totalDapim) * 100);
  const dapim = Array.from({ length: masechet.totalDapim }, (_, i) => masechet.startDaf + i);
  const filteredDapim = showOnlyUnlearned
    ? dapim.filter((daf) => !isLearned(masechet.id, daf))
    : dapim;

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-2xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              → חזרה
            </Link>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">מסכת {masechet.nameHe}</h1>
              <p className="text-muted-foreground text-sm mt-1">
                סדר {masechet.seder} · {masechet.totalDapim} דפים
              </p>
            </div>
            <div className="flex gap-1.5 mt-1">
              <a
                href={getSefariaUrl(masechet, masechet.startDaf)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs sm:text-sm text-today hover:text-today/80 border border-today/30 rounded-md px-2 sm:px-3 py-1.5 hover:bg-today/5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                ספריא
              </a>
              <a
                href={getMDYYouTubeUrl(masechet, masechet.startDaf)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs sm:text-sm text-red-600 hover:text-red-500 border border-red-200 rounded-md px-2 sm:px-3 py-1.5 hover:bg-red-50 transition-colors"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ר&apos; אלי</span>
                <span className="sm:hidden">MDY</span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Progress value={percentage} className="flex-1 h-3" />
            <span className="text-sm font-medium whitespace-nowrap">
              {learnedCount}/{masechet.totalDapim} ({percentage}%)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={showOnlyUnlearned ? "default" : "outline"}
            size="sm"
            onClick={() => setShowOnlyUnlearned(!showOnlyUnlearned)}
            className={showOnlyUnlearned ? "bg-today hover:bg-today/90" : ""}
          >
            {showOnlyUnlearned ? "מציג רק לא נלמדו" : "הצג רק דפים שלא נלמדו"}
          </Button>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-13 gap-1.5 sm:gap-2">
          {filteredDapim.map((daf) => {
            const learned = isLearned(masechet.id, daf);
            return (
              <Tooltip key={daf}>
                <TooltipTrigger
                  onClick={() => toggleDaf(masechet.id, daf)}
                  className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs sm:text-sm font-medium transition-all hover:scale-105 cursor-pointer group relative ${
                    learned
                      ? "bg-learned text-foreground shadow-sm"
                      : "bg-card border border-border text-muted-foreground hover:border-learned/50"
                  }`}
                >
                  <span className="text-[11px] sm:text-xs">{toHebrewNumeral(daf)}</span>
                </TooltipTrigger>
                <TooltipContent side="top" className="flex flex-col items-center gap-1.5 p-2">
                  <span className="font-medium">{masechet.nameHe} דף {toHebrewNumeral(daf)}</span>
                  <div className="flex gap-2 text-[11px]">
                    <a
                      href={getSefariaUrl(masechet, daf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-today underline flex items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <BookOpen className="w-3 h-3" />
                      ספריא
                    </a>
                    <a
                      href={getMDYYouTubeUrl(masechet, daf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 underline flex items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Youtube className="w-3 h-3" />
                      שיעור
                    </a>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {filteredDapim.length === 0 && showOnlyUnlearned && (
          <div className="text-center py-12">
            <p className="text-2xl font-bold text-learned">סיימת את המסכת!</p>
            <p className="text-muted-foreground mt-2">כל הדפים נלמדו</p>
          </div>
        )}
      </main>
    </div>
  );
}
