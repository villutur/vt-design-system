import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeyValue } from "./KeyValue";

const meta: Meta<typeof KeyValue> = {
  component: KeyValue,
  title: "Components/DataDisplay/KeyValue",
  tags: ["autodocs"],
  argTypes: {
    layout: { control: "select", options: ["inline", "stacked"] },
  },
};

export default meta;
type Story = StoryObj<typeof KeyValue>;

const items = [
  { label: "Node_ID", value: "NODE_ALPHA_001" },
  { label: "Cluster", value: "EU_West_01" },
  { label: "Status", value: "Active" },
  { label: "Created", value: "2023-10-24 14:22" },
];

export const Inline: Story = {
  args: { items, layout: "inline" },
  render: (args) => (
    <div className="w-64">
      <KeyValue {...args} />
    </div>
  ),
};

export const Stacked: Story = {
  args: { items, layout: "stacked" },
  render: (args) => (
    <div className="w-48">
      <KeyValue {...args} />
    </div>
  ),
};
