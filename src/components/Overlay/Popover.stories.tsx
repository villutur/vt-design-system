import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Forms/Button";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

const meta: Meta<typeof Popover> = {
  component: Popover,
  title: "Components/Overlay/Popover",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Popover is the base anchored overlay primitive for non-modal content attached to a trigger. Use it for custom inspector, picker, or utility panels when Dropdown would be too menu-specific and Modal or Drawer would be too heavy. By default, the panel derives its accessible name from the trigger when no explicit `aria-label` or `aria-labelledby` is provided.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-56 items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Open inspector</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-lg">
          <div className="space-y-md">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Workspace inspector</h3>
              <p className="mt-xs text-sm text-foreground-muted">
                Generic anchored overlays such as dropdowns and inspectors can build on this primitive.
              </p>
            </div>
            <div className="rounded-xl border border-default bg-surface-subtle p-md text-sm text-foreground-muted">
              Region: eu-north-1
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const SameWidth: Story = {
  render: () => (
    <div className="flex min-h-56 items-center justify-center">
      <Popover sameWidth>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-64 justify-between">
            Deployment actions
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-xs">
          <button className="flex w-full rounded-lg px-sm py-sm text-left text-sm hover:bg-surface-muted">
            Promote to production
          </button>
          <button className="flex w-full rounded-lg px-sm py-sm text-left text-sm hover:bg-surface-muted">
            Pause rollout
          </button>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const WithAriaLabelOverride: Story = {
  render: () => (
    <div className="flex min-h-56 items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open release shortcuts</Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Release shortcuts" className="w-72 p-lg">
          <div className="space-y-sm">
            <h3 className="text-sm font-semibold text-foreground">Keyboard shortcuts</h3>
            <p className="text-sm text-foreground-muted">
              Use an explicit accessible name when the trigger text is too vague for the anchored panel itself.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
