import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "./Header";
import { IconRocket } from "@tabler/icons-react";

const meta: Meta<typeof Header> = {
  component: Header,
  title: "Components/Layout/Header",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    logo: {
      control: false,
      description: "Custom logo element (ReactNode). Overrides `logoName` and the default icon.",
    },
    logoName: {
      control: "text",
      description: "Text shown next to the default icon logo.",
    },
    userName: { control: "text" },
    userRole: { control: "text" },
    userImageUrl: { control: "text" },
    hasUnreadNotifications: { control: "boolean" },
    showSearch: {
      control: "boolean",
      description: "Show or hide the search input.",
    },
    showNotifications: {
      control: "boolean",
      description: "Show or hide the notifications bell.",
    },
    showHelp: {
      control: "boolean",
      description: "Show or hide the help button.",
    },
    showUser: {
      control: "boolean",
      description: "Show or hide the user section (avatar + name).",
    },
    onSearch: { action: "search" },
    onNotificationsClick: { action: "notifications clicked" },
    onHelpClick: { action: "help clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

const renderFull = (args: React.ComponentProps<typeof Header>) => (
  <div className="w-full">
    <Header {...args} />
  </div>
);

export const Default: Story = {
  args: {
    logoName: "Nexus Enterprise",
    userName: "Alex Rivera",
    userRole: "System Admin",
    hasUnreadNotifications: true,
    showSearch: true,
    showNotifications: true,
    showHelp: true,
    showUser: true,
  },
  render: renderFull,
};

export const WithUserImage: Story = {
  args: {
    ...Default.args,
    userImageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  render: renderFull,
};

export const NoUnreadNotifications: Story = {
  args: {
    ...Default.args,
    hasUnreadNotifications: false,
  },
  render: renderFull,
};

export const CustomLogo: Story = {
  name: "Custom Logo Prop",
  args: {
    ...Default.args,
    logo: (
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-emerald-500 p-1.5 text-white">
          <IconRocket size={20} />
        </div>
        <span className="text-lg font-bold tracking-tight text-emerald-600">My Custom App</span>
      </div>
    ),
  },
  render: renderFull,
};

export const MinimalHeader: Story = {
  name: "Minimal (Logo Only)",
  args: {
    ...Default.args,
    showSearch: false,
    showNotifications: false,
    showHelp: false,
    showUser: false,
  },
  render: renderFull,
};

export const NoSearch: Story = {
  args: {
    ...Default.args,
    showSearch: false,
  },
  render: renderFull,
};

export const NoActionButtons: Story = {
  name: "No Notifications / Help",
  args: {
    ...Default.args,
    showNotifications: false,
    showHelp: false,
  },
  render: renderFull,
};
