"use client";

import { Nav } from "@/components/nav";
import { TalmudChart } from "@/components/chart/talmud-chart";

export default function ChartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">לוח תלמודו בידו</h1>
        <TalmudChart />
      </main>
    </div>
  );
}
