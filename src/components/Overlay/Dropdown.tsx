import React from "react";
import { useControllableState } from "../../internal/useControllableState";
import { cn } from "../../utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

interface DropdownContextValue {
  closeMenu: () => void;
}

const DropdownContext = React.createContext<DropdownContextValue | undefined>(undefined);

function useDropdownContext() {
  return React.useContext(DropdownContext);
}

function getFocusableMenuItems(container: HTMLElement | null) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLButtonElement>("[data-dropdown-item='true']:not([disabled])"));
}

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  align?: "left" | "right" | "center";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  menuAriaLabel?: string;
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      className,
      trigger,
      children,
      align = "left",
      open,
      defaultOpen,
      onOpenChange,
      menuAriaLabel = "Dropdown menu",
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const [currentOpen, setCurrentOpen] = useControllableState({
      value: open,
      defaultValue: defaultOpen ?? false,
      onChange: onOpenChange,
    });

    const placement = align === "right" ? "bottom-end" : align === "center" ? "bottom" : "bottom-start";

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const items = getFocusableMenuItems(contentRef.current);

      if (items.length === 0) {
        return;
      }

      const activeIndex = items.findIndex((item) => item === document.activeElement);

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          const nextIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % items.length;
          items[nextIndex]?.focus();
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          const nextIndex = activeIndex < 0 ? items.length - 1 : (activeIndex - 1 + items.length) % items.length;
          items[nextIndex]?.focus();
          break;
        }
        case "Home":
          event.preventDefault();
          items[0]?.focus();
          break;
        case "End":
          event.preventDefault();
          items[items.length - 1]?.focus();
          break;
        case "Tab":
          setCurrentOpen(false);
          break;
        default:
          break;
      }
    };

    const triggerElement = React.isValidElement(trigger) ? (
      typeof trigger.type === "string" && !["button", "a", "input"].includes(trigger.type) ? (
        React.cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
          role: (trigger.props as { role?: string }).role ?? "button",
          tabIndex: (trigger.props as { tabIndex?: number }).tabIndex ?? 0,
        })
      ) : (
        trigger
      )
    ) : (
      <button type="button">{trigger}</button>
    );

    return (
      <Popover open={currentOpen} onOpenChange={setCurrentOpen} placement={placement}>
        <DropdownContext.Provider
          value={{
            closeMenu: () => setCurrentOpen(false),
          }}
        >
          <PopoverTrigger asChild aria-haspopup="menu">
            {triggerElement}
          </PopoverTrigger>
          <PopoverContent
            ref={(node) => {
              contentRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            role="menu"
            aria-orientation="vertical"
            aria-label={menuAriaLabel}
            onKeyDown={(event) => {
              onKeyDown?.(event);

              if (!event.defaultPrevented) {
                handleKeyDown(event);
              }
            }}
            className={cn("animate-in fade-in-0 zoom-in-95 min-w-36 p-xs", className)}
            {...props}
          >
            {children}
          </PopoverContent>
        </DropdownContext.Provider>
      </Popover>
    );
  },
);

Dropdown.displayName = "Dropdown";

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  closeOnSelect?: boolean;
}

export const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, closeOnSelect = true, disabled, onClick, ...props }, ref) => {
    const context = useDropdownContext();

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        data-dropdown-item="true"
        disabled={disabled}
        className={cn(
          "relative flex w-full items-center gap-sm rounded-lg px-sm py-sm text-sm text-foreground transition-colors outline-none hover:bg-surface-muted hover:text-foreground focus:bg-surface-muted focus:text-foreground disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented && !disabled && closeOnSelect) {
            context?.closeMenu();
          }
        }}
        {...props}
      />
    );
  },
);

DropdownItem.displayName = "DropdownItem";

export const DropdownSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="separator" className={cn("-mx-xs my-xs h-px bg-border-default", className)} {...props} />
  ),
);

DropdownSeparator.displayName = "DropdownSeparator";
