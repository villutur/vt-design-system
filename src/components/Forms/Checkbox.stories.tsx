import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: "Components/Forms/Checkbox",
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Primary label text",
    },
    description: {
      control: "text",
      description: "Secondary helper text below the label",
    },
    disabled: {
      control: "boolean",
    },
    checked: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
  },
};

export const WithDescription: Story = {
  args: {
    label: "Subscribe to newsletter",
    description: "Get updates on new products and features.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Remember me",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Required field",
    disabled: true,
    checked: true,
  },
};
