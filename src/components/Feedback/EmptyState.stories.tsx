import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconInbox, IconSearch } from "@tabler/icons-react";
import { Button } from "../Forms/Button";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  component: EmptyState,
  title: "Components/Feedback/EmptyState",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "EmptyState is the dedicated no-data and first-run surface. Use it when the main content area has nothing meaningful to render yet, not for transient loading or background confirmations.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: <IconInbox size={24} />,
    eyebrow: "No content",
    title: "Nothing has been uploaded yet",
    description:
      "When files, notes, or release assets are added, they will appear here.",
    action: <Button size="sm">Upload first file</Button>,
  },
};

export const LeftAligned: Story = {
  args: {
    icon: <IconSearch size={22} />,
    title: "No matching results",
    description:
      "Try widening the filters or searching for a different keyword.",
    align: "left",
    size: "sm",
    action: (
      <Button size="xs" variant="secondary">
        Clear filters
      </Button>
    ),
  },
};

export const FirstRunSetup: Story = {
  args: {
    icon: <IconInbox size={22} />,
    eyebrow: "First run",
    title: "No environments are connected yet",
    description:
      "Connect a workspace or import an existing configuration before monitoring can begin.",
    action: <Button size="sm">Connect environment</Button>,
    size: "md",
  },
};
