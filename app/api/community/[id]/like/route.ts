// app/api/community/[id]/like/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

// POST /api/community/[id]/like  → افزایش لایک
export async function POST(_req: Request, { params }: Params) {
  const { id } = params;

  try {
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
