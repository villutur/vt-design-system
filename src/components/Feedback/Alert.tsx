import React from "react";
import { cn } from "../../utils/cn";
import {
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";

export type AlertType = "success" | "warning" | "error" | "info";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  title: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  /** Compact inline style - smaller icon, tighter padding, no border radius. */
  compact?: boolean;
  closeButtonLabel?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      type = "info",
      title,
      children,
      icon,
      onClose,
      compact = false,
      closeButtonLabel = "Dismiss alert",
      role,
      "aria-live": ariaLive,
      className = "",
      ...props
    },
    ref,
  ) => {
    const typeStyles = {
      success: {
        bg: "bg-success/10",
        text: "text-success",
        icon: icon || <IconCircleCheck size={20} />,
      },
      warning: {
        bg: "bg-warning/10",
        text: "text-warning",
        icon: icon || <IconAlertTriangle size={20} />,
      },
      error: {
        bg: "bg-error/10",
        text: "text-error",
        icon: icon || <IconAlertCircle size={20} />,
      },
      info: {
        bg: "bg-primary/10",
        text: "text-primary",
        icon: icon || <IconInfoCircle size={20} />,
      },
    };

    const style = typeStyles[type];
    const resolvedRole =
      role ?? (type === "error" || type === "warning" ? "alert" : "status");
    const resolvedAriaLive =
      ariaLive ?? (resolvedRole === "alert" ? "assertive" : "polite");

    return (
      <div
        ref={ref}
        role={resolvedRole}
        aria-live={resolvedAriaLive}
        className={cn(
          "flex items-start gap-md",
          compact
            ? `border-l-2 p-sm ${style.bg} border-current`
            : `rounded-lg p-md ${style.bg}`,
          className,
        )}
        {...props}
      >
        <div className={`mt-xs flex items-center justify-center ${style.text}`}>
          {style.icon}
        </div>
        <div className="flex-1">
          <h4 className={`text-sm font-bold ${style.text}`}>{title}</h4>
          {children ? (
            <div className={`mt-xs text-sm ${style.text} opacity-80`}>
              {children}
            </div>
          ) : null}
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className={`rounded-md p-xs opacity-70 transition-colors hover:bg-foreground/5 hover:opacity-100 ${style.text}`}
            aria-label={closeButtonLabel}
          >
            <IconX size={16} />
          </button>
        ) : null}
      </div>
    );
  },
);

Alert.displayName = "Alert";
