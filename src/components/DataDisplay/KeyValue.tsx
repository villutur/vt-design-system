import React from "react";
import { cn } from "../../utils/cn";

export interface KeyValueItem {
  label: string;
  value: React.ReactNode;
}

export interface KeyValueProps extends React.HTMLAttributes<HTMLDListElement> {
  items: KeyValueItem[];
  /** How columns are arranged */
  layout?: "stacked" | "inline";
}

export const KeyValue: React.FC<KeyValueProps> = ({ items, layout = "inline", className, ...props }) => {
  return (
    <dl className={cn("space-y-xs", className)} {...props}>
      {items.map(({ label, value }) => (
        <div
          key={label}
          className={cn(layout === "inline" ? "flex items-baseline justify-between gap-md" : "flex flex-col gap-xs")}
        >
          <dt className="shrink-0 text-xs font-bold tracking-wide text-foreground-subtle uppercase">{label}</dt>
          <dd className="truncate text-right text-xs text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
};

KeyValue.displayName = "KeyValue";
