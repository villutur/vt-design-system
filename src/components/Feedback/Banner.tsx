import React from "react";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { cn } from "../../utils/cn";

export type BannerType = "success" | "warning" | "error" | "info";

const bannerStyles: Record<
  BannerType,
  {
    icon: React.ReactNode;
    container: string;
    iconColor: string;
    textColor: string;
  }
> = {
  success: {
    icon: <IconCircleCheck size={18} />,
    container: "border-success/20 bg-success/10",
    iconColor: "text-success",
    textColor: "text-success",
  },
  warning: {
    icon: <IconAlertTriangle size={18} />,
    container: "border-warning/20 bg-warning/10",
    iconColor: "text-warning",
    textColor: "text-warning",
  },
  error: {
    icon: <IconAlertCircle size={18} />,
    container: "border-error/20 bg-error/10",
    iconColor: "text-error",
    textColor: "text-error",
  },
  info: {
    icon: <IconInfoCircle size={18} />,
    container: "border-primary/20 bg-primary/10",
    iconColor: "text-primary",
    textColor: "text-primary",
  },
};

export interface BannerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  type?: BannerType;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  onClose?: () => void;
  closeButtonLabel?: string;
}

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      type = "info",
      title,
      description,
      icon,
      actions,
      onClose,
      closeButtonLabel = "Dismiss banner",
      role,
      "aria-live": ariaLive,
      className,
      ...props
    },
    ref,
  ) => {
    const styles = bannerStyles[type];
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
          "flex flex-col gap-md rounded-2xl border px-lg py-md shadow-soft md:flex-row md:items-start md:justify-between",
          styles.container,
          className,
        )}
        {...props}
      >
        <div className="flex min-w-0 items-start gap-md">
          <div
            className={cn(
              "mt-[2px] inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface/70",
              styles.iconColor,
            )}
          >
            {icon ?? styles.icon}
          </div>
          <div className="min-w-0">
            <h3 className={cn("text-sm font-semibold", styles.textColor)}>
              {title}
            </h3>
            {description ? (
              <div className="mt-xs text-sm text-foreground-muted">
                {description}
              </div>
            ) : null}
          </div>
        </div>

        {actions || onClose ? (
          <div className="flex shrink-0 items-center gap-sm md:pl-lg">
            {actions}
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-surface-muted hover:text-foreground"
                aria-label={closeButtonLabel}
              >
                <IconX size={16} />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);

Banner.displayName = "Banner";
