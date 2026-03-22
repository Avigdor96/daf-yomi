---
name: rtl-component
description: Use this skill whenever creating or modifying React components in the "הש"ס שלי" project. Provides conventions for RTL Hebrew UI components using Next.js App Router, Tailwind CSS with logical properties, shadcn/ui, and Heebo font. Trigger when creating new pages, components, or layouts, or when fixing RTL/Hebrew display issues.
---

# RTL Hebrew Component Conventions

## Project Setup

- **Framework**: Next.js 14 App Router with TypeScript
- **Styling**: Tailwind CSS with RTL via `dir="rtl"` on root `<html>`
- **Components**: shadcn/ui (installed via CLI, customized)
- **Font**: Heebo (Google Fonts, variable weight)
- **Language**: Hebrew (lang="he")

## Root Layout Pattern

```tsx
// src/app/layout.tsx
import { Heebo } from 'next/font/google';

const heebo = Heebo({ subsets: ['hebrew', 'latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={heebo.className}>{children}</body>
    </html>
  );
}
```

## Tailwind RTL Rules

Since the app is always RTL, use logical properties consistently:

| Instead of | Use |
|-----------|-----|
| `ml-4` | `ms-4` (margin-inline-start) |
| `mr-4` | `me-4` (margin-inline-end) |
| `pl-4` | `ps-4` (padding-inline-start) |
| `pr-4` | `pe-4` (padding-inline-end) |
| `left-0` | `start-0` |
| `right-0` | `end-0` |
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `rounded-l-lg` | `rounded-s-lg` |
| `rounded-r-lg` | `rounded-e-lg` |
| `border-l` | `border-s` |
| `border-r` | `border-e` |

Note: `flex-row-reverse` is NOT needed since `dir="rtl"` handles flex direction automatically.

## Color Palette

```
--background: #faf6f0 (cream)
--foreground: #3d2c1e (dark brown)
--learned: #d4a853 (gold/amber - for completed dapim)
--today: #2563eb (blue - for today's daf highlight)
--seder-header: #8b7355 (warm gray-brown - for seder dividers)
--card: #ffffff
--muted: #f5f0e8
```

## Component Patterns

### Page Component (Server Component by default)
```tsx
// src/app/dashboard/page.tsx
export default async function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">דשבורד</h1>
      {/* content */}
    </div>
  );
}
```

### Client Component
```tsx
'use client';

import { useState } from 'react';

export function DafCell({ masechetId, daf, isLearned, onToggle }: DafCellProps) {
  // Always include aria-label in Hebrew for accessibility
  return (
    <button
      onClick={() => onToggle(masechetId, daf)}
      aria-label={`${masechetName} דף ${hebrewNumeral} - ${isLearned ? 'נלמד' : 'לא נלמד'}`}
      className={cn(
        'w-3 h-3 rounded-sm transition-colors',
        isLearned ? 'bg-[#d4a853]' : 'bg-gray-200 hover:bg-gray-300'
      )}
    />
  );
}
```

### Accessibility
- All interactive elements must have Hebrew `aria-label`
- Use semantic HTML (`<nav>`, `<main>`, `<section>`)
- Keyboard navigation: arrow keys for grid cells, Enter/Space to toggle
- Tooltips should appear with Hebrew text

### Numbers Display
- Daf numbers: always Hebrew numerals (ב׳, ג׳, ל״ב)
- Statistics/counts: can use Arabic numerals (847 מתוך 2,711)
- Percentages: Arabic numerals with % sign on the left (because RTL): 31.2%

### Optimistic Updates Pattern
```tsx
'use client';

function useOptimisticToggle() {
  const [optimistic, setOptimistic] = useState<Set<string>>(new Set());

  async function toggle(masechetId: string, daf: number) {
    const key = `${masechetId}:${daf}`;
    // Optimistic: update UI immediately
    setOptimistic(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
    // Then sync with server
    try {
      await fetch('/api/progress', {
        method: 'POST',
        body: JSON.stringify({ masechetId, daf }),
      });
    } catch {
      // Revert on failure
      setOptimistic(prev => {
        const next = new Set(prev);
        next.has(key) ? next.delete(key) : next.add(key);
        return next;
      });
    }
  }
  return { optimistic, toggle };
}
```
