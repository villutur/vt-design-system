import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Sidebar,
  SidebarItem,
  SidebarSectionBase,
  SidebarSystemHealth,
} from "./Sidebar";
import {
  IconHome,
  IconUsers,
  IconSettings,
  IconChartBar,
  IconShield,
  IconAlertCircle,
} from "@tabler/icons-react";

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
  title: "Components/Layout/Sidebar",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    footer: {
      control: false,
      description:
        "Content rendered in the bottom footer area. Pass `null` to hide entirely. Use `<SidebarSystemHealth />` for the built-in widget.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const navItems = (
  <>
    <SidebarItem icon={<IconHome size={20} />} label="Dashboard" isActive />
    <SidebarItem icon={<IconChartBar size={20} />} label="Analytics" />
    <SidebarItem icon={<IconUsers size={20} />} label="Team Members" />
    <SidebarSectionBase title="Configuration" />
    <SidebarItem icon={<IconSettings size={20} />} label="Settings" />
    <SidebarItem icon={<IconShield size={20} />} label="Security" />
  </>
);

const withLayout = (sidebar: React.ReactNode) => (
  <div className="flex h-[600px]">
    {sidebar}
    <main className="flex-1 bg-slate-50 p-8 dark:bg-background-main">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </main>
  </div>
);

export const Default: Story = {
  name: "Default (with SidebarSystemHealth)",
  render: (args) =>
    withLayout(
      <Sidebar {...args} footer={<SidebarSystemHealth />}>
        {navItems}
      </Sidebar>
    ),
};

export const LowHealth: Story = {
  name: "Low System Health",
  render: (args) =>
    withLayout(
      <Sidebar
        {...args}
        footer={
          <SidebarSystemHealth
            percentage={45}
            label="System Health"
            status="Service degraded (1 incident)"
          />
        }
      >
        {navItems}
      </Sidebar>
    ),
};

export const CustomFooter: Story = {
  name: "Custom Footer Content",
  render: (args) =>
    withLayout(
      <Sidebar
        {...args}
        footer={
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <IconAlertCircle size={16} className="shrink-0 text-amber-500" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Maintenance window tonight at 22:00
            </p>
          </div>
        }
      >
        {navItems}
      </Sidebar>
    ),
};

export const NoFooter: Story = {
  name: "No Footer",
  render: (args) =>
    withLayout(
      <Sidebar {...args} footer={null}>
        {navItems}
      </Sidebar>
    ),
};
