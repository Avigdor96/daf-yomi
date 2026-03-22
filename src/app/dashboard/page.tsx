"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Nav } from "@/components/nav";
import { TodayDafCard } from "@/components/dashboard/today-daf-card";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { MasechetList } from "@/components/dashboard/masechet-list";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
        <TodayDafCard />
        <StatsCards />

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">מסכתות</h2>
            <Link href="/chart" className={cn(buttonVariants({ variant: "link", size: "sm" }), "text-today")}>
              לוח מלא ←
            </Link>
          </div>
          <MasechetList />
        </div>
      </main>
    </div>
  );
}
