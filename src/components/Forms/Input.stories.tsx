import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  component: Input,
  title: "Components/Forms/Input",
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text for the input",
    },
    helperText: {
      control: "text",
      description: "Additional text below the input",
    },
    error: {
      control: "boolean",
      description: "Whether the input is in an error state",
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "tel", "url"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Full Name",
    placeholder: "Jane Doe",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Email Address",
    type: "email",
    placeholder: "user@example.com",
    helperText: "We'll never share your email with anyone else.",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Username",
    defaultValue: "admin",
    error: true,
    helperText: "This username is already taken.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Company (Optional)",
    placeholder: "Acme Corp",
    disabled: true,
  },
};
