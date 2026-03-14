import React from "react";
import { IconX } from "@tabler/icons-react";
import { FloatingPortal } from "../../internal/FloatingPortal";
import { useBodyScrollLock } from "../../internal/useBodyScrollLock";
import { useDismissibleLayer } from "../../internal/useDismissibleLayer";
import { useFocusReturn } from "../../internal/useFocusReturn";
import { useFocusTrap } from "../../internal/useFocusTrap";
import { getInitialFocusTarget } from "../../internal/getInitialFocusTarget";
import { cn } from "../../utils/cn";

export interface DrawerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  isOpen: boolean;
  onClose: () => void;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg";
  title: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  closeButtonLabel?: string;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

const sizeClassMap = {
  left: {
    sm: "w-full max-w-sm",
    md: "w-full max-w-xl",
    lg: "w-full max-w-2xl",
  },
  right: {
    sm: "w-full max-w-sm",
    md: "w-full max-w-xl",
    lg: "w-full max-w-2xl",
  },
  top: {
    sm: "h-auto max-h-[40vh]",
    md: "h-auto max-h-[55vh]",
    lg: "h-auto max-h-[70vh]",
  },
  bottom: {
    sm: "h-auto max-h-[40vh]",
    md: "h-auto max-h-[55vh]",
    lg: "h-auto max-h-[70vh]",
  },
} as const;

const sideClassMap = {
  left: "left-0 top-0 h-full rounded-r-2xl border-r",
  right: "right-0 top-0 h-full rounded-l-2xl border-l",
  top: "left-0 top-0 w-full rounded-b-2xl border-b",
  bottom: "bottom-0 left-0 w-full rounded-t-2xl border-t",
} as const;

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      isOpen,
      onClose,
      side = "right",
      size = "md",
      title,
      description,
      footer,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      closeButtonLabel = "Close drawer",
      initialFocusRef,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const closeButtonRef = React.useRef<HTMLButtonElement>(null);
    const titleId = React.useId();
    const descriptionId = React.useId();

    useBodyScrollLock(isOpen);
    useFocusReturn(isOpen);
    useFocusTrap({ enabled: isOpen, ref: panelRef });
    useDismissibleLayer({
      enabled: isOpen,
      refs: [panelRef],
      onDismiss: onClose,
      dismissOnOutsidePress: closeOnBackdropClick,
      dismissOnEscape: closeOnEscape,
    });

    React.useEffect(() => {
      if (!isOpen) {
        return;
      }

      getInitialFocusTarget(
        panelRef.current,
        initialFocusRef?.current ?? closeButtonRef.current,
      )?.focus();
    }, [initialFocusRef, isOpen]);

    if (!isOpen) {
      return null;
    }

    return (
      <FloatingPortal>
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-overlay/40 backdrop-blur-sm" />
          <div
            ref={(node) => {
              panelRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            className={cn(
              "absolute flex overflow-hidden border-default bg-surface shadow-2xl outline-none",
              sideClassMap[side],
              sizeClassMap[side][size],
              className,
            )}
            {...props}
          >
            <div className="flex h-full w-full flex-col">
              <div className="flex items-start justify-between gap-md border-b border-default px-lg py-lg">
                <div className="min-w-0">
                  <h2
                    id={titleId}
                    className="text-lg font-bold text-foreground"
                  >
                    {title}
                  </h2>
                  {description ? (
                    <p
                      id={descriptionId}
                      className="mt-sm text-sm text-foreground-muted"
                    >
                      {description}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  ref={closeButtonRef}
                  data-close-button="true"
                  onClick={onClose}
                  className="rounded-lg p-xs text-foreground-subtle transition-colors hover:bg-surface-muted hover:text-foreground"
                  aria-label={closeButtonLabel}
                >
                  <IconX size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-lg">{children}</div>

              {footer ? (
                <div className="border-t border-default px-lg py-md">
                  {footer}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </FloatingPortal>
    );
  },
);

Drawer.displayName = "Drawer";
