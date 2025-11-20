// app/api/community/[id]/reply/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

// POST /api/community/[id]/reply  → اضافه کردن پاسخ
export async function POST(req: Request, { params }: Params) {
  const { id } = params;

  try {
    const { body } = (await req.json()) as { body: string };
    const text = body?.trim();
    if (!text) {
      return NextResponse.json(
        { error: "Reply body is required" },
        { status: 400 }
      );
    }

    // چون در مدل Reply فقط author/role متن ساده داریم، فعلاً ثابت می‌گذاریم
    const reply = await prisma.reply.create({
      data: {
        threadId: id,
        body: text,
        author: "Demo User",
        role: "Community member",
      },
    });

    // شمارنده replies در خود Thread
    await prisma.thread.update({
      where: { id },
      data: {
        replies: { increment: 1 },
      },
    });

    return NextResponse.json({
      id: reply.id,
      body: reply.body,
      author: reply.author,
      role: reply.role,
      createdAt: reply.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("POST /api/community/[id]/reply failed", err);
    return NextResponse.json(
      { error: "Failed to post reply" },
      { status: 500 }
    );
  }
}
