import React from "react";
import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import { Field } from "./Field";

const inputSizeClassMap = {
  xs: {
    input: "h-6 px-sm text-[11px]",
    button: "h-6 w-6",
  },
  sm: {
    input: "h-8 px-sm text-xs",
    button: "h-8 w-8",
  },
  md: {
    input: "h-10 px-md text-sm",
    button: "h-10 w-10",
  },
} as const;

export interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type" | "size"
> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  error?: boolean;
  size?: keyof typeof inputSizeClassMap;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      step = 1,
      label,
      description,
      helperText,
      errorText,
      error,
      size = "md",
      className,
      disabled,
      id,
      required,
      ...props
    },
    ref,
  ) => {
    const generatedId = id || React.useId();
    const sizing = inputSizeClassMap[size];

    const decrement = () => {
      const next = value - step;
      if (min === undefined || next >= min) onChange(next);
    };

    const increment = () => {
      const next = value + step;
      if (max === undefined || next <= max) onChange(next);
    };

    const baseInput =
      "w-full rounded-lg border border-default bg-surface-subtle text-center text-foreground transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
    const errorInput = "border-error/50 focus:border-error focus:ring-error/20";
    const btnClass =
      "inline-flex shrink-0 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30";

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
        <div className="flex items-center gap-xs">
          <button
            type="button"
            onClick={decrement}
            disabled={disabled || (min !== undefined && value <= min)}
            className={cn(btnClass, sizing.button)}
            aria-label="Decrease"
          >
            <IconMinus size={14} />
          </button>
          <input
            ref={ref}
            id={generatedId}
            type="number"
            value={value}
            onChange={(e) => {
              const parsed = parseFloat(e.target.value);
              if (!isNaN(parsed)) onChange(parsed);
            }}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={
              helperText || errorText ? `${generatedId}-message` : undefined
            }
            className={cn(
              baseInput,
              sizing.input,
              error && errorInput,
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={increment}
            disabled={disabled || (max !== undefined && value >= max)}
            className={cn(btnClass, sizing.button)}
            aria-label="Increase"
          >
            <IconPlus size={14} />
          </button>
        </div>
      </Field>
    );
  },
);

NumberInput.displayName = "NumberInput";
