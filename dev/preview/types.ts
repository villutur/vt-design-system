export type PreviewTab =
  | "typography"
  | "theme"
  | "data-display"
  | "tree-view"
  | "navigation"
  | "feedback"
  | "forms"
  | "overlays"
  | "panels"
  | "example-login-split"
  | "example-login-compact"
  | "example-dashboard-operations"
  | "example-dashboard-executive"
  | "example-ai-assistant-workspace"
  | "example-ai-chat-workspace"
  | "example-log-viewer-workspace"
  | "example-release-control-workspace"
  | "example-incident-triage-workspace"
  | "example-incident-triage-palette-workspace"
  | "example-documentation-ops-workspace";

export const DEFAULT_PREVIEW_TAB: PreviewTab = "typography";
