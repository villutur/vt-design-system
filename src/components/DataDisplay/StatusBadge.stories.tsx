import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBadge } from "./StatusBadge";

const meta: Meta<typeof StatusBadge> = {
  component: StatusBadge,
  title: "Components/DataDisplay/StatusBadge",
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["active", "pending", "error", "warning", "archived", "inactive"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-sm">
      <StatusBadge status="active" />
      <StatusBadge status="pending" />
      <StatusBadge status="error" />
      <StatusBadge status="warning" />
      <StatusBadge status="archived" />
      <StatusBadge status="inactive" />
    </div>
  ),
};

export const CustomLabel: Story = {
  args: { status: "active", label: "Online" },
};

export const Playground: Story = {
  args: { status: "pending" },
};
