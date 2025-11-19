// app/events/[id]/page.tsx
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  // params یک Promise است → اول await
  const { id } = await params;

  if (!id || typeof id !== "string") {
    notFound();
  }

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      createdBy: true,
      organization: true,
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/events"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to events
        </Link>
      </div>

      <section className="rounded-2xl bg-white p-8 shadow-sm space-y-4">
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <span>
            {event.date
              ? format(event.date, "MMMM dd, yyyy")
              : "Date to be confirmed"}
          </span>
          {event.country && (
            <>
              <span>•</span>
              <span className="capitalize">{event.country}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl font-semibold text-gray-900">
          {event.title}
        </h1>

        {event.location && (
          <p className="text-gray-700">
            📍 {event.location}
          </p>
        )}

        {event.organization && (
          <p className="text-sm text-gray-500">
            Organized by{" "}
            <span className="font-medium">{event.organization.name}</span>
          </p>
        )}

        {event.description && (
          <p className="mt-4 text-gray-700 whitespace-pre-line">
            {event.description}
          </p>
        )}

        {event.url && (
          <div className="pt-4">
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Open event website
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
