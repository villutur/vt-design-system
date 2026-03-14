import React from "react";
import { IconX } from "@tabler/icons-react";
import { FloatingPortal } from "../../internal/FloatingPortal";
import { useBodyScrollLock } from "../../internal/useBodyScrollLock";
import { useDismissibleLayer } from "../../internal/useDismissibleLayer";
import { useFocusReturn } from "../../internal/useFocusReturn";
import { useFocusTrap } from "../../internal/useFocusTrap";
import { getInitialFocusTarget } from "../../internal/getInitialFocusTarget";
import { cn } from "../../utils/cn";
import { Button } from "../Forms/Button";

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  primaryActionLabel?: string;
  primaryActionOnClick?: () => void;
  primaryActionLoading?: boolean;
  primaryActionVariant?: "primary" | "danger";
  secondaryActionLabel?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  closeButtonLabel?: string;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

const sizeClassMap: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      size = "md",
      primaryActionLabel = "Confirm",
      primaryActionOnClick,
      primaryActionLoading = false,
      primaryActionVariant = "primary",
      secondaryActionLabel = "Cancel",
      closeOnBackdropClick = true,
      closeOnEscape = true,
      closeButtonLabel = "Close dialog",
      initialFocusRef,
      className,
      ...props
    },
    ref,
  ) => {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const closeButtonRef = React.useRef<HTMLButtonElement>(null);
    const titleId = React.useId();
    const descriptionId = description ? React.useId() : undefined;

    useBodyScrollLock(isOpen);
    useFocusReturn(isOpen);
    useFocusTrap({ enabled: isOpen, ref: panelRef });
    useDismissibleLayer({
      enabled: isOpen,
      refs: [panelRef],
      onDismiss: onClose,
      dismissOnOutsidePress: false,
      dismissOnEscape: closeOnEscape,
    });

    React.useEffect(() => {
      if (!isOpen) {
        return;
      }

      getInitialFocusTarget(panelRef.current, initialFocusRef?.current ?? closeButtonRef.current)?.focus();
    }, [initialFocusRef, isOpen]);

    if (!isOpen) {
      return null;
    }

    return (
      <FloatingPortal>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-overlay/40 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (closeOnBackdropClick && event.target === event.currentTarget) {
                onClose();
              }
            }}
          />

          <div
            ref={composeRefs(ref, panelRef)}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            className={cn(
              "animate-in fade-in zoom-in-95 relative m-md w-full overflow-hidden rounded-2xl border border-default bg-surface shadow-2xl duration-200 outline-none",
              sizeClassMap[size],
              className,
            )}
            {...props}
          >
            <div className="p-lg">
              <div className="mb-md flex items-start justify-between gap-md">
                <div className="min-w-0">
                  <h3 id={titleId} className="text-xl font-bold text-foreground">
                    {title}
                  </h3>
                  {description ? (
                    <p id={descriptionId} className="mt-sm text-sm text-foreground-muted">
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
                  <IconX size={20} />
                </button>
              </div>

              {children ? <div className="mb-lg">{children}</div> : null}

              <div className="mt-xl flex justify-end gap-md">
                <Button variant="ghost" onClick={onClose}>
                  {secondaryActionLabel}
                </Button>
                {primaryActionOnClick ? (
                  <Button
                    variant={primaryActionVariant}
                    onClick={primaryActionOnClick}
                    isLoading={primaryActionLoading}
                  >
                    {primaryActionLabel}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </FloatingPortal>
    );
  },
);

Modal.displayName = "Modal";
