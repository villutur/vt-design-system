import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberInput } from "./NumberInput";
import { useState } from "react";

const meta: Meta<typeof NumberInput> = {
  component: NumberInput,
  title: "Components/Forms/NumberInput",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

function Controlled(props: Partial<React.ComponentProps<typeof NumberInput>>) {
  const [val, setVal] = useState(props.value ?? 0);
  return <NumberInput {...props} value={val} onChange={setVal} />;
}

export const Default: Story = {
  render: () => <Controlled value={5} min={0} max={100} />,
};

export const WithLabel: Story = {
  render: () => (
    <Controlled
      value={10}
      min={1}
      max={50}
      step={1}
      label="Retry Limit"
      helperText="Number of retries before failing"
    />
  ),
};

export const WithStep: Story = {
  render: () => <Controlled value={0.5} step={0.25} min={0} max={2} label="Threshold" />,
};

export const WithError: Story = {
  render: () => (
    <Controlled value={200} min={0} max={100} label="Percentage" helperText="Value exceeds maximum" error />
  ),
};
