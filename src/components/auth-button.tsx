"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name ?? "תמונת פרופיל"}
            className="w-7 h-7 rounded-full border border-border"
          />
        )}
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {session.user.name}
        </span>
        <button
          onClick={() => signOut()}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground"
          )}
          aria-label="התנתקות"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "gap-2"
      )}
      aria-label="התחברות עם גוגל"
    >
      <LogIn className="w-4 h-4" />
      <span>התחברות</span>
    </button>
  );
}
