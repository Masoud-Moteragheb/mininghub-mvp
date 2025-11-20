// app/api/community/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** کمک برای اینکه رشته‌های tags را به فیلدهای قابل‌استفاده تبدیل کنیم */
function mapThreadToCommunityItem(thread: any) {
  // پیش‌فرض‌ها
  let tag: "Q&A" | "Case Study" | "News" | "Job" = "Q&A";
  let mine: string | undefined;
  let mineType: string | undefined;
  let country: string | undefined;
  let commodity: string | undefined;

  if (Array.isArray(thread.tags)) {
    for (const t of thread.tags as string[]) {
      const [key, ...rest] = t.split(":");
      const value = rest.join(":").trim();
      if (!value) continue;

      switch (key) {
        case "tag":
          if (
            value === "Q&A" ||
            value === "Case Study" ||
            value === "News" ||
            value === "Job"
          ) {
            tag = value;
          }
          break;
        case "mine":
          mine = value;
          break;
        case "mineType":
          mineType = value;
          break;
        case "country":
          country = value;
          break;
        case "commodity":
          commodity = value;
          break;
      }
    }
  }

  return {
    id: thread.id as string,
    title: thread.title as string,
    excerpt: (thread.body as string) ?? "",
    tag,
    mine,
    mineType,
    country,
    commodity,
    // چون در مدل دیتابیس author و role نداریم، فعلاً ثابت می‌گذاریم
    author: "Demo User",
    role: "Community member",
    createdAt: (thread.createdAt as Date).toISOString(),
    replies: (thread.replies as number) ?? 0,
    likes: (thread.likes as number) ?? 0,
  };
}

// GET /api/community  → لیست پست‌ها
export async function GET() {
  try {
    const threads = await prisma.thread.findMany({
      orderBy: { createdAt: "desc" },
    });

    const items = threads.map(mapThreadToCommunityItem);
    return NextResponse.json(items);
  } catch (err) {
    console.error("GET /api/community failed", err);
    return NextResponse.json(
      { error: "Failed to load community posts" },
      { status: 500 }
    );
  }
}

// POST /api/community  → ساخت پست جدید
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      body: text,
      tag,
      mine,
      mineType,
      country,
      commodity,
    } = body as {
      title: string;
      body: string;
      tag: "Q&A" | "Case Study" | "News" | "Job";
      mine?: string | null;
      mineType?: string | null;
      country?: string | null;
      commodity?: string | null;
    };

    if (!title || !text) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    // tags را به صورت key:value ذخیره می‌کنیم تا بعداً بتوانیم دوباره بخوانیم
    const tags: string[] = [];
    if (tag) tags.push(`tag:${tag}`);
    if (mine) tags.push(`mine:${mine}`);
    if (mineType) tags.push(`mineType:${mineType}`);
    if (country) tags.push(`country:${country}`);
    if (commodity) tags.push(`commodity:${commodity}`);

    const thread = await prisma.thread.create({
      data: {
        title,
        body: text,
        tags,
        likes: 0,
        replies: 0,
      },
    });

    const item = mapThreadToCommunityItem(thread);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("POST /api/community failed", err);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
