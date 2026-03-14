import React from "react";
import { cn } from "../../utils/cn";

export interface CommandBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Main heading */
  title: string;
  /** Subtitle / meta line (e.g. environment, refresh rate) */
  subtitle?: string;
  /** Action elements on the right side */
  actions?: React.ReactNode;
}

export const CommandBar: React.FC<CommandBarProps> = ({ title, subtitle, actions, className, ...props }) => {
  return (
    <div className={cn("flex items-start justify-between", className)} {...props}>
      <div>
        <h1 className="text-lg leading-none font-bold text-foreground">{title}</h1>
        {subtitle && <p className="mt-md text-[10px] tracking-wider text-foreground-muted uppercase">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-md">{actions}</div>}
    </div>
  );
};

CommandBar.displayName = "CommandBar";
