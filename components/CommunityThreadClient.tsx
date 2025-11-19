// components/CommunityThreadClient.tsx
"use client";

import { useState } from "react";
import type { CommunityItem } from "@/app/community/page";
import type { Reply } from "@/app/community/[id]/page";

type Props = {
  post: CommunityItem;
  initialReplies: Reply[];
};

export default function CommunityThreadClient({ post, initialReplies }: Props) {
  const [replies, setReplies] = useState<Reply[]>(initialReplies);
  const [likes, setLikes] = useState<number>(post.likes ?? 0);
  const [body, setBody] = useState("");

  let formattedDate = "";
  try {
    formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    formattedDate = post.createdAt;
  }

  async function handleLike() {
    try {
      const res = await fetch(`/api/community/${post.id}/like`, {
        method: "POST",
      });
      if (!res.ok) return;
      const data = await res.json();
      setLikes(data.likes);
    } catch (e) {
      console.error("Failed to like post", e);
    }
  }




  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;

    try {
      const res = await fetch(`/api/community/${post.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      if (!res.ok) {
        console.error("Failed to post reply", res.status);
        return;
      }

      const created = (await res.json()) as Reply;
      setReplies((prev) => [...prev, created]);
      setBody("");
    } catch (err) {
      console.error("Failed to post reply", err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Post header */}
      <article className="rounded-xl border border-neutral-200 bg-white/80 p-4 shadow-sm shadow-black/5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center gap-2">
            {post.tag && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                {post.tag}
              </span>
            )}
            {post.mine && (
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
                {post.mine}
              </span>
            )}
            {post.country && (
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
                {post.country}
              </span>
            )}
            {post.mineType && (
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
                {post.mineType}
              </span>
            )}
          </div>

          <span>{formattedDate}</span>
        </div>

        <h1 className="mt-3 text-xl font-semibold text-neutral-900">
          {post.title}
        </h1>

        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
          {post.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-700">{post.author}</span>
            {post.role && <span>· {post.role}</span>}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLikes((v) => v + 1)}
              className="inline-flex items-center gap-1 rounded-full bg-neutral-50 px-3 py-1 text-[11px] text-neutral-600 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <span>👍</span>
              <span>{likes}</span>
            </button>

            <span>{replies.length} replies</span>
          </div>
        </div>
      </article>

      {/* Reply form */}
      <section className="rounded-xl border border-neutral-200 bg-white/70 p-4 shadow-sm shadow-black/5">
        <h2 className="text-sm font-semibold text-neutral-800">
          Add a reply
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Share your experience, suggestions, or follow-up questions.
        </p>

        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <textarea
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none ring-emerald-500 focus:ring-1"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your reply here..."
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-emerald-700"
            >
              Post reply
            </button>
          </div>
        </form>
      </section>

      {/* Replies list */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-800">
          Replies ({replies.length})
        </h2>

        {replies.length === 0 ? (
          <p className="text-xs text-neutral-500">
            No replies yet. Be the first to share your thoughts.
          </p>
        ) : (
          <div className="space-y-3">
            {replies.map((r) => {
              let d = "";
              try {
                d = new Date(r.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
              } catch {
                d = r.createdAt;
              }

              return (
                <article
                  key={r.id}
                  className="rounded-lg border border-neutral-200 bg-white/80 p-3 text-sm text-neutral-800"
                >
                  <div className="mb-1 flex items-center justify-between text-[11px] text-neutral-500">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-700">
                        {r.author}
                      </span>
                      {r.role && <span>· {r.role}</span>}
                    </div>
                    <span>{d}</span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {r.body}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
