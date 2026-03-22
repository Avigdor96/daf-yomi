"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/auth-button";

export function Nav() {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between">
        <Link href="/" className="text-lg sm:text-xl font-black text-foreground whitespace-nowrap">
          הש&quot;ס שלי
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <nav className="flex gap-0.5">
            <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs sm:text-sm px-2 sm:px-3")}>
              דשבורד
            </Link>
            <Link href="/chart" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs sm:text-sm px-2 sm:px-3")}>
              לוח מעקב
            </Link>
          </nav>
          <div className="border-s border-border ps-1.5 sm:ps-2 ms-0.5 sm:ms-1">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
