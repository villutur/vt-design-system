import React from "react";
import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { Field } from "./Field";

const toggleSizeClassMap = {
  sm: {
    track: "h-5 w-9 after:h-4 after:w-4",
    after: "after:top-[2px] after:inset-s-[2px]",
    label: "text-xs",
    description: "text-xs",
  },
  md: {
    track: "h-6 w-11 after:h-5 after:w-5",
    after: "after:top-[2px] after:inset-s-[2px]",
    label: "text-sm",
    description: "text-xs",
  },
} as const;

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  error?: boolean;
  size?: keyof typeof toggleSizeClassMap;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
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
      defaultChecked,
      checked,
      required,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = id || React.useId();
    const sizing = toggleSizeClassMap[size];

    return (
      <Field
        helperText={helperText}
        errorText={errorText}
        error={error}
        disabled={disabled}
        messageId={helperText || errorText ? `${generatedId}-message` : undefined}
      >
        <div className={cn("flex items-center justify-between gap-md", className)}>
          <div className="min-w-0">
            {label ? (
              <p className={cn("font-medium text-foreground-muted", sizing.label)}>
                {label}
                {required ? (
                  <span className="ml-xs text-error" aria-hidden="true">
                    *
                  </span>
                ) : null}
              </p>
            ) : null}
            {description ? (
              <p className={cn("mt-xs text-foreground-muted", sizing.description)}>{description}</p>
            ) : null}
          </div>
          <label
            htmlFor={generatedId}
            className={cn(
              "relative inline-flex items-center",
              disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
            )}
          >
            <input
              type="checkbox"
              id={generatedId}
              ref={ref}
              className="peer sr-only"
              defaultChecked={defaultChecked}
              checked={checked}
              required={required}
              disabled={disabled}
              aria-invalid={error || undefined}
              aria-describedby={helperText || errorText ? `${generatedId}-message` : undefined}
              {...props}
            />
            <div
              className={cn(
                "rounded-full bg-surface-muted peer-checked:bg-primary peer-focus:ring-4 peer-focus:ring-primary/20 peer-focus:outline-none after:absolute after:rounded-full after:border after:border-strong after:bg-surface after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full",
                sizing.track,
                sizing.after,
              )}
            />
          </label>
        </div>
      </Field>
    );
  },
);

Toggle.displayName = "Toggle";
