import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogViewerWorkspaceExample } from "../../internal/examples/logViewerWorkspace";

const meta = {
  title: "Examples/Log Viewer Workspace",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A realistic operational workspace that treats LogViewer as a viewer-only primitive with filtering, expansion, and virtualization, while leaving the logging pipeline outside the design-system component.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-canvas p-xl">
      <LogViewerWorkspaceExample />
    </div>
  ),
};
