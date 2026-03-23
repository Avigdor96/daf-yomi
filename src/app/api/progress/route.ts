import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProgress } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { isValidDaf } from "@/lib/daf-yomi";

// GET /api/progress - Get all progress for authenticated user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
    }

    const progress = await db
      .select({
        masechetId: userProgress.masechetId,
        daf: userProgress.daf,
        learnedAt: userProgress.learnedAt,
      })
      .from(userProgress)
      .where(eq(userProgress.userId, session.user.id));

    return NextResponse.json(progress);
  } catch (err) {
    console.error("[GET /api/progress]", err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}

// POST /api/progress - Toggle a daf (learn/unlearn)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const { masechetId, daf } = body;

    // Validate input
    if (!masechetId || typeof masechetId !== "string" || typeof daf !== "number") {
      return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
    }

    if (!isValidDaf(masechetId, daf)) {
      return NextResponse.json({ error: "מסכת או דף לא תקינים" }, { status: 400 });
    }

    // Check if exists
    const existing = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.masechetId, masechetId),
          eq(userProgress.daf, daf)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Unlearn
      await db
        .delete(userProgress)
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(userProgress.masechetId, masechetId),
            eq(userProgress.daf, daf)
          )
        );
      return NextResponse.json({ action: "removed" });
    } else {
      // Learn
      await db
        .insert(userProgress)
        .values({ userId, masechetId, daf });
      return NextResponse.json({ action: "added" });
    }
  } catch (err) {
    console.error("[POST /api/progress]", err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
