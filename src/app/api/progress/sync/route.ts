import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProgress } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { isValidDaf } from "@/lib/daf-yomi";

// Max items per sync to prevent abuse
const MAX_SYNC_ITEMS = 2800; // slightly more than total dapim (2711)

// POST /api/progress/sync - Sync localStorage data to server on first login
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const { items } = body as {
      items: Array<{ masechetId: string; daf: number }>;
    };

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
    }

    if (items.length > MAX_SYNC_ITEMS) {
      return NextResponse.json({ error: "יותר מדי פריטים" }, { status: 400 });
    }

    // Filter only valid dapim
    const validItems = items.filter(
      (item) =>
        item &&
        typeof item.masechetId === "string" &&
        typeof item.daf === "number" &&
        isValidDaf(item.masechetId, item.daf)
    );

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

    // Insert only new valid items
    const newItems = validItems.filter(
      (item) => !existingSet.has(`${item.masechetId}:${item.daf}`)
    );

    if (newItems.length > 0) {
      await db.insert(userProgress).values(
        newItems.map((item) => ({
          userId,
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
  } catch (err) {
    console.error("[POST /api/progress/sync]", err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
