// app/api/community/[id]/reply/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }   // ⬅️ اینجا Promise است
) {
  // ✅ اول params را unwrap می‌کنیم
  const { id: threadId } = await ctx.params;

  const { body } = await req.json();

  if (!threadId || !body?.trim()) {
    return NextResponse.json(
      { error: "Missing threadId or body" },
      { status: 400 }
    );
  }

  // ریپلای را در دیتابیس بساز
  const reply = await prisma.reply.create({
    data: {
      threadId,
      author: "You",
      role: "Community member",
      body,
    },
  });

  // شمارنده‌ی replies را +۱ کن
  await prisma.thread.update({
    where: { id: threadId },
    data: {
      replies: { increment: 1 },
    },
  });

  return NextResponse.json({
    id: reply.id,
    author: reply.author,
    role: reply.role ?? undefined,
    body: reply.body,
    createdAt: reply.createdAt.toISOString(),
  });
}
