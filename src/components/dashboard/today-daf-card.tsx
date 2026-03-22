"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTodaysDaf, getMasechetById, toHebrewNumeral, getSefariaUrl, getMDYYouTubeUrl } from "@/lib/daf-yomi";
import { useProgress } from "@/hooks/use-progress";
import { Youtube, BookOpen } from "lucide-react";

export function TodayDafCard() {
  const todayDaf = getTodaysDaf();
  const masechet = getMasechetById(todayDaf.masechetId)!;
  const { isLearned, toggleDaf } = useProgress();
  const learned = isLearned(todayDaf.masechetId, todayDaf.daf);

  return (
    <Card className="border-2 border-today/20 bg-gradient-to-bl from-today/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-muted-foreground">הדף היומי</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">
            {masechet.nameHe}
          </p>
          <p className="text-5xl font-black text-today mt-1">
            דף {toHebrewNumeral(todayDaf.daf)}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => toggleDaf(todayDaf.masechetId, todayDaf.daf)}
            variant={learned ? "default" : "outline"}
            className={`flex-1 text-base ${
              learned
                ? "bg-learned hover:bg-learned/90 text-foreground"
                : "border-learned text-learned hover:bg-learned/10"
            }`}
          >
            {learned ? "נלמד ✓" : "למדתי"}
          </Button>
          <a
            href={getSefariaUrl(masechet, todayDaf.daf)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "border-today/30 text-today hover:bg-today/10 gap-1.5")}
          >
            <BookOpen className="w-4 h-4" />
            ספריא
          </a>
          <a
            href={getMDYYouTubeUrl(masechet, todayDaf.daf)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "border-red-200 text-red-600 hover:bg-red-50 gap-1.5")}
          >
            <Youtube className="w-4 h-4" />
            <span className="hidden sm:inline">שיעור</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
