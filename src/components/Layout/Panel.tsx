import React from "react";
import {
  Group as LibResizablePanelGroup,
  Panel as LibResizablePanel,
  Separator as ResizablePanelResizeHandle,
  GroupProps,
  SeparatorProps,
} from "react-resizable-panels";
import { IconGridDots } from "@tabler/icons-react";
import { cn } from "../../utils/cn";

// ─── Fixed Panel ─────────────────────────────────────────────────────────────
// A simple, non-resizable panel. Can be laid out horizontally or vertically
// by controlling the parent flex direction.

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stack children horizontally (row) or vertically (column, default). */
  orientation?: "horizontal" | "vertical";
  /** Flex grow factor (like CSS flex-grow). Defaults to 1. */
  grow?: number;
  /** Fixed width (horizontal) or height (vertical). Overrides grow. */
  size?: string | number;
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ orientation = "vertical", grow = 1, size, className, style, ...props }, ref) => {
    const flexStyles: React.CSSProperties =
      size != null
        ? orientation === "horizontal"
          ? { flexShrink: 0, width: size }
          : { flexShrink: 0, height: size }
        : { flex: grow };

    return (
      <div
        ref={ref}
        className={cn(
          "flex overflow-hidden",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          className,
        )}
        style={{ ...flexStyles, ...style }}
        {...props}
      />
    );
  },
);
Panel.displayName = "Panel";

// ─── Panel Group ─────────────────────────────────────────────────────────────
// Wraps fixed panels in a flex container.

export interface PanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout direction of child panels. Defaults to "horizontal". */
  orientation?: "horizontal" | "vertical";
}

export const PanelGroup = React.forwardRef<HTMLDivElement, PanelGroupProps>(
  ({ orientation = "horizontal", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className,
      )}
      {...props}
    />
  ),
);
PanelGroup.displayName = "PanelGroup";

// ─── Resizable Panel ─────────────────────────────────────────────────────────
// Thin wrapper over react-resizable-panels' Panel for named export consistency.

export const ResizablePanel = LibResizablePanel;

// ─── Resizable Panel Group ────────────────────────────────────────────────────
// Wraps react-resizable-panels Group and normalises the direction prop name.

export interface ResizablePanelGroupProps extends GroupProps {
  /** Layout direction. Defaults to "horizontal". */
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function ResizablePanelGroup({
  orientation = "horizontal",
  className,
  ...props
}: ResizablePanelGroupProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Group = LibResizablePanelGroup as any;
  return (
    <Group
      orientation={orientation}
      className={cn("flex h-full w-full", className)}
      {...props}
    />
  );
}

// ─── Resize Handle ────────────────────────────────────────────────────────────

interface PanelResizeHandleProps extends SeparatorProps {
  withHandle?: boolean;
}

export const PanelResizeHandle = ({
  withHandle = true,
  className,
  ...props
}: PanelResizeHandleProps) => {
  return (
    <ResizablePanelResizeHandle
      className={cn(
        // Base styles
        "relative flex items-center justify-center bg-surface-muted transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
        // Vertical handle (separator is vertical between horizontal panels)
        "aria-[orientation=vertical]:w-1.5 aria-[orientation=vertical]:h-full",
        // Horizontal handle (separator is horizontal between vertical panels)
        "aria-[orientation=horizontal]:h-1.5 aria-[orientation=horizontal]:w-full",
        "border-default",
        "[&[aria-orientation=horizontal]>div]:rotate-90",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-6 w-3 items-center justify-center rounded-sm border border-strong bg-surface shadow-sm">
          <IconGridDots className="h-2.5 w-2.5 text-foreground-muted" />
        </div>
      )}
    </ResizablePanelResizeHandle>
  );
};
