import React from "react";
import { cn } from "../../utils/cn";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction of the divider */
  orientation?: "horizontal" | "vertical";
  /** Optional centered label */
  label?: string;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = "horizontal", label, className, ...props }, ref) => {
    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn("mx-sm inline-block h-full w-px self-stretch bg-border-default", className)}
          {...props}
        />
      );
    }

    if (label) {
      return (
        <div
          ref={ref}
          role="separator"
          className={cn("flex items-center gap-md", className)}
          {...props}
        >
          <div className="h-px flex-1 bg-border-default" />
          <span className="text-xs font-medium whitespace-nowrap text-foreground-subtle">{label}</span>
          <div className="h-px flex-1 bg-border-default" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        className={cn("h-px w-full bg-border-default", className)}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";
