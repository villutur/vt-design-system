import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Forms/Button";
import { Banner } from "./Banner";

const meta: Meta<typeof Banner> = {
  component: Banner,
  title: "Components/Feedback/Banner",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Banner is the page- or section-level feedback surface for important notices that should remain visible until the user addresses or dismisses them. Use it above inline Alert and below fully blocking dialog patterns. Its default announcement behavior now scales with severity so warnings and errors can interrupt more strongly than passive notices.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Info: Story = {
  args: {
    type: "info",
    title: "Scheduled maintenance window",
    description:
      "Workspace analytics will be briefly unavailable while the metrics cluster is upgraded.",
    actions: <Button size="sm">Review timeline</Button>,
  },
};

export const WarningDismissible: Story = {
  render: (args) => <Banner {...args} />,
  args: {
    type: "warning",
    title: "Storage nearing capacity",
    description:
      "The current plan is at 90% of the monthly storage quota. Consider upgrading before exports fail.",
    actions: (
      <Button size="sm" variant="secondary">
        Manage plan
      </Button>
    ),
    onClose: () => undefined,
  },
};

export const WorkflowEscalation: Story = {
  args: {
    type: "error",
    title: "Deployments are paused for this workspace",
    description:
      "A failed production rollout requires manual review before the release pipeline can continue.",
    actions: (
      <div className="flex flex-wrap gap-sm">
        <Button size="sm">Review incident</Button>
        <Button size="sm" variant="secondary">
          Open runbook
        </Button>
      </div>
    ),
  },
};
