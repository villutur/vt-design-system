import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionPanel } from "./SectionPanel";
import { Button } from "../Forms/Button";
import { IconRefresh } from "@tabler/icons-react";

const meta: Meta<typeof SectionPanel> = {
  component: SectionPanel,
  title: "Components/Surfaces/SectionPanel",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SectionPanel>;

export const Default: Story = {
  args: {
    title: "Input Parameters",
    subtitle: "",
    children: <p className="text-sm text-slate-600 dark:text-gray-400">Panel content goes here.</p>,
  },
};

export const WithSubtitle: Story = {
  args: {
    title: "Data Explorer",
    subtitle: "Showing 1–12 of 842 records",
    children: <p className="text-sm text-slate-600 dark:text-gray-400">Table or content here.</p>,
  },
};

export const WithControls: Story = {
  args: {
    title: "System Metrics",
    controls: (
      <Button size="xs" variant="ghost">
        <IconRefresh size={12} />
        Refresh
      </Button>
    ),
    children: <p className="text-sm text-slate-600 dark:text-gray-400">Metric content here.</p>,
  },
};

export const NoPadding: Story = {
  args: {
    title: "Table Panel",
    noPadding: true,
    children: (
      <div className="divide-y divide-border-muted">
        {["Row A", "Row B", "Row C"].map((r) => (
          <div key={r} className="px-md py-sm text-sm text-slate-700 dark:text-gray-300">
            {r}
          </div>
        ))}
      </div>
    ),
  },
};
