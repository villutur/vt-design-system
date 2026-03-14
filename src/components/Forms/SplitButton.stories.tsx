import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconDownload,
  IconRefresh,
  IconSettings,
  IconUserPlus,
} from "@tabler/icons-react";
import { SplitButton } from "./SplitButton";

const actions = [
  {
    id: "export-csv",
    label: "Export CSV",
    description: "Download the current table with applied filters.",
    icon: <IconDownload size={16} />,
    shortcut: "E",
  },
  {
    id: "sync-now",
    label: "Refresh data",
    description: "Fetch the newest records from the source.",
    icon: <IconRefresh size={16} />,
  },
  {
    id: "settings",
    label: "Automation settings",
    description: "Configure how the workflow runs by default.",
    icon: <IconSettings size={16} />,
    separatorBefore: true,
  },
] as const;

const meta: Meta<typeof SplitButton> = {
  component: SplitButton,
  title: "Components/Forms/SplitButton",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "SplitButton combines a primary action with a compact secondary action menu. Use it when one workflow path is clearly preferred, but related alternatives should stay one click away. The control is exposed as a grouped action surface so screen readers can understand the primary and secondary triggers together.",
      },
    },
  },
  args: {
    children: "Publish release",
    actions,
    variant: "primary",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof SplitButton>;

export const Default: Story = {};

export const SecondaryWorkflow: Story = {
  args: {
    children: "Invite reviewer",
    variant: "secondary",
    leftIcon: <IconUserPlus size={16} />,
    actions: [
      {
        label: "Invite reviewer",
        description: "Send the standard reviewer invitation now.",
        icon: <IconUserPlus size={16} />,
      },
      {
        label: "Add as observer",
        description: "Grant read-only access without approval rights.",
      },
      {
        label: "Open permissions",
        description: "Review role and workspace access first.",
        icon: <IconSettings size={16} />,
        separatorBefore: true,
      },
    ],
  },
};

export const Disabled: Story = {
  args: {
    children: "Publish release",
    disabled: true,
  },
};
