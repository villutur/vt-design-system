import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Stepper } from "./Stepper";

const meta: Meta<typeof Stepper> = {
  component: Stepper,
  title: "Components/Navigation/Stepper",
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: { type: "radio" },
      options: ["horizontal", "vertical"],
    },
    interactive: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const steps = [
  {
    id: "details",
    title: "Project details",
    description: "Name, region, and environment",
  },
  {
    id: "access",
    title: "Access policy",
    description: "Permissions and API keys",
  },
  {
    id: "review",
    title: "Review",
    description: "Final confirmation before launch",
  },
];

function InteractiveStepper(args: Partial<React.ComponentProps<typeof Stepper>>) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <Stepper
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      interactive
      {...args}
    />
  );
}

export const Default: Story = {
  args: {
    steps,
    currentStep: 1,
  },
};

export const Vertical: Story = {
  render: () => <InteractiveStepper orientation="vertical" />,
};

export const Interactive: Story = {
  render: () => <InteractiveStepper orientation="horizontal" />,
};
