import React from "react";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const progressBarVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-surface-muted",
  {
    variants: {
      size: {
        sm: "h-1.5",
        default: "h-2.5",
        lg: "h-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-success",
        warning: "bg-warning",
        error: "bg-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ProgressBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressBarVariants> {
  /**
   * Value between 0 and max
   */
  value?: number;
  /**
   * Maximum value. Default is 100
   */
  max?: number;
  /**
   * Color variant of the progress indicator
   */
  variant?: VariantProps<typeof progressIndicatorVariants>["variant"];
  /**
   * Whether to show an indeterminate animation
   */
  indeterminate?: boolean;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size,
      variant,
      indeterminate,
      ...props
    },
    ref
  ) => {
    // Ensure value is between 0 and max
    const safeValue = Math.min(Math.max(value, 0), max);
    const percentage = (safeValue / max) * 100;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : safeValue}
        className={cn(progressBarVariants({ size }), className)}
        {...props}
      >
        <div
          className={cn(
            progressIndicatorVariants({ variant }),
            indeterminate && "animate-progress-indeterminate origin-left"
          )}
          style={{ transform: indeterminate ? undefined : `translateX(-${100 - percentage}%)` }}
        />
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";
