"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta } from "@/types";
import { cn } from "@/lib/utils";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit, hasNext, hasPrev } = pagination;

  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Build visible page numbers
  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-xs text-text-tertiary">
        Showing {start}–{end} of {total} task{total !== 1 ? "s" : ""}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-secondary
                     hover:text-text-primary hover:border-border-strong hover:bg-surface-2
                     disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={15} />
        </button>

        {getPages().map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-text-tertiary">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all",
                p === page
                  ? "bg-accent text-white border border-accent"
                  : "border border-border text-text-secondary hover:text-text-primary hover:border-border-strong hover:bg-surface-2"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-secondary
                     hover:text-text-primary hover:border-border-strong hover:bg-surface-2
                     disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
