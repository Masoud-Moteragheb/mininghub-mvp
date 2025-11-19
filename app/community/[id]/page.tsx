// app/community/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CommunityThreadClient from "@/components/CommunityThreadClient";
import type { CommunityItem } from "@/app/community/page";

export type Reply = {
  id: string;
  author: string;
  role?: string;
  createdAt: string;
  body: string;
};

export default async function CommunityThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const thread = await prisma.thread.findUnique({
    where: { id },
  });

  if (!thread) {
    return notFound();
  }

  const dbReplies = await prisma.reply.findMany({
    where: { threadId: id },
    orderBy: { createdAt: "asc" },
  });

  const post: CommunityItem = {
    id: thread.id,
    title: thread.title,
    excerpt: thread.body,
    tag: (thread.tags?.[0] as any) ?? "Q&A",
    mine: undefined,
    mineType: undefined,
    country: undefined,
    commodity: undefined,
    author: "Demo User",
    role: "Community member",
    createdAt: thread.createdAt.toISOString(),
    replies: thread.replies ?? dbReplies.length,
    likes: thread.likes ?? 0,
  };

  const replies: Reply[] = dbReplies.map((r) => ({
    id: r.id,
    author: r.author,
    role: r.role ?? undefined,
    body: r.body,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-4 text-xs text-neutral-500">
        <Link
          href="/community"
          className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
        >
          ← Back to community
        </Link>
      </div>

      <CommunityThreadClient post={post} initialReplies={replies} />
    </div>
  );
}
