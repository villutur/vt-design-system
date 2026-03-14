import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Forms/Button";
import { ToastProvider, useToast } from "./Toast";

const meta: Meta = {
  title: "Components/Feedback/Toast",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Toast is the transient notification pattern for asynchronous outcomes and short-lived feedback. Use it for workflow confirmations, warnings, and failures that should not permanently occupy layout space. Severity-aware announcement roles now help routine updates stay polite while errors and warnings can interrupt more strongly.",
      },
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-xl border border-default bg-surface-subtle p-xl">
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj;

function ToastTypeDemo() {
  const { toast } = useToast();

  return (
    <div className="flex max-w-xl flex-wrap justify-center gap-sm">
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: "Saved",
            description: "Workspace settings were saved successfully.",
            type: "default",
          })
        }
      >
        Default
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "Release published",
            description: "The new configuration is now live.",
            type: "success",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: "Review required",
            description: "A maintainer needs to approve this change.",
            type: "info",
          })
        }
      >
        Info
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: "Storage almost full",
            description: "You have used 90% of your available quota.",
            type: "warning",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          toast({
            title: "Deployment failed",
            description: "Check the logs and retry the rollout.",
            type: "error",
          })
        }
      >
        Error
      </Button>
    </div>
  );
}

function AsyncWorkflowDemo() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: "Publishing release",
          description: "Your deployment is being prepared.",
          type: "info",
          duration: 1800,
        });

        window.setTimeout(() => {
          toast({
            title: "Release published",
            description: "All environments were updated successfully.",
            type: "success",
            action: (
              <Button size="xs" variant="secondary">
                View changelog
              </Button>
            ),
          });
        }, 1000);
      }}
    >
      Run async workflow
    </Button>
  );
}

export const Types: Story = {
  render: () => <ToastTypeDemo />,
};

export const AsyncWorkflow: Story = {
  render: () => <AsyncWorkflowDemo />,
};

export const RetryAndConfirm: Story = {
  render: () => {
    const { toast } = useToast();

    return (
      <Button
        variant="secondary"
        onClick={() => {
          toast({
            title: "Upload failed",
            description: "The release bundle could not be uploaded on the first attempt.",
            type: "warning",
            action: (
              <Button
                size="xs"
                onClick={() =>
                  toast({
                    title: "Retry succeeded",
                    description: "The second upload completed successfully.",
                    type: "success",
                  })
                }
              >
                Retry now
              </Button>
            ),
          });
        }}
      >
        Trigger retry flow
      </Button>
    );
  },
};
