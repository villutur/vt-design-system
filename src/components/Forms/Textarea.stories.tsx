import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  title: "Components/Forms/Textarea",
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text for the textarea",
    },
    description: {
      control: "text",
    },
    helperText: {
      control: "text",
    },
    error: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
    resize: {
      control: { type: "select" },
      options: ["none", "vertical", "both"],
    },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: "Prompt",
    placeholder: "Describe what should happen next...",
    helperText: "Use this for longer freeform input.",
  },
};

export const WithDescription: Story = {
  args: {
    label: "System instruction",
    description: "Optional guidance that shapes the model's tone and priorities.",
    defaultValue:
      "Answer like a pragmatic product engineer. Prefer concise recommendations with tradeoffs.",
    resize: "none",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Notes",
    error: true,
    helperText: "Add more detail before continuing.",
    defaultValue: "Too short",
  },
};

export const Compact: Story = {
  args: {
    label: "Compact textarea",
    size: "sm",
    rows: 4,
    placeholder: "A denser input for side panels or inspectors.",
  },
};
