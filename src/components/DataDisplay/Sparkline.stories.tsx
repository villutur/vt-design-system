import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkline } from "./Sparkline";

const meta: Meta<typeof Sparkline> = {
  component: Sparkline,
  title: "Components/DataDisplay/Sparkline",
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color" },
    strokeWidth: { control: { type: "range", min: 0.5, max: 4, step: 0.5 } },
    height: { control: { type: "range", min: 12, max: 64, step: 4 } },
  },
};

export default meta;
type Story = StoryObj<typeof Sparkline>;

const revenue = [12, 18, 14, 22, 20, 30, 26, 38, 34, 44, 40, 50];
const latency = [8, 10, 7, 11, 8, 13, 9, 9, 12, 10, 14, 11];

export const Default: Story = {
  args: { data: revenue, color: "#137fec", height: 24 },
};

export const Success: Story = {
  args: { data: revenue, color: "#4ade80", height: 24, strokeWidth: 1.5 },
};

export const Warning: Story = {
  args: { data: latency, color: "#fbbf24", height: 24 },
};

export const TallChart: Story = {
  args: { data: revenue, color: "#137fec", height: 48, strokeWidth: 2 },
};
