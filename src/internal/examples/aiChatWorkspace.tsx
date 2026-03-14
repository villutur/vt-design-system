import React from "react";
import {
  IconArrowDown,
  IconMessageCircle,
  IconRobot,
  IconSparkles,
  IconWand,
} from "@tabler/icons-react";
import {
  AIResponseView,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CommandInput,
  MarkdownRenderer,
  ScrollArea,
  SectionPanel,
} from "../../index";
import { ChatBubble } from "../../components/DataDisplay/ChatBubble";

const attachmentPreview =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23dbeafe'/%3E%3Cstop offset='1' stop-color='%2393c5fd'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' rx='32' fill='url(%23g)'/%3E%3Ccircle cx='148' cy='132' r='48' fill='%23ffffff' fill-opacity='.82'/%3E%3Cpath d='M108 252l68-72 74 52 104-116 124 136H108z' fill='%23ffffff' fill-opacity='.92'/%3E%3C/svg%3E";

const completedResponse = `## Release handoff

The canary can continue after the rollback wording is attached to the approval packet.

- Approval metadata is complete
- Reviewer guidance is now explicit
- The rollback threshold remains 2%

### Suggested note

> Revert command-suite-rollout to REL-3106 if error rate exceeds 2% or navigation regressions appear during canary traffic.
`;

const streamingResponse = `## Draft in progress

I am folding the newest reviewer note into the release summary.

- Preserving the final rollback wording
- Cross-checking the release owner
- Waiting for the final ticket link
`;

const promptHistory = [
  {
    id: "chat-history-handoff",
    label: "Rollback handoff request",
    description: "Recent prompt reused while preparing the approval packet.",
    value:
      "Summarize the rollout blocker for REL-3104 and draft the exact rollback wording I can paste into the approval packet.",
  },
  {
    id: "chat-history-export",
    label: "Export bundle follow-up",
    description: "Short follow-up for packaging the final incident bundle.",
    value:
      "Add one short follow-up about which slash command I should use next to export the final incident bundle.",
  },
];

const slashCommands = [
  {
    value: "summarize",
    label: "Summarize conversation",
    description: "Create a concise assistant summary from the visible thread.",
    group: "Prompt helpers",
  },
  {
    value: "release-note",
    label: "Insert release-note template",
    description: "Prefill the prompt with release handoff structure.",
    group: "Templates",
  },
  {
    value: "export-bundle",
    label: "Prepare export bundle",
    description: "Start the command for packaging the final incident bundle.",
    group: "Actions",
    shortcut: "⌘E",
  },
];

export function AIChatWorkspaceExample() {
  const [followTail, setFollowTail] = React.useState(true);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.34fr_0.66fr]">
      <SectionPanel
        title="Composition notes"
        subtitle="Why this stays an example before becoming a public AIChat component"
      >
        <div className="space-y-md">
          <div className="flex flex-wrap items-center gap-sm">
            <Badge variant="softPrimary">Example</Badge>
            <Badge variant="outlineGray">Composition-first</Badge>
            <Badge variant="soft">Chat workflow</Badge>
          </div>

          <Card variant="plain" className="rounded-2xl bg-surface-subtle">
            <CardContent className="space-y-sm p-lg">
              <p className="text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                Current boundary
              </p>
              <p className="text-sm text-foreground-muted">
                This workspace validates a reusable chat shell without locking
                the design system into session state, transport logic, or agent
                orchestration too early.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-sm">
            <div className="flex items-start gap-sm rounded-xl border border-default bg-surface-subtle/60 px-md py-md">
              <IconMessageCircle size={16} className="mt-[2px] text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Conversation rows stay generic
                </p>
                <p className="text-sm text-foreground-muted">
                  `ChatBubble` only owns alignment, tone, meta, and resilient
                  long-content layout.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-sm rounded-xl border border-default bg-surface-subtle/60 px-md py-md">
              <IconRobot size={16} className="mt-[2px] text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Assistant payloads stay render-only
                </p>
                <p className="text-sm text-foreground-muted">
                  `AIResponseView` remains the dense tool-call and attachment
                  surface inside the broader chat shell.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-sm rounded-xl border border-default bg-surface-subtle/60 px-md py-md">
              <IconWand size={16} className="mt-[2px] text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Prompt input stays reusable
                </p>
                <p className="text-sm text-foreground-muted">
                  `CommandInput` continues to be the shared command and prompt
                  primitive rather than a chat-specific textarea.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionPanel>

      <SectionPanel
        title="Conversation lane"
        subtitle="User prompts, assistant responses, streaming output, and attachments"
      >
        <div className="space-y-md">
          <ScrollArea
            maxHeight={560}
            className="rounded-2xl border border-default bg-canvas/70 p-md"
            followTail={followTail}
            onFollowTailChange={setFollowTail}
          >
            <div className="space-y-md">
              <ChatBubble
                align="end"
                tone="user"
                author="Operator"
                meta="09:42"
                avatar={<Avatar fallbackText="Operator" size="sm" />}
              >
                Summarize the rollout blocker for REL-3104 and draft the exact
                rollback wording I can paste into the approval packet.
              </ChatBubble>

              <ChatBubble
                align="start"
                tone="assistant"
                author="Assistant"
                meta="09:43"
                avatar={<Avatar fallbackText="Assistant" size="sm" />}
              >
                <AIResponseView
                  status="complete"
                  density="compact"
                  content={completedResponse}
                  thought={{
                    summary: "Checking the latest reviewer note",
                    content:
                      "Loaded the approval packet, extracted the reviewer requirement, and preserved the exact rollback threshold for the final note.",
                  }}
                  toolCalls={[
                    {
                      id: "fetch-release",
                      name: "fetchRelease",
                      status: "success",
                      summary:
                        "Loaded the current release status and environment data.",
                      input: `{"releaseId":"REL-3104"}`,
                      output: `{"environment":"Production","owner":"Jamie Rivera","status":"canary"}`,
                      language: "json",
                    },
                    {
                      id: "fetch-reviewer-note",
                      name: "fetchReviewerNote",
                      status: "success",
                      summary:
                        "Returned the latest rollback guidance from the reviewer.",
                      input: `{"releaseId":"REL-3104","noteType":"rollback"}`,
                      output: `{"note":"Revert to REL-3106 if error rate exceeds 2%."}`,
                      language: "json",
                    },
                  ]}
                  attachments={[
                    {
                      id: "attachment-preview",
                      kind: "image",
                      title: "Approval packet preview",
                      src: attachmentPreview,
                      description:
                        "Shared screenshot packaged with the release summary.",
                      meta: "PNG · 640x360",
                    },
                    {
                      id: "attachment-file",
                      kind: "file",
                      title: "handoff-note.md",
                      src: "/exports/handoff-note.md",
                      description:
                        "Generated markdown note ready to attach to the rollout ticket.",
                      meta: "Markdown · 4 KB",
                    },
                  ]}
                />
              </ChatBubble>

              <ChatBubble
                align="end"
                tone="user"
                author="Operator"
                meta="09:44"
                avatar={<Avatar fallbackText="Operator" size="sm" />}
              >
                Add one short follow-up about which slash command I should use
                next to export the final incident bundle.
              </ChatBubble>

              <ChatBubble
                align="start"
                tone="assistant"
                author="Assistant"
                meta="09:45"
                status="streaming"
                avatar={<Avatar fallbackText="Assistant" size="sm" />}
              >
                <MarkdownRenderer
                  content={streamingResponse}
                  density="compact"
                />
              </ChatBubble>
            </div>
          </ScrollArea>

          {!followTail ? (
            <div className="pointer-events-none -mt-18 flex justify-center px-md">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="pointer-events-auto shadow-soft dark:shadow-soft-dark"
                onClick={() => setFollowTail(true)}
              >
                <IconArrowDown size={16} />
                Follow conversation
              </Button>
            </div>
          ) : null}

          <CommandInput
            label="Assistant prompt"
            description="Compose the next prompt with slash commands, history, and keyboard submit."
            helperText="ArrowUp opens prompt history at the start of an empty prompt. Ctrl/Cmd + Enter submits the message."
            defaultValue="Create the final handoff note, mention the rollback threshold, and export the incident bundle."
            history={promptHistory}
            slashCommands={slashCommands}
            submitLabel="Send"
            actions={
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<IconSparkles size={16} />}
              >
                Insert release template
              </Button>
            }
            onSubmit={async () => {
              await new Promise((resolve) => setTimeout(resolve, 700));
            }}
          />
        </div>
      </SectionPanel>
    </div>
  );
}
