import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  component: Spinner,
  title: "Components/Feedback/Spinner",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "primary", "white", "success", "warning", "error"],
      description: "Color variant of the spinner",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg", "xl"],
      description: "Size of the spinner",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: "default",
    variant: "default",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-lg items-center p-md bg-slate-50 dark:bg-slate-900 rounded-lg">
      <Spinner variant="default" />
      <Spinner variant="primary" />
      <Spinner variant="success" />
      <Spinner variant="warning" />
      <Spinner variant="error" />
      <div className="p-sm bg-slate-800 rounded">
        <Spinner variant="white" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-lg">
      <Spinner size="sm" />
      <Spinner size="default" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};
