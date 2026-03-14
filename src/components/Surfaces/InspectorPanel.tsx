import React from "react";
import { cn } from "../../utils/cn";
import { Card } from "./Card";

export interface InspectorPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
}

export const InspectorPanel = React.forwardRef<HTMLDivElement, InspectorPanelProps>(
  ({ eyebrow, title, description, actions, footer, className, children, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn("overflow-hidden", className)} {...props}>
        {(eyebrow || title || description || actions) ? (
          <div className="border-b border-default bg-surface-subtle/70 px-lg py-lg">
            <div className="flex flex-wrap items-start justify-between gap-md">
              <div className="min-w-0 space-y-xs">
                {eyebrow ? (
                  <p className="text-[11px] font-bold tracking-[0.14em] text-foreground-subtle uppercase">{eyebrow}</p>
                ) : null}
                {title ? <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3> : null}
                {description ? <p className="text-sm leading-6 text-foreground-muted">{description}</p> : null}
              </div>

              {actions ? <div className="flex shrink-0 flex-wrap gap-sm">{actions}</div> : null}
            </div>
          </div>
        ) : null}

        <div className="space-y-lg px-lg py-lg">{children}</div>

        {footer ? <div className="border-t border-default bg-surface-subtle/50 px-lg py-md">{footer}</div> : null}
      </Card>
    );
  },
);

InspectorPanel.displayName = "InspectorPanel";
