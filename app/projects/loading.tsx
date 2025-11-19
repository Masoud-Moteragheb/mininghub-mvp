// app/projects/loading.tsx
export default function LoadingProjects() {
  const cards = Array.from({ length: 6 });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6 h-7 w-40 rounded bg-neutral-200 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-200/70 p-5 space-y-3"
          >
            <div className="h-5 w-3/4 bg-neutral-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-neutral-200 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-neutral-200 rounded animate-pulse" />
            <div className="flex gap-2 pt-2">
              <div className="h-5 w-14 bg-neutral-200 rounded-full animate-pulse" />
              <div className="h-5 w-16 bg-neutral-200 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
