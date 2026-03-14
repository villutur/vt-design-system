import React from "react";
import { cn } from "../../utils/cn";

export interface AppShellProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentContainerClassName?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  header,
  sidebar,
  children,
  className = "",
  contentContainerClassName = "max-w-[1280px]",
}) => {
  return (
    <div
      className={cn(
        "min-h-screen bg-canvas font-display text-foreground",
        className,
      )}
    >
      <div className="flex h-screen flex-col">
        {header}
        <div className="flex flex-1 overflow-hidden">
          {sidebar}
          <main className="relative flex-1 overflow-y-auto bg-canvas/60 p-xl">
            <div
              className={cn("mx-auto space-y-10", contentContainerClassName)}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
