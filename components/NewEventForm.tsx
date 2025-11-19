"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Org = {
  id: string;
  name: string;
};

export default function NewEventForm({
  organizations,
}: {
  organizations: Org[];
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    adminCode: "",
    title: "",
    description: "",
    date: "",
    endDate: "",
    location: "",
    country: "",
    url: "",
    organizationId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to create event");
      } else {
        setSuccess("Event created successfully.");
        const data = await res.json();
        // هدایت به صفحه‌ی جزئیات رویداد
        router.push(`/events/${data.event.id}`);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
    >
      {/* Admin code */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">
          Admin code
        </label>
        <input
          type="password"
          name="adminCode"
          value={form.adminCode}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
          placeholder="Enter admin code"
          required
        />
        <p className="text-[11px] text-slate-500">
          Only administrators with the correct code can create events.
        </p>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* Dates */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            Start date
          </label>
          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            End date (optional)
          </label>
          <input
            type="datetime-local"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            Location / Venue
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Country</label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
            placeholder="Germany, Canada, ..."
          />
        </div>
      </div>

      {/* URL */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">
          Event website / registration link
        </label>
        <input
          type="url"
          name="url"
          value={form.url}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
          placeholder="https://..."
        />
      </div>

      {/* Organization */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">
          Organizing organization
        </label>
        <select
          name="organizationId"
          value={form.organizationId}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
        >
          <option value="">— Select organization (optional) —</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
      {success && (
        <p className="text-xs text-emerald-600">
          {success}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center rounded-full bg-emerald-700 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Create event"}
      </button>
    </form>
  );
}
