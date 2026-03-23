"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const STORAGE_KEY = "hashas-sheli-progress";

function loadLocalProgress(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return new Set(JSON.parse(stored));
  } catch {
    // ignore parse errors
  }
  return new Set();
}

function saveLocalProgress(progress: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...progress]));
}

export function useProgress() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [progress, setProgress] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const hasSynced = useRef(false);
  const hasHydrated = useRef(false);

  // Load from localStorage after hydration to avoid mismatch
  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;
    const local = loadLocalProgress();
    if (local.size > 0) {
      setProgress(local);
    }
  }, []);

  // When authenticated, always merge local + server data
  useEffect(() => {
    if (!isAuthenticated || hasSynced.current) return;
    hasSynced.current = true;

    async function syncWithServer() {
      setIsLoading(true);
      try {
        const localProgress = loadLocalProgress();

        if (localProgress.size > 0) {
          // Has local data - send to server for merge
          const items = [...localProgress].map((key) => {
            const [masechetId, daf] = key.split(":");
            return { masechetId, daf: parseInt(daf, 10) };
          });

          const res = await fetch("/api/progress/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
          });

          if (res.ok) {
            const data = await res.json();
            // Server returns union of local + server data
            const mergedSet = new Set<string>(
              data.progress.map(
                (p: { masechetId: string; daf: number }) =>
                  `${p.masechetId}:${p.daf}`
              )
            );
            setProgress(mergedSet);
            saveLocalProgress(mergedSet);
          }
        } else {
          // No local data - just load from server
          const res = await fetch("/api/progress");
          if (res.ok) {
            const data = await res.json();
            const serverSet = new Set<string>(
              data.map(
                (p: { masechetId: string; daf: number }) =>
                  `${p.masechetId}:${p.daf}`
              )
            );
            setProgress(serverSet);
            saveLocalProgress(serverSet);
          }
        }
      } catch (err) {
        console.error("[sync]", err);
      } finally {
        setIsLoading(false);
      }
    }

    syncWithServer();
  }, [isAuthenticated]);

  const isLearned = useCallback(
    (masechetId: string, daf: number) => {
      return progress.has(`${masechetId}:${daf}`);
    },
    [progress]
  );

  const toggleDaf = useCallback(
    async (masechetId: string, daf: number) => {
      const key = `${masechetId}:${daf}`;

      // Optimistic update
      setProgress((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        saveLocalProgress(next);
        return next;
      });

      // If authenticated, sync with server
      if (isAuthenticated) {
        try {
          const res = await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ masechetId, daf }),
          });

          if (!res.ok) {
            // Revert on failure
            setProgress((prev) => {
              const reverted = new Set(prev);
              if (reverted.has(key)) {
                reverted.delete(key);
              } else {
                reverted.add(key);
              }
              saveLocalProgress(reverted);
              return reverted;
            });
          }
        } catch {
          // Revert on failure
          setProgress((prev) => {
            const reverted = new Set(prev);
            if (reverted.has(key)) {
              reverted.delete(key);
            } else {
              reverted.add(key);
            }
            saveLocalProgress(reverted);
            return reverted;
          });
        }
      }
    },
    [isAuthenticated]
  );

  const getLearnedCount = useCallback(
    (masechetId?: string) => {
      if (!masechetId) return progress.size;
      let count = 0;
      for (const key of progress) {
        if (key.startsWith(`${masechetId}:`)) count++;
      }
      return count;
    },
    [progress]
  );

  const getLearnedDapim = useCallback(
    (masechetId: string): number[] => {
      const dapim: number[] = [];
      for (const key of progress) {
        if (key.startsWith(`${masechetId}:`)) {
          dapim.push(parseInt(key.split(":")[1], 10));
        }
      }
      return dapim.sort((a, b) => a - b);
    },
    [progress]
  );

  return {
    progress,
    isLearned,
    toggleDaf,
    getLearnedCount,
    getLearnedDapim,
    isLoading,
    isAuthenticated,
  };
}
