// app/api/community/[id]/like/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// در Next.js 16، context.params یک Promise است
export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const updated = await prisma.thread.update({
      where: { id },
      data: {
        likes: { increment: 1 },
      },
    });

    return NextResponse.json({ likes: updated.likes ?? 0 });
  } catch (err) {
    console.error("POST /api/community/[id]/like failed", err);
    return NextResponse.json(
      { error: "Failed to like post" },
      { status: 500 }
    );
  }
}
