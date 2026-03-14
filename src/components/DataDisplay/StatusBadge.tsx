import React from "react";
import { cn } from "../../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

export type StatusBadgeStatus =
  | "active"
  | "success"
  | "pending"
  | "error"
  | "failed"
  | "archived"
  | "warning"
  | "inactive";

const statusVariants = cva(
  "inline-flex items-center rounded px-xs py-[2px] text-[10px] font-bold uppercase tracking-wider border",
  {
    variants: {
      status: {
        active:   "border-success/30 bg-success/5 text-success",
        success:  "border-success/30 bg-success/5 text-success",
        pending:  "border-warning/30 bg-warning/5 text-warning",
        error:    "border-error/30 bg-error/5 text-error",
        failed:   "border-error/30 bg-error/5 text-error",
        warning:  "border-warning/30 bg-warning/5 text-warning",
        archived: "border-border-default bg-surface-muted text-foreground-muted",
        inactive: "border-border-default bg-surface-muted text-foreground-muted",
      },
    },
    defaultVariants: {
      status: "active",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusVariants> {
  status: StatusBadgeStatus;
  /** Override the display label. Defaults to the status name. */
  label?: string;
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, label, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(statusVariants({ status }), className)}
        {...props}
      >
        {label ?? status}
      </span>
    );
  }
);

StatusBadge.displayName = "StatusBadge";
