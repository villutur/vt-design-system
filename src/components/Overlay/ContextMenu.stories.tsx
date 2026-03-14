import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./ContextMenu";

const meta: Meta<typeof ContextMenu> = {
  component: ContextMenu,
  title: "Components/Overlay/ContextMenu",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ContextMenu provides a menu surface for pointer context actions and keyboard equivalents such as Shift+F10 or the Context Menu key. Use clear menu labeling when the available actions need stronger screen-reader context.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

function BasicContextMenu() {
  const onDuplicate = fn();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex min-h-48 w-full items-center justify-center rounded-xl border border-dashed border-strong bg-surface-subtle text-sm text-foreground-muted">
          Right-click here or press Shift+F10
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent aria-label="Workspace item actions">
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem onClick={onDuplicate} shortcut="D">
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled shortcut="Del">
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export const Default: Story = {
  render: () => <BasicContextMenu />,
};

export const OpenAndSelect: Story = {
  render: () => <BasicContextMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.pointer({
      target: canvas.getByText(/right-click here/i),
      keys: "[MouseRight]",
    });
    await expect(within(document.body).getByRole("menu")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(within(document.body).queryByRole("menu")).not.toBeInTheDocument();
  },
};

export const KeyboardOpen: Story = {
  render: () => <BasicContextMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText(/right-click here/i);

    trigger.focus();
    await userEvent.keyboard("{Shift>}{F10}{/Shift}");

    await expect(
      within(document.body).getByRole("menu", {
        name: /workspace item actions/i,
      }),
    ).toBeInTheDocument();
  },
};
