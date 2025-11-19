// app/events/page.tsx
import { format } from "date-fns";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function EventsPage() {
  const allEvents = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: {
      organization: true,
    },
  });

  const now = new Date();

  const upcoming = allEvents.filter((e) => e.date && e.date >= now);
  const past = allEvents.filter((e) => e.date && e.date < now);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-white p-8 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Events</h1>
          <p className="mt-2 text-gray-600">
            Conferences, workshops, webinars and meetups related to mining, mine
            water and hydrogeology.
          </p>
        </div>

        <Link
          href="/events/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-white text-sm font-medium hover:bg-emerald-700"
        >
          + New Event
        </Link>
      </section>


      {/* Upcoming */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upcoming events
        </h2>

        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-500">
            No upcoming events yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map((event) => (
              <article
                key={event.id}
                className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex flex-col gap-2"
              >
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>
                    {event.date
                      ? format(event.date, "MMM dd, yyyy")
                      : "Date TBD"}
                  </span>
                  {event.country && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{event.country}</span>
                    </>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  {event.title}
                </h3>

                {event.location && (
                  <p className="text-sm text-gray-600">{event.location}</p>
                )}

                {event.organization && (
                  <p className="text-xs text-gray-500">
                    Organized by{" "}
                    <span className="font-medium">
                      {event.organization.name}
                    </span>
                  </p>
                )}

                <div className="mt-3">
                  <Link
                    href={`/events/${event.id}`}
                    className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    View details <span className="ml-1">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Past events</h2>

        {past.length === 0 ? (
          <p className="text-sm text-gray-500">
            No past events in the database yet.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {past.map((event) => (
              <article
                key={event.id}
                className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex flex-col gap-2 opacity-80"
              >
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>
                    {event.date
                      ? format(event.date, "MMM dd, yyyy")
                      : "Date TBD"}
                  </span>
                  {event.country && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{event.country}</span>
                    </>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  {event.title}
                </h3>

                {event.location && (
                  <p className="text-sm text-gray-600">{event.location}</p>
                )}

                {event.organization && (
                  <p className="text-xs text-gray-500">
                    Organized by{" "}
                    <span className="font-medium">
                      {event.organization.name}
                    </span>
                  </p>
                )}

                <div className="mt-3">
                  <Link
                    href={`/events/${event.id}`}
                    className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    View details <span className="ml-1">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
