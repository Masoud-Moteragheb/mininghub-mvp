// components/ProjectCard.tsx
import { Pencil, Trash2 } from "lucide-react";

export type ProjectItem = {
  id: string;
  title: string;
  summary?: string | null;
  tags: string[];
  owner?: { name?: string | null; email: string } | null;
  createdAt?: string;
  stars?: number | null;
};

type Props = {
  item: ProjectItem;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ProjectCard({ item, onEdit, onDelete }: Props) {
  const ownerLabel = item.owner?.name ?? item.owner?.email ?? "Demo User";

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      {/* بالا: عنوان + ستاره + دکمه‌های اکشن */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-snug line-clamp-2">
          {item.title}
        </h3>

        <div className="flex flex-col items-end gap-1">
          {/* تعداد ستاره‌ها */}
          <div className="inline-flex items-center gap-1 text-amber-500">
            <span>⭐</span>
            <span className="text-sm font-medium text-neutral-600">
              {item.stars ?? 0}
            </span>
          </div>

          {/* دکمه‌های ویرایش / حذف (اگر props داده شده باشند) */}
          {(onEdit || onDelete) && (
            <div className="flex gap-1 text-neutral-400">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="rounded-full p-1 hover:bg-neutral-100 hover:text-neutral-700"
                  title="Edit project"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-full p-1 hover:bg-red-50 hover:text-red-600"
                  title="Delete project"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* خلاصه */}
      {item.summary && (
        <p className="mt-3 line-clamp-3 text-neutral-600">{item.summary}</p>
      )}

      {/* تگ‌ها */}
      {item.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* صاحب پروژه */}
      <div className="mt-4 text-xs text-neutral-500">{ownerLabel}</div>
    </div>
  );
}
