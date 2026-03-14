import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "./Chip";
import { IconCircleCheck, IconInfoCircle } from "@tabler/icons-react";

const meta: Meta<typeof Chip> = {
  component: Chip,
  title: "Components/DataDisplay/Chip",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "outline"],
      description: "Visual style of the chip",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg"],
      description: "Size of the chip",
    },
    interactive: {
      control: "boolean",
      description: "Whether the chip has hover/active states",
    },
    onRemove: { action: "removed" },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    children: "React",
    variant: "default",
  },
};

export const Outline: Story = {
  args: {
    children: "TypeScript",
    variant: "outline",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Chip size="sm">Small Chip</Chip>
      <Chip size="default">Default Chip</Chip>
      <Chip size="lg">Large Chip</Chip>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Chip startIcon={<IconCircleCheck size={16} />}>Completed</Chip>
      <Chip variant="outline" endIcon={<IconInfoCircle size={16} />}>
        Information
      </Chip>
    </div>
  ),
};

export const Removable: Story = {
  args: {
    children: "Frontend",
    onRemove: () => alert("Removed!"),
  },
};

export const Interactive: Story = {
  args: {
    children: "Click Me",
    interactive: true,
  },
};
