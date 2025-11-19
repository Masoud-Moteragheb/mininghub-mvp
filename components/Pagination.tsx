import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | string[] | undefined>;
};

export function Pagination({ currentPage, totalPages, basePath, searchParams = {} }: Props) {
  if (totalPages <= 1) return null;

  // حفظ سایر query ها
  function buildHref(page: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (!value) return;
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        if (key !== "page") params.set(key, value);
      }
    });
    params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-3 text-xs">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        className={`rounded-full border px-3 py-1 ${
          currentPage === 1
            ? "cursor-not-allowed border-slate-200 text-slate-300"
            : "border-slate-300 text-slate-700 hover:border-emerald-600 hover:text-emerald-700"
        }`}
        aria-disabled={currentPage === 1}
      >
        Previous
      </Link>

      <span className="text-slate-500">
        Page {currentPage} of {totalPages}
      </span>

      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        className={`rounded-full border px-3 py-1 ${
          currentPage === totalPages
            ? "cursor-not-allowed border-slate-200 text-slate-300"
            : "border-slate-300 text-slate-700 hover:border-emerald-600 hover:text-emerald-700"
        }`}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </Link>
    </div>
  );
}
