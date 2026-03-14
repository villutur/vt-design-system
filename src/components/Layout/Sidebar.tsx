import React from "react";

// ---------------------------------------------------------------------------
// SidebarItem
// ---------------------------------------------------------------------------

export interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive = false,
  className = "",
  ...props
}) => {
  const activeClass = isActive
    ? "border-r-4 border-primary bg-primary/10 text-primary"
    : "text-foreground-muted hover:bg-surface-subtle hover:text-foreground";

  return (
    <a
      className={`flex items-center gap-md px-lg py-md text-sm font-medium transition-colors ${activeClass} ${className}`}
      {...props}
    >
      <div className="flex items-center justify-center text-current">{icon}</div>
      {label}
    </a>
  );
};

// ---------------------------------------------------------------------------
// SidebarSectionBase
// ---------------------------------------------------------------------------

export const SidebarSectionBase: React.FC<{ title: string }> = ({ title }) => (
  <div className="px-lg pt-md pb-sm">
    <p className="text-[10px] font-bold tracking-widest text-foreground-subtle uppercase">{title}</p>
  </div>
);

// ---------------------------------------------------------------------------
// SidebarSystemHealth  (pre-built footer, exported for convenience)
// ---------------------------------------------------------------------------

export interface SidebarSystemHealthProps {
  /** Percentage 0–100 displayed as a progress bar */
  percentage?: number;
  /** Label above the progress bar */
  label?: string;
  /** Status text below the progress bar */
  status?: string;
}

export const SidebarSystemHealth: React.FC<SidebarSystemHealthProps> = ({
  percentage = 92,
  label = "System Health",
  status = "All systems operational",
}) => (
  <div className="rounded-lg border border-default bg-surface-subtle p-md">
    <p className="mb-xs text-xs font-semibold text-primary">{label}</p>
    <div className="mb-sm h-1.5 w-full rounded-full bg-primary/10">
      <div className="h-1.5 rounded-full bg-primary" style={{ width: `${percentage}%` }} />
    </div>
    <p className="text-[10px] text-foreground-muted">{status}</p>
  </div>
);

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

export interface SidebarProps {
  /** Navigation items (SidebarItem, SidebarSectionBase, etc.) */
  children: React.ReactNode;
  /**
   * Optional content rendered in a bordered footer at the bottom of the sidebar.
   * Pass `null` or omit to hide the footer entirely.
   * Use `<SidebarSystemHealth />` for the built-in health widget.
   */
  footer?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, footer = <SidebarSystemHealth /> }) => {
  return (
    <aside className="flex w-64 flex-col border-r border-default bg-surface">
      <nav className="flex-1 space-y-1 py-lg">{children}</nav>

      {footer != null && <div className="border-t border-default p-lg">{footer}</div>}
    </aside>
  );
};
