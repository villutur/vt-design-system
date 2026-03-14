import React from "react";
import { cn } from "../../utils/cn";

export interface HealthBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value 0–100 */
  value: number;
  /** Width class override, defaults to w-16 */
  widthClass?: string;
}

function colorForValue(v: number): string {
  if (v >= 75) return "bg-success";
  if (v >= 40) return "bg-warning";
  return "bg-error";
}

export const HealthBar: React.FC<HealthBarProps> = ({
  value,
  widthClass = "w-16",
  className,
  ...props
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-1.5 overflow-hidden rounded-full bg-surface-muted", widthClass, className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <div
        className={cn("h-full rounded-full", colorForValue(clamped))}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

HealthBar.displayName = "HealthBar";
