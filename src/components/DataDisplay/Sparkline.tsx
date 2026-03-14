import React from "react";
import { cn } from "../../utils/cn";

export interface SparklineProps extends React.SVGProps<SVGSVGElement> {
  /** Array of numeric data points */
  data: number[];
  /** Color of the sparkline stroke */
  color?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Height of the SVG in pixels */
  height?: number;
}

function normalize(data: number[]): number[] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return data.map((v) => (v - min) / range);
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = "currentColor",
  strokeWidth = 1.5,
  height = 24,
  className,
  ...props
}) => {
  if (!data || data.length < 2) return null;

  const normalized = normalize(data);
  const w = 100;
  const h = 20;
  const step = w / (normalized.length - 1);

  const points = normalized
    .map((v, i) => `${i * step},${h - v * h}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={cn("w-full", className)}
      style={{ height }}
      aria-hidden="true"
      {...props}
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

Sparkline.displayName = "Sparkline";
