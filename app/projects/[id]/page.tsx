// app/projects/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProjectDetailPageProps = {
  // در Next.js 16، params یک Promise است
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  // حتما منتظر params بمانیم
  const { id } = await params;

  // اگر id مشکل داشت، 404
  if (!id || typeof id !== "string") {
    return notFound();
  }

  // چون در Prisma schema نوع id = String است، مستقیم از خودش استفاده می‌کنیم
  const project = await prisma.project.findUnique({
    where: { id },           // دیگر Number() لازم نیست
    include: {
      owner: true,
    },
  });

  if (!project) {
    return notFound();
  }

  return (
    <main className="max-w-5xl mx-auto py-10 space-y-6">
      <Link
        href="/projects"
        className="text-sm text-emerald-700 hover:underline"
      >
        ← Back to all projects
      </Link>

      <section className="mt-4 rounded-2xl bg-white p-8 shadow-sm border border-neutral-200 space-y-4">
        <h1 className="text-2xl font-semibold">{project.title}</h1>

        {project.summary && (
          <p className="text-neutral-700">{project.summary}</p>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
          <span>Owner: {project.owner?.name ?? "Unknown"}</span>
          <span>
            Created at:{" "}
            {project.createdAt.toLocaleDateString("en-GB")}
          </span>
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
