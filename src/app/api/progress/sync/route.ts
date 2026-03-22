import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProgress } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

// POST /api/progress/sync - Sync localStorage data to server on first login
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
  }
  const userId = session.user.id;

  const { items } = (await request.json()) as {
    items: Array<{ masechetId: string; daf: number }>;
  };

  if (!items || !Array.isArray(items)) {
    return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
  }

  // Get existing progress
  const existing = await db
    .select({
      masechetId: userProgress.masechetId,
      daf: userProgress.daf,
    })
    .from(userProgress)
    .where(eq(userProgress.userId, userId));

  const existingSet = new Set(
    existing.map((e) => `${e.masechetId}:${e.daf}`)
  );

  // Insert only new items
  const newItems = items.filter(
    (item) => !existingSet.has(`${item.masechetId}:${item.daf}`)
  );

  if (newItems.length > 0) {
    await db.insert(userProgress).values(
      newItems.map((item) => ({
        userId: userId!,
        masechetId: item.masechetId,
        daf: item.daf,
      }))
    );
  }

  // Return the merged full progress
  const allProgress = await db
    .select({
      masechetId: userProgress.masechetId,
      daf: userProgress.daf,
    })
    .from(userProgress)
    .where(eq(userProgress.userId, userId));

  return NextResponse.json({
    synced: newItems.length,
    total: allProgress.length,
    progress: allProgress,
  });
}
