// components/CommunityClient.tsx
"use client";

import { useMemo, useState } from "react";
import type { CommunityItem } from "@/app/community/page";
import CommunityCard from "./CommunityCard";

type Props = {
  initialItems: CommunityItem[];
};

const TAG_FILTERS: { label: string; value: "all" | CommunityItem["tag"] }[] = [
  { label: "All", value: "all" },
  { label: "Q&A", value: "Q&A" },
  { label: "Case Studies", value: "Case Study" },
  { label: "News", value: "News" },
  { label: "Jobs", value: "Job" },
];

type SortKey = "newest" | "oldest" | "mostReplies" | "mostLikes";

export default function CommunityClient({ initialItems }: Props) {
  const [items, setItems] = useState<CommunityItem[]>(initialItems);

  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<"all" | CommunityItem["tag"]>("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  const [mineTypeFilter, setMineTypeFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [commodityFilter, setCommodityFilter] = useState<string>("all");

  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    body: "",
    tag: "Q&A" as CommunityItem["tag"],
    mine: "",
    mineType: "",
    country: "",
    commodity: "",
  });

  // Unique filter values
  const { mineTypes, countries, commodities } = useMemo(() => {
    const mt = new Set<string>();
    const c = new Set<string>();
    const com = new Set<string>();

    for (const item of items) {
      if (item.mineType) mt.add(item.mineType);
      if (item.country) c.add(item.country);
      if (item.commodity) com.add(item.commodity);
    }

    return {
      mineTypes: Array.from(mt),
      countries: Array.from(c),
      commodities: Array.from(com),
    };
  }, [items]);

  // Filter + search + sort
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = items.filter((item) => {
      const matchTag = tag === "all" ? true : item.tag === tag;
      if (!matchTag) return false;

      const matchMineType =
        mineTypeFilter === "all" ? true : item.mineType === mineTypeFilter;
      if (!matchMineType) return false;

      const matchCountry =
        countryFilter === "all" ? true : item.country === countryFilter;
      if (!matchCountry) return false;

      const matchCommodity =
        commodityFilter === "all"
          ? true
          : item.commodity === commodityFilter;
      if (!matchCommodity) return false;

      const text =
        (
          item.title +
          " " +
          item.excerpt +
          " " +
          (item.mine || "") +
          " " +
          (item.country || "") +
          " " +
          (item.author || "") +
          " " +
          (item.commodity || "") +
          " " +
          (item.mineType || "")
        ).toLowerCase();

      const matchQuery = q === "" ? true : text.includes(q);

      return matchQuery;
    });

    list = list.slice().sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      switch (sortBy) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "mostReplies":
          return (b.replies ?? 0) - (a.replies ?? 0);
        case "mostLikes":
          return (b.likes ?? 0) - (a.likes ?? 0);
        default:
          return 0;
      }
    });

    return list;
  }, [
    items,
    query,
    tag,
    sortBy,
    mineTypeFilter,
    countryFilter,
    commodityFilter,
  ]);

  async function handleLike(id: string) {
    try {
      const res = await fetch(`/api/community/${id}/like`, {
        method: "POST",
      });
      if (!res.ok) return;
      const data = await res.json(); // { likes: number }

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, likes: data.likes } : item
        )
      );
    } catch (err) {
      console.error("Failed to like post", err);
    }
  }


  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.body.trim()) return;

    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newPost.title.trim(),
        body: newPost.body.trim(),
        excerpt: newPost.body.trim(),
        tag: newPost.tag,
        mine: newPost.mine.trim() || null,
        mineType: newPost.mineType.trim() || null,
        country: newPost.country.trim() || null,
        commodity: newPost.commodity.trim() || null,
      }),
    });

    if (!res.ok) {
      console.error("Failed to create post", res.status);
      return;
    }

    const created = (await res.json()) as CommunityItem;

    setItems((prev) => [created, ...prev]);

    setNewPost({
      title: "",
      body: "",
      tag: "Q&A",
      mine: "",
      mineType: "",
      country: "",
      commodity: "",
    });
    setShowNewPostForm(false);
  }

  return (
    <div className="space-y-6">
      {/* Top controls: search + filters + sort */}
      <div className="space-y-4 rounded-xl border border-neutral-100 bg-white/60 p-4 shadow-sm shadow-black/5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Search in title, mine, country, author..."
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 focus:ring-1"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-neutral-400">
              Ctrl+F
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            {TAG_FILTERS.map((t) => {
              const isActive = t.value === tag;
              return (
                <button
                  key={t.value}
                  onClick={() => setTag(t.value)}
                  className={
                    "rounded-full border px-3 py-1 transition text-xs sm:text-sm " +
                    (isActive
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                      : "border-neutral-200 text-neutral-600 hover:bg-neutral-50")
                  }
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced filters + sort */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
            <select
              value={mineTypeFilter}
              onChange={(e) => setMineTypeFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-2 py-1"
            >
              <option value="all">All mine types</option>
              {mineTypes.map((mt) => (
                <option key={mt} value={mt}>
                  {mt}
                </option>
              ))}
            </select>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-2 py-1"
            >
              <option value="all">All countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={commodityFilter}
              onChange={(e) => setCommodityFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-2 py-1"
            >
              <option value="all">All commodities</option>
              {commodities.map((com) => (
                <option key={com} value={com}>
                  {com}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-neutral-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="rounded-lg border border-neutral-200 bg-white px-2 py-1"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="mostReplies">Most replies</option>
              <option value="mostLikes">Most likes</option>
            </select>
          </div>
        </div>

        {/* New post toggle */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowNewPostForm((v) => !v)}
            className="text-xs sm:text-sm rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 hover:bg-emerald-100"
          >
            {showNewPostForm ? "Cancel new post" : "Create new post"}
          </button>
        </div>

        {/* New post form */}
        {showNewPostForm && (
          <form
            onSubmit={handleCreatePost}
            className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50/60 p-3 text-xs sm:text-sm"
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex-1">
                <label className="block text-[11px] font-medium text-neutral-600">
                  Title
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs sm:text-sm"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost((p) => ({ ...p, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="w-full sm:w-40">
                <label className="block text-[11px] font-medium text-neutral-600">
                  Tag
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs sm:text-sm"
                  value={newPost.tag}
                  onChange={(e) =>
                    setNewPost((p) => ({
                      ...p,
                      tag: e.target.value as CommunityItem["tag"],
                    }))
                  }
                >
                  <option value="Q&A">Q&A</option>
                  <option value="Case Study">Case Study</option>
                  <option value="News">News</option>
                  <option value="Job">Job</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600">
                Body / summary
              </label>
              <textarea
                className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs sm:text-sm"
                rows={3}
                value={newPost.body}
                onChange={(e) =>
                  setNewPost((p) => ({ ...p, body: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-600">
                  Mine / site
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs sm:text-sm"
                  value={newPost.mine}
                  onChange={(e) =>
                    setNewPost((p) => ({ ...p, mine: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600">
                  Mine type
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs sm:text-sm"
                  placeholder="Open-pit, underground..."
                  value={newPost.mineType}
                  onChange={(e) =>
                    setNewPost((p) => ({ ...p, mineType: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600">
                  Country
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs sm:text-sm"
                  value={newPost.country}
                  onChange={(e) =>
                    setNewPost((p) => ({ ...p, country: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600">
                  Commodity
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs sm:text-sm"
                  placeholder="Copper, coal, gold..."
                  value={newPost.commodity}
                  onChange={(e) =>
                    setNewPost((p) => ({ ...p, commodity: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs sm:text-sm font-medium text-white hover:bg-emerald-700"
              >
                Post to community
              </button>
            </div>
          </form>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-neutral-500 text-sm">
          No posts found for the selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <CommunityCard
              key={item.id}
              item={item}
              onLike={() => handleLike(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
