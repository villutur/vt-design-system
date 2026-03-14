import type { Meta, StoryObj } from "@storybook/react-vite";
import { AIAssistantWorkspaceExample } from "../../internal/examples/aiAssistantWorkspace";

const meta = {
  title: "Examples/AI Assistant Workspace",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A composition-first assistant workspace that pairs CommandInput with AIResponseView instead of locking the design system into a monolithic chat component too early.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-canvas p-xl">
      <AIAssistantWorkspaceExample />
    </div>
  ),
};
