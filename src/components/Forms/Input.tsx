import React from "react";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { Field } from "./Field";

const inputVariants = cva(
  "w-full rounded-lg border bg-surface-subtle text-foreground transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      hasError: {
        true: "border-error/50 focus:border-error focus:ring-2 focus:ring-error/20",
        false:
          "border-default hover:border-strong focus:border-primary focus:ring-2 focus:ring-primary/20",
      },
      size: {
        xs: "py-xs px-sm text-[11px] h-6",
        sm: "py-xs px-sm text-xs",
        md: "py-sm px-md text-sm",
      },
    },
    defaultVariants: {
      hasError: false,
      size: "md",
    },
  },
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  error?: boolean;
  labelHidden?: boolean;
  /** Input density. xs = h-6 compact, sm = tight, md = default */
  size?: "xs" | "sm" | "md";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      helperText,
      errorText,
      error,
      labelHidden = false,
      size = "md",
      className,
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
        labelHidden={labelHidden}
        messageId={
          helperText || errorText ? `${generatedId}-message` : undefined
        }
      >
        <input
          id={generatedId}
          ref={ref}
          className={cn(inputVariants({ hasError: !!error, size, className }))}
          aria-invalid={!!error}
          aria-describedby={
            helperText || errorText ? `${generatedId}-message` : undefined
          }
          required={required}
          disabled={disabled}
          {...props}
        />
      </Field>
    );
  },
);

Input.displayName = "Input";
