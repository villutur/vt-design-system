import React from "react";
import { cn } from "../../utils/cn";

export type TimelineItemStatus =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface TimelineItem {
  id?: React.Key;
  title: React.ReactNode;
  timestamp?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  status?: TimelineItemStatus;
  content?: React.ReactNode;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
  density?: "default" | "compact";
}

const statusClasses: Record<TimelineItemStatus, string> = {
  default: "border-strong bg-surface text-foreground-muted",
  info: "border-primary/30 bg-primary/10 text-primary",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  error: "border-error/30 bg-error/10 text-error",
};

export const Timeline: React.FC<TimelineProps> = ({
  items,
  density = "default",
  className,
  ...props
}) => {
  return (
    <div className={cn("space-y-md", className)} {...props}>
      {items.map((item, index) => {
        const status = item.status ?? "default";

        return (
          <div
            key={item.id ?? `timeline-item-${index}`}
            className="grid grid-cols-[auto_1fr] gap-md"
          >
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-sm shadow-sm",
                  statusClasses[status],
                )}
              >
                {item.icon ?? <span className="h-2 w-2 rounded-full bg-current" />}
              </div>
              {index < items.length - 1 ? (
                <div className="mt-sm h-full min-h-8 w-px bg-border-default" />
              ) : null}
            </div>

            <div
              className={cn(
                "rounded-xl border border-default bg-surface px-md py-md shadow-soft dark:shadow-soft-dark",
                density === "compact" && "px-md py-sm",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-sm">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="mt-xs text-sm text-foreground-muted">
                      {item.description}
                    </p>
                  ) : null}
                </div>
                {item.timestamp ? (
                  <span className="text-xs font-medium tracking-wide text-foreground-subtle uppercase">
                    {item.timestamp}
                  </span>
                ) : null}
              </div>

              {item.content ? (
                <div className="mt-md border-t border-default pt-md text-sm text-foreground-muted">
                  {item.content}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

Timeline.displayName = "Timeline";
