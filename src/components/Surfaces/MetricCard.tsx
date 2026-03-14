import React from "react";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { Card } from "./Card";
import { Sparkline } from "../DataDisplay/Sparkline";
import { cn } from "../../utils/cn";

type TrendDirection = "up" | "down" | "neutral";
type TrendType = "success" | "warning" | "error" | "primary";

const trendClassMap: Record<
  TrendType | "neutral",
  {
    badge: string;
    chartShell: string;
    chartColor: string;
  }
> = {
  success: {
    badge: "bg-success/10 text-success",
    chartShell: "from-success/6 via-success/14 to-success/6",
    chartColor: "text-success/75",
  },
  warning: {
    badge: "bg-warning/10 text-warning",
    chartShell: "from-warning/6 via-warning/14 to-warning/6",
    chartColor: "text-warning/75",
  },
  error: {
    badge: "bg-error/10 text-error",
    chartShell: "from-error/6 via-error/14 to-error/6",
    chartColor: "text-error/75",
  },
  primary: {
    badge: "bg-primary/10 text-primary",
    chartShell: "from-primary/6 via-primary/14 to-primary/6",
    chartColor: "text-primary/75",
  },
  neutral: {
    badge: "bg-surface-muted text-foreground-muted",
    chartShell: "from-surface-subtle via-surface-muted to-surface-subtle",
    chartColor: "text-foreground-subtle/65",
  },
};

const sparklineDataMap: Record<TrendDirection, number[]> = {
  up: [8, 9, 8.5, 11, 10, 13, 12, 14, 13, 16, 14],
  down: [16, 15.5, 16, 14, 13.5, 12, 11.5, 10, 9.5, 8.5, 8],
  neutral: [10, 10.2, 10.1, 10.8, 10.5, 11.1, 10.9, 11.3, 11.1, 11.5, 11.2],
};

export interface MetricCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title?: React.ReactNode;
  value?: React.ReactNode;
  description?: React.ReactNode;
  trendValue?: React.ReactNode;
  trendDirection?: TrendDirection;
  trendType?: TrendType;
  eyebrow?: React.ReactNode;
  headline?: React.ReactNode;
  summary?: React.ReactNode;
  statusLabel?: React.ReactNode;
  statusDirection?: TrendDirection;
  statusTone?: TrendType;
  icon: React.ReactNode;
  iconColorClass?: string;
  chart?: React.ReactNode;
  sparklineData?: number[];
  footer?: React.ReactNode;
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      title,
      value,
      description,
      trendValue,
      trendDirection,
      trendType,
      eyebrow,
      headline,
      summary,
      statusLabel,
      statusDirection,
      statusTone,
      icon,
      iconColorClass = "text-primary bg-primary/10",
      chart,
      sparklineData,
      footer,
      className,
      ...props
    },
    ref,
  ) => {
    const resolvedEyebrow = eyebrow ?? title;
    const resolvedHeadline = headline ?? value;
    const resolvedSummary = summary ?? description;
    const resolvedStatusLabel = statusLabel ?? trendValue;
    const resolvedStatusDirection = statusDirection ?? trendDirection ?? "up";
    const resolvedStatusTone = statusTone ?? trendType ?? "success";
    const visualTone =
      resolvedStatusDirection === "neutral"
        ? trendClassMap.neutral
        : trendClassMap[resolvedStatusTone];
    const resolvedSparkline = chart ?? (
      <div
        className={cn(
          "relative mt-lg overflow-hidden rounded-xl border border-default/80 bg-linear-to-r px-sm py-sm",
          visualTone.chartShell,
        )}
      >
        <Sparkline
          data={sparklineData ?? sparklineDataMap[resolvedStatusDirection]}
          className={cn("h-8", visualTone.chartColor)}
          strokeWidth={1.9}
          height={32}
        />
      </div>
    );

    return (
      <Card ref={ref} className={cn("p-lg", className)} {...props}>
        <div className="flex items-start justify-between gap-md">
          <div className={cn("rounded-2xl p-sm", iconColorClass)}>
            <div className="flex items-center justify-center">{icon}</div>
          </div>

          {resolvedStatusLabel ? (
            <span
              className={cn(
                "inline-flex items-center gap-xs rounded-full px-sm py-xs text-xs font-bold",
                visualTone.badge,
              )}
            >
              {resolvedStatusDirection === "up" ? <IconArrowUp size={14} /> : null}
              {resolvedStatusDirection === "down" ? <IconArrowDown size={14} /> : null}
              {resolvedStatusLabel}
            </span>
          ) : null}
        </div>

        <div className="mt-md min-w-0 space-y-sm">
          {resolvedEyebrow ? (
            <p className="text-sm font-medium text-foreground-muted">
              {resolvedEyebrow}
            </p>
          ) : null}
          {resolvedHeadline ? (
            <h3 className="text-[clamp(1.85rem,2.35vw,2.45rem)] leading-[0.98] font-bold tracking-tight text-foreground">
              {resolvedHeadline}
            </h3>
          ) : null}
          {resolvedSummary ? (
            <p className="text-sm leading-6 text-foreground-muted">
              {resolvedSummary}
            </p>
          ) : null}
        </div>

        {resolvedSparkline}

        {footer ? (
          <div className="mt-md border-t border-default pt-md text-sm leading-6 text-foreground-muted">
            {footer}
          </div>
        ) : null}
      </Card>
    );
  },
);

MetricCard.displayName = "MetricCard";
