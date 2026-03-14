import React from "react";
import { createContext, useContext, useState, forwardRef } from "react";
import { cn } from "../../utils/cn";

// --- Context ---
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
  variant: "primary" | "secondary";
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a <Tabs> provider");
  }
  return context;
}

// --- Components ---

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: "primary" | "secondary";
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      defaultValue,
      value: controlledValue,
      onValueChange: controlledOnValueChange,
      variant = "primary",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;

    const value = isControlled ? controlledValue : uncontrolledValue;
    const onValueChange = (newValue: string) => {
      if (!isControlled) setUncontrolledValue(newValue);
      controlledOnValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ value, onValueChange, variant }}>
        <div ref={ref} className={cn("flex flex-col", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);
Tabs.displayName = "Tabs";

export const TabsList = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { variant } = useTabs();
    return <div ref={ref} className={cn("flex", variant === "primary" ? "gap-xl" : "gap-md", className)} {...props} />;
  },
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange, variant } = useTabs();
    const isSelected = selectedValue === value;

    // Styles derived from panels-and-tabs.html
    const primaryStyles = isSelected
      ? "border-b-2 border-primary pb-md text-sm font-semibold text-primary transition-colors"
      : "border-b-2 border-transparent pb-md text-sm font-semibold text-foreground-muted transition-colors hover:text-foreground";

    const secondaryStyles = isSelected
      ? "border-b-2 border-primary pb-sm text-xs font-bold tracking-wider text-primary uppercase"
      : "border-b-2 border-transparent pb-sm text-xs font-bold tracking-wider text-foreground-muted uppercase transition-colors hover:text-foreground";

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isSelected}
        onClick={() => onValueChange(value)}
        className={cn(variant === "primary" ? primaryStyles : secondaryStyles, className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, children, ...props }, ref) => {
    const { value: selectedValue } = useTabs();

    if (selectedValue !== value) return null;

    return (
      <div ref={ref} role="tabpanel" className={cn("mt-md outline-none focus:ring-0", className)} {...props}>
        {children}
      </div>
    );
  },
);
TabsContent.displayName = "TabsContent";
