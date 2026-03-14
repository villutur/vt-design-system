import type { Meta, StoryObj } from "@storybook/react-vite";
import { CommandBar } from "./CommandBar";
import { Button } from "../Forms/Button";

const meta: Meta<typeof CommandBar> = {
  component: CommandBar,
  title: "Components/Layout/CommandBar",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CommandBar>;

export const Default: Story = {
  args: {
    title: "Analytics Overview",
    subtitle: "Live environment: Production-Cluster-04 // Refresh: 15s",
    actions: (
      <>
        <Button size="xs" variant="secondary">
          Export CSV
        </Button>
        <Button size="xs">Re-Sync Nodes</Button>
      </>
    ),
  },
};

export const TitleOnly: Story = {
  args: { title: "System Configuration" },
};
