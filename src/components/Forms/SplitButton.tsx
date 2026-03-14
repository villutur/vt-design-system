import React from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "../../utils/cn";
import { Dropdown, DropdownItem, DropdownSeparator } from "../Overlay/Dropdown";
import { Button, type ButtonProps } from "./Button";

export interface SplitButtonAction {
  id?: string;
  label: React.ReactNode;
  onSelect?: () => void;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  shortcut?: React.ReactNode;
  disabled?: boolean;
  closeOnSelect?: boolean;
  separatorBefore?: boolean;
}

export interface SplitButtonProps extends Omit<ButtonProps, "children" | "rightIcon"> {
  children: React.ReactNode;
  actions: ReadonlyArray<SplitButtonAction>;
  menuAlign?: "left" | "center" | "right";
  menuButtonAriaLabel?: string;
  menuAriaLabel?: string;
  groupAriaLabel?: string;
  dropdownClassName?: string;
  mainButtonClassName?: string;
  menuButtonClassName?: string;
  onActionSelect?: (action: SplitButtonAction, index: number) => void;
}

export const SplitButton = React.forwardRef<HTMLButtonElement, SplitButtonProps>(
  (
    {
      children,
      actions,
      menuAlign = "right",
      menuButtonAriaLabel = "More actions",
      menuAriaLabel,
      groupAriaLabel,
      dropdownClassName,
      mainButtonClassName,
      menuButtonClassName,
      onActionSelect,
      variant = "primary",
      size = "md",
      disabled = false,
      isLoading = false,
      leftIcon,
      type = "button",
      className,
      ...buttonProps
    },
    ref,
  ) => {
    const resolvedVariant = variant === "icon" ? "secondary" : variant;
    const menuDisabled = disabled || actions.length === 0;
    const resolvedGroupAriaLabel =
      groupAriaLabel ??
      (typeof children === "string" && children.trim().length > 0 ? `${children} split button` : "Split button");
    const resolvedMenuAriaLabel =
      menuAriaLabel ??
      (typeof children === "string" && children.trim().length > 0 ? `More actions for ${children}` : "More actions");

    return (
      <div role="group" aria-label={resolvedGroupAriaLabel} className={cn("inline-flex items-stretch", className)}>
        <Button
          {...buttonProps}
          ref={ref}
          type={type}
          variant={resolvedVariant}
          size={size}
          disabled={disabled}
          isLoading={isLoading}
          leftIcon={leftIcon}
          className={cn("rounded-r-none", mainButtonClassName)}
        >
          {children}
        </Button>

        <Dropdown
          align={menuAlign}
          menuAriaLabel={resolvedMenuAriaLabel}
          className={dropdownClassName}
          trigger={
            <Button
              type="button"
              aria-label={menuButtonAriaLabel}
              variant={resolvedVariant}
              size={size}
              disabled={menuDisabled}
              className={cn("-ml-px rounded-l-none px-xs", menuButtonClassName)}
            >
              <IconChevronDown size={16} />
            </Button>
          }
        >
          {actions.map((action, index) => (
            <React.Fragment key={action.id ?? `split-button-action-${index}`}>
              {action.separatorBefore ? <DropdownSeparator /> : null}
              <DropdownItem
                disabled={action.disabled}
                closeOnSelect={action.closeOnSelect}
                onClick={() => {
                  action.onSelect?.();
                  onActionSelect?.(action, index);
                }}
              >
                <span className="flex min-w-0 flex-1 items-start gap-sm">
                  {action.icon ? <span className="mt-[2px] shrink-0 text-foreground-subtle">{action.icon}</span> : null}
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-foreground">{action.label}</span>
                    {action.description ? (
                      <span className="mt-xs block text-xs text-foreground-muted">{action.description}</span>
                    ) : null}
                  </span>
                </span>
                {action.shortcut ? (
                  <span className="shrink-0 text-[10px] tracking-wide text-foreground-subtle uppercase">
                    {action.shortcut}
                  </span>
                ) : null}
              </DropdownItem>
            </React.Fragment>
          ))}
        </Dropdown>
      </div>
    );
  },
);

SplitButton.displayName = "SplitButton";
