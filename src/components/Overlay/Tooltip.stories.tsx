import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip";
import { Button } from "../Forms/Button";
import { IconInfoCircle } from "@tabler/icons-react";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: "Components/Overlay/Tooltip",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Tooltip provides brief contextual help on hover or focus. It shares the package's anchored positioning foundation, but it remains a specialized assistive pattern rather than a generic interactive overlay. When the trigger already has an `aria-describedby` relationship, Tooltip preserves it and appends its own description only while open.",
      },
    },
  },
  argTypes: {
    position: {
      control: "radio",
      options: ["top", "bottom", "left", "right"],
    },
    delay: {
      control: "number",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: "Add to library",
    position: "top",
    delay: 200,
  },
  render: (args) => (
    <div className="flex h-40 w-full items-center justify-center">
      <Tooltip {...args}>
        <Button variant="outline">Hover over me</Button>
      </Tooltip>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="grid grid-cols-3 grid-rows-3 gap-8">
        <div className="col-start-2 flex justify-center">
          <Tooltip content="Tooltip on top" position="top">
            <Button variant="secondary">Top</Button>
          </Tooltip>
        </div>
        <div className="row-start-2 flex justify-end pr-4">
          <Tooltip content="Tooltip on left" position="left">
            <Button variant="secondary">Left</Button>
          </Tooltip>
        </div>
        <div className="col-start-3 row-start-2 flex pl-4">
          <Tooltip content="Tooltip on right" position="right">
            <Button variant="secondary">Right</Button>
          </Tooltip>
        </div>
        <div className="col-start-2 row-start-3 flex justify-center">
          <Tooltip content="Tooltip on bottom" position="bottom">
            <Button variant="secondary">Bottom</Button>
          </Tooltip>
        </div>
      </div>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex h-40 w-full items-center justify-center gap-2 text-foreground-muted">
      <span>Payment settings</span>
      <Tooltip content="Your payment method will be billed automatically every billing cycle.">
        <IconInfoCircle
          size={18}
          className="cursor-help text-foreground-subtle transition-colors hover:text-foreground"
        />
      </Tooltip>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div className="flex h-40 w-full items-center justify-center">
      <Tooltip content="Publishing this change will update the shared configuration for every environment connected to this workspace, including staging and production.">
        <Button variant="secondary">Review impact</Button>
      </Tooltip>
    </div>
  ),
};

export const WithExistingDescription: Story = {
  render: () => (
    <div className="flex h-48 w-full flex-col items-center justify-center gap-3">
      <p id="tooltip-existing-description" className="max-w-sm text-center text-sm text-foreground-muted">
        This action already has an inline accessibility description before the tooltip opens.
      </p>
      <Tooltip content="This tooltip adds a temporary contextual hint without replacing the existing description.">
        <Button variant="outline" aria-describedby="tooltip-existing-description">
          Publish workspace
        </Button>
      </Tooltip>
    </div>
  ),
};
