import React from "react";
import {
  IconAlertTriangle,
  IconCheck,
  IconCircleX,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { cn } from "../../utils/cn";

export type ToastType = "default" | "success" | "warning" | "error" | "info";

export interface ToastOptions {
  title?: string;
  description?: React.ReactNode;
  type?: ToastType;
  duration?: number;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

interface ToastRecord extends ToastOptions {
  id: string;
}

interface ToastItemProps extends ToastRecord {
  onClose: (id: string) => void;
}

const toastStyleMap: Record<
  ToastType,
  { icon: React.ReactNode; container: string; iconClassName: string }
> = {
  default: {
    icon: <IconInfoCircle className="h-5 w-5" />,
    container: "border-default bg-surface text-foreground",
    iconClassName: "text-foreground-muted",
  },
  info: {
    icon: <IconInfoCircle className="h-5 w-5" />,
    container: "border-primary/20 bg-primary/10 text-foreground",
    iconClassName: "text-primary",
  },
  success: {
    icon: <IconCheck className="h-5 w-5" />,
    container: "border-success/20 bg-success/10 text-foreground",
    iconClassName: "text-success",
  },
  warning: {
    icon: <IconAlertTriangle className="h-5 w-5" />,
    container: "border-warning/20 bg-warning/10 text-foreground",
    iconClassName: "text-warning",
  },
  error: {
    icon: <IconCircleX className="h-5 w-5" />,
    container: "border-error/20 bg-error/10 text-foreground",
    iconClassName: "text-error",
  },
};

function createToastId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 9);
}

const ToastItem = React.forwardRef<HTMLDivElement, ToastItemProps>(
  (
    {
      id,
      title,
      description,
      type = "default",
      duration = 5000,
      icon,
      action,
      onClose,
    },
    ref,
  ) => {
    React.useEffect(() => {
      if (duration <= 0) {
        return;
      }

      const timer = window.setTimeout(() => onClose(id), duration);
      return () => window.clearTimeout(timer);
    }, [duration, id, onClose]);

    const style = toastStyleMap[type];
    const announcementRole =
      type === "error" || type === "warning" ? "alert" : "status";

    return (
      <div
        ref={ref}
        role={announcementRole}
        aria-live={announcementRole === "alert" ? "assertive" : "polite"}
        className={cn(
          "animate-in slide-in-from-right-full fade-in-0 pointer-events-auto flex w-full min-w-[20rem] overflow-hidden rounded-xl border shadow-lg ring-1 ring-foreground/5 sm:w-[22rem]",
          style.container,
        )}
      >
        <div className="flex w-full items-start gap-md p-md">
          <div className={cn("shrink-0", style.iconClassName)}>
            {icon ?? style.icon}
          </div>
          <div className="min-w-0 flex-1">
            {title ? <p className="text-sm font-semibold">{title}</p> : null}
            {description ? (
              <div className="mt-xs text-sm text-foreground-muted">
                {description}
              </div>
            ) : null}
            {action ? <div className="mt-sm">{action}</div> : null}
          </div>
          <button
            type="button"
            className="inline-flex rounded-md p-xs text-foreground-subtle transition-colors hover:bg-foreground/5 hover:text-foreground focus:ring-2 focus:ring-primary/30 focus:outline-none"
            onClick={() => onClose(id)}
            aria-label={
              title ? `Dismiss ${title} notification` : "Dismiss notification"
            }
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  },
);

ToastItem.displayName = "ToastItem";

interface ToastContextType {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined,
);

export interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  position?: "bottom-right" | "top-right";
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  position = "bottom-right",
}) => {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const toast = React.useCallback(
    (options: ToastOptions) => {
      const id = createToastId();

      setToasts((currentToasts) => {
        const nextToasts = [{ id, ...options }, ...currentToasts];
        return nextToasts.slice(0, maxToasts);
      });

      return id;
    },
    [maxToasts],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        className={cn(
          "pointer-events-none fixed right-0 z-100 flex w-full max-w-md flex-col gap-sm p-lg",
          position === "bottom-right"
            ? "bottom-0 sm:right-0 sm:bottom-0"
            : "top-0 sm:right-0",
        )}
      >
        {toasts.map((toastItem) => (
          <ToastItem key={toastItem.id} {...toastItem} onClose={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
