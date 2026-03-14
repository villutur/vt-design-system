import { IconRobot, IconSparkles, IconWand } from "@tabler/icons-react";
import { AIResponseView, Badge, Button, Card, CardContent, CommandInput, SectionPanel } from "../../index";

const attachmentPreview =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23e0f2fe'/%3E%3Cstop offset='1' stop-color='%2393c5fd'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' rx='32' fill='url(%23g)'/%3E%3Crect x='56' y='60' width='220' height='22' rx='11' fill='%230f172a' fill-opacity='.12'/%3E%3Crect x='56' y='102' width='520' height='14' rx='7' fill='%230f172a' fill-opacity='.1'/%3E%3Crect x='56' y='132' width='460' height='14' rx='7' fill='%230f172a' fill-opacity='.1'/%3E%3Crect x='56' y='196' width='164' height='108' rx='20' fill='%23ffffff' fill-opacity='.78'/%3E%3Crect x='240' y='172' width='172' height='132' rx='20' fill='%23ffffff' fill-opacity='.88'/%3E%3Crect x='432' y='146' width='152' height='158' rx='20' fill='%23ffffff' fill-opacity='.96'/%3E%3C/svg%3E";

const responseContent = `## Release handoff

The canary can continue once the rollback note is attached to the approval packet.

- Reviewer note confirms staging is healthy
- The only blocker is the missing recovery path
- Suggested wording is ready for the final handoff

### Ready-to-send note

> If error rate exceeds 2% or the new command palette blocks navigation, revert to release REL-3106 and page the owning reviewer.
`;

const promptHistory = [
  {
    id: "assistant-history-release",
    label: "Release handoff summary",
    description: "Recent approval-packet draft reused by the release team.",
    value:
      "Summarize the release status for REL-3104, include the rollback note wording, and attach the dashboard anomaly screenshot.",
  },
  {
    id: "assistant-history-review",
    label: "Reviewer follow-up",
    description: "Short prompt for clarifying blockers before approval.",
    value:
      "Draft a short reviewer follow-up that asks for the remaining rollback clarification and the final ticket link.",
  },
];

const slashCommands = [
  {
    value: "summarize",
    label: "Summarize context",
    description: "Generate a concise summary from the latest release state.",
    group: "Prompt helpers",
  },
  {
    value: "release-note",
    label: "Insert release-note template",
    description: "Prefill a handoff structure for the rollout packet.",
    group: "Templates",
  },
  {
    value: "export-bundle",
    label: "Prepare export bundle",
    description: "Generate the command for packaging the response attachments.",
    group: "Actions",
  },
];

export function AIAssistantWorkspaceExample() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <SectionPanel title="Prompt lane" subtitle="CommandInput paired with reusable response rendering">
        <div className="space-y-md">
          <div className="flex flex-wrap items-center gap-sm">
            <Badge variant="softPrimary">Example</Badge>
            <Badge variant="outlineGray">Composition-first</Badge>
          </div>

          <Card variant="plain" className="rounded-2xl bg-surface-subtle">
            <CardContent className="space-y-sm p-lg">
              <p className="text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">Workspace context</p>
              <p className="text-sm text-foreground-muted">
                This combines the new response renderer with the existing prompt input rather than introducing a
                monolithic chat shell too early.
              </p>
            </CardContent>
          </Card>

          <CommandInput
            label="Assistant prompt"
            description="Draft the release handoff note and summarize the remaining canary blocker."
            helperText="ArrowUp opens prompt history at the start of an empty prompt. Ctrl/Cmd + Enter runs the command."
            defaultValue="Summarize the release status for REL-3104, include the rollback note wording, and attach the dashboard anomaly screenshot."
            history={promptHistory}
            slashCommands={slashCommands}
            submitLabel="Run assistant"
            actions={
              <Button size="sm" variant="ghost" leftIcon={<IconWand size={16} />}>
                Insert release template
              </Button>
            }
            onSubmit={async () => {
              await new Promise((resolve) => setTimeout(resolve, 700));
            }}
          />
        </div>
      </SectionPanel>

      <SectionPanel title="Assistant lane" subtitle="Markdown, tool calls, and attachments in one render-only surface">
        <AIResponseView
          status="complete"
          content={responseContent}
          thought={{
            summary: "Cross-checking the canary reviewer note",
            content:
              "Pulled the current reviewer note, compared it with the release queue, and extracted the single remaining blocker for the handoff.",
          }}
          toolCalls={[
            {
              id: "fetch-release",
              name: "fetchRelease",
              status: "success",
              summary: "Loaded release metadata and approval owner details.",
              input: `{"releaseId":"REL-3104"}`,
              output: `{"environment":"Production","reviewer":"Jamie Rivera","status":"active"}`,
              language: "json",
            },
            {
              id: "fetch-reviewer-note",
              name: "fetchReviewerNote",
              status: "success",
              summary: "Returned the note that explains the remaining rollback requirement.",
              input: `{"releaseId":"REL-3104","noteType":"rollback"}`,
              output: `{"note":"Revert to REL-3106 if command palette navigation regresses."}`,
              language: "json",
            },
          ]}
          attachments={[
            {
              id: "attachment-image",
              kind: "image",
              title: "Dashboard anomaly preview",
              src: attachmentPreview,
              description: "Shared as part of the approval packet so reviewers can see the pre-rollback signal.",
              meta: "PNG · 640x360",
            },
            {
              id: "attachment-file",
              kind: "file",
              title: "handoff-note.md",
              src: "/exports/handoff-note.md",
              description: "Exported markdown ready to attach to the rollout ticket.",
              meta: "Markdown · 4 KB",
            },
          ]}
        />

        <div className="mt-md flex flex-wrap items-center gap-sm text-xs text-foreground-muted">
          <Badge variant="softSuccess" size="sm">
            <IconSparkles size={12} />
            AIResponseView
          </Badge>
          <Badge variant="soft" size="sm">
            <IconRobot size={12} />
            CommandInput
          </Badge>
          <span>Transport-agnostic composition for assistant workflows.</span>
        </div>
      </SectionPanel>
    </div>
  );
}
