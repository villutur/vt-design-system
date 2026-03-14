import React from "react";
import { cn } from "../../utils/cn";

const toolbarSizeClassMap = {
  sm: "min-h-10 rounded-lg px-sm py-xs text-xs",
  md: "min-h-11 rounded-xl px-md py-sm text-sm",
} as const;

const toolbarToneClassMap = {
  plain: "border-transparent bg-transparent shadow-none",
  subtle: "border border-default bg-surface-subtle shadow-none",
  surface: "border border-default bg-surface shadow-sm",
} as const;

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof toolbarSizeClassMap;
  tone?: keyof typeof toolbarToneClassMap;
  wrap?: boolean;
}

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ size = "md", tone = "subtle", wrap = true, className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full items-center gap-sm",
        wrap ? "flex-wrap" : "flex-nowrap overflow-x-auto",
        toolbarSizeClassMap[size],
        toolbarToneClassMap[tone],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

Toolbar.displayName = "Toolbar";

export interface ToolbarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
}

export const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ compact = false, className, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={cn("flex min-w-0 items-center", compact ? "gap-xs" : "gap-sm", className)}
      {...props}
    />
  ),
);

ToolbarGroup.displayName = "ToolbarGroup";

export interface ToolbarSpacerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ToolbarSpacer = React.forwardRef<HTMLDivElement, ToolbarSpacerProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-4 flex-1", className)} {...props} />
));

ToolbarSpacer.displayName = "ToolbarSpacer";
