import type { Meta, StoryObj } from "@storybook/react-vite";
import { AIChatWorkspaceExample } from "../../internal/examples/aiChatWorkspace";

const meta = {
  title: "Examples/AI Chat Workspace",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A conversation-first assistant workspace built from ChatBubble, CommandInput, AIResponseView, and layout primitives. It serves as the reference composition before a first-class AIChat component is considered.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-canvas p-xl">
      <AIChatWorkspaceExample />
    </div>
  ),
};
