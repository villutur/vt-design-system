import React from "react";
import { forwardRef } from "react";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "../../utils/cn";
import { Field } from "./Field";

const checkboxSizeClassMap = {
  sm: {
    control: "h-4 w-4",
    icon: "top-[3px] left-[1px]",
    label: "text-xs",
    description: "text-xs",
  },
  md: {
    control: "h-5 w-5",
    icon: "top-[4px] left-[2px]",
    label: "text-sm",
    description: "text-xs",
  },
} as const;

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  error?: boolean;
  size?: keyof typeof checkboxSizeClassMap;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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
    const sizing = checkboxSizeClassMap[size];

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
              type="checkbox"
              id={generatedId}
              ref={ref}
              disabled={disabled}
              required={required}
              aria-invalid={error || undefined}
              aria-describedby={helperText || errorText ? `${generatedId}-message` : undefined}
              className={cn(
                "peer cursor-pointer appearance-none rounded border-2 border-strong transition-all checked:border-primary checked:bg-primary hover:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70",
                sizing.control,
              )}
              {...props}
            />
            <IconCheck
              size={size === "sm" ? 12 : 16}
              className={cn(
                "pointer-events-none absolute text-white opacity-0 transition-opacity peer-checked:opacity-100",
                sizing.icon,
              )}
              stroke={3}
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

Checkbox.displayName = "Checkbox";
