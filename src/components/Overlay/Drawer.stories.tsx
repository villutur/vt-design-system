import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { useState } from "react";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { Drawer } from "./Drawer";
import { Button } from "../Forms/Button";
import { Toggle } from "../Forms/Toggle";

const meta: Meta<typeof Drawer> = {
  component: Drawer,
  title: "Components/Overlay/Drawer",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Drawer is a dialog-like side or edge panel for workflows that should keep page context visible. Use it when you need richer content than a popover, but a full blocking modal would feel too disruptive. It follows the dialog accessibility model with explicit labeling, focus management, and configurable backdrop and Escape dismissal behavior.",
      },
    },
  },
  argTypes: {
    side: {
      control: { type: "radio" },
      options: ["left", "right", "top", "bottom"],
    },
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

function DrawerExample(args: Partial<React.ComponentProps<typeof Drawer>>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex w-full items-center justify-center p-12">
      <Button onClick={() => setIsOpen(true)}>
        <IconAdjustmentsHorizontal size={16} />
        Open Drawer
      </Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Workspace settings"
        description="Adjust quick preferences without leaving the current page."
        footer={
          <div className="flex justify-end gap-sm">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Save</Button>
          </div>
        }
        {...args}
      >
        <div className="space-y-md">
          <Toggle id="drawer-live-updates" label="Enable live updates" />
          <Toggle id="drawer-notifications" label="Compact notifications" />
        </div>
      </Drawer>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <DrawerExample {...args} />,
};

export const OpenCloseInteraction: Story = {
  render: (args) => <DrawerExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /open drawer/i }));
    await expect(within(document.body).getByRole("dialog")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect(within(document.body).queryByRole("dialog")).not.toBeInTheDocument();
  },
};

export const BackdropGuarded: Story = {
  render: (args) => (
    <DrawerExample
      closeOnBackdropClick={false}
      description="This drawer keeps focus trapped until the user closes it explicitly."
      {...args}
    />
  ),
};
