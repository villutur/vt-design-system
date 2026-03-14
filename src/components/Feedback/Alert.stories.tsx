import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Forms/Button";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  component: Alert,
  title: "Components/Feedback/Alert",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Alert is the inline, surface-local feedback pattern for warnings, failures, and confirmations that belong inside the current page or panel rather than above the whole section. Its default live region behavior now tracks severity so destructive or warning states can announce more assertively than routine notices.",
      },
    },
  },
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["info", "success", "warning", "error"],
      description: "The semantic intent of the alert",
    },
    title: {
      control: "text",
      description: "Bold title at the top of the alert",
    },
    onClose: { action: "closed" },
    children: {
      control: "text",
      description: "The main body content",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    type: "info",
    title: "Update Available",
    children: "A new version of the design system is available for download.",
  },
};

export const Success: Story = {
  args: {
    type: "success",
    title: "Deployment Successful",
    children: "Your application has been deployed to the production environment.",
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
    title: "Rate Limit Warning",
    children: "You are approaching your monthly API rate limit (85% used).",
  },
};

export const Error: Story = {
  args: {
    type: "error",
    title: "Connection Failed",
    children: "Unable to connect to the database. Please check your network connection and try again.",
  },
};

export const Dismissible: Story = {
  args: {
    type: "info",
    title: "Dismissible Alert",
    children: "Click the X icon in the corner to dismiss this alert.",
    onClose: () => undefined,
  },
};

export const NoTitle: Story = {
  args: {
    type: "success",
    children: "Your settings have been saved automatically.",
  },
};

export const InlineRetry: Story = {
  render: (args) => (
    <Alert {...args}>
      <div className="space-y-sm">
        <p>The latest activity stream could not be loaded. Retry the request or switch to a different workspace.</p>
        <Button size="xs" variant="secondary">
          Retry fetch
        </Button>
      </div>
    </Alert>
  ),
  args: {
    type: "error",
    title: "Activity stream unavailable",
  },
};
