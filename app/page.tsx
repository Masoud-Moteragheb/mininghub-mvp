// app/page.tsx
import Link from "next/link";
import { CalendarDays, FolderKanban, MessageCircle, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma"; // مسیر را مطابق پروژه خودت تنظیم کن

export default async function HomePage() {
  // آمار کلی
  const [projectCount, threadCount, eventCount] = await Promise.all([
    prisma.project.count(),
    prisma.thread.count(),
    prisma.event.count(),
  ]);

  // آخرین ۳ مورد از هر بخش
  const [latestProjects, latestThreads, latestEvents] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.thread.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.event.findMany({
      orderBy: { date: "asc" }, // نزدیک‌ترین رویدادها
      take: 3,
    }),
  ]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="border-b bg-emerald-50/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Mining • Mine water • Hydrogeology
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Welcome to <span className="text-emerald-700">MiningHub</span>
            </h1>
            <p className="text-slate-700">
              Showcase mining projects, share real-world experiences on mine water and
              hydrogeology, and collaborate with engineers, researchers, and companies
              in one professional space.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
              >
                Browse projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/community"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
              >
                Join the community
              </Link>
            </div>
          </div>

          <div className="grid w-full max-w-md grid-cols-3 gap-3 text-sm md:text-base">
            <HeroStat
              label="Projects"
              value={projectCount}
              caption="Case studies & pilots"
            />
            <HeroStat
              label="Discussions"
              value={threadCount}
              caption="Q&A • Best practices"
            />
            <HeroStat
              label="Events"
              value={eventCount}
              caption="Workshops & webinars"
            />
          </div>
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-8 md:grid-cols-3">
        <SummaryCard
          icon={<FolderKanban className="h-5 w-5" />}
          title="Projects"
          description="Real-world mine water, dewatering and environmental projects from around the world."
          href="/projects"
          linkLabel="View all projects"
        />
        <SummaryCard
          icon={<MessageCircle className="h-5 w-5" />}
          title="Community"
          description="Ask questions, share experience and discuss best practices with other professionals."
          href="/community"
          linkLabel="Explore community"
        />
        <SummaryCard
          icon={<CalendarDays className="h-5 w-5" />}
          title="Events"
          description="Conferences, workshops and webinars related to mining and water resources."
          href="/events"
          linkLabel="See all events"
        />
      </section>

      {/* LATEST CONTENT */}
      <section className="mx-auto max-w-6xl space-y-12 px-4 pb-16">
        {/* Latest projects */}
        <div className="space-y-4">
          <SectionHeader
            title="Latest projects"
            href="/projects"
            linkLabel="View all projects"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {latestProjects.length === 0 ? (
              <EmptyCard text="No projects yet. Be the first to add one." />
            ) : (
              latestProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/70 hover:shadow-md"
                >
                  <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                    {p.title}
                  </p>
                  <p className="mt-2 line-clamp-3 text-xs text-slate-600">
                    {p.summary ?? ""}
                  </p>
                  <span className="mt-3 text-xs text-slate-400">
                    {p.country ? p.country : "Unknown location"}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Latest community threads */}
        <div className="space-y-4">
          <SectionHeader
            title="Latest community threads"
            href="/community"
            linkLabel="Go to community"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {latestThreads.length === 0 ? (
              <EmptyCard text="No discussions yet. Start the first thread." />
            ) : (
              latestThreads.map((t) => (
                <Link
                  key={t.id}
                  href={`/community/${t.id}`}
                  className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/70 hover:shadow-md"
                >
                  <span className="inline-flex w-fit rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                    {t.tags?.[0] ?? "Q&A"}
                  </span>
                  <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900">
                    {t.title}
                  </p>
                  <p className="mt-2 line-clamp-3 text-xs text-slate-600">
                    {t.body?.slice(0, 160) ?? ""}
                  </p>
                  <span className="mt-3 text-xs text-slate-400">
                    {t.replies} replies • {t.likes} likes
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="space-y-4">
          <SectionHeader
            title="Upcoming events"
            href="/events"
            linkLabel="See all events"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {latestEvents.length === 0 ? (
              <EmptyCard text="No upcoming events yet." />
            ) : (
              latestEvents.map((e) => (
                <Link
                  key={e.id}
                  href={`/events/${e.id}`}
                  className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/70 hover:shadow-md"
                >
                  <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                    {e.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatEventDate(e.date)} • {e.country ?? "TBA"}
                  </p>
                  <p className="mt-2 line-clamp-3 text-xs text-slate-600">
                    {e.description ?? ""}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// ------------ Small presentational components ------------

function HeroStat({
  label,
  value,
  caption,
}: {
  label: string;
  value: number;
  caption: string;
}) {
  return (
    <div className="flex flex-col rounded-xl bg-white px-4 py-3 text-slate-900 shadow-sm">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="mt-1 text-xl font-semibold">
        {value.toLocaleString?.() ?? value}
      </span>
      <span className="mt-1 text-[11px] text-slate-500">{caption}</span>
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  description,
  href,
  linkLabel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          {icon}
        </div>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      <p className="mt-2 text-xs text-slate-600">{description}</p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center text-xs font-medium text-emerald-700 hover:text-emerald-900"
      >
        {linkLabel}
        <ArrowRight className="ml-1 h-3 w-3" />
      </Link>
    </div>
  );
}

function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <Link
        href={href}
        className="inline-flex items-center text-xs font-medium text-emerald-700 hover:text-emerald-900"
      >
        {linkLabel}
        <ArrowRight className="ml-1 h-3 w-3" />
      </Link>
    </div>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
      {text}
    </div>
  );
}

function formatEventDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
