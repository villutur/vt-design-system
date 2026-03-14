import React from "react";
import { forwardRef } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "../../utils/cn";
import { Field } from "./Field";

const selectSizeClasses = {
  xs: "py-xs pr-2xl pl-sm text-[11px] h-6",
  sm: "py-xs pr-2xl pl-sm text-xs",
  md: "py-sm pr-2xl pl-md text-sm",
} as const;

export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  label?: string;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  error?: boolean;
  size?: keyof typeof selectSizeClasses;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      description,
      helperText,
      errorText,
      error,
      options,
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

    return (
      <Field
        label={label}
        description={description}
        helperText={helperText}
        errorText={errorText}
        error={!!error}
        required={required}
        disabled={disabled}
        htmlFor={generatedId}
        messageId={
          helperText || errorText ? `${generatedId}-message` : undefined
        }
      >
        <div className="relative">
          <select
            id={generatedId}
            ref={ref}
            className={cn(
              "w-full appearance-none rounded-lg border bg-surface-subtle text-foreground transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
              selectSizeClasses[size],
              error
                ? "border-error/50 focus:border-error focus:ring-2 focus:ring-error/20"
                : "border-default hover:border-strong focus:border-primary focus:ring-2 focus:ring-primary/20",
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={
              helperText || errorText ? `${generatedId}-message` : undefined
            }
            required={required}
            disabled={disabled}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <IconChevronDown
            size={20}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-foreground-subtle"
          />
        </div>
      </Field>
    );
  },
);

Select.displayName = "Select";
