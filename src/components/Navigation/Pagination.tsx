import React from "react";
import { cn } from "../../utils/cn";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current 1-based page number */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Max visible page buttons around current page (default 2) */
  siblingCount?: number;
}

function getPageRange(
  current: number,
  total: number,
  siblings: number,
): (number | "...")[] {
  const pages: (number | "...")[] = [];
  const left = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);

  pages.push(1);
  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("...");
  if (total > 1) pages.push(total);

  return pages;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  ...props
}) => {
  const pages = getPageRange(page, totalPages, siblingCount);

  const btnBase =
    "inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded px-xs text-xs font-medium transition-colors";
  const btnActive = "bg-primary/10 font-bold text-primary";
  const btnInactive =
    "text-foreground-muted hover:bg-surface-muted hover:text-foreground";
  const btnDisabled = "cursor-not-allowed opacity-30";

  return (
    <div
      className={cn("flex items-center gap-xs", className)}
      role="navigation"
      aria-label="Pagination"
      {...props}
    >
      <button
        className={cn(btnBase, page <= 1 ? btnDisabled : btnInactive)}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <IconChevronLeft size={14} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-xs text-xs text-foreground-subtle"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            className={cn(btnBase, p === page ? btnActive : btnInactive)}
            onClick={() => onPageChange(p as number)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        className={cn(btnBase, page >= totalPages ? btnDisabled : btnInactive)}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <IconChevronRight size={14} />
      </button>
    </div>
  );
};

Pagination.displayName = "Pagination";
