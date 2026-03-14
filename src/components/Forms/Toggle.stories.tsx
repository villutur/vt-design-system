import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "./Toggle";

const meta: Meta<typeof Toggle> = {
  component: Toggle,
  title: "Components/Forms/Toggle",
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
    defaultChecked: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    label: "Enable notifications",
  },
};

export const WithDescription: Story = {
  args: {
    label: "Airplane Mode",
    description: "Disable all wireless connections.",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Developer Mode",
    description: "Requires administrator privileges.",
    disabled: true,
  },
};
