import type { Meta, StoryObj } from "@storybook/react-vite";
import { AIResponseView } from "./AIResponseView";

const attachmentPreview =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23dbeafe'/%3E%3Cstop offset='1' stop-color='%2393c5fd'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' rx='32' fill='url(%23g)'/%3E%3Ccircle cx='152' cy='132' r='54' fill='%23ffffff' fill-opacity='.82'/%3E%3Cpath d='M120 248l72-72 64 56 108-120 112 136H120z' fill='%23ffffff' fill-opacity='.92'/%3E%3C/svg%3E";

const completedContent = `## Release note draft

The canary is safe to continue. The remaining blocker is a missing rollback note for the command suite rollout.

- Approval packet is otherwise complete
- QA coverage looks stable in staging
- Reviewer asked for a more explicit recovery path

\`\`\`md
Rollback note: revert command-suite-rollout to release REL-3106 if error rate exceeds 2%.
\`\`\`
`;

const streamingContent = `## Draft in progress

The deployment summary is being updated with the latest approvals.

- Added release owner and environment context
- Pulling the newest reviewer notes
- `;

const meta: Meta<typeof AIResponseView> = {
  component: AIResponseView,
  title: "Components/DataDisplay/AIResponseView",
  tags: ["autodocs"],
  args: {
    status: "complete",
    content: completedContent,
    density: "default",
    showThought: true,
    showToolCalls: true,
  },
  argTypes: {
    status: {
      control: "radio",
      options: ["thinking", "streaming", "complete", "error"],
    },
    density: {
      control: "radio",
      options: ["default", "compact"],
    },
    showThought: { control: "boolean" },
    showToolCalls: { control: "boolean" },
    className: { control: false },
    thought: { control: false },
    toolCalls: { control: false },
    attachments: { control: false },
    errorMessage: { control: false },
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof AIResponseView>;

export const PlainCompletedResponse: Story = {};

export const StreamingResponse: Story = {
  args: {
    status: "streaming",
    content: streamingContent,
    thought: undefined,
    toolCalls: undefined,
  },
};

export const ThinkingWithToolCalls: Story = {
  args: {
    status: "thinking",
    content: undefined,
    thought: {
      summary: "Collecting the missing release context",
      content:
        "Comparing the selected release with the approval queue and pulling the reviewer note that explains the current blocker.",
      defaultOpen: true,
    },
    toolCalls: [
      {
        id: "fetch-release",
        name: "fetchRelease",
        status: "success",
        summary: "Loaded metadata for REL-3104 from the release queue.",
        input: `{"releaseId":"REL-3104"}`,
        output: `{"release":"navigation-treeview-1.2.0","environment":"Production","reviewer":"Jamie Rivera"}`,
        language: "json",
        defaultOpen: true,
      },
      {
        id: "fetch-reviewer-note",
        name: "fetchReviewerNote",
        status: "running",
        summary: "Looking up the latest reviewer guidance before drafting the note.",
        input: `{"releaseId":"REL-3104","noteType":"rollback"}`,
        language: "json",
      },
    ],
  },
};

export const MultimodalAttachments: Story = {
  args: {
    status: "complete",
    content:
      "## Investigation package\n\nThe assistant returned a screenshot, a recorded handoff, and a generated export for the incident timeline.",
    attachments: [
      {
        id: "img-1",
        kind: "image",
        title: "Dashboard anomaly preview",
        src: attachmentPreview,
        description: "Annotated screenshot captured before the rollback.",
        meta: "PNG · 640x360",
      },
      {
        id: "audio-1",
        kind: "audio",
        title: "Responder handoff",
        src: "/audio/handoff.wav",
        description: "Short voice note summarizing the mitigation steps.",
        meta: "WAV · 00:18",
      },
      {
        id: "file-1",
        kind: "file",
        title: "Incident timeline export",
        src: "/exports/incident-timeline.json",
        description: "Structured timeline for downstream tooling and auditing.",
        meta: "JSON · 12 KB",
      },
    ],
  },
};

export const ErrorState: Story = {
  args: {
    status: "error",
    content:
      "## Partial output\n\nThe assistant started drafting the summary but the final handoff was interrupted.",
    errorMessage:
      "The workspace could not finish the response because the reviewer note service timed out.",
    thought: {
      summary: "Fallback path",
      content: "Retry only the note lookup step and preserve the already drafted markdown.",
    },
    toolCalls: [
      {
        id: "reviewer-note",
        name: "fetchReviewerNote",
        status: "error",
        summary: "The upstream note service timed out after 10 seconds.",
        input: `{"releaseId":"REL-3104","noteType":"rollback"}`,
        output: `{"error":"timeout","retryable":true}`,
        language: "json",
        defaultOpen: true,
      },
    ],
  },
};
