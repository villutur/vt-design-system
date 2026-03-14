import React from "react";
import { IconLayersIntersect, IconSearch, IconBell, IconHelp } from "@tabler/icons-react";
import { Avatar } from "../DataDisplay/Avatar";

export interface HeaderProps {
  /** Custom logo element. If not provided, a default icon + logoName is displayed. */
  logo?: React.ReactNode;
  /** Optional custom actions rendered before the built-in notification/help/user controls. */
  actions?: React.ReactNode;
  /** Text shown next to the default icon logo. Ignored when `logo` prop is provided. */
  logoName?: string;
  /** Name of the logged-in user */
  userName?: string;
  /** Role or title of the logged-in user */
  userRole?: string;
  /** URL for the user's avatar image. Falls back to first initial if not provided. */
  userImageUrl?: string;
  /** Callback when the search input changes */
  onSearch?: (query: string) => void;
  /** Callback when the notifications button is clicked */
  onNotificationsClick?: () => void;
  /** Callback when the help button is clicked */
  onHelpClick?: () => void;
  /** Whether to show a red dot indicator on the notifications bell */
  hasUnreadNotifications?: boolean;
  /** Whether to show the search input (default: true) */
  showSearch?: boolean;
  /** Whether to show the notifications bell button (default: true) */
  showNotifications?: boolean;
  /** Whether to show the help button (default: true) */
  showHelp?: boolean;
  /** Whether to show the user avatar and name section (default: true) */
  showUser?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  actions,
  logoName = "Nexus Enterprise",
  userName = "Alex Rivera",
  userRole = "System Admin",
  userImageUrl,
  onSearch,
  onNotificationsClick,
  onHelpClick,
  hasUnreadNotifications = true,
  showSearch = true,
  showNotifications = true,
  showHelp = true,
  showUser = true,
}) => {
  const hasActionButtons = Boolean(actions) || showNotifications || showHelp;

  return (
    <header className="z-20 flex h-16 items-center justify-between border-b border-default bg-surface px-lg">
      <div className="flex items-center gap-xl">
        {/* Logo */}
        {logo ? (
          logo
        ) : (
          <div className="flex items-center gap-sm">
            <div className="rounded-lg bg-primary p-sm text-white">
              <IconLayersIntersect size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight">{logoName}</span>
          </div>
        )}

        {/* Search */}
        {showSearch && (
          <div className="relative w-64">
            <IconSearch size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-foreground-subtle" />
            <input
              type="text"
              placeholder="Global search..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full rounded-lg border-none bg-surface-muted py-sm pr-md pl-2xl text-sm text-foreground transition-all outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-md">
        {actions ? <div className="flex items-center gap-sm">{actions}</div> : null}

        {/* Notifications */}
        {showNotifications && (
          <button
            onClick={onNotificationsClick}
            className="relative rounded-lg p-sm text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <IconBell size={24} />
            {hasUnreadNotifications && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-surface bg-error"></span>
            )}
          </button>
        )}

        {/* Help */}
        {showHelp && (
          <button
            onClick={onHelpClick}
            className="rounded-lg p-sm text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <IconHelp size={24} />
          </button>
        )}

        {/* Divider between action buttons and user section */}
        {showUser && hasActionButtons && <div className="mx-sm h-8 w-px bg-border-default"></div>}

        {/* User section */}
        {showUser && (
          <div className="flex items-center gap-md">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-foreground">{userName}</p>
              <p className="text-[10px] tracking-wider text-foreground-muted uppercase">{userRole}</p>
            </div>
            <Avatar
              src={userImageUrl}
              alt={userName}
              fallbackText={userName}
              className="border border-primary/20 bg-primary/10 font-bold text-primary"
            />
          </div>
        )}
      </div>
    </header>
  );
};
