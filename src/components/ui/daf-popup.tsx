"use client";

import { useEffect, useRef } from "react";
import { BookOpen, Youtube, Check, X } from "lucide-react";

interface DafPopupProps {
  masechetName: string;
  dafLabel: string;
  isLearned: boolean;
  sefariaUrl: string;
  youtubeUrl: string;
  onToggle: () => void;
  onClose: () => void;
}

export function DafPopup({
  masechetName,
  dafLabel,
  isLearned,
  sefariaUrl,
  youtubeUrl,
  onToggle,
  onClose,
}: DafPopupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        ref={ref}
        className="bg-card rounded-xl shadow-xl border border-border p-4 w-[260px] space-y-3 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">
            {masechetName} דף {dafLabel}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {/* Toggle learned */}
          <button
            onClick={() => {
              onToggle();
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isLearned
                ? "bg-learned/20 text-foreground hover:bg-learned/30"
                : "bg-muted hover:bg-muted/80 text-foreground"
            }`}
          >
            <Check className="w-4 h-4" />
            {isLearned ? "סמן כלא נלמד" : "סמן כנלמד"}
          </button>

          {/* Sefaria link */}
          <a
            href={sefariaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-today/10 text-today hover:bg-today/20 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            פתח בספריא
          </a>

          {/* YouTube link */}
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <Youtube className="w-4 h-4" />
            שיעור ר&apos; אלי סטפנסקי
          </a>
        </div>
      </div>
    </div>
  );
}
