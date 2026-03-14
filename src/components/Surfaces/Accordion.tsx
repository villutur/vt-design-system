import React from "react";
import { createContext, useContext, forwardRef } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "../../utils/cn";

interface AccordionContextValue {
  type?: "single" | "multiple";
  collapsible?: boolean;
  value: string[];
  onItemClick: (itemValue: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      children,
      type = "single",
      collapsible = false,
      defaultValue,
      value: controlledValue,
      onValueChange,
      ...props
    },
    ref
  ) => {
    // Uncontrolled state
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(() => {
      if (defaultValue !== undefined) {
        return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      }
      return [];
    });

    const isControlled = controlledValue !== undefined;
    const value = isControlled
      ? Array.isArray(controlledValue)
        ? controlledValue
        : [controlledValue]
      : uncontrolledValue;

    const handleItemClick = (itemValue: string) => {
      let newValue: string[];

      if (type === "single") {
        if (value.includes(itemValue)) {
          newValue = collapsible ? [] : value;
        } else {
          newValue = [itemValue];
        }
      } else {
        if (value.includes(itemValue)) {
          newValue = value.filter((v) => v !== itemValue);
        } else {
          newValue = [...value, itemValue];
        }
      }

      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      
      if (onValueChange) {
        // We typecast or enforce depending on what the consumer expects,
        // but typically a single type expects a string and multiple expects string[].
        onValueChange(type === "single" ? newValue[0] || "" : newValue);
      }
    };

    return (
      <AccordionContext.Provider
        value={{ type, collapsible, value, onItemClick: handleItemClick }}
      >
        <div ref={ref} className={cn("space-y-2 w-full", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

export interface AccordionItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  value: string;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, title, value, children, ...props }, ref) => {
    const context = useContext(AccordionContext);
    
    if (!context) {
      throw new Error("AccordionItem must be used within an Accordion");
    }

    const isOpen = context.value.includes(value);

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-lg border border-default bg-surface",
          className
        )}
        {...props}
      >
        <button
          type="button"
          className="flex w-full items-center justify-between px-lg py-4 text-base font-semibold transition-all hover:bg-surface-subtle [&[data-state=open]>svg]:rotate-180"
          data-state={isOpen ? "open" : "closed"}
          onClick={() => context.onItemClick(value)}
        >
          {title}
          <IconChevronDown className="h-5 w-5 shrink-0 text-foreground-muted transition-transform duration-200" />
        </button>
        <div
          data-state={isOpen ? "open" : "closed"}
          className={cn(
            "overflow-hidden text-sm text-foreground-muted transition-all",
            isOpen
              ? "animate-accordion-down"
              : "animate-accordion-up h-0 opacity-0"
          )}
        >
          <div className="px-lg pb-4 pt-0 leading-relaxed text-base">{children}</div>
        </div>
      </div>
    );
  }
);
AccordionItem.displayName = "AccordionItem";
