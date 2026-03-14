import React from "react";
import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { Field } from "./Field";

const radioSizeClassMap = {
  sm: {
    control: "h-4 w-4",
    dot: "top-[5px] left-[5px] h-1.5 w-1.5",
    label: "text-xs",
    description: "text-xs",
  },
  md: {
    control: "h-5 w-5",
    dot: "top-[7px] left-[5px] h-2.5 w-2.5",
    label: "text-sm",
    description: "text-xs",
  },
} as const;

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  error?: boolean;
  size?: keyof typeof radioSizeClassMap;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      description,
      helperText,
      errorText,
      error = false,
      size = "md",
      className = "",
      id,
      required,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = id || React.useId();
    const sizing = radioSizeClassMap[size];

    return (
      <Field
        helperText={helperText}
        errorText={errorText}
        error={error}
        disabled={disabled}
        messageId={helperText || errorText ? `${generatedId}-message` : undefined}
      >
        <label
          htmlFor={generatedId}
          className={cn(
            "group flex items-start gap-md",
            disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
            className,
          )}
        >
          <div className="relative flex items-center pt-xs">
            <input
              type="radio"
              id={generatedId}
              ref={ref}
              disabled={disabled}
              required={required}
              aria-invalid={error || undefined}
              aria-describedby={helperText || errorText ? `${generatedId}-message` : undefined}
              className={cn(
                "peer cursor-pointer appearance-none rounded-full border-2 border-strong transition-all checked:border-primary hover:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70",
                sizing.control,
              )}
              {...props}
            />
            <div
              className={cn(
                "pointer-events-none absolute rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100",
                sizing.dot,
              )}
            />
          </div>
          <div className="min-w-0">
            {label ? (
              <span
                className={cn(
                  "block font-medium text-foreground-muted transition-colors group-hover:text-foreground",
                  sizing.label,
                )}
              >
                {label}
                {required ? (
                  <span className="ml-xs text-error" aria-hidden="true">
                    *
                  </span>
                ) : null}
              </span>
            ) : null}
            {description ? (
              <p className={cn("mt-xs text-foreground-muted", sizing.description)}>{description}</p>
            ) : null}
          </div>
        </label>
      </Field>
    );
  },
);

Radio.displayName = "Radio";
