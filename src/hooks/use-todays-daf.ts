"use client";

import { useState, useEffect } from "react";
import { getTodaysDaf } from "@/lib/daf-yomi";
import type { TodaysDaf } from "@/lib/daf-yomi/types";

function dafKey(d: TodaysDaf): string {
  return `${d.masechetId}:${d.daf}`;
}

function msUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return midnight.getTime() - now.getTime() + 100;
}

export function useTodaysDaf(): TodaysDaf {
  const [daf, setDaf] = useState<TodaysDaf>(() => getTodaysDaf());

  useEffect(() => {
    setDaf(getTodaysDaf());

    let timerId: ReturnType<typeof setTimeout>;

    function scheduleNextUpdate() {
      timerId = setTimeout(() => {
        setDaf(getTodaysDaf());
        scheduleNextUpdate();
      }, msUntilMidnight());
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        const fresh = getTodaysDaf();
        setDaf((prev) => (dafKey(prev) === dafKey(fresh) ? prev : fresh));
        clearTimeout(timerId);
        scheduleNextUpdate();
      }
    }

    scheduleNextUpdate();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return daf;
}
