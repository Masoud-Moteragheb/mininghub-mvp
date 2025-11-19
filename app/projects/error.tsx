"use client";

export default function ProjectsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h2 className="text-xl font-semibold">Could not load projects</h2>
      <p className="mt-2 text-neutral-600">{error.message}</p>
      <button
        onClick={reset}
        className="mt-6 rounded bg-neutral-900 text-white px-4 py-2"
      >
        Try again
      </button>
    </div>
  );
}
