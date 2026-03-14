import React from "react";
import { cn } from "../../utils/cn";

// ---------------------------------------------------------------------------
// SectionPanel
// ---------------------------------------------------------------------------

export interface SectionPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Panel header title (rendered in uppercase) */
  title: string;
  /** Optional subtitle or record count */
  subtitle?: string;
  /** Controls rendered in the top-right of the header */
  controls?: React.ReactNode;
  /** Remove default padding from the body */
  noPadding?: boolean;
}

export const SectionPanel = React.forwardRef<HTMLDivElement, SectionPanelProps>(
  ({ title, subtitle, controls, noPadding = false, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col border border-default bg-surface", className)} {...props}>
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-default bg-surface-subtle px-md py-sm">
          <div className="flex items-center gap-md">
            <span className="text-[10px] font-bold tracking-widest text-foreground uppercase">{title}</span>
            {subtitle && <span className="text-[10px] text-foreground-subtle">{subtitle}</span>}
          </div>
          {controls && <div className="flex items-center gap-sm">{controls}</div>}
        </div>

        {/* Body */}
        <div className={cn("flex-1", !noPadding && "p-md")}>{children}</div>
      </div>
    );
  },
);

SectionPanel.displayName = "SectionPanel";
