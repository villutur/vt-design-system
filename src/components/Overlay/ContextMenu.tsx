import React from "react";
import { FloatingPortal } from "../../internal/FloatingPortal";
import { useDismissibleLayer } from "../../internal/useDismissibleLayer";
import { useFocusReturn } from "../../internal/useFocusReturn";
import { useListNavigation } from "../../internal/useListNavigation";
import { cn } from "../../utils/cn";

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  contentId: string;
  openAt: (x: number, y: number) => void;
  close: () => void;
}

const ContextMenuContext = React.createContext<ContextMenuState | undefined>(
  undefined,
);

function useContextMenuState() {
  const context = React.useContext(ContextMenuContext);
  if (!context) {
    throw new Error("ContextMenu components must be used within <ContextMenu>");
  }
  return context;
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

export interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  ...props
}) => {
  const contentId = React.useId();
  const [position, setPosition] = React.useState({ isOpen: false, x: 0, y: 0 });

  const value = React.useMemo(
    () => ({
      isOpen: position.isOpen,
      x: position.x,
      y: position.y,
      contentId,
      openAt: (x: number, y: number) => setPosition({ isOpen: true, x, y }),
      close: () =>
        setPosition((currentPosition) => ({ ...currentPosition, isOpen: false })),
    }),
    [contentId, position],
  );

  return (
    <ContextMenuContext.Provider value={value}>
      <div {...props}>{children}</div>
    </ContextMenuContext.Provider>
  );
};

export interface ContextMenuTriggerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ContextMenuTrigger = React.forwardRef<
  HTMLDivElement,
  ContextMenuTriggerProps
>(({ children, onContextMenu, onClick, onKeyDown, tabIndex, ...props }, ref) => {
  const { openAt, close, isOpen, contentId } = useContextMenuState();

  return (
    <div
      ref={ref}
      tabIndex={tabIndex ?? 0}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={isOpen ? contentId : undefined}
      data-state={isOpen ? "open" : "closed"}
      onClick={composeEventHandlers(onClick, () => {
        close();
      })}
      onContextMenu={composeEventHandlers(onContextMenu, (event) => {
        event.preventDefault();
        openAt(event.clientX, event.clientY);
      })}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
          event.preventDefault();
          const rect = event.currentTarget.getBoundingClientRect();
          openAt(rect.left, rect.bottom);
          return;
        }

        if (event.key === "Escape") {
          close();
        }
      })}
      {...props}
    >
      {children}
    </div>
  );
});
ContextMenuTrigger.displayName = "ContextMenuTrigger";

interface ContextMenuItemInternalProps {
  itemIndex?: number;
  active?: boolean;
  setItemRef?: (node: HTMLButtonElement | null) => void;
  setActiveIndex?: (index: number) => void;
  onRequestClose?: () => void;
}

export interface ContextMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(
  (
    {
      children,
      className,
      onKeyDown,
      onContextMenu,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const { isOpen, x, y, close, contentId } = useContextMenuState();
  const contentRef = React.useRef<HTMLDivElement>(null);

  useFocusReturn(isOpen);
  useDismissibleLayer({
    enabled: isOpen,
    refs: [contentRef],
    onDismiss: close,
  });

  const menuItems = React.useMemo(() => {
    const items: Array<{ disabled?: boolean }> = [];

    React.Children.forEach(children, (child) => {
      if (
        React.isValidElement<ContextMenuItemProps>(child) &&
        child.type === ContextMenuItem
      ) {
        items.push({ disabled: child.props.disabled });
      }
    });

    return items;
  }, [children]);

  const { activeIndex, setActiveIndex, handleKeyDown, itemRefs, setItemRef } =
    useListNavigation({
      items: menuItems,
      open: isOpen,
      onClose: close,
      focusItemOnChange: true,
      onSelect: (_item, index) => {
        itemRefs.current[index]?.click();
      },
    });

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    window.requestAnimationFrame(() => {
      contentRef.current?.focus();
    });
  }, [isOpen]);

    if (!isOpen) {
      return null;
    }

  let itemIndex = -1;
  const decoratedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child) || child.type !== ContextMenuItem) {
      return child;
    }

    itemIndex += 1;

    return React.cloneElement(
      child as React.ReactElement<
        ContextMenuItemProps & ContextMenuItemInternalProps
      >,
      {
        itemIndex,
        active: itemIndex === activeIndex,
        setItemRef: setItemRef(itemIndex),
        setActiveIndex,
        onRequestClose: close,
      },
    );
  });

    return (
      <FloatingPortal>
        <div
          id={contentId}
          ref={(node) => {
            contentRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          role="menu"
          aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : "Context menu")}
          aria-labelledby={ariaLabelledBy}
          aria-orientation="vertical"
          tabIndex={-1}
          onContextMenu={composeEventHandlers(onContextMenu, (event) => {
            event.preventDefault();
          })}
          onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
          style={{ position: "fixed", top: y, left: x }}
          className={cn(
            "z-50 min-w-48 rounded-xl border border-default bg-surface p-xs shadow-xl outline-none",
            className,
          )}
          {...props}
        >
          {decoratedChildren}
        </div>
      </FloatingPortal>
    );
  },
);
ContextMenuContent.displayName = "ContextMenuContent";

export interface ContextMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shortcut?: React.ReactNode;
  inset?: boolean;
}

export const ContextMenuItem = React.forwardRef<
  HTMLButtonElement,
  ContextMenuItemProps & ContextMenuItemInternalProps
>(
  (
    {
      className,
      shortcut,
      inset = false,
      itemIndex,
      active,
      setItemRef,
      setActiveIndex,
      onRequestClose,
      onClick,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={(node) => {
          setItemRef?.(node);
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        type="button"
        role="menuitem"
        tabIndex={active ? 0 : -1}
        disabled={disabled}
        onFocus={() => {
          if (itemIndex !== undefined) {
            setActiveIndex?.(itemIndex);
          }
        }}
        onMouseEnter={() => {
          if (itemIndex !== undefined) {
            setActiveIndex?.(itemIndex);
          }
        }}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            onRequestClose?.();
          }
        }}
        className={cn(
          "flex w-full items-center justify-between gap-md rounded-lg px-sm py-sm text-sm text-foreground outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          inset && "pl-lg",
          active
            ? "bg-surface-muted"
            : "hover:bg-surface-subtle hover:text-foreground",
          className,
        )}
        {...props}
      >
        <span>{children}</span>
        {shortcut ? (
          <span className="text-xs tracking-wide text-foreground-subtle uppercase">
            {shortcut}
          </span>
        ) : null}
      </button>
    );
  },
);
ContextMenuItem.displayName = "ContextMenuItem";

export const ContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn("my-xs h-px bg-border-default", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";
