// app/api/community/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CommunityItem } from "@/app/community/page";

function mapThreadToCommunityItem(thread: any): CommunityItem {
  const firstTag = (thread.tags?.[0] as string | undefined) ?? "Q&A";

  return {
    id: thread.id,
    title: thread.title,
    excerpt: thread.body,
    tag: firstTag as CommunityItem["tag"],

    mine: undefined,
    mineType: undefined,
    country: undefined,
    commodity: undefined,

    author: "Demo User",
    role: "Community member",
    createdAt: thread.createdAt.toISOString(),
    replies: thread.replies ?? 0,
    likes: thread.likes ?? 0, // 👈 حالا مقدار واقعی
  };
}

export async function GET() {
  const threads = await prisma.thread.findMany({
    orderBy: { createdAt: "desc" },
  });

  const items = threads.map(mapThreadToCommunityItem);
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();

  const thread = await prisma.thread.create({
    data: {
      title: body.title,
      body: body.excerpt ?? body.body ?? "",
      tags: [body.tag],
    },
  });

  const item = mapThreadToCommunityItem(thread);
  return NextResponse.json(item, { status: 201 });
}
