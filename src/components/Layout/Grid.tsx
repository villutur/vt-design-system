import React from "react";
import { cn } from "../../utils/cn";

type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type GridGap = "none" | "sm" | "md" | "lg" | "xl";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns. Maps to Tailwind `grid-cols-{n}` classes.
   * @default 1
   */
  cols?: GridCols;
  /**
   * Gap between grid items. Maps to predefined Tailwind `gap-{n}` strings.
   * @default "md"
   */
  gap?: GridGap;
}

const colStyles: Record<GridCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};

const gapStyles: Record<GridGap, string> = {
  none: "gap-0",
  sm: "gap-sm",
  md: "gap-md",
  lg: "gap-lg",
  xl: "gap-xl",
};

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = "md", children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("grid", colStyles[cols], gapStyles[gap], className)} {...props}>
        {children}
      </div>
    );
  },
);
Grid.displayName = "Grid";

type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full";

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns this item should span across.
   * Maps to Tailwind `col-span-{n}` classes.
   */
  colSpan?: ColSpan;
}

const colSpanStyles: Record<ColSpan, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
  full: "col-span-full",
};

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, colSpan, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(colSpan ? colSpanStyles[colSpan] : "", className)} {...props}>
        {children}
      </div>
    );
  },
);
GridItem.displayName = "GridItem";
