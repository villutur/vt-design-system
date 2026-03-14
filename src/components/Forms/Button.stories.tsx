import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";
import { IconMail, IconArrowRight } from "@tabler/icons-react";

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Components/Forms/Button",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outline", "ghost", "danger", "icon"],
      description: "The visual style of the button",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "The size of the button",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    isLoading: {
      control: "boolean",
      description: "Whether to show a loading spinner",
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    size: "md",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
};

export const Danger: Story = {
  args: {
    children: "Delete Item",
    variant: "danger",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: "Saving changes",
    isLoading: true,
  },
};

export const WithIcons: Story = {
  args: {
    children: "Send Email",
    leftIcon: <IconMail size={18} />,
    rightIcon: <IconArrowRight size={18} />,
  },
};

export const IconVariant: Story = {
  args: {
    variant: "icon",
    children: <IconMail size={20} />,
    "aria-label": "Send Email",
  },
};
