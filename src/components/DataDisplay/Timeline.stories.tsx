import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconCheck,
  IconClockHour4,
  IconFileAnalytics,
  IconServerBolt,
} from "@tabler/icons-react";
import { Timeline } from "./Timeline";

const meta: Meta<typeof Timeline> = {
  component: Timeline,
  title: "Components/DataDisplay/Timeline",
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: { type: "radio" },
      options: ["default", "compact"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

const items = [
  {
    title: "Deployment queued",
    description: "Release 2026.03.11 entered the deployment pipeline.",
    timestamp: "09:12",
    status: "info" as const,
    icon: <IconClockHour4 size={16} />,
  },
  {
    title: "Schema migration complete",
    description: "All regions applied the latest migration successfully.",
    timestamp: "09:18",
    status: "success" as const,
    icon: <IconCheck size={16} />,
    content: "Processed 4 clusters with zero rollback events.",
  },
  {
    title: "Traffic shifted",
    description: "Production traffic is now served by the new build.",
    timestamp: "09:24",
    status: "default" as const,
    icon: <IconServerBolt size={16} />,
  },
  {
    title: "Audit report published",
    description: "Monitoring snapshot and release metrics are available.",
    timestamp: "09:30",
    status: "warning" as const,
    icon: <IconFileAnalytics size={16} />,
  },
];

export const Default: Story = {
  args: {
    items,
  },
};

export const Compact: Story = {
  args: {
    items,
    density: "compact",
  },
};
