import React from "react";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-sm py-xs text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-surface",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-white shadow-sm hover:bg-primary/80",
        secondary:
          "border-transparent bg-surface-muted text-foreground shadow-sm hover:bg-surface-subtle",
        destructive:
          "border-transparent bg-error text-white shadow-sm hover:bg-error/80",
        success:
          "border-transparent bg-success text-white shadow-sm hover:bg-success/80",
        warning:
          "border-transparent bg-warning text-white shadow-sm hover:bg-warning/80",
        info:
          "border-transparent bg-primary text-white shadow-sm hover:bg-primary/80",
        outline: "border border-default text-foreground",
        soft: "border-transparent bg-surface-muted text-foreground",
        softPrimary: "border-transparent bg-primary/10 text-primary",
        softSuccess: "border-transparent bg-success/10 text-success",
        softWarning: "border-transparent bg-warning/10 text-warning",
        softError: "border-transparent bg-error/10 text-error",
        // Outlined status variants (matching design-v2)
        outlineSuccess: "border border-success/30 bg-success/5 text-success",
        outlineWarning: "border border-warning/30 bg-warning/5 text-warning",
        outlineError:   "border border-error/30 bg-error/5 text-error",
        outlineGray:    "border border-default bg-surface-muted text-foreground-muted",
      },
      size: {
        sm: "text-[10px] px-sm py-xs",
        default: "text-xs px-sm py-xs",
        lg: "text-sm px-md py-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
  /** Show a small colored dot before the label */
  dot?: boolean;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span className="mr-xs inline-block h-1.5 w-1.5 rounded-full bg-current" />
        )}
        {children}
      </div>
    );
  }
);
Badge.displayName = "Badge";
