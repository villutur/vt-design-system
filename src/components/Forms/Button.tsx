import React from "react";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { IconLoader2 } from "@tabler/icons-react";

// Preserving types for backwards compatibility if needed, though they map to CVA variants now.
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "icon";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "border border-transparent bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 focus:ring-primary/50 focus:ring-offset-canvas",
        secondary:
          "border border-default bg-surface text-foreground hover:bg-surface-subtle focus:ring-primary/20 focus:ring-offset-canvas",
        outline:
          "border border-default bg-transparent text-foreground hover:bg-surface-subtle focus:ring-primary/20 focus:ring-offset-canvas",
        ghost:
          "border border-transparent bg-transparent text-foreground-muted hover:bg-surface-muted hover:text-foreground focus:ring-primary/20 focus:ring-offset-canvas",
        danger:
          "border border-transparent bg-error text-white hover:bg-error/90 hover:shadow-lg hover:shadow-error/20 focus:ring-error/50 focus:ring-offset-canvas",
        icon: "rounded-md border border-transparent bg-transparent text-foreground-muted hover:bg-surface-muted hover:text-foreground focus:ring-primary/20 focus:ring-offset-canvas",

      },
      size: {
        xs: "text-[10px] px-sm py-xs gap-xs",
        sm: "text-xs px-md py-sm gap-sm",
        md: "text-sm px-md py-sm gap-sm",
        lg: "text-base px-lg py-md gap-sm",
        iconXs: "p-xs",
        iconSm: "p-sm",
        iconMd: "p-sm",
        iconLg: "p-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "size" | "variant"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Map normal sizes to icon sizes when variant is 'icon'
    const actualSize =
      variant === "icon"
        ? size === "xs"
          ? "iconXs"
          : size === "sm"
            ? "iconSm"
            : size === "lg"
              ? "iconLg"
              : "iconMd"
        : size;

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(buttonVariants({ variant, size: actualSize, className }))}
        {...props}
      >
        {isLoading && <IconLoader2 className="animate-spin text-[1.25em]" />}
        {!isLoading && leftIcon && (
          <span className="inline-flex">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="inline-flex">{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
