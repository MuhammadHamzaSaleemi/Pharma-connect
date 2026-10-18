import React from "react";
import Icon from "./msIcon";

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push("...");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

// Client-side pager shared by the public list explorers (jobs, scholarships).
// Renders nothing when everything fits on one page.
export default function Pagination({ page, totalPages, totalResults, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md">
      <p className="text-xs text-on-surface-variant text-center sm:text-left">
        Showing page <span className="font-bold text-navy-surface">{page}</span>{" "}
        of <span className="font-bold text-navy-surface">{totalPages}</span> (
        {totalResults} results)
      </p>
      <nav className="flex items-center gap-1 text-sm">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(Math.max(1, page - 1))}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-card border border-border-subtle text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Previous page"
        >
          <Icon name="chevron_left" className="text-[18px]" />
        </button>
        {getPageNumbers(page, totalPages).map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center text-outline">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold transition-colors ${
                p === page
                  ? "bg-primary text-on-primary border-0"
                  : "bg-surface-card border border-border-subtle text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-card border border-border-subtle text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Next page"
        >
          <Icon name="chevron_right" className="text-[18px]" />
        </button>
      </nav>
    </div>
  );
}
