import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio } from "./Radio";

const meta: Meta<typeof Radio> = {
  component: Radio,
  title: "Components/Forms/Radio",
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
    name: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: "Option A",
    name: "example-group",
  },
};

export const WithDescription: Story = {
  args: {
    label: "Premium Plan",
    description: "$19.99/month, billed annually.",
    name: "plan-group",
  },
};

export const RadioGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Radio name="fruit" label="Apple" defaultChecked />
      <Radio name="fruit" label="Banana" />
      <Radio name="fruit" label="Orange" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Unavailable Option",
    disabled: true,
  },
};
