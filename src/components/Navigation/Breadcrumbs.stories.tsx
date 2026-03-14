import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconHome, IconLayoutCards, IconSettings } from "@tabler/icons-react";
import { Breadcrumbs } from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  component: Breadcrumbs,
  title: "Components/Navigation/Breadcrumbs",
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: false,
      description: "Ordered breadcrumb items from root to current page.",
    },
    separator: {
      control: false,
    },
    maxItems: {
      control: { type: "number", min: 3, step: 1 },
      description:
        "Collapses long paths by keeping the first item and the tail.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

const defaultItems = [
  { label: "Workspace", href: "#" },
  { label: "Projects", href: "#" },
  { label: "Design System", href: "#" },
  { label: "Breadcrumbs" },
];

const iconItems = [
  { label: "Home", href: "#", icon: <IconHome size={14} /> },
  { label: "Components", href: "#", icon: <IconLayoutCards size={14} /> },
  { label: "Settings", icon: <IconSettings size={14} /> },
];

const deepItems = [
  { label: "Workspace", href: "#" },
  { label: "Admin", href: "#" },
  { label: "Operations", href: "#" },
  { label: "Users", href: "#" },
  { label: "Permissions", href: "#" },
  { label: "Audit Log" },
];

export const Default: Story = {
  args: {
    items: defaultItems,
  },
  render: (args) => (
    <div className="max-w-2xl">
      <Breadcrumbs {...args} />
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    items: iconItems,
  },
  render: (args) => (
    <div className="max-w-2xl">
      <Breadcrumbs {...args} />
    </div>
  ),
};

export const Collapsed: Story = {
  args: {
    items: deepItems,
    maxItems: 4,
  },
  render: (args) => (
    <div className="max-w-2xl">
      <Breadcrumbs {...args} />
    </div>
  ),
};
