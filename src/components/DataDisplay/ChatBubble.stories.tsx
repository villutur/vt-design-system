import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconRobot, IconUser } from "@tabler/icons-react";
import { AIResponseView } from "./AIResponseView";
import { Avatar } from "./Avatar";
import { ChatBubble } from "./ChatBubble";
import { MarkdownRenderer } from "./MarkdownRenderer";

const assistantMarkdown = `## Release recommendation

The rollout can continue if the rollback note is attached before approval.

- Staging is healthy
- Reviewer note is available
- One attachment still needs to be linked
`;

const meta: Meta<typeof ChatBubble> = {
  component: ChatBubble,
  title: "Components/DataDisplay/ChatBubble",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    align: {
      control: "radio",
      options: ["start", "end"],
    },
    tone: {
      control: "radio",
      options: ["neutral", "assistant", "user", "success", "warning", "error"],
    },
    density: {
      control: "radio",
      options: ["default", "compact"],
    },
    surface: {
      control: "radio",
      options: ["bubble", "plain"],
    },
    author: { control: false },
    avatar: { control: false },
    meta: { control: false },
    attachments: { control: false },
    footer: { control: false },
    children: { control: false },
  },
  args: {
    align: "start",
    tone: "assistant",
    density: "default",
    surface: "bubble",
  },
};

export default meta;
type Story = StoryObj<typeof ChatBubble>;

export const AssistantMarkdown: Story = {
  args: {
    author: "Ops Assistant",
    meta: "09:42",
    avatar: <Avatar fallbackText="Ops Assistant" size="sm" />,
    children: <MarkdownRenderer content={assistantMarkdown} density="compact" />,
    footer: "Viewer-only message shell around reusable markdown.",
  },
};

export const UserReply: Story = {
  args: {
    align: "end",
    tone: "user",
    author: "Jamie Rivera",
    meta: "09:43",
    avatar: (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-subtle text-foreground">
        <IconUser size={16} />
      </div>
    ),
    children:
      "Attach the dashboard screenshot, keep the rollback sentence short, and mention that staging stayed stable during the last approval window.",
  },
};

export const StreamingAssistant: Story = {
  args: {
    author: "Ops Assistant",
    meta: "Live",
    status: "streaming",
    avatar: (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        <IconRobot size={16} />
      </div>
    ),
    children: "Drafting the handoff note now. Pulling the latest reviewer note and the anomaly screenshot metadata.",
  },
};

export const PlainSurfaceWrapper: Story = {
  render: (args) => (
    <ChatBubble
      {...args}
      surface="plain"
      author="Ops Assistant"
      meta="09:44"
      avatar={<Avatar fallbackText="Ops Assistant" size="sm" />}
      status="complete"
    >
      <AIResponseView
        status="complete"
        content={assistantMarkdown}
        toolCalls={[
          {
            id: "fetch-note",
            name: "fetchReviewerNote",
            status: "success",
            summary: "Loaded the latest rollback guidance.",
            input: `{"releaseId":"REL-3104"}`,
            output: `{"note":"Revert to REL-3106 if error rate exceeds 2%."}`,
            language: "json",
          },
        ]}
      />
    </ChatBubble>
  ),
};
