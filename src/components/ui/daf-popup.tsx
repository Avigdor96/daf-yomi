"use client";

import { useState, useEffect } from "react";
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
  const [visible, setVisible] = useState(false);

  // Animate in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-200 ${
        visible ? "bg-black/40" : "bg-transparent"
      }`}
      onClick={handleClose}
    >
      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl border-t border-border p-5 pb-8 transition-transform duration-200 ease-out ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl">
            {masechetName} דף {dafLabel}
          </h3>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {/* Toggle learned */}
          <button
            onClick={() => {
              onToggle();
              handleClose();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-colors active:scale-[0.98] ${
              isLearned
                ? "bg-learned/20 text-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            <Check className="w-5 h-5" />
            {isLearned ? "סמן כלא נלמד" : "סמן כנלמד ✓"}
          </button>

          {/* Sefaria link */}
          <a
            href={sefariaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium bg-today/10 text-today transition-colors active:scale-[0.98] block"
          >
            <BookOpen className="w-5 h-5" />
            פתח בספריא
          </a>

          {/* YouTube link */}
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium bg-red-50 text-red-600 transition-colors active:scale-[0.98] block"
          >
            <Youtube className="w-5 h-5" />
            שיעור ר&apos; אלי סטפנסקי
          </a>
        </div>
      </div>
    </div>
  );
}
