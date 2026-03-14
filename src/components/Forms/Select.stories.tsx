import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
  component: Select,
  title: "Components/Forms/Select",
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text above the select",
    },
    helperText: {
      control: "text",
      description: "Text below the select",
    },
    error: {
      control: "boolean",
      description: "Whether the select is in an error state",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const SAMPLE_OPTIONS = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
];

export const Default: Story = {
  args: {
    label: "Country",
    options: SAMPLE_OPTIONS,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Notification Frequency",
    helperText: "Choose how often you want to receive emails",
    options: [
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "never", label: "Never" },
    ],
  },
};

export const ErrorState: Story = {
  args: {
    label: "Favorite Color",
    options: [
      { value: "", label: "Select an option..." },
      { value: "red", label: "Red" },
      { value: "blue", label: "Blue" },
    ],
    error: true,
    helperText: "This field is required",
  },
};

export const Disabled: Story = {
  args: {
    label: "Region",
    options: [{ value: "eu", label: "Europe (Disabled)" }],
    disabled: true,
  },
};
