import React from "react";
import {
  IconActivity,
  IconAppWindow,
  IconCurrencyDollar,
  IconForms,
  IconGitBranch,
  IconHome,
  IconLayoutCards,
  IconLayoutSidebar,
  IconPalette,
  IconServer,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react";
import { Sidebar, SidebarItem, SidebarSectionBase } from "../../src/index";
import type { PreviewTab } from "./types";

interface PreviewSidebarProps {
  activeTab: PreviewTab;
  onTabChange: (tab: PreviewTab) => void;
}

interface PreviewNavItem {
  tab: PreviewTab;
  label: string;
  icon: React.ReactNode;
}

const primaryItems: PreviewNavItem[] = [
  {
    tab: "typography",
    label: "Typography & Layout",
    icon: <IconHome size={20} />,
  },
  {
    tab: "data-display",
    label: "Data Display",
    icon: <IconLayoutCards size={20} />,
  },
  {
    tab: "tree-view",
    label: "Tree View",
    icon: <IconGitBranch size={20} />,
  },
  {
    tab: "navigation",
    label: "Navigation",
    icon: <IconSparkles size={20} />,
  },
  {
    tab: "feedback",
    label: "Feedback",
    icon: <IconActivity size={20} />,
  },
  {
    tab: "forms",
    label: "Forms & Inputs",
    icon: <IconForms size={20} />,
  },
  {
    tab: "overlays",
    label: "Overlays",
    icon: <IconAppWindow size={20} />,
  },
  {
    tab: "panels",
    label: "Panels & Tabs",
    icon: <IconLayoutSidebar size={20} />,
  },
  {
    tab: "theme",
    label: "Design Tokens & Theming",
    icon: <IconPalette size={20} />,
  },
];

const exampleItems: PreviewNavItem[] = [
  {
    tab: "example-login-split",
    label: "Login / Split",
    icon: <IconSparkles size={20} />,
  },
  {
    tab: "example-login-compact",
    label: "Login / Compact",
    icon: <IconUsers size={20} />,
  },
  {
    tab: "example-dashboard-operations",
    label: "Dashboard / Operations",
    icon: <IconServer size={20} />,
  },
  {
    tab: "example-dashboard-executive",
    label: "Dashboard / Executive",
    icon: <IconCurrencyDollar size={20} />,
  },
  {
    tab: "example-ai-assistant-workspace",
    label: "AI / Assistant Workspace",
    icon: <IconSparkles size={20} />,
  },
  {
    tab: "example-ai-chat-workspace",
    label: "AI / Chat Workspace",
    icon: <IconUsers size={20} />,
  },
  {
    tab: "example-log-viewer-workspace",
    label: "Ops / Log Viewer",
    icon: <IconActivity size={20} />,
  },
  {
    tab: "example-release-control-workspace",
    label: "Workflow / Release Control",
    icon: <IconGitBranch size={20} />,
  },
  {
    tab: "example-incident-triage-workspace",
    label: "Workflow / Incident Triage",
    icon: <IconServer size={20} />,
  },
  {
    tab: "example-incident-triage-palette-workspace",
    label: "Workflow / Palette Open",
    icon: <IconAppWindow size={20} />,
  },
  {
    tab: "example-documentation-ops-workspace",
    label: "Workflow / Docs Ops",
    icon: <IconLayoutCards size={20} />,
  },
  {
    tab: "example-playground-signal-theme",
    label: "Theme / VT Playground",
    icon: <IconSparkles size={20} />,
  },
  {
    tab: "example-asset-studio-lantern-theme",
    label: "Theme / VT Asset Studio",
    icon: <IconPalette size={20} />,
  },
];

export function PreviewSidebar({
  activeTab,
  onTabChange,
}: PreviewSidebarProps) {
  const renderItem = (item: PreviewNavItem) => (
    <SidebarItem
      key={item.tab}
      icon={item.icon}
      label={item.label}
      href="#"
      isActive={activeTab === item.tab}
      onClick={(event) => {
        event.preventDefault();
        onTabChange(item.tab);
      }}
    />
  );

  return (
    <Sidebar>
      {primaryItems.map(renderItem)}
      <SidebarSectionBase title="Examples" />
      {exampleItems.map(renderItem)}
    </Sidebar>
  );
}
