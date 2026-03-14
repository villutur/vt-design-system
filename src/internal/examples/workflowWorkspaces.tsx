import React from "react";
import {
  createColumnHelper,
  type ColumnDef,
  type Table as TanStackTable,
} from "@tanstack/react-table";
import {
  IconAlertTriangle,
  IconArrowUpRight,
  IconBolt,
  IconBroadcast,
  IconColumns3,
  IconCommand,
  IconDownload,
  IconFileCode,
  IconFilter,
  IconGitBranch,
  IconLifebuoy,
  IconRefresh,
  IconRobot,
  IconRouteAltLeft,
  IconSearch,
  IconServer,
  IconSettings,
  IconShieldCheck,
  IconWand,
} from "@tabler/icons-react";
import {
  AppShell,
  Badge,
  Banner,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CommandBar,
  CommandInput,
  CommandPalette,
  type CommandPaletteSection,
  DataTable,
  EmptyState,
  Header,
  Input,
  SectionPanel,
  Sidebar,
  SidebarItem,
  SidebarSectionBase,
  SidebarSystemHealth,
  SplitButton,
  StatusBadge,
  Toolbar,
  ToolbarGroup,
  ToolbarSpacer,
  TreeView,
  type TreeViewItem,
} from "../../index";
import {
  branchFirstTreeComparator,
  createAsyncExplorerItems,
  createAsyncTreeChildLoader,
  createFileTreeItems,
  renderAsyncExplorerNode,
  renderFileTreeNode,
} from "../../components/Navigation/treeView.examples";

type ReleaseRow = {
  id: string;
  release: string;
  environment: string;
  owner: string;
  approval: string;
  status: "active" | "pending" | "warning" | "error";
  updatedAt: string;
};

type IncidentRow = {
  id: string;
  service: string;
  severity: "Critical" | "High" | "Medium";
  region: string;
  owner: string;
  status: "active" | "pending" | "warning" | "error";
  startedAt: string;
};

const releaseColumnHelper = createColumnHelper<ReleaseRow>();
const incidentColumnHelper = createColumnHelper<IncidentRow>();

const releaseColumns: ColumnDef<ReleaseRow, any>[] = [
  releaseColumnHelper.accessor("release", {
    header: "Release",
    cell: (info) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">
          {info.getValue()}
        </div>
        <div className="truncate text-xs text-foreground-muted">
          {info.row.original.id}
        </div>
      </div>
    ),
    size: 220,
  }),
  releaseColumnHelper.accessor("environment", {
    header: "Environment",
    cell: (info) => info.getValue(),
    size: 140,
  }),
  releaseColumnHelper.accessor("owner", {
    header: "Owner",
    cell: (info) => info.getValue(),
    size: 160,
  }),
  releaseColumnHelper.accessor("approval", {
    header: "Approval",
    cell: (info) => info.getValue(),
    size: 170,
  }),
  releaseColumnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
    size: 120,
  }),
  releaseColumnHelper.accessor("updatedAt", {
    header: "Updated",
    cell: (info) => info.getValue(),
    size: 130,
  }),
];

const incidentColumns: ColumnDef<IncidentRow, any>[] = [
  incidentColumnHelper.accessor("service", {
    header: "Service",
    cell: (info) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">
          {info.getValue()}
        </div>
        <div className="truncate text-xs text-foreground-muted">
          {info.row.original.id}
        </div>
      </div>
    ),
    size: 220,
  }),
  incidentColumnHelper.accessor("severity", {
    header: "Severity",
    cell: (info) => (
      <Badge
        size="sm"
        variant={
          info.getValue() === "Critical"
            ? "softError"
            : info.getValue() === "High"
              ? "softWarning"
              : "softPrimary"
        }
      >
        {info.getValue()}
      </Badge>
    ),
    size: 120,
  }),
  incidentColumnHelper.accessor("region", {
    header: "Region",
    cell: (info) => info.getValue(),
    size: 120,
  }),
  incidentColumnHelper.accessor("owner", {
    header: "Responder",
    cell: (info) => info.getValue(),
    size: 150,
  }),
  incidentColumnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
    size: 120,
  }),
  incidentColumnHelper.accessor("startedAt", {
    header: "Started",
    cell: (info) => info.getValue(),
    size: 120,
  }),
];

const releaseRows: ReleaseRow[] = [
  {
    id: "REL-3104",
    release: "navigation-treeview-1.2.0",
    environment: "Production",
    owner: "Alex Morgan",
    approval: "Ready for canary",
    status: "active",
    updatedAt: "09:42",
  },
  {
    id: "REL-3105",
    release: "datatable-grid-followups",
    environment: "Staging",
    owner: "Jamie Rivera",
    approval: "Awaiting QA",
    status: "pending",
    updatedAt: "09:18",
  },
  {
    id: "REL-3106",
    release: "toolbar-layout-refresh",
    environment: "Preview",
    owner: "Sam Patel",
    approval: "Blocked by snapshot",
    status: "warning",
    updatedAt: "08:56",
  },
  {
    id: "REL-3107",
    release: "command-suite-rollout",
    environment: "Production",
    owner: "Riley Turner",
    approval: "Needs rollback note",
    status: "error",
    updatedAt: "08:31",
  },
  {
    id: "REL-3108",
    release: "field-pattern-pass",
    environment: "Staging",
    owner: "Morgan Lee",
    approval: "Approved",
    status: "active",
    updatedAt: "08:12",
  },
  {
    id: "REL-3109",
    release: "overlay-docs-cleanup",
    environment: "Preview",
    owner: "Taylor Ross",
    approval: "Review queued",
    status: "pending",
    updatedAt: "07:48",
  },
];

const incidentRows: IncidentRow[] = [
  {
    id: "INC-904",
    service: "auth-service",
    severity: "Critical",
    region: "eu-north-1",
    owner: "Riley Turner",
    status: "error",
    startedAt: "09:14",
  },
  {
    id: "INC-905",
    service: "api-gateway",
    severity: "High",
    region: "us-east-2",
    owner: "Alex Morgan",
    status: "warning",
    startedAt: "09:22",
  },
  {
    id: "INC-906",
    service: "worker-scheduler",
    severity: "Medium",
    region: "eu-west-1",
    owner: "Sam Patel",
    status: "pending",
    startedAt: "09:29",
  },
  {
    id: "INC-907",
    service: "release-webhooks",
    severity: "High",
    region: "ap-southeast-1",
    owner: "Jamie Rivera",
    status: "active",
    startedAt: "09:33",
  },
  {
    id: "INC-908",
    service: "metrics-pipeline",
    severity: "Medium",
    region: "eu-central-1",
    owner: "Morgan Lee",
    status: "pending",
    startedAt: "09:36",
  },
];

const incidentPaletteSections: CommandPaletteSection[] = [
  {
    title: "Navigation",
    items: [
      {
        value: "open-incident-board",
        label: "Open incident board",
        description: "Jump to the active triage queue and responder notes.",
        shortcut: "G I",
        icon: <IconBroadcast size={16} />,
        group: "Navigation",
      },
      {
        value: "open-service-map",
        label: "Open affected service tree",
        description: "Focus the lazy-loaded service explorer on the left.",
        shortcut: "G S",
        icon: <IconServer size={16} />,
        group: "Navigation",
      },
    ],
  },
  {
    title: "Actions",
    items: [
      {
        value: "restart-auth-service",
        label: "Restart auth-service",
        description: "Queue a controlled rolling restart in eu-north-1.",
        shortcut: "R R",
        icon: <IconBolt size={16} />,
        group: "Actions",
      },
      {
        value: "open-remediation-template",
        label: "Insert remediation template",
        description: "Prefill a command draft for the mitigation bot.",
        shortcut: "R T",
        icon: <IconWand size={16} />,
        group: "Actions",
      },
    ],
  },
];

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function createDocsTreeItems(): TreeViewItem[] {
  return [
    {
      id: "docs-foundations",
      name: "Foundations",
      description: "Public handbook pages",
      defaultExpanded: true,
      data: { kind: "folder" },
      children: [
        {
          id: "docs-foundations-patterns",
          name: "ComponentPatterns.mdx",
          description: "Technical patterns for consumers",
          droppable: false,
          data: { kind: "file", extension: "mdx" },
        },
        {
          id: "docs-foundations-tokens",
          name: "DesignTokens.stories.tsx",
          description: "Theme tokens and mappings",
          droppable: false,
          data: { kind: "file", extension: "tsx" },
        },
      ],
    },
    {
      id: "docs-examples",
      name: "Examples",
      description: "Realistic workflows and composed pages",
      defaultExpanded: true,
      data: { kind: "folder" },
      children: [
        {
          id: "docs-examples-layouts",
          name: "PageLayouts.stories.tsx",
          description: "Existing shell and dashboard examples",
          droppable: false,
          data: { kind: "file", extension: "tsx" },
        },
        {
          id: "docs-examples-workspaces",
          name: "WorkflowWorkspaces.stories.tsx",
          description: "Release and incident workspaces",
          droppable: false,
          data: { kind: "file", extension: "tsx" },
        },
      ],
    },
    {
      id: "docs-technical",
      name: "technical",
      description: "Internal handbooks and ADRs",
      defaultExpanded: true,
      data: { kind: "folder" },
      children: [
        {
          id: "docs-technical-patterns",
          name: "component-patterns.md",
          description: "Canonical implementation guidance",
          droppable: false,
          data: { kind: "file", extension: "md" },
        },
        {
          id: "docs-technical-research",
          name: "research",
          description: "Open architecture questions",
          data: { kind: "folder" },
          children: [
            {
              id: "docs-technical-research-boundaries",
              name: "package-boundaries-and-repo-topology.md",
              description: "Package boundaries and monorepo questions",
              droppable: false,
              data: { kind: "file", extension: "md" },
            },
          ],
        },
      ],
    },
  ];
}

function WorkspaceShell({
  activeArea,
  healthLabel,
  healthStatus,
  healthPercentage,
  children,
}: {
  activeArea: "release" | "incident" | "docs";
  healthLabel: string;
  healthStatus: string;
  healthPercentage: number;
  children: React.ReactNode;
}) {
  return (
    <AppShell
      contentContainerClassName="max-w-none space-y-8"
      header={
        <Header
          logoName="Northstar Control"
          userName="Morgan Lee"
          userRole="Design System Lead"
          hasUnreadNotifications
        />
      }
      sidebar={
        <Sidebar
          footer={
            <SidebarSystemHealth
              percentage={healthPercentage}
              label={healthLabel}
              status={healthStatus}
            />
          }
        >
          <SidebarItem
            href="#"
            icon={<IconBroadcast size={18} />}
            label="Overview"
            isActive={activeArea === "release"}
          />
          <SidebarItem
            href="#"
            icon={<IconServer size={18} />}
            label="Incidents"
            isActive={activeArea === "incident"}
          />
          <SidebarItem
            href="#"
            icon={<IconFileCode size={18} />}
            label="Documentation"
            isActive={activeArea === "docs"}
          />
          <SidebarSectionBase title="Workspace" />
          <SidebarItem
            href="#"
            icon={<IconGitBranch size={18} />}
            label="Releases"
          />
          <SidebarItem
            href="#"
            icon={<IconShieldCheck size={18} />}
            label="Policies"
          />
          <SidebarItem
            href="#"
            icon={<IconSettings size={18} />}
            label="Settings"
          />
        </Sidebar>
      }
    >
      {children}
    </AppShell>
  );
}

function StatCard({
  eyebrow,
  title,
  value,
  supporting,
}: {
  eyebrow: React.ReactNode;
  title: string;
  value: string;
  supporting: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-sm">
        <div className="flex items-center justify-between gap-sm">
          <Badge variant="softPrimary">{eyebrow}</Badge>
          <IconArrowUpRight size={16} className="text-foreground-subtle" />
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-sm text-sm text-foreground-muted">{supporting}</p>
      </CardContent>
    </Card>
  );
}

function ReleaseTableToolbar({ table }: { table: TanStackTable<ReleaseRow> }) {
  return (
    <Toolbar
      size="sm"
      tone="plain"
      className="border border-default bg-surface"
    >
      <ToolbarGroup compact>
        <Button
          size="xs"
          variant="secondary"
          leftIcon={<IconFilter size={14} />}
        >
          Filters
        </Button>
        <Button
          size="xs"
          variant="secondary"
          leftIcon={<IconColumns3 size={14} />}
        >
          Columns
        </Button>
      </ToolbarGroup>
      <ToolbarSpacer />
      <ToolbarGroup compact className="text-[11px] text-foreground-muted">
        <span>{table.getFilteredSelectedRowModel().rows.length} selected</span>
      </ToolbarGroup>
    </Toolbar>
  );
}

function IncidentTableToolbar({
  table,
}: {
  table: TanStackTable<IncidentRow>;
}) {
  return (
    <Toolbar
      size="sm"
      tone="plain"
      className="border border-default bg-surface"
    >
      <ToolbarGroup compact>
        <Button
          size="xs"
          variant="secondary"
          leftIcon={<IconRefresh size={14} />}
        >
          Refresh view
        </Button>
        <Button
          size="xs"
          variant="secondary"
          leftIcon={<IconRouteAltLeft size={14} />}
        >
          Group by region
        </Button>
      </ToolbarGroup>
      <ToolbarSpacer />
      <ToolbarGroup compact className="text-[11px] text-foreground-muted">
        <span>{table.getRowModel().rows.length} active records</span>
      </ToolbarGroup>
    </Toolbar>
  );
}

export function ReleaseControlWorkspaceShowcase() {
  const repositoryItems = React.useMemo(() => createFileTreeItems(), []);

  return (
    <WorkspaceShell
      activeArea="release"
      healthLabel="Release readiness"
      healthStatus="Canary path healthy across three environments"
      healthPercentage={96}
    >
      <div className="space-y-8">
        <CommandBar
          title="Release control workspace"
          subtitle="Production lane // Thursday deploy window // refreshed 2 minutes ago"
          actions={
            <>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<IconRefresh size={16} />}
              >
                Refresh snapshot
              </Button>
              <SplitButton
                size="sm"
                leftIcon={<IconGitBranch size={16} />}
                actions={[
                  {
                    label: "Schedule canary rollout",
                    description: "Start with 5% traffic in production.",
                    icon: <IconBroadcast size={14} />,
                  },
                  {
                    label: "Create approval packet",
                    description: "Bundle notes for reviewers and QA.",
                    icon: <IconDownload size={14} />,
                  },
                  {
                    label: "Hold current release",
                    description: "Pause until blockers are resolved.",
                    icon: <IconAlertTriangle size={14} />,
                    separatorBefore: true,
                  },
                ]}
              >
                Promote build
              </SplitButton>
            </>
          }
        />

        <Banner
          type="warning"
          title="One production rollout still needs a manual approval note."
          description="This page demonstrates how TreeView, Toolbar, DataTable, SplitButton, and CommandInput can work as one realistic release workflow instead of isolated component demos."
          actions={
            <Button size="sm" variant="secondary">
              Review blockers
            </Button>
          }
        />

        <Toolbar tone="surface">
          <ToolbarGroup className="min-w-[18rem] flex-1">
            <Input
              aria-label="Search release workspace"
              placeholder="Search releases, owners, or environments..."
              className="w-full"
            />
          </ToolbarGroup>
          <ToolbarGroup compact>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<IconFilter size={16} />}
            >
              Filters
            </Button>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<IconDownload size={16} />}
            >
              Export snapshot
            </Button>
          </ToolbarGroup>
          <ToolbarSpacer />
          <ToolbarGroup compact className="text-xs text-foreground-muted">
            <span>3 environments</span>
            <span>6 queued releases</span>
          </ToolbarGroup>
        </Toolbar>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            eyebrow="Queue"
            title="Active release lanes"
            value="6"
            supporting="Three are already staged for production canary."
          />
          <StatCard
            eyebrow="Review"
            title="Manual approvals"
            value="2"
            supporting="Only one note still blocks a production promotion."
          />
          <StatCard
            eyebrow="Coverage"
            title="Healthy checks"
            value="42 / 46"
            supporting="Cross-region smoke tests remain green."
          />
          <StatCard
            eyebrow="Drift"
            title="Config mismatches"
            value="3"
            supporting="Most drift is isolated to preview-only environments."
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <div className="space-y-md">
            <div className="flex items-center justify-between gap-md">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                  Repository map
                </p>
                <p className="mt-xs text-sm text-foreground-muted">
                  TreeView used as a file explorer for the release bundle.
                </p>
              </div>
              <Badge variant="outlineGray">TreeView</Badge>
            </div>
            <TreeView
              searchable
              multiSelect
              defaultItems={repositoryItems}
              renderNode={renderFileTreeNode}
              sortComparator={branchFirstTreeComparator}
            />
          </div>

          <div className="space-y-md">
            <div className="flex items-center justify-between gap-md">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                  Deployment queue
                </p>
                <p className="mt-xs text-sm text-foreground-muted">
                  DataTable with row selection, pinning, resizing, and a
                  Toolbar-based action strip.
                </p>
              </div>
              <Badge variant="outlineGray">DataTable</Badge>
            </div>
            <DataTable
              columns={releaseColumns}
              data={releaseRows}
              enablePagination
              pageSize={5}
              enableRowSelection
              enableGlobalFilter
              enableColumnPinning
              enableColumnResizing
              defaultColumnPinning={{ left: ["release"], right: ["updatedAt"] }}
              stickyHeader
              showColumnBorders
              toolbar={(table) => <ReleaseTableToolbar table={table} />}
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <SectionPanel
            title="Automation command"
            subtitle="CommandInput in a realistic release workflow"
          >
            <CommandInput
              label="Release assistant prompt"
              description="Use a multiline command surface for rollout notes, approval packets, or deployment bot instructions."
              helperText="Ctrl/Cmd + Enter runs the command."
              defaultValue="Draft a canary rollout note for navigation-treeview-1.2.0 and highlight the remaining approval blocker."
              submitLabel="Run command"
              actions={
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<IconRobot size={16} />}
                >
                  Insert template
                </Button>
              }
              onSubmit={async () => {
                await wait(900);
              }}
            />
          </SectionPanel>

          <SectionPanel
            title="Approval summary"
            subtitle="Complementary supporting surface"
          >
            <div className="space-y-md">
              <Card variant="plain" className="rounded-2xl bg-surface-subtle">
                <CardContent className="p-lg">
                  <div className="flex items-center justify-between gap-md">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Production canary path is almost ready
                      </p>
                      <p className="mt-xs text-sm text-foreground-muted">
                        The remaining blocker is a missing rollback note for the
                        command suite rollout.
                      </p>
                    </div>
                    <StatusBadge status="pending" label="Needs note" />
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-md sm:grid-cols-2">
                <Card variant="plain" className="rounded-2xl bg-surface-subtle">
                  <CardContent className="p-lg">
                    <p className="text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                      Reviewer
                    </p>
                    <p className="mt-sm text-sm font-medium text-foreground">
                      Jamie Rivera
                    </p>
                    <p className="mt-xs text-sm text-foreground-muted">
                      Watching cross-environment drift and QA coverage.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="plain" className="rounded-2xl bg-surface-subtle">
                  <CardContent className="p-lg">
                    <p className="text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                      Packet
                    </p>
                    <p className="mt-sm text-sm font-medium text-foreground">
                      Approval bundle ready
                    </p>
                    <p className="mt-xs text-sm text-foreground-muted">
                      Attach the generated summary before promoting the build.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </SectionPanel>
        </div>
      </div>
    </WorkspaceShell>
  );
}

export function IncidentTriageWorkspaceShowcase({
  startWithPaletteOpen = false,
}: {
  startWithPaletteOpen?: boolean;
}) {
  const serviceItems = React.useMemo(() => createAsyncExplorerItems(), []);
  const loadChildren = React.useMemo(() => createAsyncTreeChildLoader(), []);
  const [paletteOpen, setPaletteOpen] = React.useState(startWithPaletteOpen);

  return (
    <WorkspaceShell
      activeArea="incident"
      healthLabel="Incident pressure"
      healthStatus="One critical service needs mitigation in eu-north-1"
      healthPercentage={71}
    >
      <div className="space-y-8">
        <CommandBar
          title="Incident triage workspace"
          subtitle="Responder lane // production services // command palette available"
          actions={
            <>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<IconCommand size={16} />}
                onClick={() => setPaletteOpen(true)}
              >
                Open palette
              </Button>
              <SplitButton
                size="sm"
                leftIcon={<IconBolt size={16} />}
                actions={[
                  {
                    label: "Restart affected service",
                    description: "Queue a rolling restart for auth-service.",
                    icon: <IconServer size={14} />,
                  },
                  {
                    label: "Notify on-call rotation",
                    description: "Alert the next responder ring automatically.",
                    icon: <IconLifebuoy size={14} />,
                  },
                  {
                    label: "Open mitigation guide",
                    description: "Jump to the documented runbook.",
                    icon: <IconWand size={14} />,
                    separatorBefore: true,
                  },
                ]}
              >
                Run mitigation
              </SplitButton>
            </>
          }
        />

        <Banner
          type="error"
          title="Database-backed authentication is degraded in production."
          description="This page combines lazy TreeView loading, a dense DataTable workflow, command surfaces, and an optional CommandPalette overlay in one realistic triage layout."
          actions={
            <Button size="sm" variant="secondary">
              Escalate incident
            </Button>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            eyebrow="Critical"
            title="Open incidents"
            value="5"
            supporting="Two active mitigations are already running in parallel."
          />
          <StatCard
            eyebrow="Latency"
            title="Auth error spike"
            value="+38%"
            supporting="Most failures are currently isolated to one region."
          />
          <StatCard
            eyebrow="Coverage"
            title="Responders online"
            value="8"
            supporting="Command surfaces are ready for handoff and status notes."
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <div className="space-y-md">
            <div className="flex items-center justify-between gap-md">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                  Affected services
                </p>
                <p className="mt-xs text-sm text-foreground-muted">
                  Async TreeView example with built-in loading, error, and
                  inline retry.
                </p>
              </div>
              <Badge variant="outlineGray">TreeView</Badge>
            </div>
            <TreeView
              searchable
              defaultItems={serviceItems}
              renderNode={renderAsyncExplorerNode}
              loadChildren={loadChildren}
            />
          </div>

          <div className="space-y-md">
            <div className="flex items-center justify-between gap-md">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                  Triage queue
                </p>
                <p className="mt-xs text-sm text-foreground-muted">
                  DataTable used for severity sorting, responder ownership, and
                  fast operator actions.
                </p>
              </div>
              <Badge variant="outlineGray">DataTable</Badge>
            </div>
            <DataTable
              columns={incidentColumns}
              data={incidentRows}
              enablePagination={false}
              enableGlobalFilter
              enableColumnResizing
              stickyHeader
              density="sm"
              showColumnBorders
              toolbar={(table) => <IncidentTableToolbar table={table} />}
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <SectionPanel
            title="Responder command"
            subtitle="CommandInput for guided remediation"
          >
            <CommandInput
              label="Mitigation command"
              description="Use this command surface to draft instructions for the incident bot or capture a responder handoff."
              helperText="Keep the prompt short and operationally explicit."
              defaultValue="Draft the next safest mitigation step for auth-service in eu-north-1 and include rollback criteria."
              submitLabel="Run playbook"
              actions={
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<IconSearch size={16} />}
                >
                  Insert runbook step
                </Button>
              }
              onSubmit={async () => {
                await wait(1000);
              }}
            />
          </SectionPanel>

          <SectionPanel
            title="Suggested next action"
            subtitle="Supportive surface next to the command workflow"
          >
            <EmptyState
              align="left"
              eyebrow="Operator note"
              icon={<IconRobot size={22} />}
              title="Open the command palette for the fastest handoff actions."
              description="The palette is useful for jumping between services, inserting remediation templates, and keeping responder navigation close to the active incident view."
              action={
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<IconCommand size={16} />}
                  onClick={() => setPaletteOpen(true)}
                >
                  Open command palette
                </Button>
              }
            />
          </SectionPanel>
        </div>

        <CommandPalette
          isOpen={paletteOpen}
          onOpenChange={setPaletteOpen}
          sections={incidentPaletteSections}
        />
      </div>
    </WorkspaceShell>
  );
}

export function DocumentationOpsWorkspaceShowcase() {
  const docsTreeItems = React.useMemo(() => createDocsTreeItems(), []);

  return (
    <WorkspaceShell
      activeArea="docs"
      healthLabel="Docs coverage"
      healthStatus="Consumer-facing docs are aligned with the latest component pass"
      healthPercentage={93}
    >
      <div className="space-y-8">
        <CommandBar
          title="Documentation operations workspace"
          subtitle="Storybook examples // public docs // internal handbooks"
          actions={
            <>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<IconRefresh size={16} />}
              >
                Sync docs
              </Button>
              <SplitButton
                size="sm"
                leftIcon={<IconFileCode size={16} />}
                actions={[
                  {
                    label: "Publish docs review",
                    description: "Send the current docs bundle for review.",
                    icon: <IconDownload size={14} />,
                  },
                  {
                    label: "Generate migration note",
                    description: "Draft consumer guidance for API changes.",
                    icon: <IconWand size={14} />,
                  },
                  {
                    label: "Open technical handbook",
                    description:
                      "Jump to the internal component patterns guide.",
                    icon: <IconSettings size={14} />,
                    separatorBefore: true,
                  },
                ]}
              >
                Prepare publish
              </SplitButton>
            </>
          }
        />

        <Banner
          type="info"
          title="This docs-focused page shows that the same component set also works for internal maintenance workflows."
          description="TreeView maps content structure, DataTable handles the review queue, Toolbar keeps controls compact, and CommandInput provides a place for draft prompts and publishing instructions."
        />

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <div className="space-y-md">
            <div className="flex items-center justify-between gap-md">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                  Content map
                </p>
                <p className="mt-xs text-sm text-foreground-muted">
                  TreeView used as a documentation and handbook navigator.
                </p>
              </div>
              <Badge variant="outlineGray">TreeView</Badge>
            </div>
            <TreeView
              searchable
              defaultItems={docsTreeItems}
              renderNode={renderFileTreeNode}
              sortComparator={branchFirstTreeComparator}
            />
          </div>

          <div className="space-y-md">
            <div className="flex items-center justify-between gap-md">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                  Review queue
                </p>
                <p className="mt-xs text-sm text-foreground-muted">
                  The same DataTable and Toolbar pattern also fits docs
                  publishing and review.
                </p>
              </div>
              <Badge variant="outlineGray">Toolbar + DataTable</Badge>
            </div>
            <DataTable
              columns={releaseColumns}
              data={releaseRows.slice(0, 4)}
              enablePagination={false}
              enableGlobalFilter
              enableRowSelection
              toolbar={(table) => <ReleaseTableToolbar table={table} />}
            />
          </div>
        </div>

        <SectionPanel
          title="Drafting lane"
          subtitle="CommandInput for docs and migration notes"
        >
          <CommandInput
            label="Docs assistant prompt"
            description="Create consumer-facing notes that align public Storybook guidance with internal implementation changes."
            helperText="This works well for migration notes, public examples, and reviewer summaries."
            defaultValue="Draft a short Storybook docs note that explains when to choose Table versus DataTable and link it back to the technical patterns handbook."
            submitLabel="Draft note"
            actions={
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<IconWand size={16} />}
              >
                Insert docs template
              </Button>
            }
            onSubmit={async () => {
              await wait(750);
            }}
          />
        </SectionPanel>
      </div>
    </WorkspaceShell>
  );
}
