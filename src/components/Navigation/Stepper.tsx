import React, { forwardRef } from "react";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "../../utils/cn";

export type StepStatus = "pending" | "current" | "complete" | "error";

export interface StepItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  status?: StepStatus;
  disabled?: boolean;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepItem[];
  currentStep: number;
  onStepChange?: (index: number, step: StepItem) => void;
  interactive?: boolean;
  orientation?: "horizontal" | "vertical";
}

function getComputedStatus(step: StepItem, index: number, currentStep: number) {
  if (step.status) {
    return step.status;
  }

  if (index < currentStep) {
    return "complete";
  }
  if (index === currentStep) {
    return "current";
  }
  return "pending";
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      currentStep,
      onStepChange,
      interactive = false,
      orientation = "horizontal",
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <ol
          className={cn(
            "flex gap-md",
            orientation === "horizontal"
              ? "flex-col md:flex-row"
              : "flex-col",
          )}
        >
          {steps.map((step, index) => {
            const status = getComputedStatus(step, index, currentStep);
            const isActive = status === "current";
            const isComplete = status === "complete";
            const isError = status === "error";
            const isInteractive = interactive && !step.disabled && !!onStepChange;

            return (
              <li
                key={step.id}
                className={cn(
                  "flex min-w-0 flex-1 gap-md",
                  orientation === "horizontal" ? "md:flex-col" : "items-start",
                )}
              >
                <button
                  type="button"
                  disabled={!isInteractive}
                  onClick={() => onStepChange?.(index, step)}
                  className={cn(
                    "group flex flex-1 items-start gap-md rounded-xl text-left transition-colors",
                    orientation === "horizontal"
                      ? "md:flex-col md:items-stretch"
                      : "items-start",
                    isInteractive && "hover:bg-surface-subtle",
                    !isInteractive && "cursor-default",
                  )}
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                        isComplete &&
                          "border-success/30 bg-success text-white",
                        isActive &&
                          "border-primary bg-primary text-white",
                        isError && "border-error bg-error text-white",
                        status === "pending" &&
                          "border-strong bg-surface text-foreground-muted",
                      )}
                    >
                      {isComplete ? <IconCheck size={16} /> : index + 1}
                    </span>
                    {index < steps.length - 1 ? (
                      <span
                        className={cn(
                          "mt-sm block bg-border-default",
                          orientation === "horizontal"
                            ? "hidden h-px w-full md:block"
                            : "h-10 w-px",
                        )}
                      />
                    ) : null}
                  </div>

                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-sm font-semibold",
                        isActive
                          ? "text-primary"
                          : "text-foreground",
                        isError && "text-error",
                      )}
                    >
                      {step.title}
                    </span>
                    {step.description ? (
                      <span className="mt-xs block text-sm text-foreground-muted">
                        {step.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    );
  },
);

Stepper.displayName = "Stepper";
