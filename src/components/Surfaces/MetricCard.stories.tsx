import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconActivity,
  IconDatabase,
  IconTrendingDown,
} from "@tabler/icons-react";
import { MetricCard } from "./MetricCard";

const meta: Meta<typeof MetricCard> = {
  component: MetricCard,
  title: "Components/Surfaces/MetricCard",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "MetricCard is a summary-and-signal surface for dashboards, overviews, and route-level status lanes. It works for KPIs, but it also fits the broader summary cards used in `vt-playground` where the headline is often a short state label rather than a pure number.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Default: Story = {
  args: {
    eyebrow: "Deployment success rate",
    headline: "98.4%",
    summary: "Compared to the previous 30-day window.",
    statusLabel: "+2.1%",
    statusTone: "success",
    statusDirection: "up",
    icon: <IconActivity size={20} />,
  },
};

export const NeutralTrend: Story = {
  args: {
    eyebrow: "Storage usage",
    headline: "420 GB",
    summary: "Stable over the last 7 days.",
    statusLabel: "No major change",
    statusDirection: "neutral",
    statusTone: "primary",
    icon: <IconDatabase size={20} />,
    footer: "Capacity planning review scheduled for next sprint.",
  },
};

export const CustomChart: Story = {
  args: {
    eyebrow: "Incident volume",
    headline: "12",
    summary: "Critical issues opened this month.",
    statusLabel: "-18%",
    statusDirection: "down",
    statusTone: "error",
    icon: <IconTrendingDown size={20} />,
    chart: (
      <div className="mt-md flex h-16 items-end gap-xs">
        {[28, 40, 24, 18, 22, 12, 16].map((value, index) => (
          <div
            key={index}
            className="flex-1 rounded-t bg-error/30"
            style={{ height: `${value}px` }}
          />
        ))}
      </div>
    ),
  },
};

export const CapacityReview: Story = {
  args: {
    eyebrow: "Storage capacity",
    headline: "86%",
    summary: "Used across active workspaces this billing cycle.",
    statusLabel: "+6%",
    statusDirection: "up",
    statusTone: "warning",
    icon: <IconDatabase size={20} />,
    footer: "Pair this surface with Banner or Alert when action is required.",
  },
};

export const RouteSummary: Story = {
  args: {
    eyebrow: "Studio route",
    headline: "memory on",
    summary:
      "One-shot prompting and persistent text chat now share saved local presets, clearer response framing, and a SQLite-backed saved-run shelf.",
    statusLabel: "active",
    statusDirection: "up",
    statusTone: "primary",
    icon: <IconActivity size={20} />,
    footer:
      "The studio lane now proves server-side Gemini access across both one-shot and multi-turn text flows.",
  },
};
