import React from "react";
import type { Placement } from "@floating-ui/react";
import { FloatingPortal } from "../../internal/FloatingPortal";
import { useAnchoredFloating } from "../../internal/useAnchoredFloating";
import { useControllableState } from "../../internal/useControllableState";
import { useDismissibleLayer } from "../../internal/useDismissibleLayer";
import { useFocusReturn } from "../../internal/useFocusReturn";
import { cn } from "../../utils/cn";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerId?: string;
  setTriggerId: (id: string | undefined) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  setReference: (node: HTMLElement | null) => void;
  setFloating: (node: HTMLDivElement | null) => void;
  floatingStyles: React.CSSProperties;
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(
  undefined,
);

function usePopoverContext() {
  const context = React.useContext(PopoverContext);

  if (!context) {
    throw new Error("Popover components must be used within <Popover>");
  }

  return context;
}

function composeRefs<T>(
  ...refs: Array<React.Ref<T> | ((node: T | null) => void) | undefined>
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === "function") {
        ref(node);
        return;
      }

      (ref as React.MutableRefObject<T | null>).current = node;
    });
  };
}

function composeEventHandlers<E extends React.SyntheticEvent>(
  userHandler: ((event: E) => void) | undefined,
  internalHandler: (event: E) => void,
) {
  return (event: E) => {
    userHandler?.(event);

    if (!event.defaultPrevented) {
      internalHandler(event);
    }
  };
}

export interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  offsetValue?: number;
  sameWidth?: boolean;
}

export function Popover({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom-start",
  offsetValue = 8,
  sameWidth = false,
}: PopoverProps) {
  const [currentOpen, setCurrentOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const contentId = React.useId();
  const [triggerId, setTriggerId] = React.useState<string | undefined>();
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const { refs, floatingStyles } = useAnchoredFloating({
    open: currentOpen,
    onOpenChange: setCurrentOpen,
    placement,
    offsetValue,
    sameWidth,
  });

  useFocusReturn(currentOpen);
  useDismissibleLayer({
    enabled: currentOpen,
    refs: [triggerRef, contentRef],
    onDismiss: () => setCurrentOpen(false),
  });

  const value = React.useMemo<PopoverContextValue>(
    () => ({
      open: currentOpen,
      setOpen: setCurrentOpen,
      contentId,
      triggerId,
      setTriggerId,
      triggerRef,
      contentRef,
      setReference: (node) => refs.setReference(node),
      setFloating: (node) => refs.setFloating(node),
      floatingStyles,
    }),
    [contentId, currentOpen, floatingStyles, refs, setCurrentOpen, triggerId],
  );

  return (
    <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
  );
}

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(
  (
    { asChild = false, children, onClick, onKeyDown, disabled, ...props },
    ref,
  ) => {
    const fallbackTriggerId = React.useId();
    const resolvedTriggerId = props.id ?? fallbackTriggerId;
    const { open, setOpen, contentId, setTriggerId, triggerRef, setReference } =
      usePopoverContext();

    React.useEffect(() => {
      setTriggerId(resolvedTriggerId);

      return () => {
        setTriggerId(undefined);
      };
    }, [resolvedTriggerId, setTriggerId]);

    const sharedProps = {
      id: resolvedTriggerId,
      "aria-controls": open ? contentId : undefined,
      "aria-expanded": open,
      "aria-haspopup": props["aria-haspopup"] ?? ("dialog" as const),
      "data-state": open ? "open" : "closed",
      ...props,
      onClick: composeEventHandlers(onClick, () => {
        if (!disabled) {
          setOpen(!open);
        }
      }),
      onKeyDown: composeEventHandlers(onKeyDown, (event) => {
        if (disabled) {
          return;
        }

        switch (event.key) {
          case "ArrowDown":
          case "Enter":
          case " ":
            event.preventDefault();
            setOpen(true);
            break;
          case "Escape":
            event.preventDefault();
            setOpen(false);
            break;
          default:
            break;
        }
      }),
    };

    if (asChild && React.isValidElement(children)) {
      const child = React.Children.only(children) as React.ReactElement<
        Record<string, unknown>
      >;
      const childProps = child.props as {
        onClick?: React.MouseEventHandler<HTMLElement>;
        onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
      };
      const childRef = (child as unknown as { ref?: React.Ref<HTMLElement> })
        .ref;

      return React.cloneElement(child, {
        ...child.props,
        ...sharedProps,
        ref: composeRefs(
          ref as React.Ref<HTMLElement>,
          childRef,
          triggerRef,
          setReference,
        ),
        onClick: composeEventHandlers(childProps.onClick, sharedProps.onClick),
        onKeyDown: composeEventHandlers(
          childProps.onKeyDown,
          sharedProps.onKeyDown,
        ),
      });
    }

    return (
      <button
        ref={composeRefs(
          ref as React.Ref<HTMLElement>,
          triggerRef,
          setReference,
        )}
        type="button"
        disabled={disabled}
        {...sharedProps}
      >
        {children}
      </button>
    );
  },
);

PopoverTrigger.displayName = "PopoverTrigger";

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  portal?: boolean;
}

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(
  (
    {
      className,
      children,
      portal = true,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const {
      open,
      contentId,
      triggerId,
      contentRef,
      setFloating,
      floatingStyles,
    } = usePopoverContext();

    React.useEffect(() => {
      if (!open) {
        return;
      }

      window.requestAnimationFrame(() => {
        const focusTarget =
          contentRef.current?.querySelector<HTMLElement>(
            "[data-autofocus], [autofocus], button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
          ) ?? contentRef.current;

        focusTarget?.focus();
      });
    }, [open, contentRef]);

    if (!open) {
      return null;
    }

    const content = (
      <div
        id={contentId}
        ref={composeRefs(ref, contentRef, setFloating)}
        role="dialog"
        aria-modal="false"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : (ariaLabelledBy ?? triggerId)}
        data-overlay-layer=""
        data-state={open ? "open" : "closed"}
        tabIndex={-1}
        style={floatingStyles}
        className={cn(
          "z-50 overflow-hidden rounded-xl border border-default bg-surface shadow-xl outline-none",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );

    return portal ? <FloatingPortal>{content}</FloatingPortal> : content;
  },
);

PopoverContent.displayName = "PopoverContent";

export interface PopoverCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  PopoverCloseProps
>(({ onClick, ...props }, ref) => {
  const { setOpen } = usePopoverContext();

  return (
    <button
      ref={ref}
      type="button"
      onClick={composeEventHandlers(onClick, () => setOpen(false))}
      {...props}
    />
  );
});

PopoverClose.displayName = "PopoverClose";
