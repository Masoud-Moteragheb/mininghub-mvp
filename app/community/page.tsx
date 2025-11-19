// app/community/page.tsx
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

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return "http://localhost:3000";
}

async function getCommunityItems(): Promise<CommunityItem[]> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/community`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch /api/community", res.status);
    return [];
  }

  return res.json();
}

export default async function CommunityPage() {
  const items = await getCommunityItems();

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
