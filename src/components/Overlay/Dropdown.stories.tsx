import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Dropdown, DropdownItem, DropdownSeparator } from "./Dropdown";
import { Button } from "../Forms/Button";
import { IconSettings, IconUser, IconLogout, IconChevronDown } from "@tabler/icons-react";

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  title: "Components/Overlay/Dropdown",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dropdown is the menu-oriented anchored overlay for compact action lists. It follows the popover-style overlay foundation, but it is intended specifically for short contextual action sets rather than arbitrary custom panel content. The menu surface carries explicit menu labeling and keyboard navigation semantics.",
      },
    },
  },
  argTypes: {
    align: {
      control: "radio",
      options: ["left", "center", "right"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    align: "left",
  },
  render: (args) => (
    <div className="flex w-full items-center justify-center p-12">
      <Dropdown
        {...args}
        trigger={
          <Button variant="secondary" rightIcon={<IconChevronDown size={16} />}>
            Options
          </Button>
        }
      >
        <DropdownItem>Profile Details</DropdownItem>
        <DropdownItem>Billing Configuration</DropdownItem>
        <DropdownItem>Team Settings</DropdownItem>
        <DropdownSeparator />
        <DropdownItem className="text-error hover:text-error focus:text-error">Delete Account</DropdownItem>
      </Dropdown>
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    align: "left",
  },
  render: (args) => (
    <div className="flex w-full items-center justify-center p-12">
      <Dropdown
        {...args}
        trigger={
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-default bg-surface text-foreground-muted transition-colors hover:bg-surface-subtle hover:text-foreground">
            <IconUser size={20} />
          </div>
        }
      >
        <DropdownItem>
          <IconUser size={16} className="mr-2" />
          My Profile
        </DropdownItem>
        <DropdownItem>
          <IconSettings size={16} className="mr-2" />
          Settings
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem className="text-error hover:text-error focus:text-error">
          <IconLogout size={16} className="mr-2" />
          Log out
        </DropdownItem>
      </Dropdown>
    </div>
  ),
};

export const KeyboardNavigation: Story = {
  args: {
    align: "left",
  },
  render: (args) => (
    <div className="flex w-full items-center justify-center p-12">
      <Dropdown
        {...args}
        trigger={
          <Button variant="secondary" rightIcon={<IconChevronDown size={16} />}>
            Workspace actions
          </Button>
        }
      >
        <DropdownItem>Open details</DropdownItem>
        <DropdownItem>Duplicate workspace</DropdownItem>
        <DropdownItem disabled>Archive</DropdownItem>
        <DropdownSeparator />
        <DropdownItem>Transfer ownership</DropdownItem>
      </Dropdown>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /workspace actions/i });

    await userEvent.click(trigger);
    await expect(within(document.body).getByRole("menu")).toBeInTheDocument();

    await userEvent.keyboard("{ArrowDown}");
    await expect(
      within(document.body).getByRole("menuitem", {
        name: /duplicate workspace/i,
      }),
    ).toHaveFocus();

    await userEvent.keyboard("{End}");
    await expect(
      within(document.body).getByRole("menuitem", {
        name: /transfer ownership/i,
      }),
    ).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await expect(within(document.body).queryByRole("menu")).not.toBeInTheDocument();
  },
};

export const RightAligned: Story = {
  args: {
    align: "right",
  },
  render: (args) => (
    <div className="flex w-full items-center justify-end p-12">
      <Dropdown {...args} trigger={<Button variant="outline">Actions</Button>}>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Duplicate</DropdownItem>
        <DropdownItem>Archive</DropdownItem>
        <DropdownItem disabled>Share (Pro feature)</DropdownItem>
      </Dropdown>
    </div>
  ),
};
