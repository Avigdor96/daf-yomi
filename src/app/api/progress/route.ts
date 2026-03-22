import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProgress } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

// GET /api/progress - Get all progress for authenticated user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
  }
  const userId = session.user.id;

  const progress = await db
    .select({
      masechetId: userProgress.masechetId,
      daf: userProgress.daf,
      learnedAt: userProgress.learnedAt,
    })
    .from(userProgress)
    .where(eq(userProgress.userId, userId));

  return NextResponse.json(progress);
}

// POST /api/progress - Toggle a daf (learn/unlearn)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
  }
  const userId = session.user.id;

  const { masechetId, daf } = await request.json();

  if (!masechetId || !daf) {
    return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
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
}
