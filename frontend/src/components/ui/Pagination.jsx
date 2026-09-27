import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ page = 1, pages = 1, onChange, className = "" }) {
  if (pages <= 1) return null;

  const nums = [];
  const push = (n) => nums.push(n);
  if (pages <= 7) {
    for (let i = 1; i <= pages; i += 1) push(i);
  } else {
    push(1);
    if (page > 3) push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i += 1) push(i);
    if (page < pages - 2) push("…");
    push(pages);
  }

  const btn = "flex h-9 min-w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors";

  return (
    <nav className={`flex items-center justify-center gap-2 ${className}`} aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={`${btn} border-slate-200 bg-white text-ink-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Previous page"
      >
        <FaChevronLeft size={11} />
      </button>
      {nums.map((n, idx) =>
        n === "…" ? (
          <span key={`e${idx}`} className="px-1 text-sm text-slate-400">
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={`${btn} ${
              n === page
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-slate-200 bg-white text-ink-700 hover:bg-slate-50"
            }`}
          >
            {n}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        className={`${btn} border-slate-200 bg-white text-ink-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Next page"
      >
        <FaChevronRight size={11} />
      </button>
    </nav>
  );
}
