// components/ProjectsClient.tsx
"use client";

export const dynamic = "force-dynamic";

import { useMemo, useState } from "react";
import { Plus, X, Search, Filter, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import ProjectCard, { ProjectItem } from "./ProjectCard";

/* --------- Helper components --------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 inline-block text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-2xl border bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            className="rounded-lg border px-2 py-1 text-sm hover:bg-neutral-50"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-3">{children}</div>
      </div>
    </div>
  );
}

/* --------- Main component --------- */

type Props = {
  initialItems: ProjectItem[];
};

type CreateForm = {
  title: string;
  summary: string;
  tags: string;
  ownerEmail: string;
};

type EditForm = {
  title: string;
  summary: string;
  tags: string;
};

export default function ProjectsClient({ initialItems }: Props) {
  const [items, setItems] = useState<ProjectItem[]>(initialItems ?? []);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<ProjectItem | null>(null);

  const [createForm, setCreateForm] = useState<CreateForm>({
    title: "",
    summary: "",
    tags: "",
    ownerEmail: "",
  });

  const [editForm, setEditForm] = useState<EditForm>({
    title: "",
    summary: "",
    tags: "",
  });

  // 🔍 جستجو و فیلتر و مرتب‌سازی
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "title" | "stars">("newest");

  /* ---------- Derived states ---------- */

  const canCreate = useMemo(
    () =>
      createForm.title.trim().length > 0 &&
      createForm.tags.trim().length > 0, // فعلاً خودت حواست باشد حداقل یک تگ بدهی
    [createForm.title, createForm.tags]
  );

  const canSaveEdit = useMemo(
    () =>
      editForm.title.trim().length > 0 &&
      editForm.tags.trim().length > 0,
    [editForm.title, editForm.tags]
  );

  // لیست همه‌ی تگ‌ها برای فیلتر
  const allTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  // 🔁 فیلتر + جستجو + مرتب‌سازی روی items
  const visibleItems = useMemo(() => {
    let list = [...items];

    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter((p) => {
        const inTitle = p.title.toLowerCase().includes(q);
        const inSummary = (p.summary ?? "").toLowerCase().includes(q);
        const inTags = p.tags.some((t) => t.toLowerCase().includes(q));
        return inTitle || inSummary || inTags;
      });
    }

    if (tagFilter !== "all") {
      list = list.filter((p) => p.tags.includes(tagFilter));
    }

    list.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "stars") {
        return (b.stars ?? 0) - (a.stars ?? 0);
      }
      // newest: بر اساس createdAt (یا id به‌عنوان fallback)
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });

    return list;
  }, [items, search, tagFilter, sortBy]);

  /* ---------- Create project ---------- */

  async function addProject() {
    if (!canCreate) {
      toast.error("لطفاً عنوان و حداقل یک تگ را پر کن.");
      return;
    }

    const body = {
      title: createForm.title.trim(),
      summary: createForm.summary.trim() || undefined,
      tags: createForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      ownerEmail: createForm.ownerEmail.trim() || undefined,
    };

    const toastId = toast.loading("Creating project...");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        throw new Error(data?.error || "Create failed");
      }

      setItems((prev) => [data, ...prev]);
      setCreateForm({ title: "", summary: "", tags: "", ownerEmail: "" });
      setOpenCreate(false);
      toast.success("Project created", { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || "Create failed", { id: toastId });
    }
  }

  /* ---------- Start edit ---------- */

  function startEdit(p: ProjectItem) {
    setEditing(p);
    setEditForm({
      title: p.title,
      summary: p.summary ?? "",
      tags: p.tags.join(", "),
    });
    setOpenEdit(true);
  }

  /* ---------- Save edit ---------- */

  async function saveEdit() {
    if (!editing) return;
    if (!canSaveEdit) {
      toast.error("عنوان و حداقل یک تگ لازم است.");
      return;
    }

    const body = {
      title: editForm.title.trim(),
      summary: editForm.summary.trim(),
      tags: editForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const toastId = toast.loading("Saving changes...");

    // optimistic update
    const backup = items;
    setItems((prev) =>
      prev.map((p) =>
        p.id === editing.id ? { ...p, ...body, tags: body.tags } : p
      )
    );

    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(editing.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        throw new Error(data?.error || "Update failed");
      }

      toast.success("Changes saved", { id: toastId });
    } catch (err: any) {
      setItems(backup); // rollback
      toast.error(err?.message || "Update failed", { id: toastId });
    } finally {
      setOpenEdit(false);
      setEditing(null);
    }
  }

  /* ---------- Delete ---------- */

  async function remove(id: string) {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    const toastId = toast.loading("Deleting...");
    const backup = items;
    setItems((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || "Delete failed");
      }

      toast.success("Project deleted", { id: toastId });
    } catch (err: any) {
      setItems(backup); // rollback
      toast.error(err?.message || "Delete failed", { id: toastId });
    }
  }

  /* ---------- Render ---------- */

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* هدر صفحه */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>

        <button
          type="button"
          onClick={() => setOpenCreate(true)}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* نوار جستجو + فیلتر + مرتب‌سازی */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border bg-neutral-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        {/* جستجو */}
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-neutral-500" />
          <input
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Search by title, summary or tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* فیلتر بر اساس تگ */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-500" />
          <select
            className="rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          >
            <option value="all">All tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                #{t}
              </option>
            ))}
          </select>
        </div>

        {/* مرتب‌سازی */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-neutral-500" />
          <select
            className="rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "newest" | "title" | "stars")
            }
          >
            <option value="newest">Newest</option>
            <option value="title">Title (A–Z)</option>
            <option value="stars">Stars (high → low)</option>
          </select>
        </div>
      </div>

      {/* لیست پروژه‌ها (بعد از فیلتر/جستجو/مرتب‌سازی) */}
      {visibleItems.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-neutral-500">
          No matching projects.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((p) => (
            <ProjectCard
              key={p.id}
              item={p}
              onEdit={() => startEdit(p)}
              onDelete={() => remove(p.id)}
            />
          ))}
        </div>
      )}

      {/* مودال ساخت پروژه جدید */}
      {openCreate && (
        <Modal title="New Project" onClose={() => setOpenCreate(false)}>
          <Field label="Title *">
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={createForm.title}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </Field>

          <Field label="Summary">
            <textarea
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={createForm.summary}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, summary: e.target.value }))
              }
            />
          </Field>

          <Field label="Tags (comma separated) *">
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="dewatering, ml, groundwater"
              value={createForm.tags}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, tags: e.target.value }))
              }
            />
          </Field>

          <Field label="Owner email (optional)">
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={createForm.ownerEmail}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, ownerEmail: e.target.value }))
              }
            />
          </Field>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenCreate(false)}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canCreate}
              onClick={addProject}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              Create
            </button>
          </div>
        </Modal>
      )}

      {/* مودال ویرایش */}
      {openEdit && editing && (
        <Modal title="Edit Project" onClose={() => setOpenEdit(false)}>
          <Field label="Title *">
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={editForm.title}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </Field>

          <Field label="Summary">
            <textarea
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={editForm.summary}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, summary: e.target.value }))
              }
            />
          </Field>

          <Field label="Tags (comma separated) *">
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={editForm.tags}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, tags: e.target.value }))
              }
            />
          </Field>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setOpenEdit(false);
                setEditing(null);
              }}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSaveEdit}
              onClick={saveEdit}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
