import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DocumentationOpsWorkspaceShowcase,
  IncidentTriageWorkspaceShowcase,
  ReleaseControlWorkspaceShowcase,
} from "../../internal/examples/workflowWorkspaces";

const meta = {
  title: "Examples/Workflow Workspaces",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Realistic workspace pages that show newer primitives such as TreeView, DataTable, Toolbar, SplitButton, CommandInput, and CommandPalette in context rather than as isolated component demos.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const ReleaseControlWorkspace: Story = {
  render: () => <ReleaseControlWorkspaceShowcase />,
};

export const IncidentTriageWorkspace: Story = {
  render: () => <IncidentTriageWorkspaceShowcase />,
};

export const IncidentTriageWithPaletteOpen: Story = {
  render: () => <IncidentTriageWorkspaceShowcase startWithPaletteOpen />,
};

export const DocumentationOpsWorkspace: Story = {
  render: () => <DocumentationOpsWorkspaceShowcase />,
};
