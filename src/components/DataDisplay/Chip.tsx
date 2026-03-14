import React from "react";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { IconX } from "@tabler/icons-react";
import { cn } from "../../utils/cn";

const chipVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-surface-muted text-foreground hover:bg-surface-subtle",
        primary:
          "bg-primary/10 text-primary hover:bg-primary/20",
        outline:
          "border border-default bg-transparent text-foreground-muted hover:bg-surface-muted hover:text-foreground",
      },
      size: {
        sm: "h-6 px-sm text-xs",
        default: "h-8 px-md text-sm",
        lg: "h-10 px-md text-base",
      },
      interactive: {
        true: "cursor-pointer active:scale-95",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  }
);

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">,
    VariantProps<typeof chipVariants> {
  /**
   * Optional icon to show before the label
   */
  startIcon?: React.ReactNode;
  /**
   * Optional icon to show after the label. Often an 'x' icon.
   */
  endIcon?: React.ReactNode;
  /**
   * If provided, makes the chip interactive
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * If provided, renders an 'x' icon at the end and triggers this callback
   */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      children,
      startIcon,
      endIcon,
      onClick,
      onRemove,
      disabled,
      ...props
    },
    ref
  ) => {
    const isInteractive = !!onClick;
    const hasRemove = !!onRemove;

    return (
      <div
        ref={ref}
        className={cn(
          chipVariants({ variant, size, interactive: isInteractive }),
          disabled ? "opacity-50 pointer-events-none" : "",
          className
        )}
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {startIcon && (
          <span className="mr-sm -ml-xs inline-flex shrink-0 items-center justify-center">
            {startIcon}
          </span>
        )}
        
        <span className="truncate">{children}</span>

        {endIcon && !hasRemove && (
          <span className="ml-sm -mr-xs inline-flex shrink-0 items-center justify-center">
            {endIcon}
          </span>
        )}

        {hasRemove && (
          <button
            type="button"
            className={cn(
              "ml-sm -mr-sm inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full opacity-70 transition-opacity hover:bg-surface-subtle hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
            )}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(e);
            }}
            disabled={disabled}
            aria-label="Remove"
          >
            <IconX className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }
);
Chip.displayName = "Chip";
