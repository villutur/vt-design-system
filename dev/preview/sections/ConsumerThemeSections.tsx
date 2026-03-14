import React, { type CSSProperties } from "react";
import {
  IconBolt,
  IconBrandOpenai,
  IconBroadcast,
  IconBrush,
  IconCompass,
  IconLibraryPhoto,
  IconPalette,
  IconPhotoSpark,
  IconRouteAltLeft,
  IconSparkles,
  IconWand,
} from "@tabler/icons-react";
import {
  AIResponseView,
  AppShell,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CommandBar,
  CommandInput,
  Header,
  Input,
  InspectorPanel,
  MetricCard,
  SectionPanel,
  Select,
  Sidebar,
  SidebarItem,
  SidebarSectionBase,
  StatusBadge,
  Textarea,
  Toolbar,
  ToolbarGroup,
  ToolbarSpacer,
} from "../../../src/index";

interface ExampleSectionShellProps {
  badges: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function ExampleSectionShell({
  badges,
  title,
  description,
  children,
}: ExampleSectionShellProps) {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">{badges}</div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-foreground-muted">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function ExampleFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-default shadow-soft">
      {children}
    </div>
  );
}

const playgroundShellBackdrop: CSSProperties = {
  background:
    "radial-gradient(circle at 14% 12%, rgba(94,234,247,0.18), transparent 0 21rem), radial-gradient(circle at 82% 12%, rgba(253,186,56,0.16), transparent 0 20rem), linear-gradient(180deg, #07111d 0%, #0a1623 48%, #0d1826 100%)",
};

const playgroundHeroBackdrop: CSSProperties = {
  background:
    "radial-gradient(circle at 14% 14%, rgba(94,234,247,0.16), transparent 0 17rem), radial-gradient(circle at 88% 16%, rgba(253,186,56,0.14), transparent 0 15rem), linear-gradient(140deg, rgba(14,25,38,0.96), rgba(8,14,24,0.92))",
};

const playgroundSignalLines: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(94,234,247,0.06), transparent), repeating-linear-gradient(90deg, transparent 0, transparent 6rem, rgba(255,255,255,0.03) 6rem, rgba(255,255,255,0.03) calc(6rem + 1px))",
};

const assetStudioShellBackdrop: CSSProperties = {
  background:
    "radial-gradient(circle at 16% 10%, rgba(255,184,120,0.18), transparent 0 21rem), radial-gradient(circle at 82% 12%, rgba(94,234,212,0.16), transparent 0 18rem), linear-gradient(180deg, #050b13 0%, #09111b 45%, #0b1420 100%)",
};

const assetStudioHeroBackdrop: CSSProperties = {
  background:
    "radial-gradient(circle at 18% 18%, rgba(255,189,135,0.18), transparent 0 15rem), radial-gradient(circle at 82% 18%, rgba(94,234,212,0.14), transparent 0 14rem), linear-gradient(145deg, rgba(18,24,34,0.96), rgba(9,16,27,0.94))",
};

const assetStageBackdrop: CSSProperties = {
  background:
    "radial-gradient(circle at 24% 18%, rgba(255,181,112,0.2), transparent 0 9rem), radial-gradient(circle at 78% 20%, rgba(94,234,212,0.18), transparent 0 8rem), linear-gradient(180deg, rgba(10,17,28,0.98), rgba(5,10,18,1))",
};

const playgroundResponse = `## Workspace Summary

The signal-heavy shell keeps navigation and status distinct while the response lane stays calm and readable.

- Route chrome carries the cyan and amber energy
- Workspace panels stay grounded in semantic surfaces
- The right rail behaves like a broadcast trace panel

### Next move

Promote the strongest draft into the shared history lane and link its trace into the log viewer.`;

const playgroundThought = `The app-specific identity lives in shell atmosphere, active navigation, and hero framing. The underlying cards, panels, inputs, and response view remain neutral design-system surfaces so the workspace still feels coherent.`;

function PlaygroundSignalMark() {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] shadow-[0_14px_32px_rgba(0,0,0,0.3)]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 24% 18%, rgba(94,234,247,0.2), transparent 0 1.75rem), radial-gradient(circle at 78% 20%, rgba(253,186,56,0.18), transparent 0 1.45rem)",
        }}
      />
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative h-7 w-7"
        aria-hidden="true"
      >
        <path
          d="M24 8C30.4 8 35.8 11.2 38.8 16.3M24 14.4C28.2 14.4 31.7 16.5 33.8 19.9M24 40C17.6 40 12.2 36.8 9.2 31.7M24 33.6C19.8 33.6 16.3 31.5 14.2 28.1"
          stroke="url(#playground-mark-beam)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M23.9 10.4V37.6M17.6 16.9L23.9 10.4L30.4 16.9M17.6 31.1L23.9 37.6L30.4 31.1"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="playground-mark-beam"
            x1="8"
            y1="8"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#5EEAF7" />
            <stop offset="0.62" stopColor="#1DA8FF" />
            <stop offset="1" stopColor="#FDBA38" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function AssetStudioLanternMark() {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] shadow-[0_14px_32px_rgba(0,0,0,0.3)]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 24% 18%, rgba(255,184,120,0.22), transparent 0 1.75rem), radial-gradient(circle at 78% 18%, rgba(94,234,212,0.2), transparent 0 1.45rem)",
        }}
      />
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative h-8 w-8"
        aria-hidden="true"
      >
        <path
          d="M32 8L49 18.2V45.8L32 56L15 45.8V18.2L32 8Z"
          stroke="rgba(255,255,255,0.88)"
          strokeWidth="2.6"
        />
        <path
          d="M32 14.4L43.8 21.4V32L32 38.9L20.2 32V21.4L32 14.4Z"
          fill="url(#asset-mark-core)"
        />
        <path
          d="M20.2 21.4L32 28.4L43.8 21.4M32 28.4V38.9"
          stroke="rgba(7,11,19,0.58)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="asset-mark-core"
            x1="12"
            y1="14"
            x2="50"
            y2="50"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#FFE0B3" />
            <stop offset="0.32" stopColor="#FF9D5C" />
            <stop offset="0.68" stopColor="#59E0DA" />
            <stop offset="1" stopColor="#8BE4FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function PlaygroundSidebar() {
  return (
    <Sidebar
      footer={
        <div className="rounded-xl border border-default bg-surface-subtle/90 p-md">
          <p className="text-xs font-semibold text-primary">Broadcast status</p>
          <div className="mt-sm flex items-center justify-between gap-sm">
            <StatusBadge status="active" label="Live traces healthy" />
            <span className="text-[10px] text-foreground-muted">4 lanes</span>
          </div>
          <p className="mt-sm text-[11px] leading-5 text-foreground-muted">
            Route accents stay local to the app shell while the cards and forms remain design-system primitives.
          </p>
        </div>
      }
    >
      <SidebarItem href="#" icon={<IconCompass size={18} />} label="Overview" isActive />
      <SidebarItem href="#" icon={<IconSparkles size={18} />} label="Studio" />
      <SidebarItem href="#" icon={<IconRouteAltLeft size={18} />} label="History" />
      <SidebarSectionBase title="Workspace" />
      <SidebarItem href="#" icon={<IconBroadcast size={18} />} label="Logs" />
      <SidebarItem href="#" icon={<IconPalette size={18} />} label="Roadmap" />
    </Sidebar>
  );
}

function PlaygroundThemeWorkspaceShowcase() {
  return (
    <div className="relative" style={playgroundShellBackdrop}>
      <div className="absolute inset-0 opacity-80" style={playgroundSignalLines} />
      <AppShell
        className="relative bg-transparent"
        contentContainerClassName="max-w-none space-y-8"
        header={
          <Header
            logo={
              <div className="flex items-center gap-md">
                <PlaygroundSignalMark />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold tracking-tight text-foreground">VT Playground</span>
                    <Badge variant="softPrimary" size="sm">
                      signal turbine
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground-muted">
                    Route-led atmosphere over neutral workspace primitives
                  </p>
                </div>
              </div>
            }
            actions={
              <Button size="sm" variant="secondary" leftIcon={<IconBroadcast size={14} />}>
                Trace rail
              </Button>
            }
            userName="V. Tech"
            userRole="Workspace operator"
            showSearch={false}
            showHelp={false}
          />
        }
        sidebar={<PlaygroundSidebar />}
      >
        <div
          className="relative overflow-hidden rounded-[32px] border border-default px-xl py-xl shadow-soft"
          style={playgroundHeroBackdrop}
        >
          <div className="absolute inset-0 opacity-70" style={playgroundSignalLines} />
          <div className="relative space-y-5">
            <CommandBar
              title="Signal and turbine shell"
              subtitle="overview route // studio lane // shared right rail"
              actions={
                <>
                  <Button size="sm" leftIcon={<IconSparkles size={16} />}>
                    Open Studio
                  </Button>
                  <Button size="sm" variant="secondary" leftIcon={<IconCompass size={16} />}>
                    View roadmap
                  </Button>
                </>
              }
            />

            <p className="max-w-3xl text-sm leading-7 text-foreground-muted">
              This example shows how a consumer app can layer a stronger shell identity on top of the neutral design
              system. The color and motion live in the route chrome and hero framing while panels, forms, and response
              surfaces stay grounded in the shared semantic palette.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="softPrimary">Shell identity</Badge>
              <Badge variant="outlineGray">Signal rails</Badge>
              <Badge variant="outlineGray">Turbine energy</Badge>
              <Badge variant="softSuccess">Readable dark mode</Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<IconBroadcast size={18} />}
            iconColorClass="bg-primary/12 text-primary"
            eyebrow="Activity"
            headline="128"
            summary="Studio events captured across text routes, logs, and history."
            statusLabel="+14%"
            statusDirection="up"
            statusTone="primary"
          />
          <MetricCard
            icon={<IconSparkles size={18} />}
            iconColorClass="bg-warning/12 text-warning"
            eyebrow="Curated runs"
            headline="36"
            summary="Saved runs shaped into reusable prompt and comparison artifacts."
            statusLabel="steady"
            statusDirection="neutral"
            statusTone="warning"
          />
          <MetricCard
            icon={<IconBolt size={18} />}
            iconColorClass="bg-success/12 text-success"
            eyebrow="Live trace"
            headline="4"
            summary="Pinned lanes emitting correlation-aware session traces."
            statusLabel="healthy"
            statusDirection="up"
            statusTone="success"
          />
          <MetricCard
            icon={<IconPalette size={18} />}
            iconColorClass="bg-primary/12 text-primary"
            eyebrow="Route tones"
            headline="6"
            summary="Overview, studio, logs, roadmap, migration, and profile share the same family."
            statusLabel="mapped"
            statusDirection="up"
            statusTone="primary"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <SectionPanel
            title="Studio lane"
            subtitle="Prompt workbench surface"
            className="overflow-hidden rounded-[28px]"
          >
            <div className="space-y-lg">
              <Toolbar tone="surface">
                <ToolbarGroup compact>
                  <Badge variant="softPrimary">hero</Badge>
                  <Badge variant="outlineGray">response framing</Badge>
                </ToolbarGroup>
                <ToolbarSpacer />
                <ToolbarGroup compact className="text-[11px] text-foreground-muted">
                  <span>dark mode active</span>
                </ToolbarGroup>
              </Toolbar>

              <CommandInput
                label="Prompt Workbench"
                description="The shell tone changes, but the underlying input remains a shared design-system primitive."
                helperText="App-local theme layer lives around the component, not inside it."
                defaultValue="Draft a calmer route header for /logs that keeps the signal identity but lowers the intensity compared with /studio."
                submitLabel="Run workbench"
                actions={
                  <Button size="sm" variant="ghost" leftIcon={<IconWand size={16} />}>
                    Insert preset
                  </Button>
                }
                onSubmit={async () => {
                  await new Promise((resolve) => setTimeout(resolve, 500));
                }}
              />

              <AIResponseView
                density="compact"
                status="complete"
                content={playgroundResponse}
                thought={{
                  summary: "Mapping route-specific intensity",
                  content: playgroundThought,
                }}
                toolCalls={[
                  {
                    id: "route-appearance",
                    name: "resolveRouteAppearance",
                    status: "success",
                    summary: "Matched the logs route to the quiet signal motif.",
                    input: `{"pathname":"/logs"}`,
                    output: `{"tone":"logs","motif":"signal","intensity":"quiet"}`,
                    language: "json",
                  },
                ]}
              />
            </div>
          </SectionPanel>

          <InspectorPanel
            eyebrow="Pinned rail"
            title="Broadcast trace console"
            description="A calmer operational surface next to the brighter studio lane."
            actions={<Badge variant="softSuccess">linked to /logs</Badge>}
            className="rounded-[28px] bg-surface"
          >
            <div className="space-y-md">
              <Card variant="plain" className="rounded-2xl bg-surface-subtle">
                <CardHeader className="pb-sm">
                  <CardTitle className="text-base">Current route stack</CardTitle>
                </CardHeader>
                <CardContent className="space-y-sm pt-0">
                  <div className="flex items-center justify-between gap-sm text-sm">
                    <span className="text-foreground-muted">Overview hero</span>
                    <StatusBadge status="active" label="medium signal" />
                  </div>
                  <div className="flex items-center justify-between gap-sm text-sm">
                    <span className="text-foreground-muted">Studio lane</span>
                    <StatusBadge status="success" label="high turbine" />
                  </div>
                  <div className="flex items-center justify-between gap-sm text-sm">
                    <span className="text-foreground-muted">Logs lane</span>
                    <StatusBadge status="pending" label="quiet console" />
                  </div>
                </CardContent>
              </Card>

              <Card variant="plain" className="rounded-2xl bg-surface-subtle">
                <CardContent className="space-y-sm p-lg">
                  <p className="text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">Theme principle</p>
                  <p className="text-sm leading-6 text-foreground-muted">
                    Keep the design system semantic and stable. Let the consumer app own brand atmosphere, route accents,
                    shell-specific motion, and hero treatment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </InspectorPanel>
        </div>
      </AppShell>
    </div>
  );
}

function AssetStudioSidebar() {
  return (
    <Sidebar
      footer={
        <div className="rounded-xl border border-default bg-surface-subtle/90 p-md">
          <p className="text-xs font-semibold text-primary">Creative system</p>
          <p className="mt-sm text-[11px] leading-5 text-foreground-muted">
            Lantern glow, facet structure, and signal rails create atmosphere without turning the workflow into a
            marketing page.
          </p>
        </div>
      }
    >
      <SidebarItem href="#" icon={<IconCompass size={18} />} label="Projects" />
      <SidebarItem href="#" icon={<IconLibraryPhoto size={18} />} label="Library" />
      <SidebarItem href="#" icon={<IconPhotoSpark size={18} />} label="Project Studio" isActive />
      <SidebarSectionBase title="Ops" />
      <SidebarItem href="#" icon={<IconBrush size={18} />} label="Published" />
      <SidebarItem href="#" icon={<IconBrandOpenai size={18} />} label="Settings" />
    </Sidebar>
  );
}

function AssetVariantCard({
  name,
  accent,
  active = false,
}: {
  name: string;
  accent: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Card
      variant="plain"
      className={`overflow-hidden rounded-[24px] border-default bg-surface ${
        active ? "ring-1 ring-primary/30" : ""
      }`}
    >
      <div className="relative aspect-square p-lg" style={assetStageBackdrop}>
        <div className="absolute inset-4 rounded-[22px] border border-white/10 bg-surface/70" />
        <div className="relative flex h-full items-center justify-center">
          <div className="grid h-32 w-32 place-items-center rounded-[28px] border border-white/15 bg-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
            {accent}
          </div>
        </div>
      </div>
      <div className="border-t border-default px-lg py-md">
        <div className="flex items-center justify-between gap-sm">
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <Badge variant={active ? "softPrimary" : "outlineGray"} size="sm">
            {active ? "selected" : "candidate"}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

function AssetStudioThemeWorkspaceShowcase() {
  return (
    <div className="relative" style={assetStudioShellBackdrop}>
      <AppShell
        className="relative bg-transparent"
        contentContainerClassName="max-w-none space-y-8"
        header={
          <Header
            logo={
              <div className="flex items-center gap-md">
                <AssetStudioLanternMark />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold tracking-tight text-foreground">VT Asset Studio</span>
                    <Badge variant="softPrimary" size="sm">
                      lantern board
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground-muted">
                    Creative tooling layered over the shared component kit
                  </p>
                </div>
              </div>
            }
            actions={
              <Button size="sm" variant="secondary" leftIcon={<IconBrandOpenai size={14} />}>
                Export skill
              </Button>
            }
            userName="V. Tech"
            userRole="Creative ops"
            showSearch={false}
            showHelp={false}
          />
        }
        sidebar={<AssetStudioSidebar />}
      >
        <div
          className="relative overflow-hidden rounded-[32px] border border-default px-xl py-xl shadow-soft"
          style={assetStudioHeroBackdrop}
        >
          <div className="relative space-y-5">
            <CommandBar
              title="Lantern and facet workspace"
              subtitle="project studio // board-first asset generation"
              actions={
                <>
                  <Button size="sm" leftIcon={<IconPhotoSpark size={16} />}>
                    Generate board
                  </Button>
                  <Button size="sm" variant="secondary" leftIcon={<IconBrandOpenai size={16} />}>
                    Local API
                  </Button>
                </>
              }
            />

            <p className="max-w-3xl text-sm leading-7 text-foreground-muted">
              This composition shows how a more expressive creative tool can still stay disciplined. Warm glow, cool
              artboard lighting, and faceted framing sit around the same shared forms, cards, panels, and buttons.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="softPrimary">Lantern glow</Badge>
              <Badge variant="outlineGray">Facet structure</Badge>
              <Badge variant="outlineGray">Signal discipline</Badge>
              <Badge variant="softSuccess">Board-first workflow</Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<IconCompass size={18} />}
            iconColorClass="bg-warning/12 text-warning"
            eyebrow="Projects"
            headline="4"
            summary="Registered roots, references, workspace paths, and published destinations."
            statusLabel="indexed"
            statusDirection="up"
            statusTone="success"
          />
          <MetricCard
            icon={<IconLibraryPhoto size={18} />}
            iconColorClass="bg-primary/12 text-primary"
            eyebrow="References"
            headline="18"
            summary="Reference files available to bias style, shape language, and package context."
            statusLabel="+6"
            statusDirection="up"
            statusTone="primary"
          />
          <MetricCard
            icon={<IconPhotoSpark size={18} />}
            iconColorClass="bg-warning/12 text-warning"
            eyebrow="Variants"
            headline="5"
            summary="Current board output count before save or publish."
            statusLabel="creative pass"
            statusDirection="neutral"
            statusTone="warning"
          />
          <MetricCard
            icon={<IconBrandOpenai size={18} />}
            iconColorClass="bg-success/12 text-success"
            eyebrow="Skill"
            headline="ready"
            summary="Codex integration exported from the same local control surface."
            statusLabel="installed"
            statusDirection="up"
            statusTone="success"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <SectionPanel
            title="Generation brief"
            subtitle="Project-aware request"
            className="rounded-[28px]"
          >
            <div className="space-y-md">
              <Select
                label="Project"
                options={[
                  { value: "vt", label: "VT Workspace" },
                  { value: "design", label: "Design System" },
                ]}
                defaultValue="vt"
              />
              <Select
                label="Asset kind"
                options={[
                  { value: "logo", label: "Logo" },
                  { value: "icon", label: "Icon" },
                  { value: "banner", label: "Banner" },
                ]}
                defaultValue="logo"
              />
              <Input
                label="Package context"
                defaultValue="vt-asset-studio"
                description="Consumer app decides the local brand context."
              />
              <Textarea
                label="Brief"
                defaultValue="Create a distinctive but reusable VT asset mark with warm glow, cut geometry, and enough structure to scale into a package family."
                helperText="Consumer-local theme wraps the shared textarea without forking the component."
              />
              <div className="flex flex-wrap gap-sm">
                <Button size="sm" leftIcon={<IconPhotoSpark size={16} />}>
                  Generate
                </Button>
                <Button size="sm" variant="secondary" leftIcon={<IconWand size={16} />}>
                  Insert preset
                </Button>
              </div>
            </div>
          </SectionPanel>

          <SectionPanel
            title="Variant board"
            subtitle="Lantern and facet treatment"
            className="rounded-[28px]"
          >
            <div className="space-y-lg">
              <Toolbar tone="surface">
                <ToolbarGroup compact>
                  <Badge variant="softPrimary">5 variants</Badge>
                  <Badge variant="outlineGray">svg-first</Badge>
                </ToolbarGroup>
                <ToolbarSpacer />
                <ToolbarGroup compact className="text-[11px] text-foreground-muted">
                  <span>package-aware output</span>
                </ToolbarGroup>
              </Toolbar>

              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                <AssetVariantCard
                  name="lantern-fold"
                  active
                  accent={
                    <div className="grid h-18 w-18 place-items-center rounded-[24px] border border-white/10 bg-white/6">
                      <IconPhotoSpark size={36} className="text-white" />
                    </div>
                  }
                />
                <AssetVariantCard
                  name="facet-orbit"
                  accent={
                    <div className="grid h-18 w-18 place-items-center rounded-full border border-primary/30 bg-primary/10">
                      <IconSparkles size={34} className="text-primary" />
                    </div>
                  }
                />
                <AssetVariantCard
                  name="signal-keystone"
                  accent={
                    <div className="grid h-18 w-18 place-items-center rounded-[20px] border border-warning/30 bg-warning/10">
                      <IconBroadcast size={34} className="text-warning" />
                    </div>
                  }
                />
              </div>
            </div>
          </SectionPanel>

          <InspectorPanel
            eyebrow="Selected variant"
            title="Inspector and publish rail"
            description="Creative intensity stays high in the board, while the inspector remains calm and operational."
            actions={<Badge variant="softSuccess">ready to save</Badge>}
            className="rounded-[28px] bg-surface"
          >
            <div className="space-y-md">
              <Card variant="plain" className="rounded-2xl bg-surface-subtle">
                <CardContent className="space-y-sm p-lg">
                  <p className="text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">Variant details</p>
                  <p className="text-sm font-semibold text-foreground">lantern-fold-vt-asset-studio.svg</p>
                  <p className="text-sm text-foreground-muted">
                    Warm core, clean silhouette, and enough negative space for small-icon scaling.
                  </p>
                </CardContent>
              </Card>

              <Input label="Output filename" defaultValue="vt-lantern-fold.svg" />
              <Select
                label="Workspace path"
                options={[
                  { value: "public", label: "[0] public/vt/assets" },
                  { value: "docs", label: "[1] docs/brand/exports" },
                ]}
                defaultValue="public"
              />

              <div className="flex flex-wrap gap-sm">
                <Button size="sm" leftIcon={<IconBrush size={16} />}>
                  Save to workspace
                </Button>
                <Button size="sm" variant="secondary" leftIcon={<IconBrandOpenai size={16} />}>
                  Publish selected
                </Button>
              </div>
            </div>
          </InspectorPanel>
        </div>
      </AppShell>
    </div>
  );
}

export function ExamplePlaygroundSignalThemeSection() {
  return (
    <ExampleSectionShell
      badges={
        <>
          <Badge variant="softPrimary">Examples</Badge>
          <Badge>Consumer theme</Badge>
          <Badge>VT Playground</Badge>
        </>
      }
      title="VT Playground Signal and Turbine Theme"
      description="A consumer-themed workspace example based on the new `vt-playground` direction. It demonstrates how the app can add signal rails, cyan and amber glow, and route-led shell energy while keeping the underlying design-system components neutral."
    >
      <ExampleFrame>
        <PlaygroundThemeWorkspaceShowcase />
      </ExampleFrame>
    </ExampleSectionShell>
  );
}

export function ExampleAssetStudioLanternThemeSection() {
  return (
    <ExampleSectionShell
      badges={
        <>
          <Badge variant="softPrimary">Examples</Badge>
          <Badge>Consumer theme</Badge>
          <Badge>VT Asset Studio</Badge>
        </>
      }
      title="VT Asset Studio Lantern and Facet Theme"
      description="A more expressive consumer-local theme based on the new `vt-asset-studio` direction. It shows how the creative app can carry warmer glow, faceted framing, and artboard-like previews without changing the shared design-system token contract."
    >
      <ExampleFrame>
        <AssetStudioThemeWorkspaceShowcase />
      </ExampleFrame>
    </ExampleSectionShell>
  );
}
