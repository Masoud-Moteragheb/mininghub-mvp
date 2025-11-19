"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim() || null,
          location: location.trim() || null,
          country: country.trim() || null,
          // tags در دیتابیس به صورت String[] است
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          // اگر بعداً organizationId یا ownerId خواستی می‌توانی اینجا اضافه کنی
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to create project.");
      }

      const data = await res.json();
      // بعد از ساخت، برو به صفحه پروژه یا لیست پروژه‌ها
      if (data.project?.id) {
        router.push(`/projects/${data.project.id}`);
      } else {
        router.push("/projects");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Create new project</h1>
      <p className="text-sm text-gray-500 mb-6">
        Add a case study or pilot project related to mining, mine water or
        hydrogeology.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: Dewatering system for open-pit copper mine"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Short summary
          </label>
          <textarea
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="What is this project about? Main objectives, methods, outcomes…"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Location (city / mine site)
            </label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Freiberg, Saxony"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Germany"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Tags (comma separated)
          </label>
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="mine water, dewatering, groundwater, acid mine drainage"
          />
          <p className="text-xs text-gray-400">
            Example: <code>mine water, dewatering, hydrogeology</code>
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/projects")}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Create project"}
          </button>
        </div>
      </form>
    </main>
  );
}
