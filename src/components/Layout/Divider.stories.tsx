import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
  component: Divider,
  title: "Components/Layout/Divider",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {};

export const WithLabel: Story = {
  args: { label: "or continue with" },
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-md">
      <span className="text-sm">Left</span>
      <Divider orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  ),
};
