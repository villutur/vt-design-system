import React from "react";
import { Badge } from "../../../src/index";
import { AIAssistantWorkspaceExample } from "../../../src/internal/examples/aiAssistantWorkspace";
import { AIChatWorkspaceExample } from "../../../src/internal/examples/aiChatWorkspace";
import { LogViewerWorkspaceExample } from "../../../src/internal/examples/logViewerWorkspace";
import {
  DashboardExecutiveContent,
  DashboardOperationsContent,
  LoginCompactShowcase,
  LoginSplitShowcase,
} from "../../../src/internal/examples/pageMockups";
import {
  DocumentationOpsWorkspaceShowcase,
  IncidentTriageWorkspaceShowcase,
  ReleaseControlWorkspaceShowcase,
} from "../../../src/internal/examples/workflowWorkspaces";

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

function DashboardFrame({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-default bg-surface shadow-soft">
      <div className="border-b border-default bg-surface-subtle px-xl py-lg">
        <p className="text-xs font-semibold tracking-[0.18em] text-foreground-subtle uppercase">
          {eyebrow}
        </p>
        <h3 className="mt-sm text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-sm max-w-2xl text-sm text-foreground-muted">
          {description}
        </p>
      </div>
      <div className="bg-canvas/40 p-xl">{children}</div>
    </div>
  );
}

function ExampleFrame({
  children,
  shell = false,
}: {
  children: React.ReactNode;
  shell?: boolean;
}) {
  return (
    <div
      className={
        shell
          ? "overflow-hidden rounded-[32px] border border-default shadow-soft"
          : "rounded-[32px] border border-default bg-canvas p-xl shadow-soft"
      }
    >
      {children}
    </div>
  );
}

export function ExampleLoginSplitSection() {
  return (
    <ExampleSectionShell
      badges={
        <>
          <Badge variant="softPrimary">Examples</Badge>
          <Badge>Login</Badge>
          <Badge>Split layout</Badge>
        </>
      }
      title="Login Split Showcase"
      description="A premium, enterprise-style sign-in page with a stronger brand story, trust signals, and a focused authentication card."
    >
      <LoginSplitShowcase contained />
    </ExampleSectionShell>
  );
}

export function ExampleLoginCompactSection() {
  return (
    <ExampleSectionShell
      badges={
        <>
          <Badge variant="softPrimary">Examples</Badge>
          <Badge>Login</Badge>
          <Badge>Compact layout</Badge>
        </>
      }
      title="Login Compact Showcase"
      description="A calmer authentication surface for internal tools, admin portals, and lower-friction entry flows. It now sits on its own page so the layout has room to breathe."
    >
      <LoginCompactShowcase contained />
    </ExampleSectionShell>
  );
}

export function ExampleDashboardOperationsSection() {
  return (
    <ExampleSectionShell
      badges={
        <>
          <Badge variant="softPrimary">Examples</Badge>
          <Badge>Dashboard</Badge>
          <Badge>Operations</Badge>
        </>
      }
      title="Dashboard Operations Showcase"
      description="A high-density control-room content layout that demonstrates metric cards, tables, timelines, tabs, health indicators, and compact identity surfaces working together."
    >
      <DashboardFrame
        eyebrow="Dashboard mockup"
        title="Operations control room"
        description="This is the content-only version for the dev preview. The Storybook example renders the same composition inside the full AppShell with Header and Sidebar."
      >
        <DashboardOperationsContent />
      </DashboardFrame>
    </ExampleSectionShell>
  );
}

export function ExampleDashboardExecutiveSection() {
  return (
    <ExampleSectionShell
      badges={
        <>
          <Badge variant="softPrimary">Examples</Badge>
          <Badge>Dashboard</Badge>
          <Badge>Executive</Badge>
        </>
      }
      title="Dashboard Executive Showcase"
      description="A calmer, leadership-facing dashboard variation that reuses the same system primitives with more emphasis on summaries, watchlists, and narrative status."
    >
      <DashboardFrame
        eyebrow="Dashboard variation"
        title="Executive commercial snapshot"
        description="A more restrained layout rhythm intended for leadership reviews, revenue health discussions, and customer success planning."
      >
        <DashboardExecutiveContent />
      </DashboardFrame>
    </ExampleSectionShell>
  );
}

export function ExampleAIAssistantWorkspaceSection() {
  return (
    <ExampleSectionShell
      badges={
        <>
          <Badge variant="softPrimary">Examples</Badge>
          <Badge>AI</Badge>
          <Badge>Assistant workspace</Badge>
        </>
      }
      title="AI Assistant Workspace"
      description="A composition-first workspace that pairs CommandInput with AIResponseView instead of locking the design system into a monolithic assistant shell too early."
    >
      <ExampleFrame>
        <AIAssistantWorkspaceExample />
      </ExampleFrame>
    </ExampleSectionShell>
  );
}

export function ExampleAIChatWorkspaceSection() {
  return (
    <ExampleSectionShell
      badges={
        <>
          <Badge variant="softPrimary">Examples</Badge>
          <Badge>AI</Badge>
          <Badge>Chat workspace</Badge>
        </>
      }
      title="AI Chat Workspace"
      description="A conversation-first assistant workspace built from ChatBubble, CommandInput, AIResponseView, and layout primitives rather than a monolithic public chat component."
    >
      <ExampleFrame>
        <AIChatWorkspaceExample />
      </ExampleFrame>
    </ExampleSectionShell>
  );
}

export function ExampleLogViewerWorkspaceSection() {
  return (
    <ExampleSectionShell
      badges={
        <>
          <Badge variant="softPrimary">Examples</Badge>
          <Badge>Operations</Badge>
          <Badge>Log viewer</Badge>
        </>
      }
      title="Log Viewer Workspace"
      description="A realistic operational workspace that treats LogViewer as a viewer-only primitive with filtering, expansion, and virtualization, while leaving the logging pipeline outside the design-system component."
    >
      <ExampleFrame>
        <LogViewerWorkspaceExample />
      </ExampleFrame>
    </ExampleSectionShell>
  );
}

export function ExampleReleaseControlWorkspaceSection() {
  return (
    <ExampleSectionShell
      badges={
        <>
          <Badge variant="softPrimary">Examples</Badge>
          <Badge>Workflow</Badge>
          <Badge>Release control</Badge>
        </>
      }
      title="Release Control Workspace"
      description="A realistic release workspace that combines TreeView, Toolbar, DataTable, SplitButton, and CommandInput in the same shell used by the Storybook example."
    >
      <ExampleFrame shell>
        <ReleaseControlWorkspaceShowcase />
      </ExampleFrame>
    </ExampleSectionShell>
  );
}

export function ExampleIncidentTriageWorkspaceSection() {
  return (
    <ExampleSectionShell
      badges={
        <>
          <Badge variant="softPrimary">Examples</Badge>
          <Badge>Workflow</Badge>
          <Badge>Incident triage</Badge>
        </>
      }
      title="Incident Triage Workspace"
      description="A responder-focused workflow that combines lazy TreeView loading, dense DataTable views, command surfaces, and mitigation actions in one operational shell."
    >
      <ExampleFrame shell>
        <IncidentTriageWorkspaceShowcase />
      </ExampleFrame>
    </ExampleSectionShell>
  );
}

export function ExampleIncidentTriagePaletteWorkspaceSection() {
  return (
    <ExampleSectionShell
      badges={
        <>
          <Badge variant="softPrimary">Examples</Badge>
          <Badge>Workflow</Badge>
          <Badge>Palette open</Badge>
        </>
      }
      title="Incident Triage Workspace With Palette Open"
      description="The same triage workspace with CommandPalette already open, mirroring the dedicated Storybook interaction example."
    >
      <ExampleFrame shell>
        <IncidentTriageWorkspaceShowcase startWithPaletteOpen />
      </ExampleFrame>
    </ExampleSectionShell>
  );
}

export function ExampleDocumentationOpsWorkspaceSection() {
  return (
    <ExampleSectionShell
      badges={
        <>
          <Badge variant="softPrimary">Examples</Badge>
          <Badge>Workflow</Badge>
          <Badge>Documentation ops</Badge>
        </>
      }
      title="Documentation Operations Workspace"
      description="A documentation-focused workflow showing that the same TreeView, DataTable, Toolbar, and CommandInput patterns also work for internal maintenance and publishing flows."
    >
      <ExampleFrame shell>
        <DocumentationOpsWorkspaceShowcase />
      </ExampleFrame>
    </ExampleSectionShell>
  );
}
