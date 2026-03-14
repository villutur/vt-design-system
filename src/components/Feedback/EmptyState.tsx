import React from "react";
import { cn } from "../../utils/cn";

const sizeClassMap = {
  sm: {
    root: "gap-sm py-xl px-md",
    title: "text-sm",
    description: "text-xs",
    icon: "p-md",
  },
  md: {
    root: "gap-md py-2xl px-md",
    title: "text-base",
    description: "text-sm",
    icon: "p-lg",
  },
} as const;

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  eyebrow?: React.ReactNode;
  align?: "center" | "left";
  size?: keyof typeof sizeClassMap;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, eyebrow, align = "center", size = "md", className, ...props }, ref) => {
    const sizing = sizeClassMap[size];

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col justify-center",
          align === "center" ? "items-center text-center" : "items-start text-left",
          sizing.root,
          className,
        )}
        {...props}
      >
        {icon ? (
          <div
            className={cn(
              "flex items-center justify-center rounded-2xl bg-surface-muted text-foreground-subtle",
              sizing.icon,
            )}
          >
            {icon}
          </div>
        ) : null}
        <div className="space-y-xs">
          {eyebrow ? (
            <p className="text-[11px] font-bold tracking-[0.14em] text-foreground-subtle uppercase">{eyebrow}</p>
          ) : null}
          <h3 className={cn("font-semibold text-foreground", sizing.title)}>{title}</h3>
          {description ? <p className={cn("text-foreground-muted", sizing.description)}>{description}</p> : null}
        </div>
        {action ? <div className="mt-xs">{action}</div> : null}
      </div>
    );
  },
);

EmptyState.displayName = "EmptyState";
