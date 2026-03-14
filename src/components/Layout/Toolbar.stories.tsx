import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconAdjustmentsHorizontal, IconDownload, IconFilter, IconPlus, IconRefresh } from "@tabler/icons-react";
import { Button } from "../Forms/Button";
import { Input } from "../Forms/Input";
import { Divider } from "./Divider";
import { Toolbar, ToolbarGroup, ToolbarSpacer } from "./Toolbar";

const meta: Meta<typeof Toolbar> = {
  component: Toolbar,
  title: "Components/Layout/Toolbar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Toolbar is the shared action-and-filter layout surface for dense command areas such as table controls, inspectors, and review workflows. Compose it with ToolbarGroup and ToolbarSpacer rather than creating one-off action bars.",
      },
    },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
    tone: {
      control: { type: "select" },
      options: ["plain", "subtle", "surface"],
    },
    wrap: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {
  render: (args) => (
    <Toolbar {...args}>
      <ToolbarGroup>
        <Button size="sm" variant="secondary" leftIcon={<IconRefresh size={16} />}>
          Refresh
        </Button>
        <Button size="sm" leftIcon={<IconDownload size={16} />}>
          Export
        </Button>
      </ToolbarGroup>
      <ToolbarSpacer />
      <ToolbarGroup compact>
        <Button size="sm" variant="ghost" leftIcon={<IconAdjustmentsHorizontal size={16} />}>
          View
        </Button>
        <Button size="sm" variant="secondary" leftIcon={<IconPlus size={16} />}>
          Add row
        </Button>
      </ToolbarGroup>
    </Toolbar>
  ),
  args: {
    size: "md",
    tone: "subtle",
  },
};

export const FilterWorkflow: Story = {
  render: () => (
    <Toolbar tone="surface">
      <ToolbarGroup className="min-w-[16rem] flex-1">
        <Input aria-label="Search deployments" placeholder="Search deployments..." className="w-full" />
      </ToolbarGroup>
      <Divider orientation="vertical" className="hidden h-7 md:block" />
      <ToolbarGroup compact>
        <Button size="sm" variant="secondary" leftIcon={<IconFilter size={16} />}>
          Filters
        </Button>
        <Button size="sm" variant="secondary" leftIcon={<IconRefresh size={16} />}>
          Sync
        </Button>
      </ToolbarGroup>
      <ToolbarSpacer />
      <ToolbarGroup compact>
        <Button size="sm" variant="ghost">
          Clear
        </Button>
        <Button size="sm" leftIcon={<IconDownload size={16} />}>
          Export CSV
        </Button>
      </ToolbarGroup>
    </Toolbar>
  ),
};

export const Compact: Story = {
  render: () => (
    <Toolbar size="sm" tone="plain" className="border border-dashed border-default">
      <ToolbarGroup compact>
        <Button size="xs" variant="secondary">
          Today
        </Button>
        <Button size="xs" variant="secondary">
          7d
        </Button>
        <Button size="xs">30d</Button>
      </ToolbarGroup>
      <ToolbarSpacer />
      <ToolbarGroup compact>
        <Button size="xs" variant="ghost">
          Compare
        </Button>
        <Button size="xs" variant="secondary">
          Saved views
        </Button>
      </ToolbarGroup>
    </Toolbar>
  ),
};
