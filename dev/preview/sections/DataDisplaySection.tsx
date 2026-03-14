import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  IconActivity,
  IconCheck,
  IconClockHour4,
  IconCurrencyDollar,
  IconRefresh,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { AIAssistantWorkspaceExample } from "../../../src/internal/examples/aiAssistantWorkspace";
import { AIChatWorkspaceExample } from "../../../src/internal/examples/aiChatWorkspace";
import { LogViewerWorkspaceExample } from "../../../src/internal/examples/logViewerWorkspace";
import {
  AIResponseView,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  ChatBubble,
  Chip,
  CodeBlock,
  CommandBar,
  DataTable,
  Divider,
  HealthBar,
  Image,
  KeyValue,
  MarkdownRenderer,
  MetricCard,
  SectionPanel,
  Sparkline,
  StatusBadge,
  Table,
  Timeline,
  Toolbar,
  ToolbarGroup,
  ToolbarSpacer,
  useToast,
} from "../../../src/index";
import type { TableColumn } from "../../../src/index";

type BasicTableRow = {
  id: string;
  name: string;
  email: string;
};

type Payment = {
  id: string;
  amount: number;
  status:
    | "active"
    | "success"
    | "pending"
    | "error"
    | "failed"
    | "archived"
    | "warning"
    | "inactive";
  email: string;
};

const basicTableRows: BasicTableRow[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
];

const basicTableColumns: TableColumn<BasicTableRow>[] = [
  { accessor: "id", header: "ID" },
  { accessor: "name", header: "Name" },
  { accessor: "email", header: "Email" },
];

const advancedTableData: Payment[] = [
  { id: "m5gr84i9", amount: 316, status: "active", email: "ken99@yahoo.com" },
  { id: "3u1reuv4", amount: 242, status: "pending", email: "Abe45@gmail.com" },
  {
    id: "derv1ws0",
    amount: 837,
    status: "inactive",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "error",
    email: "carmella@hotmail.com",
  },
  {
    id: "bhqecj4q",
    amount: 129,
    status: "warning",
    email: "jordan@example.com",
  },
  {
    id: "bhqecj4r",
    amount: 999,
    status: "archived",
    email: "alex@example.com",
  },
  {
    id: "bhqecj4s",
    amount: 50,
    status: "failed",
    email: "taylor@example.com",
  },
  {
    id: "bhqecj4t",
    amount: 450,
    status: "success",
    email: "kris@example.com",
  },
  {
    id: "bhqecj4u",
    amount: 300,
    status: "inactive",
    email: "sam@example.com",
  },
  {
    id: "bhqecj4v",
    amount: 820,
    status: "pending",
    email: "morgan@example.com",
  },
  {
    id: "bhqecj4w",
    amount: 150,
    status: "success",
    email: "riley@example.com",
  },
];

const sparklineData = [12, 18, 14, 22, 20, 30, 26, 38, 34, 44, 40, 50];

const timelineItems = [
  {
    title: "Deployment queued",
    description: "Release 2026.03.11 entered the deployment pipeline.",
    timestamp: "09:12",
    status: "info" as const,
    icon: <IconClockHour4 size={16} />,
  },
  {
    title: "Schema migration complete",
    description: "All regions applied the latest migration successfully.",
    timestamp: "09:18",
    status: "success" as const,
    icon: <IconCheck size={16} />,
    content: "Processed 4 clusters with zero rollback events.",
  },
  {
    title: "Traffic shifted",
    description: "Production traffic is now served by the new build.",
    timestamp: "09:24",
    status: "default" as const,
    icon: <IconActivity size={16} />,
  },
  {
    title: "Workspace settings updated",
    description: "The active environment and notifications were updated.",
    timestamp: "09:30",
    status: "warning" as const,
    icon: <IconSettings size={16} />,
  },
] as const;

const codeBlockExample = `import { Button, Card } from "vt-design-system";

export function ClusterCard() {
  return (
    <Card className="p-lg">
      <Button variant="secondary">Inspect node</Button>
    </Card>
  );
}`;

const imageLandscapePreview =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='960' height='540' viewBox='0 0 960 540'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23dbeafe'/%3E%3Cstop offset='1' stop-color='%2393c5fd'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='960' height='540' rx='40' fill='url(%23g)'/%3E%3Ccircle cx='208' cy='172' r='72' fill='%23ffffff' fill-opacity='.78'/%3E%3Cpath d='M128 400l136-132 120 92 180-204 268 244H128z' fill='%23ffffff' fill-opacity='.9'/%3E%3C/svg%3E";

const imageTallPreview =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='540' height='720' viewBox='0 0 540 720'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23dcfce7'/%3E%3Cstop offset='1' stop-color='%2386efac'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='720' rx='36' fill='url(%23g)'/%3E%3Crect x='84' y='96' width='372' height='60' rx='18' fill='%23052e16' fill-opacity='.1'/%3E%3Crect x='84' y='196' width='372' height='364' rx='28' fill='%23ffffff' fill-opacity='.82'/%3E%3Crect x='124' y='596' width='292' height='34' rx='17' fill='%23052e16' fill-opacity='.14'/%3E%3C/svg%3E";

const markdownOverviewImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='320' viewBox='0 0 640 320'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23dbeafe'/%3E%3Cstop offset='1' stop-color='%23bfdbfe'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='320' rx='28' fill='url(%23g)'/%3E%3Crect x='48' y='60' width='220' height='24' rx='12' fill='%231e3a8a' fill-opacity='.12'/%3E%3Crect x='48' y='102' width='544' height='14' rx='7' fill='%231e3a8a' fill-opacity='.12'/%3E%3Crect x='48' y='132' width='468' height='14' rx='7' fill='%231e3a8a' fill-opacity='.12'/%3E%3Crect x='48' y='186' width='152' height='92' rx='20' fill='%23ffffff' fill-opacity='.74'/%3E%3Crect x='224' y='168' width='160' height='110' rx='20' fill='%23ffffff' fill-opacity='.84'/%3E%3Crect x='408' y='144' width='176' height='134' rx='20' fill='%23ffffff' fill-opacity='.94'/%3E%3C/svg%3E";

const richMarkdownExample = `# Incident Briefing

Keep the response surface readable when the model mixes prose, data, and snippets.

> Render markdown as a real product surface instead of leaving each consuming app to restyle it.

## What shipped

- Shared paragraph, heading, and blockquote styling
- GFM tables and fenced code blocks
- Responsive inline images and normal anchor behavior

### Suggested follow-up

1. Wire the renderer into streaming response components
2. Reuse it in release notes and docs previews
3. Keep raw HTML disabled in v1

Use [CommandInput](?path=/docs/components-forms-commandinput--docs) to pair prompt composition with response rendering.

![Status overview](${markdownOverviewImage})
`;

const tabularMarkdownExample = `## Release Notes

| Area | Status | Notes |
| --- | --- | --- |
| Renderer | Complete | Shared styles now live in one place |
| Tool calls | In progress | Will render through AIResponseView |
| Rich media | Planned | Audio rows stay lightweight in v1 |

\`\`\`tsx
import { MarkdownRenderer } from "vt-design-system";

export function ReleaseSummary() {
  return <MarkdownRenderer content={markdown} codeTheme="dark" />;
}
\`\`\`
`;

const chatBubbleAssistantMarkdown = `## Release recommendation

The rollout can continue if the rollback note is attached before approval.

- Staging is healthy
- Reviewer note is available
- One attachment still needs to be linked
`;

const aiResponseCompletedContent = `## Release note draft

The canary is safe to continue. The remaining blocker is a missing rollback note for the command suite rollout.

- Approval packet is otherwise complete
- QA coverage looks stable in staging
- Reviewer asked for a more explicit recovery path

\`\`\`md
Rollback note: revert command-suite-rollout to release REL-3106 if error rate exceeds 2%.
\`\`\`
`;

const aiResponseStreamingContent = `## Draft in progress

The deployment summary is being updated with the latest approvals.

- Added release owner and environment context
- Pulling the newest reviewer notes
- `;

export function DataDisplaySection() {
  const { toast } = useToast();

  const dataTableColumns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              id="select-all"
              label=""
              checked={table.getIsAllPageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              id={`select-${row.id}`}
              label=""
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => (
          <StatusBadge status={info.getValue() as Payment["status"]} />
        ),
      },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: (info) => {
          const amount = Number(info.getValue());
          return (
            <div className="text-right font-medium">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(amount)}
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Data Display</h2>
        <p className="mt-2 text-sm text-foreground-muted">
          Metrics, media, markdown, AI response surfaces, and tabular data
          patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionPanel
          title="Metric Cards"
          subtitle="Dashboard summaries and trend snapshots"
          className="xl:col-span-2"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Total Users"
              value="1,234"
              trendValue="+12%"
              trendDirection="up"
              trendType="success"
              icon={<IconUsers size={24} />}
              chart={
                <Sparkline data={sparklineData} color="#4ade80" height={32} />
              }
            />
            <MetricCard
              title="Revenue"
              value="$45,678"
              trendValue="-2.4%"
              trendDirection="down"
              trendType="error"
              icon={<IconCurrencyDollar size={24} />}
              chart={
                <Sparkline
                  data={[50, 44, 40, 34, 38, 30, 26, 20, 22, 14, 18, 12]}
                  color="#f87171"
                  height={32}
                />
              }
            />
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>
                  Friendlier chrome out of the box with a little more depth and
                  presence.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground-muted">
                  Standard card content for quiet summaries, metadata, and small
                  supporting details.
                </p>
              </CardContent>
            </Card>
            <Card variant="plain" className="h-full">
              <CardHeader>
                <CardTitle>Plain Card</CardTitle>
                <CardDescription>
                  Use this when you want the same API with a calmer,
                  stripped-back surface.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground-muted">
                  Helpful when the surrounding layout already provides the main
                  visual hierarchy.
                </p>
              </CardContent>
            </Card>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Badges & Status"
          subtitle="Compact labels and semantic state"
        >
          <div className="space-y-md">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Default</Badge>
              <Badge variant="softPrimary">Soft Primary</Badge>
              <Badge variant="softSuccess" dot>
                With Dot
              </Badge>
              <Badge variant="outlineSuccess">Outline Success</Badge>
              <Badge variant="outlineWarning">Outline Warning</Badge>
              <Badge variant="outlineError">Outline Error</Badge>
              <Badge variant="outlineGray">Outline Gray</Badge>
            </div>
            <Divider />
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="active" />
              <StatusBadge status="pending" />
              <StatusBadge status="error" />
              <StatusBadge status="warning" />
              <StatusBadge status="archived" />
              <StatusBadge status="inactive" />
              <StatusBadge status="active" label="Online" />
              <StatusBadge status="error" label="Critical" />
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Avatar & Chip"
          subtitle="Identity and compact interaction patterns"
        >
          <div className="space-y-md">
            <div className="flex flex-wrap items-end gap-4">
              <Avatar size="xs" fallbackText="Extra Small" />
              <Avatar size="sm" fallbackText="Small User" />
              <Avatar size="default" src="https://i.pravatar.cc/150?u=1" />
              <Avatar size="lg" initials="VT" />
              <Avatar size="xl" />
            </div>
            <Divider />
            <div className="flex flex-wrap items-center gap-2">
              <Chip>Read Only</Chip>
              <Chip
                variant="primary"
                onClick={() =>
                  toast({
                    title: "Chip action",
                    description:
                      "The interactive chip was selected successfully.",
                    type: "info",
                  })
                }
              >
                Interactive
              </Chip>
              <Chip
                variant="outline"
                onRemove={() =>
                  toast({
                    title: "Chip removed",
                    description: "The removable chip action fired as expected.",
                    type: "success",
                  })
                }
              >
                Removable
              </Chip>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Image"
          subtitle="Shared framing, aspect ratios, and fallback handling"
        >
          <div className="space-y-md">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-sm">
                <p className="text-sm font-semibold text-foreground">Default</p>
                <Image
                  src={imageLandscapePreview}
                  alt="Design system preview asset"
                  fit="cover"
                  rounded="xl"
                  framed
                  className="w-full"
                />
              </div>

              <div className="space-y-sm">
                <p className="text-sm font-semibold text-foreground">
                  Video Contain
                </p>
                <Image
                  src={imageTallPreview}
                  alt="Tall preview rendered inside a video frame"
                  fit="contain"
                  rounded="xl"
                  framed
                  aspectRatio="video"
                  className="w-full"
                />
              </div>
            </div>

            <Divider />

            <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
              <div className="space-y-sm">
                <p className="text-sm font-semibold text-foreground">
                  Fallback State
                </p>
                <Image
                  src={undefined}
                  alt="Fallback preview"
                  aspectRatio="square"
                  rounded="full"
                  className="w-28"
                  fallback={
                    <span className="flex h-full w-full items-center justify-center bg-primary/10 text-sm font-semibold text-primary">
                      VT
                    </span>
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-sm">
                  <div className="flex items-center gap-sm">
                    <Badge variant="softPrimary">Cover</Badge>
                    <span className="text-sm text-foreground-muted">
                      Full-bleed media framing.
                    </span>
                  </div>
                  <Image
                    src={imageLandscapePreview}
                    alt="Landscape preview"
                    fit="cover"
                    rounded="xl"
                    framed
                    aspectRatio="16/10"
                    className="w-full"
                  />
                </div>

                <div className="space-y-sm">
                  <div className="flex items-center gap-sm">
                    <Badge variant="outlineGray">Contain</Badge>
                    <span className="text-sm text-foreground-muted">
                      Keeps the full asset visible.
                    </span>
                  </div>
                  <Image
                    src={imageTallPreview}
                    alt="Tall preview"
                    fit="contain"
                    rounded="xl"
                    framed
                    aspectRatio="16/10"
                    className="w-full bg-canvas"
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Sparkline"
          subtitle="Mini trend charts for cards and tables"
        >
          <div className="space-y-md">
            <div>
              <p className="mb-sm text-xs text-foreground-muted">
                Success trend
              </p>
              <Sparkline data={sparklineData} color="#4ade80" height={32} />
            </div>
            <Divider />
            <div>
              <p className="mb-sm text-xs text-foreground-muted">
                Warning trend
              </p>
              <Sparkline
                data={[8, 10, 7, 11, 8, 13, 9, 9, 12, 10, 14, 11]}
                color="#fbbf24"
                height={32}
              />
            </div>
            <Divider />
            <div>
              <p className="mb-sm text-xs text-foreground-muted">Error trend</p>
              <Sparkline
                data={sparklineData.slice().reverse()}
                color="#f87171"
                height={32}
              />
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="HealthBar"
          subtitle="Color-coded progress and service health"
        >
          <div className="space-y-md">
            {[
              { label: "NODE_ALPHA_001", value: 95 },
              { label: "NODE_BETA_002", value: 62 },
              { label: "NODE_GAMMA_003", value: 18 },
              { label: "NODE_DELTA_004", value: 82 },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-md"
              >
                <span className="flex-1 font-mono text-xs text-foreground-muted">
                  {label}
                </span>
                <HealthBar value={value} widthClass="w-24" />
                <span className="w-8 text-right text-xs text-foreground-subtle">
                  {value}%
                </span>
              </div>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="KeyValue" subtitle="Structured metadata pairs">
          <KeyValue
            items={[
              { label: "Node_ID", value: "NODE_ALPHA_001" },
              { label: "Cluster", value: "EU_West_01" },
              { label: "Status", value: <StatusBadge status="active" /> },
              { label: "Uptime", value: "14d 7h 32m" },
              { label: "Requests", value: "1,234,567" },
            ]}
          />
        </SectionPanel>

        <SectionPanel title="Timeline" subtitle="Activity and release history">
          <Timeline items={timelineItems} density="compact" />
        </SectionPanel>

        <SectionPanel
          title="Advanced DataTable"
          subtitle="Filtering, selection, and richer data grids"
          className="xl:col-span-2"
        >
          <div className="overflow-hidden">
            <DataTable
              columns={dataTableColumns}
              data={advancedTableData}
              pageSize={5}
              enableGlobalFilter
              enableRowSelection
              enableColumnPinning
              enableColumnResizing
              defaultColumnPinning={{ left: ["status"], right: ["amount"] }}
              showColumnBorders
              toolbar={(table) => (
                <Toolbar
                  size="sm"
                  tone="plain"
                  className="border border-default"
                >
                  <ToolbarGroup compact>
                    <Button
                      size="xs"
                      variant="secondary"
                      leftIcon={<IconRefresh size={14} />}
                    >
                      Refresh
                    </Button>
                    <Button
                      size="xs"
                      leftIcon={<IconSettings size={14} />}
                      onClick={() =>
                        toast({
                          title: "Table preferences updated",
                          description:
                            "Pinned columns and density can be tuned per workspace later.",
                          type: "info",
                        })
                      }
                    >
                      Configure
                    </Button>
                  </ToolbarGroup>
                  <ToolbarSpacer />
                  <ToolbarGroup
                    compact
                    className="text-[11px] text-foreground-muted"
                  >
                    <span>
                      {table.getFilteredSelectedRowModel().rows.length} selected
                    </span>
                  </ToolbarGroup>
                </Toolbar>
              )}
            />
          </div>
        </SectionPanel>

        <SectionPanel
          title="CodeBlock"
          subtitle="Syntax-highlighted snippets with copy support"
        >
          <CodeBlock
            title="ClusterCard.tsx"
            language="tsx"
            code={codeBlockExample}
            showLineNumbers
            highlightLines={[5]}
            copyable
          />
        </SectionPanel>

        <SectionPanel
          title="MarkdownRenderer"
          subtitle="Shared markdown presentation for richer content surfaces"
          className="xl:col-span-2"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-sm rounded-2xl border border-default bg-surface p-lg">
              <p className="text-sm font-semibold text-foreground">Default</p>
              <MarkdownRenderer content={richMarkdownExample} />
            </div>

            <div className="space-y-sm rounded-2xl border border-default bg-surface p-lg">
              <p className="text-sm font-semibold text-foreground">
                Tables And Code Fences
              </p>
              <MarkdownRenderer
                content={tabularMarkdownExample}
                density="compact"
                codeTheme="light"
              />
            </div>

            <div className="dark rounded-2xl bg-foreground p-lg lg:col-span-2">
              <div className="rounded-2xl border border-default bg-surface p-lg">
                <p className="mb-md text-sm font-semibold text-foreground">
                  Dark Theme Reference
                </p>
                <MarkdownRenderer
                  content={tabularMarkdownExample}
                  codeTheme="dark"
                />
              </div>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="AIResponseView"
          subtitle="Response states, tool calls, attachments, and failures"
          className="xl:col-span-2"
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="space-y-sm rounded-2xl border border-default bg-surface p-lg">
              <p className="text-sm font-semibold text-foreground">
                Plain Completed Response
              </p>
              <AIResponseView
                status="complete"
                content={aiResponseCompletedContent}
                density="default"
                showThought
                showToolCalls
              />
            </div>

            <div className="space-y-sm rounded-2xl border border-default bg-surface p-lg">
              <p className="text-sm font-semibold text-foreground">
                Streaming Response
              </p>
              <AIResponseView
                status="streaming"
                content={aiResponseStreamingContent}
                density="default"
                showThought
                showToolCalls
              />
            </div>

            <div className="space-y-sm rounded-2xl border border-default bg-surface p-lg">
              <p className="text-sm font-semibold text-foreground">
                Thinking With Tool Calls
              </p>
              <AIResponseView
                status="thinking"
                thought={{
                  summary: "Collecting the missing release context",
                  content:
                    "Comparing the selected release with the approval queue and pulling the reviewer note that explains the current blocker.",
                  defaultOpen: true,
                }}
                toolCalls={[
                  {
                    id: "fetch-release",
                    name: "fetchRelease",
                    status: "success",
                    summary:
                      "Loaded metadata for REL-3104 from the release queue.",
                    input: `{"releaseId":"REL-3104"}`,
                    output:
                      '{"release":"navigation-treeview-1.2.0","environment":"Production","reviewer":"Jamie Rivera"}',
                    language: "json",
                    defaultOpen: true,
                  },
                  {
                    id: "fetch-reviewer-note",
                    name: "fetchReviewerNote",
                    status: "running",
                    summary:
                      "Looking up the latest reviewer guidance before drafting the note.",
                    input: `{"releaseId":"REL-3104","noteType":"rollback"}`,
                    language: "json",
                  },
                ]}
              />
            </div>

            <div className="space-y-sm rounded-2xl border border-default bg-surface p-lg">
              <p className="text-sm font-semibold text-foreground">
                Multimodal Attachments
              </p>
              <AIResponseView
                status="complete"
                content="## Investigation package\n\nThe assistant returned a screenshot, a recorded handoff, and a generated export for the incident timeline."
                attachments={[
                  {
                    id: "img-1",
                    kind: "image",
                    title: "Dashboard anomaly preview",
                    src: imageLandscapePreview,
                    description:
                      "Annotated screenshot captured before the rollback.",
                    meta: "PNG / 640x360",
                  },
                  {
                    id: "audio-1",
                    kind: "audio",
                    title: "Responder handoff",
                    src: "/audio/handoff.wav",
                    description:
                      "Short voice note summarizing the mitigation steps.",
                    meta: "WAV / 00:18",
                  },
                  {
                    id: "file-1",
                    kind: "file",
                    title: "Incident timeline export",
                    src: "/exports/incident-timeline.json",
                    description:
                      "Structured timeline for downstream tooling and auditing.",
                    meta: "JSON / 12 KB",
                  },
                ]}
              />
            </div>

            <div className="space-y-sm rounded-2xl border border-default bg-surface p-lg xl:col-span-2">
              <p className="text-sm font-semibold text-foreground">
                Error State
              </p>
              <AIResponseView
                status="error"
                content="## Partial output\n\nThe assistant started drafting the summary but the final handoff was interrupted."
                errorMessage="The workspace could not finish the response because the reviewer note service timed out."
                thought={{
                  summary: "Fallback path",
                  content:
                    "Retry only the note lookup step and preserve the already drafted markdown.",
                }}
                toolCalls={[
                  {
                    id: "reviewer-note",
                    name: "fetchReviewerNote",
                    status: "error",
                    summary:
                      "The upstream note service timed out after 10 seconds.",
                    input: `{"releaseId":"REL-3104","noteType":"rollback"}`,
                    output: `{"error":"timeout","retryable":true}`,
                    language: "json",
                    defaultOpen: true,
                  },
                ]}
              />
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="ChatBubble"
          subtitle="Conversation rows for user and assistant messages"
          className="xl:col-span-2"
        >
          <div className="space-y-md">
            <ChatBubble
              author="Ops Assistant"
              meta="09:42"
              avatar={<Avatar fallbackText="Ops Assistant" size="sm" />}
            >
              <MarkdownRenderer
                content={chatBubbleAssistantMarkdown}
                density="compact"
              />
            </ChatBubble>

            <ChatBubble
              align="end"
              tone="user"
              author="Jamie Rivera"
              meta="09:43"
              avatar={<Avatar fallbackText="Jamie Rivera" size="sm" />}
            >
              Attach the dashboard screenshot, keep the rollback sentence short,
              and mention that staging stayed stable during the last approval
              window.
            </ChatBubble>

            <ChatBubble
              author="Ops Assistant"
              meta="Live"
              status="streaming"
              avatar={<Avatar fallbackText="Ops Assistant" size="sm" />}
            >
              Drafting the handoff note now. Pulling the latest reviewer note
              and the anomaly screenshot metadata.
            </ChatBubble>

            <ChatBubble
              surface="plain"
              author="Ops Assistant"
              meta="09:44"
              status="complete"
              avatar={<Avatar fallbackText="Ops Assistant" size="sm" />}
            >
              <AIResponseView
                status="complete"
                content={chatBubbleAssistantMarkdown}
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
          </div>
        </SectionPanel>

        <div className="space-y-md xl:col-span-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              AI Assistant Composition
            </h3>
            <p className="mt-xs text-sm text-foreground-muted">
              A realistic preview that combines the new response renderer with
              the existing prompt input instead of introducing a monolithic chat
              component too early.
            </p>
          </div>
          <AIAssistantWorkspaceExample />
        </div>

        <div className="space-y-md xl:col-span-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              AI Chat Composition
            </h3>
            <p className="mt-xs text-sm text-foreground-muted">
              A conversation-first workspace built from ChatBubble,
              CommandInput, AIResponseView, and ScrollArea rather than a
              monolithic public AI chat component.
            </p>
          </div>
          <AIChatWorkspaceExample />
        </div>

        <div className="space-y-md xl:col-span-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Log Viewer Composition
            </h3>
            <p className="mt-xs text-sm text-foreground-muted">
              A viewer-first operational logging surface that keeps search,
              filters, expansion, and virtualization local to the component
              without bundling a logger or worker architecture into the design
              system.
            </p>
          </div>
          <LogViewerWorkspaceExample />
        </div>

        <SectionPanel
          title="Basic Table"
          subtitle="Lightweight tabular layout without advanced controls"
          className="xl:col-span-2"
        >
          <div className="overflow-x-auto">
            <Table
              columns={basicTableColumns}
              data={basicTableRows}
              keyExtractor={(row) => row.id}
            />
          </div>
        </SectionPanel>
      </div>
    </section>
  );
}
