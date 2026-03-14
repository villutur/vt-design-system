import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: "Components/DataDisplay/Avatar",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "default", "lg", "xl"],
      description: "Size of the avatar",
    },
    src: {
      control: "text",
      description: "Image URL",
    },
    alt: {
      control: "text",
    },
    fallbackText: {
      control: "text",
      description: "Text to extract initials from if image fails",
    },
    initials: {
      control: "text",
      description: "Explicit initials to display",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    fallbackText: "John Doe",
  },
};

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    alt: "User profile picture",
  },
};

export const Initials: Story = {
  args: {
    initials: "VT",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-md">
      <Avatar size="xs" fallbackText="Extra Small" />
      <Avatar size="sm" fallbackText="Small User" />
      <Avatar size="default" fallbackText="Default Size" />
      <Avatar size="lg" fallbackText="Large Avatar" />
      <Avatar size="xl" fallbackText="Extra Large" />
    </div>
  ),
};

export const FallbackIcon: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "When no src, fallbackText, or initials are provided, an icon is shown.",
      },
    },
  },
};
