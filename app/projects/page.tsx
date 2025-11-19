// app/projects/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export const revalidate = 0;

const PAGE_SIZE = 9;

type Props = {
  searchParams?: {
    page?: string;
  };
};

export default async function ProjectsPage({ searchParams }: Props) {
  // page number from URL: /projects?page=2
  const pageParam = searchParams?.page ?? "1";
  const page = Number(pageParam) || 1;

  const [totalCount, projects] = await Promise.all([
    prisma.project.count(),
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // --------------- حالت بدون پروژه ---------------
  if (totalCount === 0) {
    return (
      <main className="py-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Projects</h1>
            <p className="text-sm text-gray-500">
              Case studies, pilots and best practices from mines and
              hydrogeology projects.
            </p>
          </div>

          <Link
            href="/projects/new"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            + Create project
          </Link>
        </div>

        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed bg-white text-center">
          <p className="text-gray-600 mb-3">
            No projects in the database yet.
          </p>
          <Link
            href="/projects/new"
            className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            Add the first project
          </Link>
        </div>
      </main>
    );
  }

  // --------------- حالت عادی با کارت‌های ۳تایی ---------------
  return (
    <main className="py-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-gray-500">
            Explore practical projects on mine water, dewatering and
            hydrogeology.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Create project
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const created =
            project.createdAt instanceof Date
              ? format(project.createdAt, "MMM d, yyyy")
              : "";

          const firstTag =
            Array.isArray((project as any).tags) &&
            (project as any).tags.length > 0
              ? (project as any).tags[0]
              : null;

          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block rounded-xl border bg-white p-4 hover:shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                <span>{created}</span>
                {firstTag && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                    {firstTag}
                  </span>
                )}
              </div>

              <h2 className="mb-2 line-clamp-2 text-sm font-semibold">
                {project.title}
              </h2>

              {project.summary && (
                <p className="mb-3 line-clamp-3 text-xs text-gray-600">
                  {project.summary}
                </p>
              )}

              <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                <span>
                  {(project as any).location
                    ? `${(project as any).location}, `
                    : ""}
                  {project.country}
                </span>
                <span className="text-emerald-700 font-medium">
                  View details →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      
    </main>
  );
}
