// components/CommunityCard.tsx
import Link from "next/link";
import type { CommunityItem } from "@/app/community/page";

type Props = {
  item: CommunityItem;
  onLike?: () => void;
};

const TAG_COLORS: Record<
  CommunityItem["tag"],
  { bg: string; text: string; label: string }
> = {
  "Q&A": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    label: "Q&A",
  },
  "Case Study": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    label: "Case study",
  },
  News: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    label: "News",
  },
  Job: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    label: "Job",
  },
};

export default function CommunityCard({ item, onLike }: Props) {
  const tagStyle = TAG_COLORS[item.tag];

  let formattedDate = "";
  try {
    formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    formattedDate = item.createdAt;
  }

  return (
    <article className="rounded-xl border border-neutral-200 bg-white/70 px-4 py-3 shadow-sm shadow-black/5 hover:shadow-md hover:border-emerald-200 transition">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${tagStyle.bg} ${tagStyle.text}`}
          >
            {tagStyle.label}
          </span>

          {item.mine && (
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
              {item.mine}
            </span>
          )}

          {item.country && (
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
              {item.country}
            </span>
          )}

          {item.mineType && (
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
              {item.mineType}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-neutral-400">
          <span>{formattedDate}</span>
          <span className="h-1 w-1 rounded-full bg-neutral-300" />
          <span>{item.replies} replies</span>
        </div>
      </div>

      <Link href={`/community/${item.id}`}>
        <h2 className="mt-2 text-sm font-semibold text-neutral-900 hover:text-emerald-700">
          {item.title}
        </h2>
      </Link>

      <p className="mt-1 line-clamp-3 text-xs text-neutral-600">
        {item.excerpt}
      </p>

      <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.author}</span>
          {item.role && <span className="text-neutral-400">· {item.role}</span>}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLike}
            className="inline-flex items-center gap-1 rounded-full bg-neutral-50 px-2 py-1 text-[11px] text-neutral-600 hover:bg-emerald-50 hover:text-emerald-800"
          >
            <span>👍</span>
            <span>{item.likes ?? 0}</span>
          </button>

          <Link
            href={`/community/${item.id}`}
            className="rounded-full bg-neutral-50 px-2 py-1 text-[11px] text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
          >
            View thread
          </Link>
        </div>
      </div>
    </article>
  );
}
