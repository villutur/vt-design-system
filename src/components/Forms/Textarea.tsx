import React from "react";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { Field } from "./Field";

const textareaVariants = cva(
  "w-full rounded-lg border bg-surface-subtle text-foreground transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      hasError: {
        true: "border-error/50 focus:border-error focus:ring-2 focus:ring-error/20",
        false: "border-default hover:border-strong focus:border-primary focus:ring-2 focus:ring-primary/20",
      },
      size: {
        xs: "min-h-20 px-sm py-xs text-[11px]",
        sm: "min-h-24 px-sm py-sm text-xs",
        md: "min-h-28 px-md py-sm text-sm",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        both: "resize",
      },
    },
    defaultVariants: {
      hasError: false,
      size: "md",
      resize: "vertical",
    },
  },
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">, VariantProps<typeof textareaVariants> {
  label?: string;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  error?: boolean;
  labelHidden?: boolean;
  size?: "xs" | "sm" | "md";
  resize?: "none" | "vertical" | "both";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      description,
      helperText,
      errorText,
      error,
      labelHidden = false,
      size = "md",
      resize = "vertical",
      className,
      id,
      required,
      disabled,
      rows = 6,
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
        messageId={helperText || errorText ? `${generatedId}-message` : undefined}
      >
        <textarea
          id={generatedId}
          ref={ref}
          rows={rows}
          className={cn(textareaVariants({ hasError: !!error, size, resize, className }))}
          aria-invalid={!!error}
          aria-describedby={helperText || errorText ? `${generatedId}-message` : undefined}
          required={required}
          disabled={disabled}
          {...props}
        />
      </Field>
    );
  },
);

Textarea.displayName = "Textarea";
