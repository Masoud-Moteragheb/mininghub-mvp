// app/community/page.tsx
import { prisma } from "@/lib/prisma";
import CommunityClient from "@/components/CommunityClient";

export type CommunityItem = {
  id: string;
  title: string;
  excerpt: string;
  tag: "Q&A" | "Case Study" | "News" | "Job";
  mine?: string;
  mineType?: string;
  country?: string;
  commodity?: string;
  author: string;
  role?: string;
  createdAt: string; // ISO
  replies: number;
  likes?: number;
};

// کمک برای تبدیل تگ‌های String[] در Thread به تگ مناسب UI
function normalizeTag(rawTag?: string | null): CommunityItem["tag"] {
  if (!rawTag) return "Q&A";

  const t = rawTag.toLowerCase();
  if (t.includes("case")) return "Case Study";
  if (t.includes("news")) return "News";
  if (t.includes("job")) return "Job";
  return "Q&A";
}

// تبدیل رکورد Thread به CommunityItem
function mapThreadToCommunityItem(thread: any): CommunityItem {
  const body: string = thread.body ?? "";
  const maxLen = 220;

  return {
    id: thread.id,
    title: thread.title,
    excerpt:
      body.length > maxLen ? body.slice(0, maxLen).trimEnd() + "…" : body,

    tag: normalizeTag(thread.tags?.[0]),

    // این‌ها فعلاً در مدل Thread نداریم → خالی می‌گذاریم
    mine: undefined,
    mineType: undefined,
    country: undefined,
    commodity: undefined,

    // چون Thread فیلد author/role ندارد،
    // یک مقدار پیش‌فرض قابل‌نمایش می‌گذاریم
    author: "Community member",
    role: undefined,

    createdAt: thread.createdAt.toISOString(),
    replies:
      (thread.repliesList?.length as number | undefined) ??
      (thread.replies as number | undefined) ??
      0,
    likes: thread.likes ?? 0,
  };
}

export default async function CommunityPage() {
  // مستقیم از Prisma و جدول Thread می‌خوانیم
  const threads = await prisma.thread.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      repliesList: true, // برای شمارش ریپلای‌ها
    },
    take: 50, // برای MVP کافی است
  });

  const items: CommunityItem[] = threads.map(mapThreadToCommunityItem);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Community</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Questions, real-world experiences, and projects from mining and
            water engineers.
          </p>
        </div>

        <button
          className="opacity-60 cursor-not-allowed rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm"
          title="Coming soon"
        >
          + New post (soon)
        </button>
      </div>

      <CommunityClient initialItems={items} />
    </div>
  );
}
