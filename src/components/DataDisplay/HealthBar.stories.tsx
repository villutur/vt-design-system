import type { Meta, StoryObj } from "@storybook/react-vite";
import { HealthBar } from "./HealthBar";

const meta: Meta<typeof HealthBar> = {
  component: HealthBar,
  title: "Components/DataDisplay/HealthBar",
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
  },
};

export default meta;
type Story = StoryObj<typeof HealthBar>;

export const High: Story = { args: { value: 92 } };
export const Medium: Story = { args: { value: 55 } };
export const Low: Story = { args: { value: 18 } };

export const AllLevels: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <div className="flex items-center gap-md">
        <HealthBar value={95} widthClass="w-24" />
        <span className="text-xs text-slate-500">High (95%)</span>
      </div>
      <div className="flex items-center gap-md">
        <HealthBar value={55} widthClass="w-24" />
        <span className="text-xs text-slate-500">Medium (55%)</span>
      </div>
      <div className="flex items-center gap-md">
        <HealthBar value={12} widthClass="w-24" />
        <span className="text-xs text-slate-500">Low (12%)</span>
      </div>
    </div>
  ),
};
