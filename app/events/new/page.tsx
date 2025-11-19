// app/events/new/page.tsx
import { prisma } from "@/lib/prisma";
import NewEventForm from "@/components/NewEventForm";

export default async function NewEventPage() {
  const organizations = await prisma.organization.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create new event
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Admin-only form for adding conferences, workshops and webinars.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-8">
        <NewEventForm organizations={organizations} />
      </section>
    </main>
  );
}
