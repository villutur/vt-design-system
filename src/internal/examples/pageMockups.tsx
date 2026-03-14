import React from "react";
import {
  IconActivity,
  IconAlertCircle,
  IconChartBar,
  IconCheck,
  IconChevronDown,
  IconClockHour4,
  IconCurrencyDollar,
  IconDatabase,
  IconHome,
  IconLayersIntersect,
  IconPalette,
  IconRefresh,
  IconServer,
  IconSettings,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react";
import {
  Alert,
  AppShell,
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
  Chip,
  Divider,
  Header,
  HealthBar,
  Input,
  KeyValue,
  MetricCard,
  ProgressBar,
  SectionPanel,
  Sidebar,
  SidebarItem,
  SidebarSectionBase,
  SidebarSystemHealth,
  Sparkline,
  StatusBadge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Timeline,
} from "../../index";
import { Table, type TableColumn } from "../../components/DataDisplay/Table";
import { cn } from "../../utils/cn";

interface MockupSurfaceProps {
  contained?: boolean;
}

interface ReleaseQueueRow {
  workflow: string;
  owner: string;
  eta: string;
  status: "active" | "pending" | "warning" | "error";
}

interface RenewalRow {
  account: string;
  renewal: string;
  owner: string;
  status: "active" | "pending" | "warning";
}

const releaseQueueColumns: TableColumn<ReleaseQueueRow>[] = [
  { header: "Workflow", accessor: "workflow" },
  { header: "Owner", accessor: "owner" },
  { header: "ETA", accessor: "eta", className: "text-right" },
  {
    header: "Status",
    accessor: (row) => (
      <div className="flex justify-end">
        <StatusBadge status={row.status} />
      </div>
    ),
    className: "text-right",
  },
];

const releaseQueueRows: ReleaseQueueRow[] = [
  {
    workflow: "Billing sync rollout",
    owner: "Jamie Rivera",
    eta: "18 min",
    status: "active",
  },
  {
    workflow: "Identity provider update",
    owner: "Alex Morgan",
    eta: "34 min",
    status: "pending",
  },
  {
    workflow: "Warehouse retry policy",
    owner: "Sam Patel",
    eta: "Needs review",
    status: "warning",
  },
  {
    workflow: "Release 26.03 hotfix",
    owner: "Taylor Reid",
    eta: "Blocked",
    status: "error",
  },
];

const renewalColumns: TableColumn<RenewalRow>[] = [
  { header: "Account", accessor: "account" },
  { header: "Renewal", accessor: "renewal" },
  { header: "Owner", accessor: "owner" },
  {
    header: "Health",
    accessor: (row) => (
      <div className="flex justify-end">
        <StatusBadge status={row.status} />
      </div>
    ),
    className: "text-right",
  },
];

const renewalRows: RenewalRow[] = [
  {
    account: "Northwind Retail",
    renewal: "14 Apr",
    owner: "Morgan Lee",
    status: "active",
  },
  {
    account: "Helios Energy",
    renewal: "26 Apr",
    owner: "Avery Ross",
    status: "pending",
  },
  {
    account: "Atlas Freight",
    renewal: "02 May",
    owner: "Jordan Kim",
    status: "warning",
  },
];

const activityItems = [
  {
    title: "Release window opened",
    description: "The EU cluster is now accepting release promotion jobs.",
    timestamp: "09:12",
    status: "default" as const,
    icon: <IconClockHour4 size={16} />,
  },
  {
    title: "Automated checks passed",
    description: "Cross-region smoke tests completed without any regressions.",
    timestamp: "09:18",
    status: "success" as const,
    icon: <IconCheck size={16} />,
    content: "14 jobs completed, zero manual rollbacks required.",
  },
  {
    title: "Identity sync degraded",
    description: "One provider needs a credential refresh before promotion.",
    timestamp: "09:24",
    status: "warning" as const,
    icon: <IconAlertCircle size={16} />,
  },
  {
    title: "Traffic shift started",
    description: "Production traffic is gradually moving to the new build.",
    timestamp: "09:31",
    status: "info" as const,
    icon: <IconActivity size={16} />,
  },
];

const loginHighlights = [
  {
    label: "SAML-ready",
    description: "Okta, Azure AD, and Google Workspace in one place",
  },
  {
    label: "Role-aware sessions",
    description: "Security policies adapt to privileged workspaces",
  },
  {
    label: "Audit visibility",
    description: "Every sign-in event is captured for compliance reviews",
  },
];

function ExampleBrandLockup({ name, subtitle }: { name: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-md">
      <div className="rounded-2xl bg-primary p-sm text-white shadow-soft">
        <IconLayersIntersect size={22} />
      </div>
      <div>
        <p className="text-base font-semibold tracking-tight text-foreground">{name}</p>
        <p className="text-xs tracking-[0.18em] text-foreground-muted uppercase">{subtitle}</p>
      </div>
    </div>
  );
}

function LoginHighlightCard({ label, description }: { label: string; description: string }) {
  return (
    <Card variant="plain" className="h-full rounded-2xl bg-surface/70">
      <CardContent className="p-lg">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-sm text-sm leading-6 text-foreground-muted">{description}</p>
      </CardContent>
    </Card>
  );
}

export function LoginSplitShowcase({ contained = false }: MockupSurfaceProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-canvas text-foreground",
        contained ? "min-h-[720px] rounded-[32px] border border-default shadow-soft" : "min-h-screen",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,116,216,0.18),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.16),transparent_38%)]" />
      <div className="border-default/70 absolute inset-y-0 left-0 hidden w-[48%] border-r bg-surface/80 lg:block" />

      <div className="relative grid min-h-full lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between gap-10 p-2xl">
          <div className="space-y-5">
            <ExampleBrandLockup name="Northstar Cloud" subtitle="Workspace access" />

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="softPrimary">Enterprise login</Badge>
              <Badge variant="softSuccess">MFA enforced</Badge>
            </div>

            <div className="max-w-xl space-y-5">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                  Secure sign-in that feels polished before the first keystroke.
                </h1>
                <p className="mt-lg max-w-xl text-base leading-7 text-foreground-muted">
                  A professional enterprise login built from cards, inputs, badges, alerts, dividers, and buttons from
                  this design system.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {loginHighlights.map((highlight) => (
                  <LoginHighlightCard
                    key={highlight.label}
                    label={highlight.label}
                    description={highlight.description}
                  />
                ))}
              </div>
            </div>
          </div>

          <Card variant="plain" className="max-w-xl rounded-3xl bg-surface/75">
            <CardContent className="grid gap-lg p-xl md:grid-cols-[1.3fr_0.7fr]">
              <div>
                <p className="text-sm font-semibold text-foreground">Trusted workspace setup</p>
                <p className="mt-sm text-sm leading-6 text-foreground-muted">
                  Teams can route users to SSO or password-based access without rebuilding the layout for each
                  workspace.
                </p>
              </div>
              <div className="flex flex-wrap items-start justify-start gap-2 md:justify-end">
                <Chip variant="outline">SAML</Chip>
                <Chip variant="outline">SCIM</Chip>
                <Chip variant="outline">Audit logs</Chip>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-center p-xl lg:p-2xl">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between gap-md">
                <ExampleBrandLockup name="Northstar Cloud" subtitle="Workspace portal" />
                <StatusBadge status="active" label="Secure" />
              </div>
              <div className="pt-sm">
                <CardTitle>Sign in to your workspace</CardTitle>
                <CardDescription>
                  Use your team credentials to access production dashboards and release controls.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-lg">
              <Input label="Work email" type="email" placeholder="alex@northstar.cloud" />
              <Input label="Password" type="password" placeholder="Enter your password" />

              <div className="flex items-center justify-between gap-md">
                <Checkbox id="remember-session" label="Keep me signed in for 12 hours" />
                <Button variant="ghost" size="xs">
                  Need help?
                </Button>
              </div>

              <div className="space-y-md">
                <Button className="w-full">Continue to workspace</Button>
                <Button variant="secondary" className="w-full">
                  Sign in with SSO
                </Button>
              </div>

              <Divider label="Security note" />

              <Alert type="info" title="Privileged roles use MFA">
                Production administrators and billing owners must complete an extra verification step before access is
                granted.
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function LoginCompactShowcase({ contained = false }: MockupSurfaceProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-canvas text-foreground",
        contained ? "min-h-[720px] rounded-[32px] border border-default shadow-soft" : "min-h-screen",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(8,145,178,0.14),transparent_34%)]" />

      <div className="relative flex min-h-full items-center justify-center p-xl lg:p-2xl">
        <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.78fr_1fr]">
          <Card variant="plain" className="rounded-[28px] bg-surface/75">
            <CardHeader>
              <div className="flex items-center justify-between gap-md">
                <ExampleBrandLockup name="Atlas Console" subtitle="Passwordless access" />
                <Badge variant="softSuccess">Magic link</Badge>
              </div>
              <CardTitle>Fast workspace entry</CardTitle>
              <CardDescription>
                A calmer login variation for internal tools, admin consoles, or support portals that do not need a large
                hero panel.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-lg">
              <KeyValue
                items={[
                  { label: "Workspace", value: "EU Operations" },
                  {
                    label: "Environment",
                    value: <StatusBadge status="active" label="Production" />,
                  },
                  { label: "Session policy", value: "12 hours" },
                  { label: "Verification", value: "Email link" },
                ]}
              />

              <div className="rounded-2xl border border-default bg-surface-subtle p-md">
                <p className="text-xs font-semibold text-foreground-muted uppercase">Why teams choose this flow</p>
                <p className="mt-sm text-sm leading-6 text-foreground-muted">
                  It reduces friction for low-risk internal tools while still leaving enough space for trust signals and
                  workspace context.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <div className="flex items-center justify-between gap-md">
                  <div className="flex items-center gap-2">
                    <Badge variant="softPrimary">Workspace access</Badge>
                    <Badge>Design system mockup</Badge>
                  </div>
                  <StatusBadge status="pending" label="Awaiting sign-in" />
                </div>
                <div className="pt-sm">
                  <CardTitle>Send a secure magic link</CardTitle>
                  <CardDescription>
                    Invite users back into the product with a compact, friendly-first authentication flow.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-lg">
                <Input label="Work email" type="email" placeholder="morgan@atlas.console" />

                <div className="grid gap-md sm:grid-cols-2">
                  <Button>Send magic link</Button>
                  <Button variant="secondary">Use password instead</Button>
                </div>

                <Alert type="success" title="Workspace protections enabled">
                  Sessions automatically fall back to step-up verification if a user enters from an unknown network.
                </Alert>

                <div className="grid gap-md sm:grid-cols-3">
                  {[
                    "Every entry attempt is logged automatically.",
                    "Region-aware session rules are enforced per workspace.",
                    "One-click fallback to password or SSO is available.",
                  ].map((copy, index) => (
                    <Card key={index} variant="plain" className="rounded-2xl bg-surface/70">
                      <CardContent className="p-md">
                        <p className="text-xs font-semibold text-foreground-muted uppercase">
                          {index === 0 ? "Audit" : index === 1 ? "Policy" : "Recovery"}
                        </p>
                        <p className="mt-sm text-sm text-foreground">{copy}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardHeaderBlock({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: React.ReactNode;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-lg xl:flex-row xl:items-end xl:justify-between">
      <div className="space-y-sm">
        <div className="flex flex-wrap items-center gap-2">{eyebrow}</div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="mt-sm max-w-3xl text-sm leading-6 text-foreground-muted">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function DashboardOperationsContent() {
  return (
    <div className="space-y-8">
      <div className="space-y-md">
        <Breadcrumbs
          items={[{ label: "Workspace", href: "#" }, { label: "Operations", href: "#" }, { label: "Release center" }]}
        />

        <DashboardHeaderBlock
          eyebrow={
            <>
              <Badge variant="softPrimary">Operations command center</Badge>
              <StatusBadge status="active" label="Live workspace" />
            </>
          }
          title="Platform health, release traffic, and approval flow in one view"
          description="This dashboard mockup combines breadcrumbs, metric cards, section panels, tabs, health bars, tables, timelines, and compact identity components into a realistic product surface."
          actions={
            <>
              <Button variant="secondary" leftIcon={<IconRefresh size={14} />}>
                Refresh snapshot
              </Button>
              <Button rightIcon={<IconChevronDown size={14} />}>New release</Button>
            </>
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Healthy services"
          value="42 / 46"
          trendValue="+4%"
          trendType="success"
          icon={<IconServer size={22} />}
          chart={<Sparkline data={[10, 12, 11, 15, 16, 19, 20, 22]} height={30} color="#22c55e" />}
        />
        <MetricCard
          title="Pending approvals"
          value="7"
          trendValue="-2"
          trendDirection="down"
          trendType="warning"
          icon={<IconActivity size={22} />}
          chart={<Sparkline data={[16, 15, 14, 14, 12, 10, 8, 7]} height={30} color="#f59e0b" />}
        />
        <MetricCard
          title="Active workspace owners"
          value="14"
          trendValue="+1"
          trendType="primary"
          icon={<IconUsers size={22} />}
          chart={<Sparkline data={[6, 8, 8, 10, 11, 11, 13, 14]} height={30} color="#2563eb" />}
        />
        <MetricCard
          title="Monthly cloud spend"
          value="$82.4k"
          trendValue="+6.3%"
          trendType="error"
          icon={<IconCurrencyDollar size={22} />}
          chart={<Sparkline data={[44, 48, 46, 51, 54, 56, 60, 64]} height={30} color="#ef4444" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <SectionPanel
          title="Approval Queue"
          subtitle="Tabs show different ways of framing release operations"
          controls={<Badge variant="softWarning">3 awaiting review</Badge>}
        >
          <Tabs defaultValue="queue" variant="secondary" className="gap-md">
            <TabsList className="border-b border-default pb-sm">
              <TabsTrigger value="queue">Queue</TabsTrigger>
              <TabsTrigger value="capacity">Capacity</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
            </TabsList>
            <TabsContent value="queue">
              <Table columns={releaseQueueColumns} data={releaseQueueRows} keyExtractor={(row) => row.workflow} />
            </TabsContent>
            <TabsContent value="capacity">
              <div className="space-y-md">
                <div>
                  <div className="mb-sm flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Build runners</span>
                    <span className="text-xs text-foreground-muted">78% reserved</span>
                  </div>
                  <ProgressBar value={78} />
                </div>
                <div>
                  <div className="mb-sm flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Review throughput</span>
                    <span className="text-xs text-foreground-muted">64% complete</span>
                  </div>
                  <ProgressBar value={64} variant="success" />
                </div>
                <div className="rounded-2xl border border-default bg-surface-subtle p-md">
                  <p className="text-sm font-semibold text-foreground">Queue recommendation</p>
                  <p className="mt-sm text-sm text-foreground-muted">
                    Shift the warehouse retry policy to the second deployment window to free approval capacity for
                    customer-facing fixes.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="automation">
              <div className="grid gap-md md:grid-cols-3">
                {[
                  ["Auto rollout", "12 flows", "Promote automatically after smoke checks pass."],
                  ["Manual review", "3 flows", "Human review remains for billing and identity changes."],
                  ["Rollback ready", "100%", "Every active flow currently has a saved rollback point."],
                ].map(([label, value, copy]) => (
                  <Card key={label} variant="plain" className="rounded-2xl bg-surface/70">
                    <CardContent className="p-lg">
                      <p className="text-xs font-semibold text-foreground-muted uppercase">{label}</p>
                      <p className="mt-sm text-lg font-semibold text-foreground">{value}</p>
                      <p className="mt-sm text-sm text-foreground-muted">{copy}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </SectionPanel>

        <SectionPanel
          title="Platform Health"
          subtitle="Current service readiness"
          controls={<StatusBadge status="active" label="Stable" />}
        >
          <div className="space-y-md">
            <Alert type="success" title="Release window healthy">
              93% of platform services are ready for promotion. One identity provider is waiting for credential
              rotation.
            </Alert>

            {[
              { name: "API cluster", value: 96 },
              { name: "Identity sync", value: 72 },
              { name: "Warehouse jobs", value: 89 },
              { name: "Event streams", value: 94 },
            ].map((item) => (
              <div key={item.name} className="space-y-sm">
                <div className="flex items-center justify-between gap-md">
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <span className="text-xs text-foreground-muted">{item.value}%</span>
                </div>
                <HealthBar value={item.value} />
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionPanel title="Release Activity" subtitle="Recent milestones and warnings">
          <Timeline items={activityItems} density="compact" />
        </SectionPanel>

        <SectionPanel title="Workspace Owners" subtitle="Active humans behind the current release">
          <div className="space-y-lg">
            <div className="flex flex-wrap gap-md">
              {[
                { initials: "MR", name: "Morgan Reed", role: "Release lead" },
                { initials: "JP", name: "Jamie Patel", role: "Platform owner" },
                { initials: "TR", name: "Taylor Ross", role: "QA reviewer" },
              ].map((person) => (
                <Card key={person.name} variant="plain" className="min-w-[180px] rounded-2xl bg-surface/70">
                  <CardContent className="flex items-center gap-md p-lg">
                    <Avatar size="default" initials={person.initials} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{person.name}</p>
                      <p className="text-xs text-foreground-muted">{person.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Divider />

            <KeyValue
              items={[
                { label: "Active region", value: "EU-West 01" },
                { label: "Rollback point", value: "r26.03.11-rc2" },
                {
                  label: "Change type",
                  value: (
                    <div className="flex gap-2">
                      <Chip variant="outline">Billing</Chip>
                      <Chip variant="outline">Identity</Chip>
                    </div>
                  ),
                },
                { label: "Approver", value: "Jamie Rivera" },
              ]}
            />
          </div>
        </SectionPanel>
      </div>
    </div>
  );
}

export function DashboardExecutiveContent() {
  return (
    <div className="space-y-8">
      <DashboardHeaderBlock
        eyebrow={
          <>
            <Badge variant="softSuccess">Executive snapshot</Badge>
            <Badge>Customer health</Badge>
          </>
        }
        title="Commercial health with a calmer, leadership-facing tone"
        description="A second dashboard variation that leans on the same design-system primitives but shifts the composition toward summaries, renewal watchlists, and leadership callouts."
        actions={
          <>
            <Button variant="secondary" leftIcon={<IconChartBar size={14} />}>
              Export board pack
            </Button>
            <Button leftIcon={<IconPalette size={14} />}>Open planning view</Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="ARR at risk"
          value="$1.2M"
          trendValue="-8%"
          trendDirection="down"
          trendType="warning"
          icon={<IconCurrencyDollar size={22} />}
          chart={<Sparkline data={[22, 21, 20, 19, 17, 16, 15, 14]} height={30} color="#f59e0b" />}
        />
        <MetricCard
          title="Renewals this quarter"
          value="24"
          trendValue="+5"
          trendType="success"
          icon={<IconHome size={22} />}
          chart={<Sparkline data={[6, 8, 9, 11, 12, 14, 18, 24]} height={30} color="#22c55e" />}
        />
        <MetricCard
          title="Partner-led expansions"
          value="9"
          trendValue="+2"
          trendType="primary"
          icon={<IconSparkles size={22} />}
          chart={<Sparkline data={[2, 3, 4, 4, 5, 7, 8, 9]} height={30} color="#2563eb" />}
        />
        <MetricCard
          title="Open escalations"
          value="3"
          trendValue="-1"
          trendDirection="down"
          trendType="success"
          icon={<IconSettings size={22} />}
          chart={<Sparkline data={[8, 8, 7, 6, 5, 5, 4, 3]} height={30} color="#16a34a" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionPanel
          title="Renewal Watchlist"
          subtitle="Accounts leadership should monitor weekly"
          controls={<Badge variant="softWarning">2 need attention</Badge>}
        >
          <Table columns={renewalColumns} data={renewalRows} keyExtractor={(row) => row.account} />
        </SectionPanel>

        <SectionPanel title="Leadership Summary" subtitle="Quick narrative built from reusable surfaces">
          <div className="space-y-md">
            <Card variant="plain" className="rounded-2xl bg-surface/70">
              <CardContent className="p-lg">
                <p className="text-sm font-semibold text-foreground">The quarter remains healthy overall.</p>
                <p className="mt-sm text-sm leading-6 text-foreground-muted">
                  The only soft spots are two renewals that need executive sponsorship and one escalation with a delayed
                  procurement timeline.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Expansion coverage</span>
                <span className="text-foreground-muted">72%</span>
              </div>
              <ProgressBar value={72} />
            </div>

            <div className="space-y-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Risk mitigation plan</span>
                <span className="text-foreground-muted">58%</span>
              </div>
              <ProgressBar value={58} variant="warning" />
            </div>

            <div className="flex flex-wrap gap-2">
              <Chip variant="outline">Board ready</Chip>
              <Chip variant="outline">Partner review</Chip>
              <Chip variant="outline">Customer success</Chip>
            </div>
          </div>
        </SectionPanel>
      </div>

      <SectionPanel title="Account Focus" subtitle="A more card-heavy layout variation">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              account: "Northwind Retail",
              note: "Renewal is strong after the implementation recovery.",
              status: "active" as const,
            },
            {
              account: "Helios Energy",
              note: "Executive sponsor should join the next steering call.",
              status: "pending" as const,
            },
            {
              account: "Atlas Freight",
              note: "Expansion is paused until procurement confirms timing.",
              status: "warning" as const,
            },
          ].map((item) => (
            <Card key={item.account} variant="plain" className="rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between gap-md">
                  <CardTitle>{item.account}</CardTitle>
                  <StatusBadge status={item.status} />
                </div>
                <CardDescription>{item.note}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-md">
                  <Avatar size="sm" initials="ML" />
                  <Avatar size="sm" initials="AR" />
                  <Avatar size="sm" initials="JP" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionPanel>
    </div>
  );
}

export function DashboardShellExample({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      header={
        <Header logoName="Northstar Control" userName="Morgan Lee" userRole="Operations Lead" hasUnreadNotifications />
      }
      sidebar={
        <Sidebar
          footer={
            <SidebarSystemHealth
              percentage={94}
              label="Workspace readiness"
              status="Release systems healthy across 4 regions"
            />
          }
        >
          <SidebarItem icon={<IconHome size={18} />} label="Overview" href="#" isActive />
          <SidebarItem icon={<IconChartBar size={18} />} label="Performance" href="#" />
          <SidebarItem icon={<IconUsers size={18} />} label="Workspace owners" href="#" />
          <SidebarSectionBase title="Operations" />
          <SidebarItem icon={<IconServer size={18} />} label="Infrastructure" href="#" />
          <SidebarItem icon={<IconDatabase size={18} />} label="Data pipelines" href="#" />
          <SidebarItem icon={<IconSettings size={18} />} label="Settings" href="#" />
        </Sidebar>
      }
    >
      {children}
    </AppShell>
  );
}
