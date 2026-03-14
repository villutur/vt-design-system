import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
  title: "Components/Feedback/ProgressBar",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Current value of the progress bar",
    },
    max: {
      control: "number",
      description: "Maximum value",
    },
    variant: {
      control: { type: "select" },
      options: ["default", "success", "warning", "error"],
      description: "Color variant of the progress bar",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg"],
      description: "Height of the progress bar",
    },
    indeterminate: {
      control: "boolean",
      description: "Whether to show a continuous loading animation",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    value: 60,
    max: 100,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-lg self-stretch">
      <div className="flex items-center gap-md">
        <span className="w-20 shrink-0 text-xs text-slate-500">Default</span>
        <ProgressBar value={40} variant="default" className="flex-1" />
      </div>
      <div className="flex items-center gap-md">
        <span className="w-20 shrink-0 text-xs text-slate-500">Success</span>
        <ProgressBar value={60} variant="success" className="flex-1" />
      </div>
      <div className="flex items-center gap-md">
        <span className="w-20 shrink-0 text-xs text-slate-500">Warning</span>
        <ProgressBar value={80} variant="warning" className="flex-1" />
      </div>
      <div className="flex items-center gap-md">
        <span className="w-20 shrink-0 text-xs text-slate-500">Error</span>
        <ProgressBar value={90} variant="error" className="flex-1" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-lg self-stretch">
      <div className="flex items-center gap-md">
        <span className="w-20 shrink-0 text-xs text-slate-500">sm</span>
        <ProgressBar value={50} size="sm" className="flex-1" />
      </div>
      <div className="flex items-center gap-md">
        <span className="w-20 shrink-0 text-xs text-slate-500">default</span>
        <ProgressBar value={50} size="default" className="flex-1" />
      </div>
      <div className="flex items-center gap-md">
        <span className="w-20 shrink-0 text-xs text-slate-500">lg</span>
        <ProgressBar value={50} size="lg" className="flex-1" />
      </div>
    </div>
  ),
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};
