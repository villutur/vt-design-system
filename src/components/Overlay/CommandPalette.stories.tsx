import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { useState } from "react";
import {
  IconChartBar,
  IconFileCode,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { Button } from "../Forms/Button";
import { CommandPalette } from "./CommandPalette";

const meta: Meta<typeof CommandPalette> = {
  component: CommandPalette,
  title: "Components/Overlay/CommandPalette",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "CommandPalette is the keyboard-first dialog surface for global search and action launching. It now exposes clearer dialog semantics, input guidance, and live status updates for filtered command results.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

const sections = [
  {
    title: "Navigation",
    items: [
      {
        value: "analytics",
        label: "Open analytics",
        description: "Jump to dashboards and reports",
        icon: <IconChartBar size={16} />,
        shortcut: "G A",
        keywords: ["dashboards", "metrics"],
        group: "Navigation",
      },
      {
        value: "team",
        label: "Open team directory",
        description: "Manage people and access",
        icon: <IconUsers size={16} />,
        shortcut: "G T",
        group: "Navigation",
      },
    ],
  },
  {
    title: "Actions",
    items: [
      {
        value: "new-file",
        label: "Create component story",
        description: "Generate a new colocated story file",
        icon: <IconFileCode size={16} />,
        shortcut: "N S",
        group: "Actions",
      },
      {
        value: "settings",
        label: "Open workspace settings",
        description: "Change environment and preferences",
        icon: <IconSettings size={16} />,
        shortcut: "G S",
        group: "Actions",
      },
    ],
  },
];

function PaletteExample(
  args: Partial<React.ComponentProps<typeof CommandPalette>>,
) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-center p-12">
      <Button onClick={() => setIsOpen(true)}>Open Command Palette</Button>
      <CommandPalette
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        sections={sections}
        {...args}
      />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <PaletteExample {...args} />,
};

export const SearchAndSelect: Story = {
  render: (args) => <PaletteExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /open command palette/i }),
    );
    const input = within(document.body).getByPlaceholderText(/search commands/i);
    await userEvent.type(input, "settings");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(
      within(document.body).queryByPlaceholderText(/search commands/i),
    ).not.toBeInTheDocument();
  },
};
