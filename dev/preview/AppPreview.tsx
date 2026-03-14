import React, { useEffect, useState } from "react";
import { AppShell, Header } from "../../src/index";
import type { SizeMode } from "../../src/index";
import { PreviewControls } from "./PreviewControls";
import { PreviewSidebar } from "./PreviewSidebar";
import {
  ExampleAIAssistantWorkspaceSection,
  ExampleAIChatWorkspaceSection,
  ExampleDashboardExecutiveSection,
  ExampleDashboardOperationsSection,
  ExampleDocumentationOpsWorkspaceSection,
  ExampleIncidentTriagePaletteWorkspaceSection,
  ExampleIncidentTriageWorkspaceSection,
  ExampleLoginCompactSection,
  ExampleLoginSplitSection,
  ExampleLogViewerWorkspaceSection,
  ExampleReleaseControlWorkspaceSection,
} from "./sections/ExampleSections";
import { DataDisplaySection } from "./sections/DataDisplaySection";
import { FeedbackSection } from "./sections/FeedbackSection";
import { FormsSection } from "./sections/FormsSection";
import { NavigationSection } from "./sections/NavigationSection";
import { OverlaysSection } from "./sections/OverlaysSection";
import { PanelsSection } from "./sections/PanelsSection";
import { ThemeSection } from "./sections/ThemeSection";
import { TreeViewSection } from "./sections/TreeViewSection";
import { TypographySection } from "./sections/TypographySection";
import { DEFAULT_PREVIEW_TAB, type PreviewTab } from "./types";

const PREVIEW_STORAGE_KEYS = {
  theme: "vt-design-system:preview-theme",
  sizeMode: "vt-design-system:preview-size-mode",
} as const;

function isSizeMode(value: string | null | undefined): value is SizeMode {
  return value === "compact" || value === "default" || value === "comfortable";
}

function readStoredTheme(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const storedTheme = window.localStorage.getItem(PREVIEW_STORAGE_KEYS.theme);

    if (storedTheme === "dark") {
      return true;
    }

    if (storedTheme === "light") {
      return false;
    }
  } catch {
    // Ignore storage access issues and fall back to DOM state.
  }

  return document.documentElement.classList.contains("dark");
}

function readStoredSizeMode(): SizeMode {
  if (typeof window === "undefined") {
    return "default";
  }

  try {
    const storedSizeMode = window.localStorage.getItem(
      PREVIEW_STORAGE_KEYS.sizeMode,
    );

    if (isSizeMode(storedSizeMode)) {
      return storedSizeMode;
    }
  } catch {
    // Ignore storage access issues and fall back to DOM state.
  }

  const domSizeMode = document.documentElement.dataset.sizeMode;

  return isSizeMode(domSizeMode) ? domSizeMode : "default";
}

function renderActiveSection(
  activeTab: PreviewTab,
  sizeMode: SizeMode,
  onSizeModeChange: (mode: SizeMode) => void,
) {
  switch (activeTab) {
    case "typography":
      return <TypographySection />;
    case "theme":
      return (
        <ThemeSection sizeMode={sizeMode} onSizeModeChange={onSizeModeChange} />
      );
    case "data-display":
      return <DataDisplaySection />;
    case "tree-view":
      return <TreeViewSection />;
    case "navigation":
      return <NavigationSection />;
    case "feedback":
      return <FeedbackSection />;
    case "forms":
      return <FormsSection />;
    case "overlays":
      return <OverlaysSection />;
    case "panels":
      return <PanelsSection />;
    case "example-login-split":
      return <ExampleLoginSplitSection />;
    case "example-login-compact":
      return <ExampleLoginCompactSection />;
    case "example-dashboard-operations":
      return <ExampleDashboardOperationsSection />;
    case "example-dashboard-executive":
      return <ExampleDashboardExecutiveSection />;
    case "example-ai-assistant-workspace":
      return <ExampleAIAssistantWorkspaceSection />;
    case "example-ai-chat-workspace":
      return <ExampleAIChatWorkspaceSection />;
    case "example-log-viewer-workspace":
      return <ExampleLogViewerWorkspaceSection />;
    case "example-release-control-workspace":
      return <ExampleReleaseControlWorkspaceSection />;
    case "example-incident-triage-workspace":
      return <ExampleIncidentTriageWorkspaceSection />;
    case "example-incident-triage-palette-workspace":
      return <ExampleIncidentTriagePaletteWorkspaceSection />;
    case "example-documentation-ops-workspace":
      return <ExampleDocumentationOpsWorkspaceSection />;
    default:
      return <TypographySection />;
  }
}

export default function AppPreview() {
  const [activeTab, setActiveTab] = useState<PreviewTab>(DEFAULT_PREVIEW_TAB);
  const [isDark, setIsDark] = useState(readStoredTheme);
  const [sizeMode, setSizeMode] = useState<SizeMode>(readStoredSizeMode);

  useEffect(() => {
    const htmlTag = document.documentElement;
    htmlTag.dataset.sizeMode = sizeMode;

    try {
      window.localStorage.setItem(PREVIEW_STORAGE_KEYS.sizeMode, sizeMode);
    } catch {
      // Ignore storage access issues in preview mode.
    }
  }, [sizeMode]);

  useEffect(() => {
    const htmlTag = document.documentElement;

    if (isDark) {
      htmlTag.classList.add("dark");
      htmlTag.style.colorScheme = "dark";
    } else {
      htmlTag.classList.remove("dark");
      htmlTag.style.colorScheme = "light";
    }

    try {
      window.localStorage.setItem(
        PREVIEW_STORAGE_KEYS.theme,
        isDark ? "dark" : "light",
      );
    } catch {
      // Ignore storage access issues in preview mode.
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((current) => !current);
  };

  return (
    <AppShell
      header={<Header logoName="vt-design-system Preview" />}
      sidebar={
        <PreviewSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      }
    >
      <div className="space-y-8 p-6">
        {renderActiveSection(activeTab, sizeMode, setSizeMode)}
      </div>

      <PreviewControls
        isDark={isDark}
        sizeMode={sizeMode}
        onSizeModeChange={setSizeMode}
        onToggleDarkMode={toggleDarkMode}
      />
    </AppShell>
  );
}
