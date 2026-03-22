"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogIn } from "lucide-react";

export default function LandingPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-8 max-w-lg px-4">
        <div>
          <h1 className="text-6xl font-black text-foreground">
            הש&quot;ס שלי
          </h1>
          <p className="text-xl text-muted-foreground mt-3">
            מעקב דף יומי דיגיטלי
          </p>
        </div>

        <p className="text-base text-muted-foreground leading-relaxed">
          עקוב אחרי הלימוד שלך, סמן כל דף שלמדת,
          וראה את ההתקדמות שלך בלוח ויזואלי מרהיב.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ size: "lg" }), "w-full text-lg bg-learned hover:bg-learned/90 text-foreground")}
          >
            כניסה לאפליקציה
          </Link>
          {status === "loading" ? (
            <div className="h-10 bg-muted animate-pulse rounded-md" />
          ) : session?.user ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span>מחובר כ-{session.user.name}</span>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full text-lg gap-2"
              )}
            >
              <LogIn className="w-5 h-5" />
              התחברות עם Google לשמירת ההתקדמות
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">37</p>
            <p className="text-xs text-muted-foreground">מסכתות</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">2,711</p>
            <p className="text-xs text-muted-foreground">דפים</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">6</p>
            <p className="text-xs text-muted-foreground">סדרים</p>
          </div>
        </div>
      </div>
    </div>
  );
}
